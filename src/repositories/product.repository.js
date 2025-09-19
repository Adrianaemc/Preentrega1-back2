import { ProductDAO } from '../dao/product.dao.js';

const productDAO = new ProductDAO();

export class ProductRepository {
  async getAll(filter = {}, options = {}) {
    return productDAO.paginate(filter, options);
  }

  async getById(id) {
    return productDAO.findById(id);
  }

  async create(productData) {
    return productDAO.create(productData);
  }

  async insertMany(productsArray) {
    return productDAO.insertMany(productsArray);
  }

  async update(id, updateData) {
    return productDAO.update(id, updateData);
  }

  async delete(id) {
    return productDAO.delete(id);
  }
}