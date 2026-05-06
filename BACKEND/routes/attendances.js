import express from 'express';

import {
    createAttendance,
    getAttendanceBySession,
    updateAttendance,
    getAttendanceByUser
} from '../controllers/attendance_controller.js';

const router = express.Router();

router.post('/', createAttendance);
router.get('/session/:session_id', getAttendanceBySession);
router.get('/user/:user_id', getAttendanceByUser);
router.patch('/:id', updateAttendance);

export default router;