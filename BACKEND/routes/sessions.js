import express from 'express';

import {
    createSession,
    getSessions,
    getSession,
    getSessionsByInstructor,
    getSessionsByDiscipline, 
    updateSession,
    deleteSession
} from '../controllers/sessions_controller.js';

const router = express.Router();

router.post('/', createSession);
router.get('/', getSessions);
router.get('/instructor/:instructor_id', getSessionsByInstructor);
router.get('/discipline/:discipline_id', getSessionsByDiscipline);
router.get('/:id', getSession);
router.patch('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;