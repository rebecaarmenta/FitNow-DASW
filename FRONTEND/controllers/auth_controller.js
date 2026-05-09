// LOGIN
function login(event) {
    event.preventDefault();
    
    let formData = new FormData(event.target);
    let loginData = Object.fromEntries(formData.entries());

    fetch(local_url + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) { 
            return response.text().then(text => { 
                alert(text || "Correo y/o contraseña incorrectos"); 
            });
        }
        return response.json();
    })
    .then(data => {
        if (!data || !data.token) return;

        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));

        alert(`¡Bienvenido de nuevo, ${data.user.name}!`);

        if (data.user.rol === 'instructor') {
            window.location.href = local_url + '/instructor/misClases.html';
        } else {
            window.location.href = local_url + '/usuario/clases.html';
        }
    })
    .catch(err => {
        console.error('Error en login:', err);
        alert("Error de conexión: Asegúrate de que el servidor esté encendido.");
    });
}
 
// REGISTER
function register(event) {
    event.preventDefault();
    let data = new FormData(event.target);
    let body = Object.fromEntries(data.entries());

    if (!body.rol) {
        body.rol = document.getElementById('rolSeleccionado').value;
    }

    if (body.rol === 'instructor') {
        body.codigo = document.getElementById('codigoInstructor').value;
    }

    fetch(local_url + '/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(msg => { alert(msg); });
        }
        alert("Cuenta creada con éxito. Por favor, inicia sesión.");
        window.location.href = local_url + '/login';
    })
    .catch(err => console.error('Error en register:', err));
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
