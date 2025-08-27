import { randomUUID } from 'crypto';

export type ProductProps = {
  id?: string;
  name: string;
  description: string;
  price: number;
  createdAt?: Date;
};

export class Product {
  public readonly id: string;
  public props: Required<ProductProps>;

  private constructor(props: ProductProps) {
    this.id = props.id || randomUUID();
    this.props = {
      ...props,
      id: this.id,
      createdAt: props.createdAt || new Date(),
    };
  }

  public static create(props: ProductProps): Product {
    // Aqui poderiam existir regras de negócio. Ex:
    if (props.price <= 0) {
      throw new Error('Price must be greater than zero.');
    }
    return new Product(props);
  }

  public updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be greater than zero.');
    }
    this.props.price = newPrice;
  }

  // getters para acessar propriedades de forma segura
  get name() { return this.props.name; }
  get description() { return this.props.description; }
  get price() { return this.props.price; }
  get createdAt() { return this.props.createdAt; }
}