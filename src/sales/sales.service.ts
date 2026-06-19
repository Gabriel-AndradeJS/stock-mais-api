import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sales } from './entities/sales.entity';
import { Product } from 'src/product/entities/product.entity';
import { StockMovementsService } from 'src/stock-movements/stock-movements.service';
import { PartMovement } from 'src/common/enums/part-movements';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Sales)
    private readonly salesRepository: Repository<Sales>,
    private readonly stockMovementsService: StockMovementsService,
  ) {}

  async getAllSales() {
    return this.salesRepository.find();
  }

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
    this.stockMovementsService.logProductMovement(
      productId,
      product.name,
      '',
      0,
      quantity || 1,
      PartMovement.SALE,
    );
    return this.salesRepository.save(sale);
  }
}
