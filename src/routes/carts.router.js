import { Router } from 'express';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Ticket } from '../models/Ticket.js';
import passport from 'passport';
import { requireRole } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Crear carrito vacío (sin restricción)
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Obtener carrito
router.get('/:cid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.cid).populate('products.product');
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  }
);

// Agregar producto al carrito (solo user)
router.post('/:cid/products/:pid',
  passport.authenticate('jwt', { session: false }),
  requireRole('user'),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;

      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

      const existingProduct = cart.products.find(p => p.product.toString() === pid);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();

      res.status(200).json({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
      console.error('Error al agregar producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// Eliminar producto del carrito
router.delete('/:cid/products/:pid',
  passport.authenticate('jwt', { session: false }),
  requireRole('user'),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

      cart.products = cart.products.filter(p => p.product.toString() !== pid);
      await cart.save();

      res.json({ message: 'Producto eliminado del carrito' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  }
);

// Vaciar carrito
router.delete('/:cid',
  passport.authenticate('jwt', { session: false }),
  requireRole('user'),
  async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.cid);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

      cart.products = [];
      await cart.save();

      res.json({ message: 'Carrito vaciado' });
    } catch (err) {
      res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
  }
);

// 🧾 COMPRA → Genera ticket y descuenta stock
router.post('/:cid/purchase',
  passport.authenticate('jwt', { session: false }),
  requireRole('user'),
  async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.cid).populate('products.product');
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

      const purchased = [];
      const notPurchased = [];

      for (const item of cart.products) {
        const prod = item.product;
        if (prod.stock >= item.quantity) {
          prod.stock -= item.quantity;
          await prod.save();
          purchased.push({ product: prod._id, quantity: item.quantity });
        } else {
          notPurchased.push({ product: prod._id, available: prod.stock });
        }
      }

      // Generar ticket solo si hay productos comprados
      if (purchased.length > 0) {
        const amount = purchased.reduce((acc, p) => {
          const prod = cart.products.find(c => c.product._id.equals(p.product)).product;
          return acc + prod.price * p.quantity;
        }, 0);

        const ticket = await Ticket.create({
          code: uuidv4(),
          purchase_datetime: new Date(),
          amount,
          purchaser: req.user.email
        });

        // Eliminar comprados del carrito
        cart.products = cart.products.filter(p =>
          !purchased.some(pur => pur.product.toString() === p.product._id.toString())
        );
        await cart.save();

        res.json({ ticket, notPurchased });
      } else {
        res.status(400).json({ error: 'No se pudo comprar ningún producto por falta de stock' });
      }
    } catch (err) {
      console.error('Error en compra:', err);
      res.status(500).json({ error: 'Error al procesar la compra' });
    }
  }
);

export default router;