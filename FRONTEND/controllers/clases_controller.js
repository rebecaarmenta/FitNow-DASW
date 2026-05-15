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

    if (!disciplinas || disciplinas.length === 0) {
        grid.innerHTML = '<div class="no-results">No hay disciplinas disponibles.</div>';
        return;
    }

    const spinningImg = 'https://as01.epimg.net/deporteyvida/imagenes/2019/09/03/portada/1567536855_286772_1567537023_noticia_normal_recorte1.jpg';
    grid.innerHTML = disciplinas.map(d => {
        const name = (d.name || '').toString();
        const imageSrc = name.toLowerCase().includes('spinning')
            ? spinningImg
            : (d.img || 'https://via.placeholder.com/320x420?text=Clase');
        const fallback = name.toLowerCase().includes('spinning')
            ? spinningImg
            : 'https://via.placeholder.com/320x420?text=Clase';
        return `
            <div class="card" onclick="verDetalle('${d._id}')">
                <img src="${imageSrc}" alt="${d.name}" onerror="this.onerror=null;this.src='${fallback}'" />
                <div class="card-overlay"></div>
                <span class="card-name">${d.name.toUpperCase()}</span>
            </div>
        `;
    }).join('');
}

function verDetalle(id) {
    // Pasamos el ID por la URL
    window.location.href = `clase.html?id=${id}`;
}