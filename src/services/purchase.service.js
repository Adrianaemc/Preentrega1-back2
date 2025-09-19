// src/services/purchase.service.js
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../models/Product.js';
import { CartRepository } from '../repositories/cart.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';

export class PurchaseService {
  constructor() {
    this.cartRepo = new CartRepository();
    this.ticketRepo = new TicketRepository();
  }

  async purchaseCart(cid, userEmail) {
    const cart = await this.cartRepo.getCartById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    const productsToPurchase = [];
    const productsNotPurchased = [];

    for (const item of cart.products) {
      const dbProduct = await Product.findById(item.product._id);

      if (dbProduct && dbProduct.stock >= item.quantity) {
        dbProduct.stock -= item.quantity;
        await dbProduct.save();
        productsToPurchase.push(item);
      } else {
        productsNotPurchased.push(item);
      }
    }

    const amount = productsToPurchase.reduce((total, p) => {
      return total + p.product.price * p.quantity;
    }, 0);

    const ticket = await this.ticketRepo.createTicket({
      code: uuidv4(),
      amount,
      purchaser: userEmail
    });

    // actualizar el carrito con los productos no comprados
    await this.cartRepo.updateCart(cid, productsNotPurchased);

    return { ticket, productsNotPurchased };
  }
}