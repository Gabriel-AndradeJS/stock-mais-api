import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
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

  private groupProducts(products: CreateSaleItemDto[]) {
    const groupedProducts = new Map<number, number>();

    for (const product of products) {
      groupedProducts.set(
        product.productId,
        (groupedProducts.get(product.productId) ?? 0) + product.quantity,
      );
    }

    return groupedProducts;
  }

  private async validateProductsStock(products: CreateSaleItemDto[]) {
    const groupedProducts = this.groupProducts(products);
    const productIds = [...groupedProducts.keys()];

    const foundProducts = await this.productRepository.find({
      where: { id: In(productIds) },
    });

    const productsById = new Map(
      foundProducts.map((product) => [product.id, product]),
    );

    if (foundProducts.length !== productIds.length) {
      throw new BadRequestException(
        'Um ou mais produtos não foram encontrados',
      );
    }

    for (const [productId, quantity] of groupedProducts) {
      const product = productsById.get(productId);

      if (!product) {
        throw new BadRequestException(
          `Produto com id ${productId} não foi encontrado`,
        );
      }

      if (product.quantity < quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para o produto: ${product.name}`,
        );
      }
    }

    return productsById;
  }

  private async processSingleSale(
    item: CreateSaleItemDto,
    manager: EntityManager,
  ) {
    const productRepository = manager.getRepository(Product);
    const salesRepository = manager.getRepository(Sales);

    const product = await productRepository.findOne({
      where: { id: item.productId },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado');
    }

    if (product.quantity < item.quantity) {
      throw new BadRequestException(
        `Estoque insuficiente para o produto: ${product.name}`,
      );
    }

    product.quantity -= item.quantity;
    await productRepository.save(product);

    const unitPrice = Number(product.salePrice);
    const totalPrice = unitPrice * item.quantity;

    const sale = salesRepository.create({
      productId: item.productId,
      productName: product.name,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
    });

    await this.stockMovementsService.logProductMovement(
      item.productId,
      product.name,
      '',
      0,
      item.quantity,
      PartMovement.SALE,
    );

    return salesRepository.save(sale);
  }

  async createSale(createSaleDto: CreateSaleDto) {
    const { products } = createSaleDto;

    await this.validateProductsStock(products);

    return this.salesRepository.manager.transaction(async (manager) => {
      const sales: Sales[] = [];

      for (const item of products) {
        const sale = await this.processSingleSale(item, manager);
        sales.push(sale);
      }

      return sales;
    });
  }
}
