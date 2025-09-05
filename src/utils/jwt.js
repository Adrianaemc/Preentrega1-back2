import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (user, expiresIn = process.env.JWT_EXPIRES || '1d') => {
  return jwt.sign(
    { uid: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
