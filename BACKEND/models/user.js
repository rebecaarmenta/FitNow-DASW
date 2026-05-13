import mongoose from 'mongoose';
 
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    lastname: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    description: { type: String, trim: true },
    classes: [{ type: String }],
    rol: { type: String, enum: ['usuario', 'instructor'], default: 'usuario' },
    joined_at: { type: Date, default: Date.now }
});


const User = mongoose.model('User', userSchema);
export default User;
 