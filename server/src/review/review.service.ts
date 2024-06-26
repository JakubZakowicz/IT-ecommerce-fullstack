import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Product } from '../product/product.entity';
import { Pagination } from '../decorators/pagination-params.decorator';
import { getOrder, getPageCount } from '../utils/functions';
import { Sorting } from '../decorators/sorting-params.decorator';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(
    paginationParams: Pagination,
    sort?: Sorting,
    productId?: string,
  ) {
    const { page, limit, size, offset } = paginationParams;
    const order = getOrder(sort);

    const [reviews, total] = await this.reviewRepository.findAndCount({
      ...(productId && { where: { product: { id: productId } } }),
      relations: { user: true },
      order,
      take: limit,
      skip: offset,
    });

    return {
      total,
      reviews,
      page,
      size,
      pageCount: getPageCount(total, size),
    };
  }

  async findOneById(id: string) {
    const review = await this.reviewRepository.findOneBy({ id });

    if (!review) {
      throw new NotFoundException(`There is no review with id: ${id}`);
    }

    return await review;
  }

  async create(userId: string, productId: string, reviewData: CreateReviewDto) {
    const newReview = await this.reviewRepository.create({
      user: { id: userId },
      product: { id: productId },
      ...reviewData,
    });

    return await this.reviewRepository.save(newReview).then(() => {
      this.calculateAverageRating(newReview.product.id);
      return newReview;
    });
  }

  async update(reviewId: string, reviewData: UpdateReviewDto) {
    await this.reviewRepository.update(reviewId, {
      ...reviewData,
    });

    const updatedReview = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: { product: true },
      select: { product: { id: true } },
    });

    if (!updatedReview) {
      throw new NotFoundException(`There is no review with id: ${reviewId}`);
    }

    this.calculateAverageRating(updatedReview.product.id);

    return updatedReview;
  }

  async delete(id: string) {
    const deletedReview = await this.reviewRepository.findOne({
      where: { id },
      relations: { product: true },
    });

    if (!deletedReview) {
      throw new NotFoundException(`There is no review with id: ${id}`);
    }

    return await this.reviewRepository.delete(id).then((res) => {
      this.calculateAverageRating(deletedReview?.product.id);
      return res;
    });
  }

  async calculateAverageRating(productId: string) {
    const reviews = await this.reviewRepository.find({
      where: { product: { id: productId } },
    });

    let averageRating = 0;

    if (reviews.length === 0) {
      await this.productRepository.save({
        id: productId,
        rating: averageRating,
      });

      return Number(averageRating.toFixed(2));
    }

    reviews.forEach((review) => {
      averageRating += review.rating;
    });

    averageRating = Number((averageRating / reviews.length).toFixed(2));

    await this.productRepository.save({ id: productId, rating: averageRating });

    return averageRating;
  }

  async checkIfUserReviewed(userId: string, productId: string) {
    return !!(await this.reviewRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    }));
  }
}
