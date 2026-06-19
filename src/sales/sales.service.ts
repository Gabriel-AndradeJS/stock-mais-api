import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sales } from './entities/sales.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productService: ProductService,
    @InjectRepository(Sales)
    private readonly salesRepository: Repository<Sales>,
  ) {}

  async createSale(createSaleDto: CreateSaleDto) {
    const { productId, quantity } = createSaleDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado');
    }

    if (quantity && product.quantity <= quantity) {
      throw new BadRequestException('Estoque insuficiente');
    }
    const updatedQuantity = product.quantity - (quantity || 1);
    product.quantity = updatedQuantity;
    await this.productRepository.save(product);
    const unitPrice = product.salePrice;
    const totalPrice = unitPrice * (quantity || 1);

    const sale = this.salesRepository.create({
      productId,
      productName: product.name,
      quantity: quantity || 1,
      unitPrice,
      totalPrice,
    });
    return this.salesRepository.save(sale);
  }
}
