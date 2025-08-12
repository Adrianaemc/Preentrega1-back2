import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';
import { User } from '../models/User.js';
import { createHash, isValidPassword } from '../utils/auth.js';

dotenv.config();
const router = Router();

// REGISTER
router.post('/register', async (req,res)=>{
  try {
    const { first_name, last_name, email, age, password, cart, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error:'Email ya registrado' });

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),   // HASH bcrypt
      cart,
      role: role || 'user'
    });

    res.status(201).json({ status:'success', user: { id:user._id, email:user.email } });
  } catch (e) {
    res.status(500).json({ error:'Error en registro' });
  }
});

// LOGIN -> genera JWT y lo guarda en cookie httpOnly
router.post('/login', async (req,res)=>{
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('cart');
    if (!user) return res.status(401).json({ error:'Credenciales inválidas' });
    if (!isValidPassword(password, user.password)) return res.status(401).json({ error:'Credenciales inválidas' });

    const token = jwt.sign(
      { uid: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    );

    res
      .cookie(process.env.JWT_COOKIE, token, { httpOnly:true, sameSite:'lax' })
      .json({ status:'success', token });
  } catch (e) {
    res.status(500).json({ error:'Error en login' });
  }
});

// CURRENT -> valida JWT desde cookie y devuelve datos del user
router.get('/current',
  passport.authenticate('jwt', { session:false }),
  (req,res)=>{
    const u = req.user;
    res.json({
      status:'success',
      user:{
        id: u._id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        age: u.age,
        role: u.role,
        cart: u.cart
      }
    });
  }
);

// LOGOUT (opcional)
router.post('/logout', (req,res)=>{
  res.clearCookie(process.env.JWT_COOKIE).json({ status:'success' });
});

export default router;