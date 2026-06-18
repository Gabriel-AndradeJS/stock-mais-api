import { Controller, Get } from '@nestjs/common';
import { StockMovementsService } from 'src/stock-movements/stock-movements.service';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Get()
  getAllMovements() {
    return this.stockMovementsService.getAllMovements();
  }
}
