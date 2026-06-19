import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from './entities/sales.entity';
import { Product } from 'src/product/entities/product.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([Sales, Product]),
    ProductModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
