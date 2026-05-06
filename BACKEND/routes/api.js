import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as usersController from '../controllers/users_controller.js';
 
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
 
// usuarios
routerApi.post('/login', usersController.login);
routerApi.post('/users', usersController.register);
routerApi.get('/users/:id', usersController.getUser);
routerApi.patch('/users/:id', usersController.updateUser);
routerApi.delete('/users/:id', usersController.deleteUser);
 
export default routerApi;
