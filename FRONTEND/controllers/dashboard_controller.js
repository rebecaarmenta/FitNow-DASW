document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    // Si no hay usuario, mandarlo al login
    if (!user || !token) {
        window.location.href = '/login';
        return;
    }

    try {
        // Pedimos el historial al backend usando el ID del usuario logueado
        const response = await fetch(`${local_url}/users/${user._id}/enrollments`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const enrollments = await response.json();
            renderClasesProgramadas(enrollments);
            renderHistorialMetas(enrollments);
        } else {
            console.error("Error al obtener el historial");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
});

function renderClasesProgramadas(enrollments) {
    const contenedor = document.getElementById('clases-programadas');
    
    if (!contenedor) return;

    // Filtramos solo las que están con status 'activa'
    const activas = enrollments.filter(e => e.status === 'activa');

    if (activas.length === 0) {
        contenedor.innerHTML = '<p class="text-center py-4">No tienes clases inscritas esta semana.</p>';
        return;
    }

    contenedor.innerHTML = activas.map(e => `
        <div class="class-row">
            <span class="class-name">${e.session_id.discipline_id?.name || 'Clase'}</span>
            <span class="class-detail class-dia">${e.session_id.day}</span>
            <span class="class-detail class-hora">${e.session_id.hour}</span>
            <span class="class-detail class-inst">Instructor</span>
        </div>
    `).join('');
}