import { Router } from 'express';
import { User } from '../models/User.js';
import { createHash } from '../utils/auth.js';

const router = Router();

// Listar (sin password)
router.get('/', async (req,res)=>{
  const users = await User.find().select('-password');
  res.json({ status:'success', users });
});

// Obtener uno (sin password)
router.get('/:id', async (req,res)=>{
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ error:'No encontrado' });
  res.json(user);
});

// Crear (hash)
router.post('/', async (req,res)=>{
  const { first_name, last_name, email, age, password, cart, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error:'Email ya registrado' });

  const user = await User.create({
    first_name, last_name, email, age,
    password: createHash(password),
    cart, role: role || 'user'
  });
  res.status(201).json({ status:'created', id:user._id });
});

// Actualizar (si viene password, re-hash)
router.put('/:id', async (req,res)=>{
  const update = { ...req.body };
  if (update.password) update.password = createHash(update.password);
  const user = await User.findByIdAndUpdate(req.params.id, update, { new:true }).select('-password');
  if (!user) return res.status(404).json({ error:'No encontrado' });
  res.json({ status:'updated', user });
});

// Eliminar
router.delete('/:id', async (req,res)=>{
  const r = await User.findByIdAndDelete(req.params.id);
  if (!r) return res.status(404).json({ error:'No encontrado' });
  res.json({ status:'deleted' });
});

export default router;