import { Module } from '@nestjs/common';
import { MechanicalReviewController } from './mechanical-review.controller';
import { MechanicalReviewService } from './mechanical-review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MechanicalReview } from 'src/mechanical-review/entities/mechanical-review.entity';
import { Product } from 'src/product/entities/product.entity';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MechanicalReview, Product]),
    UserModule,
    ProductModule,
  ],
  controllers: [MechanicalReviewController],
  providers: [MechanicalReviewService],
})
export class MechanicalReviewModule {}
