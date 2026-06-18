import { Module } from '@nestjs/common';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovementsService } from './stock-movements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovements } from 'src/stock-movements/entities/stock-movements.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovements])],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  exports: [StockMovementsService],
})
export class StockMovementsModule {}
