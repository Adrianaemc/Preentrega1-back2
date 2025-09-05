import { Product } from '../models/Product.js';

export class ProductRepository {
  async getAll(filter = {}, options = {}) {
    return Product.paginate(filter, options);
  }

  async getById(id) {
    return Product.findById(id).lean();
  }

  async create(productData) {
    return Product.create(productData);
  }

  async insertMany(productsArray) {
    return Product.insertMany(productsArray);
  }

  async update(id, updateData) {
    return Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}