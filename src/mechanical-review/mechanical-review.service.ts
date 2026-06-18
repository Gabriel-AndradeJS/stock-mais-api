import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMechanicalDto } from 'src/mechanical-review/dto/create-mechanical';
import { ProductUsedDto } from 'src/mechanical-review/dto/product-used.dto';
import { ResponseMechanicalDto } from 'src/mechanical-review/dto/response-mechanical';
import { MechanicalReview } from 'src/mechanical-review/entities/mechanical-review.entity';
import { Product } from 'src/product/entities/product.entity';
import { UserService } from 'src/user/user.service';
import { In, Repository } from 'typeorm';
import { UpdateMechanicalDto } from 'src/mechanical-review/dto/update-mechanical';
import { MechanicalStatus } from 'src/common/types/mechanical-status';
import { StockMovementsService } from 'src/stock-movements/stock-movements.service';
import { PartMovement } from 'src/common/enums/part-movements';

@Injectable()
export class MechanicalReviewService {
  constructor(
    @InjectRepository(MechanicalReview)
    private readonly mechanicalReviewRepository: Repository<MechanicalReview>,
    private readonly userService: UserService,
    private readonly stockMovementsService: StockMovementsService,
  ) {}

  private groupProductsUsed(productsUsed: ProductUsedDto[] = []) {
    const groupedProducts = new Map<number, number>();

    for (const product of productsUsed) {
      groupedProducts.set(
        product.id,
        (groupedProducts.get(product.id) ?? 0) + product.quantity,
      );
    }

    return groupedProducts;
  }

  async getMechanicalReviewById(id: number) {
    const review = await this.mechanicalReviewRepository.findOne({
      where: { id },
      relations: ['productsUsed'],
    });

    if (!review) {
      throw new BadRequestException('Revisão mecânica não encontrada');
    }

    return new ResponseMechanicalDto(review);
  }

  private async applyProductsUsed(
    mechanicalReview: MechanicalReview,
    productsUsed: ProductUsedDto[] | undefined,
    productRepository: Repository<Product>,
    isUpdate: boolean = false,
    mechanicName: string = '',
  ) {
    if (!productsUsed?.length) {
      return mechanicalReview.productsUsed ?? [];
    }

    const groupedProducts = this.groupProductsUsed(productsUsed);
    const productIds = [...groupedProducts.keys()];
    const reviewProductsById = new Map(
      (mechanicalReview.productsUsed ?? []).map((product) => [
        product.id,
        product,
      ]),
    );

    const foundProducts = await productRepository.find({
      where: { id: In(productIds) },
    });

    const foundProductsById = new Map(
      foundProducts.map((product) => [product.id, product]),
    );

    const missingProductId = productIds.find(
      (productId) => !foundProductsById.has(productId),
    );

    if (missingProductId) {
      throw new BadRequestException(
        `Produto não encontrado: ${missingProductId}`,
      );
    }

    for (const [productId, newUsedQuantity] of groupedProducts) {
      if (newUsedQuantity <= 0) {
        throw new BadRequestException(
          `Quantidade inválida para o produto: ${productId}`,
        );
      }

      const product = foundProductsById.get(productId);

      if (!product) {
        continue;
      }

      const reviewProduct = reviewProductsById.get(productId);
      const previousUsedQuantity = reviewProduct?.quantityUsed ?? 0;

      const quantityDifference = isUpdate
        ? newUsedQuantity - previousUsedQuantity
        : newUsedQuantity;

      const nextQuantity = product.quantity - quantityDifference;

      if (nextQuantity < 0) {
        throw new BadRequestException(
          `Quantidade insuficiente para o produto: ${product.name}`,
        );
      }

      product.quantity = nextQuantity;
      product.mechanicalReview = mechanicalReview;
      product.quantityUsed = newUsedQuantity;

      await productRepository.save(product);

      if (quantityDifference > 0) {
        await this.stockMovementsService.logProductMovement(
          productId,
          product.name,
          mechanicName,
          mechanicalReview.id,
          quantityDifference,
          PartMovement.OUT,
        );
      } else if (quantityDifference < 0) {
        await this.stockMovementsService.logProductMovement(
          productId,
          product.name,
          mechanicName,
          mechanicalReview.id,
          Math.abs(quantityDifference),
          PartMovement.RETURN,
        );
      }

      if (reviewProduct) {
        reviewProduct.quantityUsed = newUsedQuantity;
      } else {
        reviewProductsById.set(productId, {
          ...product,
          quantityUsed: newUsedQuantity,
        });
      }
    }

    return [...reviewProductsById.values()].map((product) => ({
      ...product,
      quantityUsed: product.quantityUsed ?? 0,
    }));
  }

  async getAllMechanicalReviews(req: Request, status?: MechanicalStatus) {
    const reviews = await this.mechanicalReviewRepository.find({
      where: { userId: req['user']?.sub },
      relations: ['productsUsed'],
    });

    const filteredReviews = status
      ? reviews.filter((review) => review.status === status)
      : reviews;

    return filteredReviews.map((review) => new ResponseMechanicalDto(review));
  }

  async createMechanicalReview(
    req: Request,
    createMechanicalReviewDto: CreateMechanicalDto,
  ) {
    const userExists = await this.userService.findById(req['user']?.sub);

    if (!userExists) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const { productsUsed = [], ...mechanicalReviewData } =
      createMechanicalReviewDto;

    const savedReview =
      await this.mechanicalReviewRepository.manager.transaction(
        async (manager) => {
          const mechanicalReviewRepository =
            manager.getRepository(MechanicalReview);

          const mechanicalReview = mechanicalReviewRepository.create({
            ...mechanicalReviewData,
            userId: userExists.id,
          });

          const savedMechanicalReview =
            await mechanicalReviewRepository.save(mechanicalReview);

          const productRepository = manager.getRepository(Product);

          const usedProducts = await this.applyProductsUsed(
            savedMechanicalReview,
            productsUsed,
            productRepository,
            false,
            mechanicalReviewData.mechanic,
          );

          return {
            ...savedMechanicalReview,
            productsUsed: usedProducts,
          };
        },
      );

    if (!savedReview) {
      throw new BadRequestException('Revisão mecânica não encontrada');
    }

    return new ResponseMechanicalDto(savedReview);
  }

  async updateMechanicalReview(
    id: number,
    updateMechanicalReviewDto: UpdateMechanicalDto,
  ) {
    const updatedReview =
      await this.mechanicalReviewRepository.manager.transaction(
        async (manager) => {
          const mechanicalReviewRepository =
            manager.getRepository(MechanicalReview);

          const mechanicalReview = await mechanicalReviewRepository.findOne({
            where: { id },
            relations: ['productsUsed'],
          });

          if (!mechanicalReview) {
            throw new BadRequestException('Revisão mecânica não encontrada');
          }

          const { productsUsed = [], ...mechanicalReviewData } =
            updateMechanicalReviewDto;

          mechanicalReviewRepository.merge(
            mechanicalReview,
            mechanicalReviewData,
          );

          await mechanicalReviewRepository.save(mechanicalReview);

          const productRepository = manager.getRepository(Product);

          const usedProducts = await this.applyProductsUsed(
            mechanicalReview,
            productsUsed,
            productRepository,
            true,
            mechanicalReview.mechanic,
          );

          return {
            ...mechanicalReview,
            productsUsed: usedProducts,
          };
        },
      );

    if (!updatedReview) {
      throw new BadRequestException('Revisão mecânica não encontrada');
    }

    return new ResponseMechanicalDto(updatedReview);
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

  async removeProductFromReview(reviewId: number, productId: number) {
    const updatedReview =
      await this.mechanicalReviewRepository.manager.transaction(
        async (manager) => {
          const mechanicalReviewRepository =
            manager.getRepository(MechanicalReview);
          const productRepository = manager.getRepository(Product);

          const review = await mechanicalReviewRepository.findOne({
            where: { id: reviewId },
            relations: ['productsUsed'],
          });

          if (!review) {
            throw new BadRequestException('Revisão mecânica não encontrada');
          }

          const productInReview = (review.productsUsed ?? []).find(
            (p) => p.id === productId,
          );

          if (!productInReview) {
            throw new BadRequestException('Produto não encontrado na revisão');
          }

          const product = await productRepository.findOne({
            where: { id: productId },
          });

          if (!product) {
            throw new BadRequestException('Produto não encontrado');
          }

          const qtyToReturn = productInReview.quantityUsed ?? 0;

          product.quantity = (product.quantity ?? 0) + qtyToReturn;
          product.quantityUsed = Math.max(
            (product.quantityUsed ?? 0) - qtyToReturn,
            0,
          );

          await productRepository.save(product);

          await this.stockMovementsService.logProductMovement(
            productId,
            product.name,
            review.mechanic,
            review.id,
            qtyToReturn,
            PartMovement.RETURN,
          );

          review.productsUsed = (review.productsUsed ?? []).filter(
            (p) => p.id !== productId,
          );

          await mechanicalReviewRepository.save(review);

          return review;
        },
      );

    return new ResponseMechanicalDto(updatedReview);
  }
}
