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
                : local_url + '/usuario/dashboard.html';
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

    try {
        const response = await fetch(local_url + '/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const mensajeError = await response.text();
            alert("Atención: " + mensajeError);
            return;
        }

        const nuevoUsuario = await response.json();
        alert(`¡Cuenta creada con éxito para ${nuevoUsuario.name}!`);
        window.location.href = local_url + '/LogIn.html';

    } catch (err) {
        alert("No se pudo conectar con el servidor.");
    }
}
 
// LOGOUT
function logout() {
    if (event) event.preventDefault();
    sessionStorage.clear();
    window.location.href = local_url + '/login';
}
 
// listeners
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');

    if (formLogin) formLogin.addEventListener('submit', login);
    if (formRegister) formRegister.addEventListener('submit', register);

    document.addEventListener('click', (e) => {
        if (e.target.closest('#btnLogout')) {
            logout(e);
        }
    });
});
