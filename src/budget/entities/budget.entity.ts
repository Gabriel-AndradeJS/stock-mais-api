import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Product, { eager: true })
  @JoinTable({ name: 'budget_products' })
  products: Product[];

  @Column('jsonb', { default: [] })
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;

  @Column({ default: 0 })
  quantityProducts: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
