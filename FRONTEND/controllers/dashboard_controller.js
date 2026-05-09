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

// (Historial y Metas)
function renderHistorialMetas(enrollments) {
    const contenedor = document.getElementById('hist-rows');
    if (!contenedor) return;

    const resumen = enrollments.reduce((acc, e) => {
        const nombreClase = e.session_id.discipline_id?.name || 'Otros';
        if (!acc[nombreClase]) {
            acc[nombreClase] = { cantidad: 0, meta: 4 };
        }
        if (e.status === 'activa') acc[nombreClase].cantidad++;
        return acc;
    }, {});

    const nombres = Object.keys(resumen);
    if (nombres.length === 0) {
        contenedor.innerHTML = '<p class="text-center py-3">Sin historial.</p>';
        return;
    }

    contenedor.innerHTML = nombres.map(nombre => {
        const info = resumen[nombre];
        const bajoMeta = info.cantidad < info.meta;
        return `
            <div class="hist-row">
                <span class="hist-class">${nombre}</span>
                <span class="hist-count">${info.cantidad}</span>
                <div class="hist-goal-cell">
                    <span class="goal-num ${bajoMeta ? 'warn' : ''}">${info.meta}</span>
                </div>
            </div>
        `;
    }).join('');
}