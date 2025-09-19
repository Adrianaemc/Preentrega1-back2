import { ProductRepository } from "../repositories/product.repository.js";

const productRepository = new ProductRepository();

export class ProductService {
  async getProducts(filter = {}, options = {}) {
    return productRepository.getAll(filter, options);
  }

  async getProductById(pid) {
    return productRepository.getById(pid);
  }

  async createProduct(productData) {
    return productRepository.create(productData);
  }

  async createManyProducts(productsArray) {
    return productRepository.insertMany(productsArray);
  }

  async updateProduct(pid, updateData) {
    return productRepository.update(pid, updateData);
  }

  async deleteProduct(pid) {
    return productRepository.delete(pid);
  }
}
