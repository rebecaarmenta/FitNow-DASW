import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as usersController from '../controllers/users_controller.js';
import jwt from 'jsonwebtoken';
import { verificarToken } from '../middlewares/auth.js';

import usersRouter from './users.js';
import disciplinesRouter from './disciplines.js';
import sessionsRouter from './sessions.js';
import enrollmentsRouter from './enrollments.js';
import attendancesRouter from './attendances.js';

 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const routerApi = express.Router();
 
// vistas
routerApi.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../FRONTEND/FitNow.html'));
});
routerApi.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../FRONTEND/LogIn.html'));
});
routerApi.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../FRONTEND/SigIn.html'));
});

routerApi.get('/usuario/dashboard.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../FRONTEND/usuario/dashboard.html'));
});

routerApi.get('/instructor/clasesSemana.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../FRONTEND/instructor/clasesSemana.html'));
});

routerApi.get('/usuario/clases.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../FRONTEND/usuario/clases.html'));
});

routerApi.get('/usuario/desinscribir.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../FRONTEND/usuario/desinscribir.html'));
});

routerApi.post('/signup', usersController.register);
routerApi.post('/login', usersController.login);

routerApi.use(verificarToken);

routerApi.get('/:id/history', usersController.getUserHistory);

routerApi.use('/users', usersRouter);
routerApi.use('/disciplines', disciplinesRouter);
routerApi.use('/sessions', sessionsRouter);
routerApi.use('/enrollments', enrollmentsRouter);
routerApi.use('/attendances', attendancesRouter);
 
export default routerApi;
