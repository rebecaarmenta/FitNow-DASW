const local_url = "http://localhost:3000";
 
function validateLogin() {
    const ruta = window.location.pathname.toLowerCase();
    const rutasProtegidas = ['/instructor/', '/usuario/'];
    const estaEnProtegida = rutasProtegidas.some(r => ruta.includes(r));
 
    if (!sessionStorage.getItem('user') && estaEnProtegida) {
        alert("Favor de iniciar sesion");
        window.location.href = local_url + '/login';
        return;
    }

    const esRutaAuth = ruta.includes('login') || ruta.includes('sigin') || ruta === '/';
 
    if (sessionStorage.getItem('user') && esRutaAuth) {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user.rol === 'instructor') {
                window.location.href = local_url + '/instructor/clasesSemana.html';
            } else {
                window.location.href = local_url + '/usuario/dashboard.html';
            }
        } catch (e) {
            console.error("Error al leer sesión", e);
            sessionStorage.clear();
        }
    }
}
 
validateLogin();

