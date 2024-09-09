import { Types } from 'mongoose';
import { ProductApi } from '../api-client';
import { generateRandomString } from '../utils/generate-random-string.util';

export class ProductBuilder {
  private _id: string;
  private name: string;
  private quantity: number;
  private productApi: ProductApi;

  constructor() {
    this._id = new Types.ObjectId().toString();
    this.name = generateRandomString();
    this.quantity = Math.ceil(Math.random() * 100);
    this.productApi = new ProductApi();
  }

  setId(value: string) {
    this._id = value;
    return this;
  }
  setName(value: string) {
    this.name = value;
    return this;
  }
  setQuantity(value: number) {
    this.quantity = value;
    return this;
  }
  async build(): Promise<string> {
    const { data } = await this.productApi.productControllerCreateOrUpdate({
      id: this._id,
      createOrUpdateProductDto: {
        name: this.name,
        quantity: this.quantity,
      },
    });

    return data._id;
  }
}
