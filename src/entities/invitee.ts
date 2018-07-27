import { Column } from 'typeorm';

export class Invitee {
  @Column()
  email: string;

  @Column()
  lastSentAt: number;

  @Column()
  attempts: number;
}
