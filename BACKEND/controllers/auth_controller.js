import User from '../models/user.js';

//POST signup
export function signup(req, res) {
    const { name, email, password, rol } = req.body;

    User.findOne({ email: email })
    .then(existe => {
        if (existe) {
            return res.status(400).send('El correo ya está registrado');
        }

        const newUser = new User({
            name,
            email,
            password,
            rol: rol || 'usuario'
        });

        return newUser.save();
    })
    .then(user => {
        if (user) {
            res.status(201).json({
                message: 'Usuario registrado con éxito',
                user: { id: user._id, name: user.name, rol: user.rol }
            });
        }
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}

//POST login
export function login(req, res) {
    const { email, password } = req.body;

    User.findOne({ email: email, password: password })
    .then(user => {
        if (!user) {
            return res.status(401).send('Correo o contraseña incorrectos');
        }

        res.json({
            message: 'Login exitoso',
            user: {
                id: user._id,
                name: user.name,
                rol: user.rol
            }
        });
    })
    .catch(err => {
        res.status(500).send(err.message);
    });
}