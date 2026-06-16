import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMechanicalDto } from 'src/mechanical-review/dto/create-mechanical';
import { ResponseMechanicalDto } from 'src/mechanical-review/dto/response-mechanical';
import { MechanicalReview } from 'src/mechanical-review/entities/mechanical-review.entity';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { UserService } from 'src/user/user.service';
import { In, Repository } from 'typeorm';

@Injectable()
export class MechanicalReviewService {
  constructor(
    @InjectRepository(MechanicalReview)
    private readonly mechanicalReviewRepository: Repository<MechanicalReview>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAllMechanicalReviews(req: Request) {
    const reviews = await this.mechanicalReviewRepository.find({
      where: { userId: req['user']?.sub },
      relations: ['productsUsed'],
    });

    return reviews.map((review) => new ResponseMechanicalDto(review));
  }

  async createMechanicalReview(
    req: Request,
    createMechanicalReviewDto: CreateMechanicalDto,
  ) {
    const userExists = await this.userService.findById(req['user']?.sub);

    if (!userExists) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const foundProducts: Product[] = [];

    if (createMechanicalReviewDto.productsUsed?.length) {
      for (const p of createMechanicalReviewDto.productsUsed) {
        const prod = await this.productService.findById(p.id);
        if (!prod) {
          throw new BadRequestException(`Produto não encontrado: ${p.id}`);
        }
        foundProducts.push(prod);
      }
    }

    createMechanicalReviewDto.userId = userExists.id;
    const mechanicalReview = this.mechanicalReviewRepository.create(
      createMechanicalReviewDto,
    );
    const savedReview =
      await this.mechanicalReviewRepository.save(mechanicalReview);

    const responseProducts: {
      id: number;
      name: string;
      salePrice: number;
      quantity: number;
      barcode: string;
    }[] = [];
    if (foundProducts.length) {
      for (const prod of foundProducts) {
        prod.mechanicalReview = savedReview;
        await this.productRepository.save(prod);
        responseProducts.push({
          id: prod.id,
          name: prod.name,
          salePrice: prod.salePrice,
          quantity: prod.quantity,
          barcode: prod.barcode,
        });
      }
    }

    return new ResponseMechanicalDto(savedReview);
  }

  async deleteMechanicalReview(id: number) {
    const mechanicalReview = await this.mechanicalReviewRepository.findOne({
      where: { id },
    });

    if (!mechanicalReview) {
      throw new BadRequestException('Revisão mecânica não encontrada');
    }

    await this.mechanicalReviewRepository.remove(mechanicalReview);
  }
}
