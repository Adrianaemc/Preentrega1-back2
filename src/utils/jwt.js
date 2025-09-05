import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

// Token general para login
export const generateToken = (user) => {
  const payload = { uid: user._id };
  return jwt.sign(payload, secret, { expiresIn: '1d' });
};

// Token para recuperación de contraseña
export const generateResetToken = (email) => {
  return jwt.sign({ email }, secret, { expiresIn: '1h' });
};

// Verificador de token (para reset-password)
export const verifyToken = (token) => {
  return jwt.verify(token, secret);
};