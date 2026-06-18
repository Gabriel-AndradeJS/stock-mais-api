import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { ProductModule } from './product/product.module';
import { MechanicalReviewModule } from './mechanical-review/mechanical-review.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'stock_mais',
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    BcryptModule,
    AuthModule,
    JwtModule,
    ProductModule,
    MechanicalReviewModule,
    StockMovementsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
