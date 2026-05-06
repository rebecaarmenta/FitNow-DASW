import express from 'express';

import {
    login,
    register,
    getUser,
    updateUser,
    deleteUser
} from '../controllers/users_controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/', register);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;