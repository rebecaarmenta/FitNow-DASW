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
        const response = await fetch(`${local_url}/${user._id}/history`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const history = await response.json();
            renderClasesProgramadas(history);
        } else {
            console.error("Error al obtener el historial");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
});

function renderClasesProgramadas(history) {
    const contenedor = document.querySelector('.class-list');
    
    // Si no tiene clases inscritas
    if (history.length === 0) {
        contenedor.innerHTML = '<p class="text-center py-3">No tienes clases inscritas esta semana.</p>';
        return;
    }

    // Mapeamos los datos reales del backend
    contenedor.innerHTML = history.map(reg => `
        <div class="class-row">
            <span class="class-name">${reg.session_id.discipline_id.name}</span>
            <span class="class-detail class-dia">${reg.session_id.day}</span>
            <span class="class-detail class-hora">${reg.session_id.hour}</span>
            <span class="class-detail class-inst">${reg.session_id.instructor_name || 'Instructor'}</span>
        </div>
    `).join('');
}