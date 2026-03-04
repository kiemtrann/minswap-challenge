import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Coin } from './coin.entity';

@Entity('coin_price_history')
export class CoinPriceHistory {
  @PrimaryColumn({ name: 'coin_ident' })
  coinIdent: string;

  @PrimaryColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'double precision' })
  price: number;

  @ManyToOne(() => Coin, (coin) => coin.priceHistory)
  @JoinColumn({ name: 'coin_ident' })
  coin: Coin;
}
