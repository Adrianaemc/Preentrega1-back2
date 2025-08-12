import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: { type:String, required:true },
  last_name:  { type:String, required:true },
  email:      { type:String, required:true, unique:true, index:true },
  age:        { type:Number, default:0 },
  password:   { type:String, required:true }, // guarda HASH bcrypt
  cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role:       { type:String, enum:['user','admin'], default:'user' }
}, { timestamps:true });

export const User = mongoose.model('User', userSchema);