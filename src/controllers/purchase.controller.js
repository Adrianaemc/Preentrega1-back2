// src/controllers/purchase.controller.js
import { PurchaseService } from '../services/purchase.service.js';

const purchaseService = new PurchaseService();

export const handlePurchase = async (req, res) => {
  try {
    const cid = req.params.cid;
    const userEmail = req.user.email;

    const result = await purchaseService.purchaseCart(cid, userEmail);

    res.json({
      status: 'success',
      ticket: result.ticket,
      notPurchased: result.productsNotPurchased
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};