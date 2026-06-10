import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BcryptModule } from './bcrypt/bcrypt.module';

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
    UserModule,
    BcryptModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
