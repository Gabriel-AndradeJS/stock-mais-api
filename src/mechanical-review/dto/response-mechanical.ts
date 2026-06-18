import { MechanicalStatus } from 'src/common/types/mechanical-status';
import { MechanicalReview } from 'src/mechanical-review/entities/mechanical-review.entity';

export class ResponseMechanicalDto {
  id: number;
  description?: string;
  status: MechanicalStatus;
  valueService: number;
  titular?: string;
  placa?: string;
  mechanic?: string;
  userId: number;
  productsUsed: {
    id: number;
    name: string;
    salePrice: number;
    quantityUsed: number;
    barcode: string;
  }[];
  total: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(mechanicalReview: MechanicalReview) {
    this.id = mechanicalReview.id;
    this.userId = mechanicalReview.userId;
    this.valueService = Number(mechanicalReview.valueService ?? 0);
    this.productsUsed = mechanicalReview.productsUsed ?? [];
    const productsTotal = this.productsUsed.reduce((sum, product) => {
      const salePrice = Number(product.salePrice ?? 0);
      const quantityUsed = Number(product.quantityUsed ?? 0);

      return sum + salePrice * quantityUsed;
    }, 0);
    this.total = productsTotal + this.valueService;
    this.status = mechanicalReview.status;
    this.createdAt = mechanicalReview.createdAt;
    this.updatedAt = mechanicalReview.updatedAt;
    this.description = mechanicalReview.description;
    this.titular = mechanicalReview.titular;
    this.placa = mechanicalReview.placa;
    this.mechanic = mechanicalReview.mechanic;
  }
}
