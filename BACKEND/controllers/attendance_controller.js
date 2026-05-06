import Attendance from '../models/attendance.js';
import Enrollment from '../models/enrollment.js';

export function createAttendance(req, res){
    let body = req.body;

    Enrollment.findOne({
        user_id: body.user_id,
        session_id: body.session_id,
        status: 'activa'
    })
    .then(enrollment => {
        if(!enrollment){
            return res.status(400).send('El usuario no esta inscrito en esta sesion');
        }
        return Attendance.findOne({
            user_id: body.user_id,
            session_id: body.session_id
        });
    })
    .then(existe => {
        if(existe){
            return res.status(400).send('La asistencia ya fue registrada');
        }
        let newAttendance = new Attendance({
            user_id: body.user_id,
            session_id: body.session_id,
            attended: body.attended
        });

        return newAttendance.save();
    })
    .then(attendance => {
        if(attendance){
            res.json(attendance);
        }
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function getAttendanceBySession(req, res){
    Attendance.find({
        session_id: req.params.session_id
    })
    .populate('user_id')
    .populate('session_id')
    .then(attendance => {
        res.json(attendance);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function updateAttendance(req, res){
    let body = req.body;

    Attendance.findByIdAndUpdate(
        req.params.id,
        {
            attended: body.attended
        },
        { new: true }
    )
    .then(attendance => {
        if(!attendance){
            return res.status(404).send('Asistencia no encontrada');
        }
        res.json(attendance);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function getAttendanceByUser(req, res){
    Attendance.find({
        user_id: req.params.user_id
    })
    .populate('session_id')
    .then(attendance => {
        res.json(attendance);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}