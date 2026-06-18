import { PartMovement } from 'src/common/enums/part-movements';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('stock_movements')
export class StockMovements {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  productName: string;

  @Column()
  mechanicName: string;

  @Column()
  mechanicalReviewId: number;

  @Column('int')
  quantity: number;

  @Column({
    type: 'enum',
    enum: PartMovement,
  })
  movementType: PartMovement;

  @CreateDateColumn()
  createdAt: Date;
}
