// LOGIN
function login(event) {
    event.preventDefault();
    let data = new FormData(event.target);
    
    // Usamos local_url
    fetch(local_url + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries()))
    })
    .then(response => {
        if (!response.ok) { 
            return response.text().then(text => { alert(text || "Credenciales incorrectas"); });
        }
        return response.json();
    })
    .then(res => {
        if (!res || !res.token) return;

        // Guardar token y usuario
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('user', JSON.stringify(res.user));

        if (res.user.rol === 'instructor') {
            window.location.href = local_url + '/instructor/misClases.html';
        } else {
            window.location.href = local_url + '/usuario/clases.html';
        }
    })
    .catch(err => {
        console.error('Error en login:', err);
        alert("No se pudo conectar con el servidor.");
    });
}
 
// REGISTER
function register(event) {
    event.preventDefault();
    let data = new FormData(event.target);
    let body = Object.fromEntries(data.entries());

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
