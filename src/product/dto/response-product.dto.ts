import { Product } from 'src/product/entities/product.entity';

export class ResponseProductDto {
  id: number;
  name: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  barcode: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;

  constructor(user: Product) {
    this.id = user.id;
    this.name = user.name;
    this.purchasePrice = user.purchasePrice;
    this.salePrice = user.salePrice;
    this.quantity = user.quantity;
    this.barcode = user.barcode;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.userId = user.userId;
  }
}
