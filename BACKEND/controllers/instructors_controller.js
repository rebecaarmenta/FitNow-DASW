import User from '../models/user.js';
import Session from '../models/session.js';

//GET instructores
export async function getInstructors(req, res) {
    try {
        const instructors = await User.find({ rol: 'instructor' }, '-password'); 
        res.json(instructors);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

//GET info de instructores
export async function getInstructorDetail(req, res) {
    try {
        const instructor = await User.findById(req.params.id, '-password');
        if (!instructor || instructor.rol !== 'instructor') {
            return res.status(404).send('Instructor no encontrado');
        }
        // Busca las sesiones asociadas a este instructor
        const sessions = await Session.find({ instructor_id: instructor._id }).populate('discipline_id');
        res.json({ instructor, sessions });
    } catch (err) {
        res.status(500).send(err.message);
    }
}
