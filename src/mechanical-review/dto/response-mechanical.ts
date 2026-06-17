import { MechanicalStatus } from 'src/common/types/mechanical-status';
import { MechanicalReview } from 'src/mechanical-review/entities/mechanical-review.entity';

export class ResponseMechanicalDto {
  id: number;
  description?: string;
  status: MechanicalStatus;
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
  createdAt: Date;
  updatedAt: Date;

  constructor(mechanicalReview: MechanicalReview) {
    this.id = mechanicalReview.id;
    this.userId = mechanicalReview.userId;
    this.productsUsed = mechanicalReview.productsUsed;
    this.status = mechanicalReview.status;
    this.createdAt = mechanicalReview.createdAt;
    this.updatedAt = mechanicalReview.updatedAt;
    this.description = mechanicalReview.description;
    this.titular = mechanicalReview.titular;
    this.placa = mechanicalReview.placa;
    this.mechanic = mechanicalReview.mechanic;
  }
}
