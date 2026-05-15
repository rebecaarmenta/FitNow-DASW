import Session from '../models/session.js';
import User from '../models/user.js';
import Discipline from '../models/discipline.js';

export async function createSession(req, res) {
    try {
        const body = req.body;
        const instructorId = body.instructor_id;
        const disciplineId = body.discipline_id;
        const dateParts = body.date ? body.date.split('-').map(part => Number(part)) : [];
        const dateValue = dateParts.length === 3
            ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
            : null;
        const timeValue = body.time;
        const capacity = Number(body.capacity);
        const placeValue = body.place ? body.place.trim() : '';

        if (!instructorId || !disciplineId || !body.date || !timeValue || !capacity || !placeValue) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        if (!dateValue || isNaN(dateValue.getTime())) {
            return res.status(400).json({ message: 'Fecha inválida' });
        }

        if (dateValue.getDay() === 0) {
            return res.status(400).json({ message: 'No se ofertan clases los domingos' });
        }

        const allowedTimes = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'];
        if (!allowedTimes.includes(timeValue)) {
            return res.status(400).json({ message: 'La hora debe ser entre 07:00 y 12:00' });
        }

        if (capacity <= 0) {
            return res.status(400).json({ message: 'El cupo debe ser mayor a 0' });
        }

        const user = await User.findById(instructorId);
        if (!user) {
            return res.status(404).send('Instructor no encontrado');
        }
        if (user.rol !== 'instructor') {
            return res.status(403).send('El usuario no es instructor');
        }

        const discipline = await Discipline.findById(disciplineId);
        if (!discipline) {
            return res.status(404).send('Disciplina no encontrada');
        }

        // Crear rango de fecha para búsqueda robusta
        const startOfDay = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate(), 0, 0, 0);
        const endOfDay = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate(), 23, 59, 59);

        const instructorConflict = await Session.findOne({
            instructor_id: instructorId,
            date: { $gte: startOfDay, $lte: endOfDay },
            time: timeValue,
            status: 'programada'
        });
        if (instructorConflict) {
            return res.status(400).json({ message: 'Instructor ocupado: ya tienes una sesión asignada ese día y hora' });
        }

        const placeConflict = await Session.findOne({
            place: placeValue,
            date: { $gte: startOfDay, $lte: endOfDay },
            time: timeValue,
            status: 'programada'
        });
        if (placeConflict) {
            return res.status(400).json({ message: 'Sala ocupada: ya hay una sesión programada en esta sala para la fecha y hora seleccionadas' });
        }

        const newSession = new Session({
            discipline_id: disciplineId,
            instructor_id: instructorId,
            date: dateValue,
            time: timeValue,
            capacity: capacity,
            place: placeValue,
            status: 'programada'
        });

        const savedSession = await newSession.save();
        res.json(savedSession);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
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

export function getSessionsByDiscipline(req, res) {
    Session.find({ discipline_id: req.params.discipline_id })
    .populate('discipline_id')
    .populate('instructor_id')
    .then(sessions => {
        res.json(sessions);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}