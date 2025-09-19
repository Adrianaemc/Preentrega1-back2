import { CartService } from '../services/cart.service.js';

const cartService = new CartService();

export const createCart = async (req, res) => {
  const newCart = await cartService.createCart();
  res.status(201).json(newCart);
};

export const getCart = async (req, res) => {
  const cart = await cartService.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
};

export const addProduct = async (req, res) => {
  const updated = await cartService.addProductToCart(req.params.cid, req.params.pid);
  if (!updated) return res.status(404).json({ error: 'No se pudo agregar producto' });
  res.json(updated);
};

export const updateCart = async (req, res) => {
  const updated = await cartService.updateCart(req.params.cid, req.body.products);
  res.json(updated);
};

export const deleteProduct = async (req, res) => {
  const updated = await cartService.deleteProduct(req.params.cid, req.params.pid);
  res.json(updated);
};

export const emptyCart = async (req, res) => {
  const updated = await cartService.emptyCart(req.params.cid);
  res.json(updated);
};