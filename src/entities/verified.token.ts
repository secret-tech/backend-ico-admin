import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Verification } from './verification';

@Entity()
export class VerifiedToken {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  token: string;

  @Column()
  verified: boolean;

  @Column(type => Verification)
  verification: Verification;
}
