import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    if (!createProductDto.name) {
      throw new BadRequestException('Name is required');
    }
    if (createProductDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
    if (createProductDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    if (createProductDto.parent_id) {
      const parent = await this.productRepository.findOne({
        where: { id: createProductDto.parent_id }
      });
      if (!parent) {
        throw new BadRequestException('Parent not found');
      }
    }

    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(page: number, limit: number) {
    const [data, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.parent_id && updateProductDto.parent_id === id) {
      throw new BadRequestException('Cannot be parent of itself');
    }

    if (updateProductDto.price !== undefined && updateProductDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    if (updateProductDto.stock !== undefined && updateProductDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    if (updateProductDto.parent_id) {
      const parent = await this.productRepository.findOne({
        where: { id: updateProductDto.parent_id }
      });
      if (!parent) {
        throw new BadRequestException('Parent not found');
      }
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    
    const children = await this.productRepository.count({
      where: { parent_id: id }
    });
    
    if (children > 0) {
      throw new BadRequestException('Cannot delete product that has children');
    }
    
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }
}