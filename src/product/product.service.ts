import { BadRequestException, Injectable, Request } from '@nestjs/common';
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
      where: { barcode: createProductDto.barcode },
    });

    if (existingProduct) {
      throw new BadRequestException(
        'Ja existe um produto com esse codigo de barras',
      );
    }

    createProductDto.userId = userExists.id;
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return new ResponseProductDto(product);
  }

  async getProducts(req: Request, page: number, limit: number) {
    const products = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: { userId: req['user']?.sub },
    });

    const total = products[1];
    const totalPages = Math.ceil(total / limit);

    return {
      results: products[0].map((product) => new ResponseProductDto(product)),
      meta: {
        page,
        limit,
        total,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async updateProduct(id: number, updateProductDto: CreateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new BadRequestException('Produto não encontrado');
    }

    const existingProduct = await this.productRepository.findOne({
      where: { barcode: updateProductDto.barcode },
    });

    if (
      existingProduct?.barcode === updateProductDto.barcode &&
      existingProduct.id !== id
    ) {
      throw new BadRequestException(
        'Ja existe um produto com esse codigo de barras',
      );
    }

    product.name = updateProductDto.name ?? product.name;
    product.barcode = updateProductDto.barcode ?? product.barcode;
    product.salePrice = updateProductDto.salePrice ?? product.salePrice;
    product.purchasePrice =
      updateProductDto.purchasePrice ?? product.purchasePrice;
    product.quantity = updateProductDto.quantity ?? product.quantity;

    await this.productRepository.save(product);
    return new ResponseProductDto(product);
  }
}
