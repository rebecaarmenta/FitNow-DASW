let dashboardState = {
    enrollments: [],
    attendances: [],
    userGoals: []
};

document.addEventListener('DOMContentLoaded', async () => {
    let user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    if (!user || !token) {
        window.location.href = '/login';
        return;
    }

    try {
        const headers = {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        };

        const enrollmentsPromise = fetch(`${local_url}/enrollments/user/${user.id}`, {
            method: 'GET',
            headers
        });
        const attendancesPromise = fetch(`${local_url}/attendances/user/${user.id}`, {
            method: 'GET',
            headers
        });
        const profilePromise = user.goals ? Promise.resolve(null) : fetch(`${local_url}/users/${user.id}`, {
            method: 'GET',
            headers
        });

        const [enrollmentsResponse, attendancesResponse, profileResponse] = await Promise.all([
            enrollmentsPromise,
            attendancesPromise,
            profilePromise
        ]);

        if (!enrollmentsResponse.ok) {
            throw new Error('Error al obtener las inscripciones');
        }

        const enrollments = await enrollmentsResponse.json();
        const attendances = attendancesResponse.ok ? await attendancesResponse.json() : [];

        if (profileResponse) {
            const profileData = await profileResponse.json();
            user.goals = profileData.goals || [];
            sessionStorage.setItem('user', JSON.stringify(user));
        }

        dashboardState = {
            enrollments,
            attendances,
            userGoals: user.goals || []
        };

        renderClasesProgramadas(enrollments);
        renderHistorialMetas();
    } catch (error) {
        console.error('Error de conexión:', error);
        const contenedor = document.getElementById('hist-rows');
        if (contenedor) contenedor.innerHTML = '<p class="text-center py-3">No se pudo cargar el historial.</p>';
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

function renderHistorialMetas() {
    const contenedor = document.getElementById('hist-rows');
    if (!contenedor) return;

    const goalsByDiscipline = dashboardState.userGoals.reduce((acc, item) => {
        if (!item || !item.discipline_id) return acc;
        const id = item.discipline_id.toString();
        acc[id] = item.goal;
        return acc;
    }, {});

    const resumen = {};

    dashboardState.enrollments.forEach(e => {
        if (e.status !== 'activa' || !e.session_id?.discipline_id) return;
        const discipline = e.session_id.discipline_id;
        const id = discipline._id?.toString() || discipline.toString();

        if (!resumen[id]) {
            resumen[id] = {
                discipline_id: id,
                name: discipline.name || 'Clase',
                attendances: 0,
                goal: goalsByDiscipline[id] ?? 4
            };
        }
    });

    dashboardState.attendances.forEach(a => {
        if (!a.attended || !a.session_id?.discipline_id) return;
        const discipline = a.session_id.discipline_id;
        const id = discipline._id?.toString() || discipline.toString();

        if (!resumen[id]) {
            resumen[id] = {
                discipline_id: id,
                name: discipline.name || 'Clase',
                attendances: 0,
                goal: goalsByDiscipline[id] ?? 4
            };
        }

        resumen[id].attendances += 1;
    });

    const filas = Object.values(resumen);
    if (filas.length === 0) {
        contenedor.innerHTML = '<p class="text-center py-3">Sin historial.</p>';
        return;
    }

    contenedor.innerHTML = filas.map(info => {
        const bajoMeta = info.attendances < info.goal;
        return `
            <div class="hist-row" data-discipline-id="${info.discipline_id}">
                <span class="hist-class">${info.name}</span>
                <span class="hist-count">${info.attendances}</span>
                <div class="hist-goal-cell">
                    <span class="goal-num ${bajoMeta ? 'warn' : 'ok'}">${info.goal}</span>
                    <button class="edit-btn" aria-label="Editar meta" title="Editar meta">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                    </button>
                </div>
            </div>`;
    }).join('');

    contenedor.onclick = handleHistorialClick;
}

function handleHistorialClick(event) {
    const saveBtn = event.target.closest('.save-goal-btn');
    const cancelBtn = event.target.closest('.cancel-goal-btn');
    const editBtn = event.target.closest('.edit-btn');
    const row = event.target.closest('.hist-row');

    if (!row) return;

    if (editBtn) {
        openGoalEditor(row);
        return;
    }

    if (saveBtn) {
        const input = row.querySelector('.goal-input');
        if (!input) return;
        const newGoal = parseInt(input.value, 10);
        if (Number.isNaN(newGoal) || newGoal < 1) {
            alert('Ingresa una meta válida mayor a 0');
            return;
        }
        saveGoal(row.dataset.disciplineId, newGoal);
        return;
    }

    if (cancelBtn) {
        renderHistorialMetas();
    }
}

function openGoalEditor(row) {
    const disciplineId = row.dataset.disciplineId;
    const currentGoal = dashboardState.userGoals.find(item => item.discipline_id.toString() === disciplineId)?.goal || 4;
    const goalCell = row.querySelector('.hist-goal-cell');
    if (!goalCell) return;

    goalCell.innerHTML = `
        <input class="goal-input" type="number" min="1" value="${currentGoal}" />
        <button class="save-goal-btn" type="button">Guardar</button>
        <button class="cancel-goal-btn" type="button">Cancelar</button>
    `;
}

async function saveGoal(disciplineId, newGoal) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');
    if (!user || !token) return;

    const updatedGoals = [...dashboardState.userGoals];
    const existing = updatedGoals.find(g => g.discipline_id.toString() === disciplineId);
    if (existing) {
        existing.goal = newGoal;
    } else {
        updatedGoals.push({ discipline_id: disciplineId, goal: newGoal });
    }

    try {
        const response = await fetch(`${local_url}/users/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ goals: updatedGoals })
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert(`No se pudo guardar la meta: ${errorText}`);
            return;
        }

        const data = await response.json();
        dashboardState.userGoals = data.user.goals || updatedGoals;
        user.goals = dashboardState.userGoals;
        sessionStorage.setItem('user', JSON.stringify(user));
        renderHistorialMetas();
    } catch (error) {
        console.error('Error guardando la meta:', error);
        alert('Error guardando la meta. Intenta de nuevo.');
    }
}
