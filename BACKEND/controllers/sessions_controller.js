import Session from '../models/session.js';
import User from '../models/user.js';
import Discipline from '../models/discipline.js';

export function createSession(req, res) {
    let body = req.body;

    User.findById(body.instructor_id)
    .then(user => {
        if(!user){
            return res.status(404).send('Instructor no encontrado');
        }
        if(user.rol !== 'instructor'){
            return res.status(403).send('El usuario no es instructor');
        }
        return Discipline.findById(body.discipline_id);
    })
    .then(discipline => {
        if(!discipline){
            return res.status(404).send('Disciplina no encontrada');
        }
        if(body.capacity <= 0){
            return res.status(400).send('El cupo debe ser mayor a 0');
        }

        let newSession = new Session({
            discipline_id: body.discipline_id,
            instructor_id: body.instructor_id,
            date: body.date,
            time: body.time,
            capacity: body.capacity,
            place: body.place,
            status: 'programada'
        });

        return newSession.save();
    })
    .then(session => {
        if(session){
            res.json(session);
        }
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function getSessions(req, res) {
    Session.find()
    .populate('discipline_id')
    .populate('instructor_id')
    .then(sessions => {
        res.json(sessions);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function getSession(req, res) {
    Session.findById(req.params.id)
    .populate('discipline_id')
    .populate('instructor_id')
    .then(session => {
        if(!session){
            return res.status(404).send('Sesion no encontrada');
        }
        res.json(session);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function getSessionsByInstructor(req, res) {
    Session.find({ instructor_id: req.params.instructor_id })
    .populate('discipline_id')
    .then(sessions => {
        res.json(sessions);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function updateSession(req, res) {
    let body = req.body;
    Session.findByIdAndUpdate(
        req.params.id,
        {
            date: body.date,
            time: body.time,
            capacity: body.capacity,
            place: body.place,
            status: body.status
        },
        { new: true }
    )
    .then(session => {

        if(!session){
            return res.status(404).send('Sesion no encontrada');
        }

        res.json(session);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function deleteSession(req, res) {
    Session.findByIdAndDelete(req.params.id)
    .then(session => {
        if(!session){
            return res.status(404).send('Sesion no encontrada');
        }
        res.json({
            message: 'Sesion eliminada'
        });
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}