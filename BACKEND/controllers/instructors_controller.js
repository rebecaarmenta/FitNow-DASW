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
