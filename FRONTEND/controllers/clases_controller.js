document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${local_url}/disciplines`);
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
            <img src="${d.image || 'https://via.placeholder.com/300x400'}" alt="${d.name}" />
            <div class="card-overlay"></div>
            <span class="card-name">${d.name.toUpperCase()}</span>
        </div>
    `).join('');
}

function verDetalle(id) {
    // Pasamos el ID por la URL
    window.location.href = `clase.html?id=${id}`;
}