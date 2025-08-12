import express from 'express';
import mongoose from 'mongoose';
import { create } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';
import passport from 'passport';
import { initPassport } from './src/config/passport.js';
import sessionsRouter from './src/routes/sessions.router.js';
import usersRouter from './src/routes/users.router.js';

// Tus routers existentes
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
import viewsRouter from './src/routes/views.router.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Conexión a MongoDB (sin opciones deprecadas)
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// cookies + passport
app.use(cookieParser());
initPassport();
app.use(passport.initialize());

// Handlebars con helper ifEquals
const hbs = create({
  helpers: {
    ifEquals(a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    }
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// Rutas de vistas y APIs existentes
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});