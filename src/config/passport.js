import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

// extrae token desde cookie
const cookieExtractor = (req) => {
  if (req && req.cookies) return req.cookies[process.env.JWT_COOKIE];
  return null;
};

export const initPassport = () => {
  passport.use('jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
      },
      async (payload, done) => {
        try {
          // Traigo el user real (mejor para /current)
          const user = await User.findById(payload.uid).populate('cart');
          if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export default passport;