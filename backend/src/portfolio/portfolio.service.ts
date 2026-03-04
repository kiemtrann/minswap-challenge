import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { Coin } from '../coin/entities/coin.entity';
import { CoinPriceHistory } from '../coin/entities/coin-price-history.entity';
import {
  CoinPortfolioDto,
  PortfolioResponseDto,
} from './dto/portfolio-response.dto';

interface SuiBalance {
  coinType: string;
  totalBalance: string;
}

const MAX_429_RETRIES = 3;

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);
  private readonly suiRpcUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Coin)
    private readonly coinRepo: Repository<Coin>,
    @InjectRepository(CoinPriceHistory)
    private readonly priceHistoryRepo: Repository<CoinPriceHistory>,
  ) {
    this.suiRpcUrl =
      process.env.SUI_RPC_URL || 'https://fullnode.mainnet.sui.io:443';
  }

  private async fetchWalletBalances(address: string): Promise<SuiBalance[]> {
    for (let attempt = 1; attempt <= MAX_429_RETRIES + 1; attempt++) {
      try {
        const response = await firstValueFrom(
          this.httpService.post<{ result: SuiBalance[] }>(this.suiRpcUrl, {
            jsonrpc: '2.0',
            id: 1,
            method: 'suix_getAllBalances',
            params: [address],
          }),
        );

        const result = response.data?.result;

        if (!result) {
          throw new BadRequestException(`No result returned from Sui RPC for address: ${address}`);
        }

        return result;
      } catch (err) {
        if (err instanceof HttpException) throw err;

        if (isAxiosError(err) && err.response?.status === 429) {
          if (attempt > MAX_429_RETRIES) {
            const retryAfter = err.response?.headers?.['retry-after'];
            this.logger.error(
              `Sui RPC still rate-limited after ${MAX_429_RETRIES} retries for address ${address}`,
            );
            throw new HttpException(
              {
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                error: 'Too Many Requests',
                message:
                  `Sui RPC rate limit reached after ${MAX_429_RETRIES} retries. ` +
                  (retryAfter
                    ? `Retry after ${retryAfter} second(s).`
                    : 'Please wait before retrying.'),
              },
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }

          const retryAfterSec = parseInt(
            err.response?.headers?.['retry-after'] ?? '5',
            10,
          );
          const delayMs = (isNaN(retryAfterSec) ? 5 : retryAfterSec) * 1_000;
          this.logger.warn(
            `Sui RPC rate limit hit (attempt ${attempt}/${MAX_429_RETRIES}). ` +
              `Retrying after ${delayMs / 1000}s…`,
          );
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }

        this.logger.error(
          `Unexpected error fetching balances for address ${address}`,
          err,
        );
        throw new BadRequestException(
          'Failed to fetch wallet balances from Sui RPC',
        );
      }
    }

    throw new ServiceUnavailableException('Sui RPC request failed unexpectedly.');
  }

  private async getCoinMetadata(coinIdents: string[]): Promise<Map<string, Coin>> {
    if (!coinIdents.length) return new Map();

    const coins = await this.coinRepo
      .createQueryBuilder('coin')
      .where('coin.coin_ident IN (:...idents)', { idents: coinIdents })
      .getMany();

    return new Map(coins.map((c) => [c.coinIdent, c]));
  }

  private async getPricesForCoins(coinIdents: string[]): Promise<
    Map<
      string,
      {
        current: number | null;
        price1d: number | null;
        price7d: number | null;
        price30d: number | null;
      }
    >
  > {
    if (!coinIdents.length) return new Map();

    const now = new Date();
    const d1 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const rawResult = await this.priceHistoryRepo.query(
      `
      WITH targets AS (
        SELECT unnest($1::text[]) AS coin_ident
      )
      SELECT
        t.coin_ident,
        (
          SELECT price FROM coin_price_history
          WHERE coin_ident = t.coin_ident
          ORDER BY created_at DESC
          LIMIT 1
        ) AS current_price,
        (
          SELECT price FROM coin_price_history
          WHERE coin_ident = t.coin_ident
          ORDER BY ABS(EXTRACT(EPOCH FROM (created_at - $2::timestamptz)))
          LIMIT 1
        ) AS price_1d,
        (
          SELECT price FROM coin_price_history
          WHERE coin_ident = t.coin_ident
          ORDER BY ABS(EXTRACT(EPOCH FROM (created_at - $3::timestamptz)))
          LIMIT 1
        ) AS price_7d,
        (
          SELECT price FROM coin_price_history
          WHERE coin_ident = t.coin_ident
          ORDER BY ABS(EXTRACT(EPOCH FROM (created_at - $4::timestamptz)))
          LIMIT 1
        ) AS price_30d
      FROM targets t
      `,
      [coinIdents, d1.toISOString(), d7.toISOString(), d30.toISOString()],
    );

    const priceMap = new Map<
      string,
      {
        current: number | null;
        price1d: number | null;
        price7d: number | null;
        price30d: number | null;
      }
    >();

    for (const row of rawResult as {
      coin_ident: string;
      current_price: string | null;
      price_1d: string | null;
      price_7d: string | null;
      price_30d: string | null;
    }[]) {
      priceMap.set(row.coin_ident, {
        current: row.current_price ? parseFloat(row.current_price) : null,
        price1d: row.price_1d ? parseFloat(row.price_1d) : null,
        price7d: row.price_7d ? parseFloat(row.price_7d) : null,
        price30d: row.price_30d ? parseFloat(row.price_30d) : null,
      });
    }

    return priceMap;
  }

  private calcPctChange(
    current: number | null,
    previous: number | null,
  ): number {
    if (!current || !previous || previous === 0) return 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(2));
  }

  async getPortfolio(
    address: string,
    limit?: number,
  ): Promise<PortfolioResponseDto> {
    const suiBalances = await this.fetchWalletBalances(address);

    if (!suiBalances.length) {
      return { coins: [], total_usd: 0 };
    }

    const coinIdents = suiBalances.map((b) => b.coinType);

    const coinMetaMap = await this.getCoinMetadata(coinIdents);

    const knownBalances = suiBalances.filter((b) =>
      coinMetaMap.has(b.coinType),
    );

    if (!knownBalances.length) {
      return { coins: [], total_usd: 0 };
    }

    const knownIdents = knownBalances.map((b) => b.coinType);

    const priceMap = await this.getPricesForCoins(knownIdents);

    const coins: CoinPortfolioDto[] = knownBalances.map((balance) => {
      const meta = coinMetaMap.get(balance.coinType)!;
      const prices = priceMap.get(balance.coinType);

      const amount =
        parseFloat(balance.totalBalance) / Math.pow(10, meta.decimals);

      const currentPrice = prices?.current ?? 0;
      const price1d = prices?.price1d ?? null;
      const price7d = prices?.price7d ?? null;
      const price30d = prices?.price30d ?? null;

      const usdValue = amount * currentPrice;

      const pnlToday = price1d !== null ? (currentPrice - price1d) * amount : 0;

      return {
        coin_type: balance.coinType,
        symbol: meta.symbol,
        decimals: meta.decimals,
        icon_url: meta.iconUrl,
        amount: parseFloat(amount.toFixed(6)),
        usd_value: parseFloat(usdValue.toFixed(2)),
        price: currentPrice,
        pnl_today: parseFloat(pnlToday.toFixed(2)),
        price_change_1d: this.calcPctChange(currentPrice, price1d),
        price_change_7d: this.calcPctChange(currentPrice, price7d),
        price_change_30d: this.calcPctChange(currentPrice, price30d),
      };
    });

    coins.sort((a, b) => b.usd_value - a.usd_value);

    const limitedCoins = limit ? coins.slice(0, limit) : coins;

    const total_usd = parseFloat(
      limitedCoins.reduce((sum, c) => sum + c.usd_value, 0).toFixed(2),
    );

    return { coins: limitedCoins, total_usd };
  }
}
