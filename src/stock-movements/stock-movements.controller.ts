import { Controller, Delete, Get } from '@nestjs/common';
import { StockMovementsService } from 'src/stock-movements/stock-movements.service';
import { Cron } from '@nestjs/schedule';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Get()
  getAllMovements() {
    return this.stockMovementsService.getAllMovements();
  }

  @Cron('0 0 0 1,15 * *')
  @Delete()
  deleteAllMovements() {
    this.stockMovementsService.deleteAllMovements();
  }
}
