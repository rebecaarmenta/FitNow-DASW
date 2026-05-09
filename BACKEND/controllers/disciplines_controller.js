import Discipline from '../models/discipline.js';

export function createDiscipline(req, res) {
    let body = req.body;
    Discipline.findOne({ name: body.name })
    .then(existe => {
        if(existe){
            res.status(400).send('La disciplina ya existe');
            return null;
        }

        let newDiscipline = new Discipline({
            name: body.name,
            description: body.description,
            img: body.img
        });

        return newDiscipline.save();
    })
    .then(discipline => {
        if(discipline){
            res.json(discipline);
        }
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function getDisciplines(req, res){
    Discipline.find()
    .then(disciplines => {
        res.json(disciplines);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function getDiscipline(req, res){
    Discipline.findById(req.params.id)
    .then(discipline => {
        if(!discipline){
            return res.status(404).send('Disciplina no encontrada');
        }
        res.json(discipline);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function updateDiscipline(req, res){
    let body = req.body;

    Discipline.findByIdAndUpdate(
        req.params.id,
        {
            name: body.name,
            description: body.description,
            img: body.img
        },
        { new: true }
    )
    .then(discipline => {

        if(!discipline){
            return res.status(404).send('Disciplina no encontrada');
        }
        res.json(discipline);
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

export function deleteDiscipline(req, res){
    Discipline.findByIdAndDelete(req.params.id)
    .then(discipline => {
        if(!discipline){
            return res.status(404).send('Disciplina no encontrada');
        }
        res.json({
            message: 'Disciplina eliminada'
        });
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}