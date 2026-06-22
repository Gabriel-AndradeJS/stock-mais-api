import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBudgetDto } from 'src/budget/dto/create-budget.dto';
import { ResponseBudgetItemsOnlyDto } from 'src/budget/dto/response-budget-items-only.dto';
import { ResponseBudgetDto } from 'src/budget/dto/response-budget.dto';
import { Budget } from 'src/budget/entities/budget.entity';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';

@Injectable()
export class BudgetService {
  constructor(
    private readonly productService: ProductService,
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  async createBudget(createBudgetDto: CreateBudgetDto) {
    const { name, items } = createBudgetDto;

    if (!items?.length) {
      throw new BadRequestException('Informe ao menos um produto');
    }

    const productIds = [...new Set(items.map((item) => item.productId))];

    const products = await this.productService.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new BadRequestException(
        'Um ou mais produtos não foram encontrados',
      );
    }

    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );

    const budgetItems = items.map((item) => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new BadRequestException(
          `Produto com id ${item.productId} não foi encontrado`,
        );
      }

      const unitPrice = Number(product.salePrice ?? 0);
      const subtotal = unitPrice * item.quantity;

      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      };
    });

    const totalAmount = budgetItems.reduce((sum, item) => {
      return sum + item.subtotal;
    }, 0);

    const quantityProducts = budgetItems.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    const budget = this.budgetRepository.create({
      name,
      items: budgetItems,
      quantityProducts,
      totalAmount,
    });

    const savedBudget = await this.budgetRepository.save(budget);
    return new ResponseBudgetDto(savedBudget);
  }

  async findAllBudgets() {
    const budgets = await this.budgetRepository.find({
      order: { createdAt: 'DESC' },
    });

    return budgets.map((budget) => new ResponseBudgetItemsOnlyDto(budget));
  }
}
