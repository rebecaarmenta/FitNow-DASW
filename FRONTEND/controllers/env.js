const local_url = "http://localhost:3000";
 
function validateLogin() {
    const ruta = window.location.pathname.toLowerCase();
    const rutasProtegidas = ['/instructor/', '/usuario/'];
    const estaEnProtegida = rutasProtegidas.some(r => ruta.includes(r));
 
    if (!sessionStorage.user && estaEnProtegida) {
        alert("Favor de iniciar sesion");
        window.location.href = local_url + '/login';
        return;
    }

    const esRutaAuth = ruta.includes('login') || ruta.includes('sigin') || ruta === '/';
 
    if (sessionStorage.user && esRutaAuth) {
        try {
            const user = JSON.parse(sessionStorage.user);
            if (user.rol === 'instructor') {
                window.location.href = local_url + '/instructor/misClases.html';
            } else {
                window.location.href = local_url + '/usuario/clases.html';
            }
        } catch (e) {
            console.error("Error al leer sesión", e);
            sessionStorage.clear();
        }
    }
}
 
validateLogin();

