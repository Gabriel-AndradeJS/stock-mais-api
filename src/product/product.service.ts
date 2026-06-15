import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { ResponseProductDto } from 'src/product/dto/response-product.dto';
import { Product } from 'src/product/entities/product.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService,
  ) {}

  async createProduct(req: Request, createProductDto: CreateProductDto) {
    const userExists = await this.userService.findById(req['user']?.sub);

    if (!userExists) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const existingProduct = await this.productRepository.findOne({
      where: { codigoQr: createProductDto.codigoQr },
    });

    if (existingProduct) {
      throw new BadRequestException('Ja existe um produto com esse codigoQr');
    }

    createProductDto.userId = userExists.id;
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return new ResponseProductDto(product);
  }
}
