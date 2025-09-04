import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';

type CreateCategoryProps = {
  name: string;
  description?: string;
  imageUrl?: string;
};

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Product, product => product.category)
  products!: Product[];

  private constructor() { }

  static create(props: CreateCategoryProps): Category {
    const category = new Category();

    Object.assign(category, {
      name: props.name,
      description: props.description,
      imageUrl: props.imageUrl,
    });

    return category;
  }
}