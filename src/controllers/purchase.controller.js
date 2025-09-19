import { PurchaseService } from '../services/purchase.service.js';

// Instancia del service
const purchaseService = new PurchaseService();

export const handlePurchase = async (req, res) => {
  try {
    const cid = req.params.cid;           // carrito desde la URL
    const userEmail = req.user.email;     // email del usuario logueado
    const userCart = String(req.user.cart); // carrito asignado al usuario

    // Validación extra de seguridad
    if (cid !== userCart) {
      return res.status(403).json({ error: 'No autorizado para operar sobre este carrito' });
    }

    // Lógica delegada al service
    const result = await purchaseService.purchaseCart(cid, userEmail);

    return res.json({
      status: 'success',
      ticket: result.ticket,
      notPurchased: result.productsNotPurchased
    });
  } catch (error) {
    console.error('[handlePurchase] error:', error.message);
    return res.status(500).json({ error: 'Error interno al procesar la compra' });
  }
};
