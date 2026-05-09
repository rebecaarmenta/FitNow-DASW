document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
});

const clases = [
    { nombre: 'Pilates',  img: 'https://i.pinimg.com/1200x/5c/8a/2b/5c8a2bc97a4993d9013bef88eb008272.jpg' },
    { nombre: 'Spinning', img: 'https://i.pinimg.com/1200x/c3/2c/5c/c32c5cafba97a20d55ff5b825ab2edd7.jpg' },
    { nombre: 'Zumba',    img: 'https://i.pinimg.com/736x/d6/c3/ba/d6c3bab99ea80eebafdafedb9a1162f8.jpg' },
    { nombre: 'Barre',    img: 'https://i.pinimg.com/1200x/60/cc/86/60cc86d2e5e4574c92fdfe4096ea5af7.jpg' },
    { nombre: 'Yoga',     img: 'https://i.pinimg.com/736x/41/cc/f2/41ccf2d8419a83bb6346e0d318850351.jpg' },
    { nombre: 'Box',      img: 'https://i.pinimg.com/1200x/27/b6/f9/27b6f9dbfb8dc6f2e2ff06c034566ba5.jpg' },
    { nombre: 'Gap',      img: 'https://i.pinimg.com/1200x/f5/d4/5b/f5d45b623d1d9143bcccc2a9c7f98ef5.jpg' },
    { nombre: 'Jump Fit', img: 'https://i.pinimg.com/1200x/4a/5c/03/4a5c03c74aad6ebb56450ff632b7f2c4.jpg' }
];

function renderGrid() {
    const grid = document.getElementById('grid');
    if (!grid) return;

    grid.innerHTML = clases.map((c, i) => `
        <div class="card" id="card-${i}" onclick="verDetalle('${c.nombre}')">
            <img src="${c.img}" alt="${c.nombre}" loading="lazy" />
            <div class="card-overlay"></div>
            <span class="card-name">${c.nombre.toUpperCase()}</span>
        </div>
    `).join('') + `<div class="no-results hidden" id="no-results">No se encontraron clases</div>`;
}

// Redirige a UNA sola página pasando el nombre por URL
function verDetalle(nombre) {
    window.location.href = `clase.html?nombre=${encodeURIComponent(nombre)}`;
}

// Función de filtrado
window.filtrar = function() {
    const query = document.getElementById('search').value.toLowerCase().trim();
    let visibles = 0;
    clases.forEach((c, i) => {
        const card = document.getElementById(`card-${i}`);
        const coincide = c.nombre.toLowerCase().includes(query);
        if (card) {
            card.classList.toggle('hidden', !coincide);
            if (coincide) visibles++;
        }
    });
    document.getElementById('no-results').classList.toggle('hidden', visibles > 0);
};