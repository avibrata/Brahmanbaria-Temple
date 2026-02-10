// Data and Core Logic
const UP_LIST = [
    'sadar', 'bijayanagar', 'nasirnagar', 'ashuganj', 'akhaura',
    'sarail', 'kasba', 'nabinagar', 'bancharampur'
];

let TempleDatabase = [];
let map;
let markers = [];
let upazilaChart;

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Initialize Map
function initMap() {
    const mapElement = document.getElementById('map-explorer');
    if (!mapElement) return;

    map = L.map('map-explorer', {
        scrollWheelZoom: false
    }).setView([23.965, 91.116], 10);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
}

// Fetch and Merge Data
async function fetchTempleData() {
    console.log("Starting to fetch temple data...");
    try {
        const fetches = UP_LIST.map(up =>
            fetch(`./${up}.json`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    const temples = Array.isArray(data) ? data : [];
                    return temples.map(item => ({ ...item, upazila: up }));
                })
                .catch(err => {
                    console.error(`Could not load ${up}.json:`, err);
                    return [];
                })
        );

        const results = await Promise.all(fetches);
        TempleDatabase = results.flat();
        console.log(`Successfully merged ${TempleDatabase.length} temples.`);

        // Update stats
        const statTemples = document.getElementById('stat-temples');
        const countDisplay = document.getElementById('count-display');
        if (statTemples) statTemples.innerText = TempleDatabase.length;
        if (countDisplay) countDisplay.innerText = TempleDatabase.length;

        renderResults(TempleDatabase);
        updateMapMarkers(TempleDatabase);
        initChart(results);

    } catch (err) {
        console.error("Critical error in fetchTempleData:", err);
        const resultsContainer = document.getElementById('temple-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `<p class="text-red-500 text-center py-10 font-bold">Failed to load temple data. Please ensure you are running this page through a local web server (like Live Server).</p>`;
        }
    }
}

// Initialize Statistics Chart
function initChart(dataByUpazila) {
    const canvas = document.getElementById('upazilaStatsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const counts = dataByUpazila.map(arr => arr.length);
    const labels = UP_LIST.map(up => up.charAt(0).toUpperCase() + up.slice(1));

    if (upazilaChart) upazilaChart.destroy();

    try {
        upazilaChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Temples',
                    data: counts,
                    backgroundColor: '#FF9933',
                    borderColor: '#e68a2e',
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                return ` ${context.raw} Temples`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { display: false },
                        ticks: { stepSize: 10 }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
        console.log("Chart initialized successfully.");
    } catch (err) {
        console.error("Error creating chart:", err);
    }
}

// Render Results List
function renderResults(data) {
    const container = document.getElementById('temple-results');
    if (!container) return;

    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p class="text-gray-400 italic text-center w-full py-10">No temples found matching your search.</p>';
        const countDisplay = document.getElementById('count-display');
        if (countDisplay) countDisplay.innerText = 0;
        return;
    }

    const countDisplay = document.getElementById('count-display');
    if (countDisplay) countDisplay.innerText = data.length;

    data.forEach(site => {
        const div = document.createElement('div');
        div.className = 'p-4 rounded-xl border border-gray-100 hover:border-[#FF9933] hover:shadow-md transition-all cursor-pointer group bg-white';
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h5 class="font-bold text-gray-800 group-hover:text-[#FF9933] transition-colors">${site.name || 'Unnamed Temple'}</h5>
                    <p class="text-sm text-gray-500 mt-1">${site.address || 'Address Unknown'}</p>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-[#FF9933]">${site.upazila}</span>
            </div>
            <a href="${site.googleMapsLink || '#'}" target="_blank" class="text-xs text-[#FF9933] font-bold mt-3 inline-block opacity-0 group-hover:opacity-100 transition-opacity">GET DIRECTIONS →</a>
        `;
        div.onclick = (e) => {
            if (e.target.tagName !== 'A') {
                focusOnSite(site);
            }
        };
        container.appendChild(div);
    });
}

function focusOnSite(site) {
    if (!map || !markers.length) return;

    const marker = markers.find(m => m.siteName === site.name);
    if (marker) {
        map.setView(marker.getLatLng(), 15);
        marker.openPopup();

        // Scroll map into view on mobile
        if (window.innerWidth < 1024) {
            const mapEl = document.getElementById('map-explorer');
            if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Update Map Markers
function updateMapMarkers(data) {
    if (!map) return;

    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const UP_COORDS = {
        sadar: [23.957, 91.111],
        bijayanagar: [24.015, 91.240],
        nasirnagar: [24.208, 91.210],
        sarail: [24.120, 91.120],
        ashuganj: [24.020, 91.010],
        akhaura: [23.880, 91.210],
        kasba: [23.730, 91.160],
        nabinagar: [23.890, 90.970],
        bancharampur: [23.780, 90.810]
    };

    data.forEach(site => {
        const base = UP_COORDS[site.upazila] || [23.965, 91.116];
        const lat = base[0] + (Math.random() - 0.5) * 0.05;
        const lng = base[1] + (Math.random() - 0.5) * 0.05;

        const marker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: "#FF9933",
            color: "#FFF",
            weight: 2,
            fillOpacity: 0.8
        }).addTo(map);

        const popupContent = `
            <div class="glass-popup p-2" style="min-width: 200px">
                <h4 class="font-bold text-lg mb-1">${site.name || 'Unnamed Temple'}</h4>
                <p class="text-sm mb-3 text-gray-600">${site.address || 'Address Unknown'}</p>
                <a href="${site.googleMapsLink || '#'}" target="_blank" class="bg-[#FF9933] text-white px-4 py-2 rounded-lg text-xs font-bold block text-center hover:bg-[#e68a2e] transition-colors">Get Directions</a>
            </div>
        `;

        marker.bindPopup(popupContent, { className: 'glass-popup' });
        marker.siteName = site.name;
        markers.push(marker);
    });

    if (data.length > 0 && data.length < TempleDatabase.length) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
    } else if (data.length === TempleDatabase.length) {
        map.setView([23.965, 91.116], 10);
    }
}

// Search Logic
function performSearch() {
    const searchEl = document.getElementById('temple-search');
    if (!searchEl) return;

    const term = searchEl.value.toLowerCase();
    const activeUpItem = document.querySelector('.upazila-item.active');
    const activeUp = activeUpItem ? activeUpItem.dataset.upazila : 'all';

    let filtered = TempleDatabase.filter(site => {
        const name = (site.name || '').toLowerCase();
        const addr = (site.address || '').toLowerCase();
        return (name.includes(term) || addr.includes(term)) &&
            (activeUp === 'all' || site.upazila === activeUp);
    });

    renderResults(filtered);
    updateMapMarkers(filtered);
}

// Initialize Everything
window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded.");
    initMap();
    fetchTempleData();

    // Event Listeners
    const searchInput = document.getElementById('temple-search');
    const searchBtn = document.getElementById('search-btn');
    const searchIcon = document.getElementById('search-icon');

    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (searchIcon) searchIcon.addEventListener('click', performSearch);

    // Upazila Selection
    const upazilaList = document.getElementById('upazila-list');
    if (upazilaList) {
        upazilaList.addEventListener('click', (e) => {
            const item = e.target.closest('.upazila-item');
            if (item) {
                console.log(`Upazila selected: ${item.dataset.upazila}`);
                document.querySelectorAll('.upazila-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                performSearch();
            }
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
