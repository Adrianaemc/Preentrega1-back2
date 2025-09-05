import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { isValidPassword } from '../utils/auth.js';

dotenv.config();

const cookieExtractor = (req) => {
  if (req && req.cookies) return req.cookies[process.env.JWT_COOKIE];
  return null;
};

export const initPassport = () => {
  // JWT Strategy (para /current)
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.uid).populate('cart');
          if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Local Strategy (para login)
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) return done(null, false, { message: 'Usuario no encontrado' });

          if (!isValidPassword(password, user.password)) {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export default passport;
