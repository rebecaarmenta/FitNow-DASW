import Enrollment from '../models/enrollment.js';
import Session from '../models/session.js';

export function createEnrollment(req, res){
    let body = req.body;

    Session.findById(body.session_id)
    .then(session => {
        if(!session){
            return res.status(404).send('Sesion no encontrada');
        }
        return Enrollment.findOne({
            user_id: body.user_id,
            session_id: body.session_id,
            status: 'activa'
        })
        .then(existe => {
            if(existe){
                return res.status(400).send('El usuario ya esta inscrito');
            }

            return Enrollment.countDocuments({
                session_id: body.session_id,
                status: 'activa'
            })
            .then(total => {

                if(total >= session.capacity){
                    return res.status(400).send('La clase esta llena');
                }

                let newEnrollment = new Enrollment({
                    user_id: body.user_id,
                    session_id: body.session_id
                });

                return newEnrollment.save();
            });
        });
    })
    .then(enrollment => {
        if(enrollment){
            res.json(enrollment);
        }
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function getEnrollmentsByUser(req, res){
    Enrollment.find({
        user_id: req.params.user_id
    })
    .populate('session_id')
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
    .then(enrollments => {
        res.json(enrollments);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}