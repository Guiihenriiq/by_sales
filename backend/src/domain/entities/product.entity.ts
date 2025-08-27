// src/domain/entities/product.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

type CreateProductProps = {
  name: string;
  description: string;
  price: number;
};

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;


  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  private constructor() { }

  static create(props: CreateProductProps): Product {
    const product = new Product();

    if (props.price <= 0) {
      throw new Error('Price must be greater than zero.');
    }

    Object.assign(product, {
      name: props.name,
      description: props.description,
      price: props.price,
    });

    return product;
  }
}