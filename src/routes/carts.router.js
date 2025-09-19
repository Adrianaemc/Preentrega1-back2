import { Router } from 'express';
import passport from 'passport';
import {
  createCart,
  getCart,
  addProduct,
  updateCart,
  deleteProduct,
  emptyCart
} from '../controllers/cart.controller.js';
import { requireRole } from '../middleware/auth.js';
import { handlePurchase } from '../controllers/purchase.controller.js';



const router = Router();

router.post('/', createCart); // Crear carrito vacío
router.get('/:cid', getCart); // Obtener carrito por ID
router.post('/:cid/product/:pid', passport.authenticate('jwt', { session: false }), requireRole('user'), addProduct); // Agregar producto
router.put('/:cid', updateCart); // Reemplazar productos
router.delete('/:cid/product/:pid', deleteProduct); // Eliminar producto
router.delete('/:cid', emptyCart); // Vaciar carrito
router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), handlePurchase);
export default router;