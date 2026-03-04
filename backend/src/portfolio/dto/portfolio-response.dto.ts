import { ApiProperty } from '@nestjs/swagger';

export class CoinPortfolioDto {
  @ApiProperty({ example: '0x2::sui::SUI', description: 'Coin type identifier' })
  coin_type: string;

  @ApiProperty({ example: 'SUI', description: 'Coin symbol' })
  symbol: string;

  @ApiProperty({ example: 9, description: 'Coin decimals' })
  decimals: number;

  @ApiProperty({ example: 'https://hop.ag/tokens/SUI.svg', description: 'Coin logo URL' })
  icon_url: string;

  @ApiProperty({ example: 1000.5, description: 'Coin amount' })
  amount: number;

  @ApiProperty({ example: 2851.43, description: 'USD value' })
  usd_value: number;

  @ApiProperty({ example: 2.85, description: 'Current USD price' })
  price: number;

  @ApiProperty({ example: 140.07, description: 'USD profit/loss vs 24 hours ago' })
  pnl_today: number;

  @ApiProperty({ example: 5.17, description: 'Price change % over the last 1 day' })
  price_change_1d: number;

  @ApiProperty({ example: 9.62, description: 'Price change % over the last 7 days' })
  price_change_7d: number;

  @ApiProperty({ example: 16.33, description: 'Price change % over the last 30 days' })
  price_change_30d: number;
}

export class PortfolioResponseDto {
  @ApiProperty({ type: [CoinPortfolioDto], description: 'List of coins' })
  coins: CoinPortfolioDto[];

  @ApiProperty({ example: 25678.90, description: 'Total USD value of all returned coins' })
  total_usd: number;
}
