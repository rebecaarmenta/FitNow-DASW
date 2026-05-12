import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routerApi from './routes/api.js';
 
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
 
const app = express();
const puerto = process.env.PORT || 3000;
 
app.use(cors());
app.use(express.json());

app.get('/favicon.ico', (req, res) => res.status(204).end());
 
// archivos estaticos del frontend
app.use(express.static(path.join(__dirname, '../FRONTEND')));
 
app.use(routerApi);
 
// conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Conectado a MongoDB!');
    app.listen(puerto, () => {
        console.log(`FitNow corriendo en el puerto ${puerto}!`);
    });
})
.catch(err => console.error('Error conectando a MongoDB:', err));
 