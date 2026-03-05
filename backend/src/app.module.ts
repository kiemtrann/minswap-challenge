import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from './coin/entities/coin.entity';
import { CoinPriceHistory } from './coin/entities/coin-price-history.entity';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isSsl = config.get<string>('DB_SSL') === 'true';
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST', 'localhost'),
          port: config.get<number>('DB_PORT', 5432),
          username: config.get<string>('DB_USERNAME', 'postgres'),
          password: config.get<string>('DB_PASSWORD', 'postgres'),
          database: config.get<string>('DB_NAME', 'portfolio-db'),
          entities: [Coin, CoinPriceHistory],
          synchronize: false,
          logging: ['error'],
          ...(isSsl && {
            ssl: { rejectUnauthorized: false },
          }),
        };
      },
    }),

    PortfolioModule,
  ],
})
export class AppModule {}
