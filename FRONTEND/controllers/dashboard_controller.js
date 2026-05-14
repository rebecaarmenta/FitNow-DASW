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
        const response = await fetch(`${local_url}/enrollments/user/${user.id}`, {
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

    const activas = enrollments.filter(e => {
        if (e.status !== 'activa' || !e.session_id) return false;
        const sessionDate = e.session_id.date ? new Date(e.session_id.date) : null;
        return sessionDate ? isDateInCurrentWeek(sessionDate) : true;
    });

    if (activas.length === 0) {
        contenedor.innerHTML = '<p class="text-center py-4">No tienes clases inscritas esta semana.</p>';
        return;
    }

    contenedor.innerHTML = activas.map(e => {
        const session = e.session_id;
        const dateValue = session?.date ? new Date(session.date) : null;
        const dia = dateValue ? formatDay(dateValue) : (session?.day || 'Sin fecha');
        const hora = session?.time || session?.hour || 'Sin hora';
        const instructor = session?.instructor_id
            ? `${session.instructor_id.name || ''} ${session.instructor_id.lastname || ''}`.trim()
            : 'Instructor';

        return `
        <div class="class-row">
            <span class="class-name">${session?.discipline_id?.name || 'Clase'}</span>
            <span class="class-detail class-dia">${dia}</span>
            <span class="class-detail class-hora">${hora}</span>
            <span class="class-detail class-inst">${instructor}</span>
        </div>`;
    }).join('');
}

function formatDay(date) {
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit'
    });
}

function isDateInCurrentWeek(date) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return date >= monday && date <= sunday;
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