const local_url = "http://localhost:3000";
 
function validateLogin() {
    const ruta = window.location.pathname;
    const rutasProtegidas = ['/instructor/', '/usuario/'];
    const estaEnProtegida = rutasProtegidas.some(r => ruta.includes(r));
 
    if (!sessionStorage.user && estaEnProtegida) {
        alert("Favor de iniciar sesion");
        window.location.href = local_url + '/login';
    }
 
    if (sessionStorage.user && (ruta === '/' || ruta.includes('LogIn') || ruta.includes('SigIn'))) {
        let user = JSON.parse(sessionStorage.user);
        if (user.rol === 'instructor') {
            window.location.href = local_url + '/instructor/misClases.html';
        } else {
            window.location.href = local_url + '/usuario/clases.html';
        }
    }
}
 
validateLogin();
