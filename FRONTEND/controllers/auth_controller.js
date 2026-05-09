// LOGIN
async function login(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(local_url + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));
            
            alert(`Bienvenid@ ${data.user.name}`);
            
            window.location.href = data.user.rol === 'instructor' 
                ? local_url + '/instructor/misClases.html' 
                : local_url + '/usuario/clases.html';
        } else {
            alert(data.message || "Error de credenciales");
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
    }
}
 
// REGISTER
async function register(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData.entries());

    if (body.password !== body.confirm_password) {
        alert("Las contraseñas no coinciden");
        return;
    }

    if (body.rol === 'instructor' && !body.codigo) {
        alert("Por favor, ingresa el código de instructor");
        return;
    }

    try {
        const response = await fetch(local_url + '/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const res = await response.json();

        if (response.ok) {
            alert("Cuenta creada con éxito. ¡Inicia sesión!");
            window.location.href = local_url + '/login';
        } else {
            alert(res.message || "Error al crear la cuenta");
        }
    } catch (err) {
        console.error('Error en register:', err);
        alert("Error de conexión con el servidor");
    }
}
 
// LOGOUT
function logout() {
    sessionStorage.clear();
    window.location.href = local_url + '/login';
}
 
// listeners
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');

    if (formLogin) {
        formLogin.addEventListener('submit', login);
    }
    if (formRegister) {
        formRegister.addEventListener('submit', register);
    }
});
