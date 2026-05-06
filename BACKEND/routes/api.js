import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as usersController from '../controllers/users_controller.js';
import usersRouter from './users.js';
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const routerApi = express.Router();
 
// vistas
routerApi.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../FitNow.html'));
});
routerApi.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../LogIn.html'));
});
routerApi.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../SigIn.html'));
});

routerApi.use('/users', usersRouter);
 
export default routerApi;
