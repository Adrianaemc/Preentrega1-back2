import { Router } from 'express';
import passport from 'passport';
import { requireRole } from '../middleware/auth.js';
import { ProductController } from '../controllers/product.controller.js';

const router = Router();
const controller = new ProductController();

router.get('/', controller.getAll);
router.get('/:pid', controller.getById);
router.post('/', passport.authenticate('jwt', { session: false }), requireRole('admin'), controller.create);
router.put('/:pid', passport.authenticate('jwt', { session: false }), requireRole('admin'), controller.update);
router.delete('/:pid', passport.authenticate('jwt', { session: false }), requireRole('admin'), controller.delete);

export default router;
