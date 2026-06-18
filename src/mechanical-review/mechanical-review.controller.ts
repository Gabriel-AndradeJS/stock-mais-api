import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { MechanicalStatus } from 'src/common/types/mechanical-status';
import { CreateMechanicalDto } from 'src/mechanical-review/dto/create-mechanical';
import { UpdateMechanicalDto } from 'src/mechanical-review/dto/update-mechanical';
import { MechanicalReviewService } from 'src/mechanical-review/mechanical-review.service';

@UseGuards(AuthGuard)
@Controller('mechanical-review')
export class MechanicalReviewController {
  constructor(
    private readonly mechanicalReviewService: MechanicalReviewService,
  ) {}

  @Get()
  getAll(@Req() req: Request, @Query('status') status?: MechanicalStatus) {
    return this.mechanicalReviewService.getAllMechanicalReviews(req, status);
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.mechanicalReviewService.getMechanicalReviewById(id);
  }

  @Post()
  create(
    @Req() req: Request,
    @Body() createMechanicalReviewDto: CreateMechanicalDto,
  ) {
    return this.mechanicalReviewService.createMechanicalReview(
      req,
      createMechanicalReviewDto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateMechanicalReviewDto: UpdateMechanicalDto,
  ) {
    return this.mechanicalReviewService.updateMechanicalReview(
      id,
      updateMechanicalReviewDto,
    );
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.mechanicalReviewService.deleteMechanicalReview(id);
  }

  @Delete(':id/product/:productId')
  removeProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.mechanicalReviewService.removeProductFromReview(id, productId);
  }
}
