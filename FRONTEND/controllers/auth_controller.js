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
            
            alert(`Bienvenido ${data.user.name}`);
            
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
