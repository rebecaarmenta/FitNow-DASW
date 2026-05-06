import express from 'express';

import {
    createEnrollment,
    getEnrollmentsByUser,
    cancelEnrollment,
    getEnrollmentsBySession
} from '../controllers/enrollments_controller.js';

const router = express.Router();

router.post('/', createEnrollment);
router.get('/user/:user_id', getEnrollmentsByUser);
router.get('/session/:session_id', getEnrollmentsBySession);
router.patch('/:id/cancel', cancelEnrollment);

export default router;