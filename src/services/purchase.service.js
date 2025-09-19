import { v4 as uuid } from 'uuid';

export class PurchaseService {
  constructor(cartRepo, productRepo, ticketRepo, userRepo) {
    this.cartRepo = cartRepo;
    this.productRepo = productRepo;
    this.ticketRepo = ticketRepo; // instancia de TicketRepository
    this.userRepo = userRepo;
  }

  async purchase(userId) {
    const user = await this.userRepo.getById(userId);
    const cart = await this.cartRepo.getByIdPopulated(user.cart);
    if (!cart || cart.products.length === 0) {
      return { ok: false, message: 'Carrito vacío' };
    }

    let total = 0;
    const unavailable = [];

    // Verificar stock
    for (const item of cart.products) {
      const p = await this.productRepo.getById(item.product._id);
      if (!p || p.stock < item.quantity) {
        unavailable.push({
          productId: item.product._id.toString(),
          requested: item.quantity,
          stock: p?.stock ?? 0
        });
        continue;
      }
      total += p.price * item.quantity;
    }

    // Descontar stock de los disponibles
    for (const item of cart.products) {
      if (unavailable.find(u => u.productId === item.product._id.toString())) continue;
      await this.productRepo.updateProduct(item.product._id, {
        stock: item.product.stock - item.quantity
      });
    }

    // Generar ticket solo si hubo compras con stock
    let ticket = null;
    if (total > 0) {
      ticket = await this.ticketRepo.create({
        code: uuid(),
        amount: total,
        purchaser: user.email
      });
    }

    return { ok: true, ticket, unavailable };
  }
}