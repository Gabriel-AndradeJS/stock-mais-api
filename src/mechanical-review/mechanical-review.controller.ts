import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateMechanicalDto } from 'src/mechanical-review/dto/create-mechanical';
import { UpdateMechanicalDto } from 'src/mechanical-review/dto/update-mechanical';
import { MechanicalReviewService } from 'src/mechanical-review/mechanical-review.service';

@Controller('mechanical-review')
export class MechanicalReviewController {
  constructor(
    private readonly mechanicalReviewService: MechanicalReviewService,
  ) {}

  @Get()
  getAll(@Req() req: Request) {
    return this.mechanicalReviewService.getAllMechanicalReviews(req);
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
}
