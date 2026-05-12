document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Recuperamos el token del sessionStorage
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${local_url}/disciplines`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}` 
            }
        });

        // Manejo de errores de autorización
        if (response.status === 401 || response.status === 403) {
            alert("Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.");
            window.location.href = local_url + '/login';
            return;
        }

        const disciplinas = await response.json();
        renderGrid(disciplinas);
    } catch (error) {
        console.error("Error al obtener disciplinas:", error);
    }
});

function renderGrid(disciplinas) {
    const grid = document.getElementById('grid');
    if (!grid) return;

    grid.innerHTML = disciplinas.map(d => `
        <div class="card" onclick="verDetalle('${d._id}')">
            <img src="${d.img}" alt="${d.name}" /> 
            <div class="card-overlay"></div>
            <span class="card-name">${d.name.toUpperCase()}</span>
        </div>
    `).join('');
}

function verDetalle(id) {
    // Pasamos el ID por la URL
    window.location.href = `clase.html?id=${id}`;
}