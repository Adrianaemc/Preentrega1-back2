import { CartDAO } from '../dao/cart.dao.js';

export class CartRepository {
  constructor() {
    this.dao = new CartDAO();
  }

  createCart() {
    return this.dao.createCart();
  }

  getCartById(cid) {
    return this.dao.getCartById(cid);
  }

  addProductToCart(cid, pid) {
    return this.dao.addProductToCart(cid, pid);
  }

  updateCart(cid, products) {
    return this.dao.updateCart(cid, products);
  }

  deleteProduct(cid, pid) {
    return this.dao.deleteProduct(cid, pid);
  }

  emptyCart(cid) {
    return this.dao.emptyCart(cid);
  }
}
