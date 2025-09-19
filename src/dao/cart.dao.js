import { CartModel } from '../models/Cart.js';

export class CartDAO {
  async createCart() {
    return await CartModel.create({});
  }

  async getCartById(cid) {
    return await CartModel.findById(cid).populate('products.product').lean();
  }

  async addProductToCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product.toString() === pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    return await cart.save();
  }

  async updateCart(cid, products) {
    return await CartModel.findByIdAndUpdate(cid, { products }, { new: true });
  }

  async deleteProduct(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    return await cart.save();
  }

  async emptyCart(cid) {
    return await CartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
  }
}