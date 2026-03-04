import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CoinPriceHistory } from './coin-price-history.entity';

@Entity('coin')
export class Coin {
  @PrimaryColumn({ name: 'coin_ident' })
  coinIdent: string;

  @Column()
  decimals: number;

  @Column()
  symbol: string;

  @Column({ name: 'icon_url' })
  iconUrl: string;

  @OneToMany(() => CoinPriceHistory, (history) => history.coin)
  priceHistory: CoinPriceHistory[];
}
