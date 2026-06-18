import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockMovements } from 'src/stock-movements/entities/stock-movements.entity';
import { Repository } from 'typeorm';
import { PartMovement } from 'src/common/enums/part-movements';

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectRepository(StockMovements)
    private readonly stockMovementsRepository: Repository<StockMovements>,
  ) {}

  async getAllMovements() {
    return await this.stockMovementsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async logProductMovement(
    productId: number,
    productName: string,
    mechanicName: string,
    mechanicalReviewId: number,
    quantity: number,
    movementType: PartMovement,
  ) {
    const movement = this.stockMovementsRepository.create({
      productId,
      productName,
      mechanicName,
      mechanicalReviewId,
      quantity,
      movementType,
    });

    return await this.stockMovementsRepository.save(movement);
  }
}
