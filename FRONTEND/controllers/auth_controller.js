// LOGIN
function login(event) {
    event.preventDefault();
    let data = new FormData(event.target);
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries()))
    })
    .then(response => {
        if (!response.ok) { alert("Correo y/o contrasenia incorrectos"); return; }
        return response.json();
    })
    .then(user => {
        if (!user) return;
        sessionStorage.setItem('user', JSON.stringify(user));
        if (user.rol === 'instructor') {
            window.location.href = local_url + '/instructor/clasesSemana.html';
        } else {
            window.location.href = local_url + '/usuario/dashboard.html';
        }
    })
    .catch(err => console.error('Error en login:', err));
}
 
// REGISTER
function register(event) {
    event.preventDefault();
    let data = new FormData(event.target);
    let body = Object.fromEntries(data.entries());
 
    if (body.rol === 'instructor') {
        body.codigo = document.getElementById('codigoInstructor').value;
    }
 
    fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(msg => { alert(msg); });
        }
        return response.json();
    })
    .then(user => {
        if (!user) return;
        sessionStorage.setItem('user', JSON.stringify(user));
        if (user.rol === 'instructor') {
            window.location.href = local_url + '/instructor/clasesSemana.html';
        } else {
            window.location.href = local_url + '/usuario/dashboard.html';
        }
    })
    .catch(err => console.error('Error en register:', err));
}
 
// LOGOUT
function logout() {
    sessionStorage.clear();
    window.location.href = local_url + '/login';
}
 
// listeners
if (document.getElementById('formLogin')) {
    document.getElementById('formLogin').addEventListener('submit', login);
}
if (document.getElementById('formRegister')) {
    document.getElementById('formRegister').addEventListener('submit', register);
}
