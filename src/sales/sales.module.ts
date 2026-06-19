import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from './entities/sales.entity';
import { Product } from 'src/product/entities/product.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { StockMovementsModule } from 'src/stock-movements/stock-movements.module';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([Sales, Product]),
    StockMovementsModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
