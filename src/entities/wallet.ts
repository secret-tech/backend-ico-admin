import { Column } from 'typeorm';

export class Wallet {
  @Column()
  ticker: string;

  @Column()
  address: string;

  @Column()
  balance: string;

  @Column()
  salt: string;

  @Column()
  mnemonic: string;
}
