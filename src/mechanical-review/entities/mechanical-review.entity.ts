import { MechanicalStatus } from 'src/common/types/mechanical-status';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mechanical_review')
export class MechanicalReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titular: string;

  @Column()
  placa: string;

  @Column()
  mechanic: string;

  @Column()
  status: MechanicalStatus;

  @OneToMany(() => Product, (product) => product.mechanicalReview, {
    cascade: ['insert', 'update'],
  })
  productsUsed: Product[];

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
