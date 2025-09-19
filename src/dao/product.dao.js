import { Product } from '../models/Product.js';

export class ProductDAO {
  async paginate(filter = {}, options = {}) {
    return Product.paginate(filter, options);
  }

  async findById(id) {
    return Product.findById(id).lean();
  }

  async create(data) {
    return Product.create(data);
  }

  async insertMany(data) {
    return Product.insertMany(data);
  }

  async update(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}