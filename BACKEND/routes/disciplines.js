import express from 'express';

import {
    createDiscipline,
    getDisciplines,
    getDiscipline,
    updateDiscipline,
    deleteDiscipline
} from '../controllers/disciplines_controller.js';

const router = express.Router();

router.post('/', createDiscipline);
router.get('/', getDisciplines);
router.get('/:id', getDiscipline);
router.patch('/:id', updateDiscipline);
router.delete('/:id', deleteDiscipline);

export default router;