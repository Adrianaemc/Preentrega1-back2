import { CartRepository } from '../repositories/cart.repository.js';

export class CartService {
  constructor() {
    this.cartRepo = new CartRepository();
  }

  createCart() {
    return this.cartRepo.createCart();
  }

  getCartById(cid) {
    return this.cartRepo.getCartById(cid);
  }

  addProductToCart(cid, pid) {
    return this.cartRepo.addProductToCart(cid, pid);
  }

  updateCart(cid, products) {
    return this.cartRepo.updateCart(cid, products);
  }

  deleteProduct(cid, pid) {
    return this.cartRepo.deleteProduct(cid, pid);
  }

  emptyCart(cid) {
    return this.cartRepo.emptyCart(cid);
  }
}