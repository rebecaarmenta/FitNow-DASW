import Enrollment from '../models/enrollment.js';
import Session from '../models/session.js';

export async function createEnrollment(req, res) {
    try {
        const body = req.body;
        const session = await Session.findById(body.session_id);

        if (!session) {
            return res.status(404).send('Sesion no encontrada');
        }

        const existingEnrollment = await Enrollment.findOne({
            user_id: body.user_id,
            session_id: body.session_id,
            status: 'activa'
        });

        if (existingEnrollment) {
            return res.status(400).send('El usuario ya esta inscrito');
        }

        const activeEnrollments = await Enrollment.find({
            user_id: body.user_id,
            status: 'activa'
        }).populate('session_id');

        function parseLocalDate(dateString) {
            if (!dateString) return null;
            const [year, month, day] = dateString.slice(0, 10).split('-').map(Number);
            if ([year, month, day].some(value => isNaN(value))) return null;
            return new Date(year, month - 1, day);
        }

        const hasConflict = activeEnrollments.some(enrollment => {
            const otherSession = enrollment.session_id;
            if (!otherSession || !otherSession.date || !otherSession.time) return false;
            
            // Convertir las fechas a strings si es necesario
            const otherDateStr = otherSession.date instanceof Date ? otherSession.date.toISOString() : otherSession.date;
            const sessionDateStr = session.date instanceof Date ? session.date.toISOString() : session.date;
            
            const otherDate = parseLocalDate(otherDateStr);
            const sessionDate = parseLocalDate(sessionDateStr);
            return otherSession._id.toString() !== session._id.toString()
                && otherDate && sessionDate && otherDate.getTime() === sessionDate.getTime()
                && otherSession.time === session.time;
        });

        if (hasConflict) {
            return res.status(400).json({ message: 'No puedes inscribirte a dos clases el mismo día y a la misma hora' });
        }

        const total = await Enrollment.countDocuments({
            session_id: body.session_id,
            status: 'activa'
        });

        if (total >= session.capacity) {
            return res.status(400).send('La clase esta llena');
        }

        const newEnrollment = new Enrollment({
            user_id: body.user_id,
            session_id: body.session_id
        });

        const savedEnrollment = await newEnrollment.save();
        res.json(savedEnrollment);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export function getEnrollmentsByUser(req, res){
    Enrollment.find({
        user_id: req.params.user_id
    })
    .populate({
        path: 'session_id',
        populate: [
            { path: 'discipline_id' },
            { path: 'instructor_id' }
        ]
    })
    .then(enrollments => {
        res.json(enrollments);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function cancelEnrollment(req, res){
    Enrollment.findByIdAndUpdate(
        req.params.id,
        {
            status: 'cancelada'
        },
        { new: true }
    )
    .then(enrollment => {
        if(!enrollment){
            return res.status(404).send('Inscripcion no encontrada');
        }
        res.json({
            message: 'Inscripcion cancelada',
            enrollment
        });
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function getEnrollmentsBySession(req, res){
    Enrollment.find({
        session_id: req.params.session_id,
        status: 'activa'
    })
    .populate('user_id')
    .populate({
        path: 'session_id',
        populate: { path: 'discipline_id' }
    })
    .then(enrollments => {
        res.json(enrollments);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}