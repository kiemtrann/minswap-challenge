import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from '../coin/entities/coin.entity';
import { CoinPriceHistory } from '../coin/entities/coin-price-history.entity';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: parseInt(process.env.SUI_RPC_TIMEOUT_MS ?? '10000', 10),
    }),
    TypeOrmModule.forFeature([Coin, CoinPriceHistory]),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
