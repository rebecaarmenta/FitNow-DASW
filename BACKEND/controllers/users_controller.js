import User from '../models/user.js';
 
const CODIGO_INSTRUCTOR = 'FITNOW2026';
 
// LOGIN
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) return res.sendStatus(401);
        res.json(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
 
// REGISTER
export async function register(req, res) {
    try {
        const { name, email, password, confirm_password, rol, codigo } = req.body;
 
        if (password !== confirm_password)
            return res.status(400).send('Las contrasenias no coinciden');
 
        if (password.length < 8)
            return res.status(400).send('La contrasenia debe tener al menos 8 caracteres');
 
        // validar correo duplicado
        const existe = await User.findOne({ email });
        if (existe) return res.status(400).send('El correo ya esta en uso');
 
        // validar codigo si es instructor
        let rolFinal = 'usuario';
        if (rol === 'instructor') {
            if (codigo !== CODIGO_INSTRUCTOR)
                return res.status(400).send('Codigo de instructor incorrecto');
            rolFinal = 'instructor';
        }
 
        const nuevoUser = new User({ name, email, password, rol: rolFinal });
        await nuevoUser.save();
        res.json(nuevoUser);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
 
// GET usuario por id
export async function getUser(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('Usuario no encontrado');
        res.json(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
 
// PATCH actualizar usuario
export async function updateUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, password },
            { new: true }
        );
        if (!user) return res.status(404).send('Usuario no encontrado');
        res.json({ message: 'Usuario actualizado', user });
    } catch (err) {
        res.status(500).send(err.message);
    }
}
 
// DELETE eliminar usuario
export async function deleteUser(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send('Usuario no encontrado');
        res.json({ message: 'Usuario eliminado', user });
    } catch (err) {
        res.status(500).send(err.message);
    }
}
