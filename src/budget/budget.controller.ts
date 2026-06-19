import { Body, Controller, Get, Post } from '@nestjs/common';
import { BudgetService } from 'src/budget/budget.service';
import { CreateBudgetDto } from 'src/budget/dto/create-budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  findAllBudgets() {
    return this.budgetService.findAllBudgets();
  }

  @Post()
  createBudget(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetService.createBudget(createBudgetDto);
  }
}
