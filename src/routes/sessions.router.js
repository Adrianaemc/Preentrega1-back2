import { Router } from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import { User } from '../models/User.js';
import { createHash, isValidPassword } from '../utils/auth.js';
import { generateToken, generateResetToken, verifyToken } from '../utils/jwt.js';
import { UserDTO } from '../dto/user.dto.js';
import { sendPasswordResetEmail } from '../utils/mailer.js';

dotenv.config();
const router = Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email ya registrado' });

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart,
      role: role || 'user'
    });

    res.status(201).json({ status: 'success', user: { id: user._id, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: 'Error en registro' });
  }
});

// LOGIN con passport-local
router.post('/login',
  passport.authenticate('login', { session: false, failWithError: true }),
  async (req, res) => {
    const user = req.user;
    const token = generateToken(user);
    res
      .cookie(process.env.JWT_COOKIE, token, { httpOnly: true, sameSite: 'lax' })
      .json({ status: 'success', token });
  },
  (err, req, res, next) => {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
);

// CURRENT con DTO y passport-jwt
router.get('/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json({ status: 'success', user: userDTO });
  }
);

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie(process.env.JWT_COOKIE).json({ status: 'success' });
});

// RECUPERAR CONTRASEÑA - Envío de mail
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const token = generateResetToken(email);
  await sendPasswordResetEmail(email, token);

  res.json({ status: 'success', message: 'Correo de recuperación enviado' });
});

// RECUPERAR CONTRASEÑA - Reset
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const payload = verifyToken(token);
    const user = await User.findOne({ email: payload.email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const same = isValidPassword(newPassword, user.password);
    if (same) return res.status(400).json({ error: 'No puedes usar la misma contraseña anterior' });

    user.password = createHash(newPassword);
    await user.save();

    res.json({ status: 'success', message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
});

export default router;