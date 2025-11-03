// map.js - Interactive Map Functionality for Hope Hands Foundation

class HopeHandsMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.userLocation = null;
        this.locations = [
            {
                id: 1,
                name: "Main Community Center",
                type: "center",
                address: "123 Hope Street, Johannesburg Central",
                coordinates: [-26.2041, 28.0473],
                hours: "Mon-Fri: 8AM-5PM, Sat: 8AM-3PM",
                services: ["Food Distribution", "Shelter", "Job Training", "Counseling"],
                phone: "076 485 7695",
                capacity: 150
            },
            {
                id: 2,
                name: "Soweto Outreach Center",
                type: "center",
                address: "456 Vilakazi Street, Soweto",
                coordinates: [-26.2676, 27.8996],
                hours: "Mon-Fri: 9AM-4PM, Sat: 9AM-2PM",
                services: ["Food Distribution", "Medical Care", "Youth Programs"],
                phone: "076 485 7696",
                capacity: 100
            },
            {
                id: 3,
                name: "Alexandra Shelter",
                type: "shelter",
                address: "789 London Road, Alexandra",
                coordinates: [-26.1006, 28.0918],
                hours: "24/7 Shelter Services",
                services: ["Emergency Shelter", "Meals", "Showers", "Clothing"],
                phone: "076 485 7697",
                capacity: 80
            },
            {
                id: 4,
                name: "CBD Food Outreach",
                type: "outreach",
                address: "Central Johannesburg CBD",
                coordinates: [-26.2041, 28.0416],
                hours: "Daily: 6PM-8PM",
                services: ["Hot Meals", "Blankets", "Hygiene Kits"],
                phone: "076 485 7698",
                capacity: 200
            },
            {
                id: 5,
                name: "West Rand Center",
                type: "center",
                address: "321 Randfontein Road, West Rand",
                coordinates: [-26.1844, 27.7020],
                hours: "Mon-Fri: 8AM-4PM",
                services: ["Food Distribution", "Skills Training", "Child Care"],
                phone: "076 485 7699",
                capacity: 120
            }
        ];
        
        this.init();
    }

    init() {
        this.initializeMap();
        this.loadLocations();
        this.setupEventListeners();
    }

    initializeMap() {
        this.map = L.map('interactiveMap' || 'fullMap').setView([-26.2041, 28.0473], 11);

        const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        });

        const satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '© Google Maps'
        });

        const hybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '© Google Maps'
        });

        streets.addTo(this.map);

        const baseMaps = {
            "Streets": streets,
            "Satellite": satellite,
            "Hybrid": hybrid
        };

        if (document.getElementById('fullMap')) {
            L.control.layers(baseMaps).addTo(this.map);
        }

        L.control.scale().addTo(this.map);
    }

    loadLocations() {
        this.clearMarkers();
        
        this.locations.forEach(location => {
            const marker = this.createMarker(location);
            this.markers.push(marker);
            marker.addTo(this.map);
        });

        if (this.markers.length > 0) {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }

        this.updateLocationsList();
    }

    createMarker(location) {
        const iconColors = {
            center: 'blue',
            shelter: 'red',
            outreach: 'green'
        };

        const icon = L.divIcon({
            className: `custom-marker ${location.type}`,
            html: `
                <div class="marker-pin ${iconColors[location.type]}" style="background-color: ${this.getColorForType(location.type)}">
                    <span class="marker-text">${location.name.charAt(0)}</span>
                </div>
            `,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        const marker = L.marker(location.coordinates, { icon: icon });
        
        marker.bindPopup(this.createPopupContent(location));
        
        marker.on('click', () => {
            this.showLocationDetails(location);
        });

        return marker;
    }

    getColorForType(type) {
        const colors = {
            center: '#3498db',
            shelter: '#e74c3c',
            outreach: '#2ecc71'
        };
        return colors[type] || '#95a5a6';
    }

    createPopupContent(location) {
        return `
            <div class="map-popup">
                <h3>${location.name}</h3>
                <p><strong>Address:</strong> ${location.address}</p>
                <p><strong>Hours:</strong> ${location.hours}</p>
                <p><strong>Services:</strong> ${location.services.slice(0, 2).join(', ')}</p>
                <p><strong>Phone:</strong> ${location.phone}</p>
                <button onclick="hopeHandsMap.showLocationDetails(${location.id})" class="btn-primary btn-small">
                    View Details
                </button>
            </div>
        `;
    }

    showLocationDetails(locationId) {
        const location = typeof locationId === 'number' 
            ? this.locations.find(loc => loc.id === locationId)
            : locationId;

        if (!location) return;

        const detailsHtml = `
            <div class="location-details">
                <h3>${location.name}</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Type:</strong>
                        <span class="type-badge ${location.type}">${this.formatType(location.type)}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Address:</strong>
                        <span>${location.address}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Operating Hours:</strong>
                        <span>${location.hours}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Contact:</strong>
                        <span>${location.phone}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Capacity:</strong>
                        <span>${location.capacity} people</span>
                    </div>
                </div>
                <div class="services-list">
                    <h4>Services Offered:</h4>
                    <div class="services-grid">
                        ${location.services.map(service => `
                            <span class="service-tag">${service}</span>
                        `).join('')}
                    </div>
                </div>
                <div class="location-actions">
                    <button onclick="hopeHandsMap.getDirections(${location.id})" class="btn-primary">
                         Get Directions
                    </button>
                    <button onclick="hopeHandsMap.shareLocation(${location.id})" class="btn-secondary">
                         Share Location
                    </button>
                </div>
            </div>
        `;

        const infoElement = document.getElementById('locationInfo');
        if (infoElement) {
            infoElement.innerHTML = detailsHtml;
            infoElement.scrollIntoView({ behavior: 'smooth' });
        }

        this.highlightLocation(location.id);
    }

    formatType(type) {
        const typeMap = {
            center: 'Community Center',
            shelter: 'Emergency Shelter',
            outreach: 'Outreach Point'
        };
        return typeMap[type] || type;
    }

    highlightLocation(locationId) {
        this.markers.forEach(marker => {
            const markerElement = marker.getElement();
            if (markerElement) {
                if (marker.location && marker.location.id === locationId) {
                    markerElement.classList.add('highlighted');
                } else {
                    markerElement.classList.remove('highlighted');
                }
            }
        });
    }

    setupEventListeners() {
        const mapTypeSelect = document.getElementById('mapType');
        if (mapTypeSelect) {
            mapTypeSelect.addEventListener('change', (e) => {
                this.changeMapType(e.target.value);
            });
        }

        const locationTypeSelect = document.getElementById('locationType');
        if (locationTypeSelect) {
            locationTypeSelect.addEventListener('change', (e) => {
                this.filterLocationsByType(e.target.value);
            });
        }

        const locateMeBtn = document.getElementById('locateMe');
        if (locateMeBtn) {
            locateMeBtn.addEventListener('click', () => {
                this.findUserLocation();
            });
        }

        const searchAddressBtn = document.getElementById('searchAddress');
        if (searchAddressBtn) {
            searchAddressBtn.addEventListener('click', () => {
                this.searchAddress();
            });
        }

        const showAllBtn = document.getElementById('showAllLocations');
        if (showAllBtn) {
            showAllBtn.addEventListener('click', () => {
                this.showAllLocations();
            });
        }

        const findNearestBtn = document.getElementById('findNearest');
        if (findNearestBtn) {
            findNearestBtn.addEventListener('click', () => {
                this.findNearestCenter();
            });
        }

        const searchLocationBtn = document.getElementById('searchLocation');
        if (searchLocationBtn) {
            searchLocationBtn.addEventListener('click', () => {
                this.searchLocations();
            });
        }
    }

    changeMapType(type) {
        console.log('Changing map type to:', type);
    }

    filterLocationsByType(type) {
        this.markers.forEach(marker => {
            if (type === 'all' || (marker.location && marker.location.type === type)) {
                marker.addTo(this.map);
            } else {
                this.map.removeLayer(marker);
            }
        });
    }

    findUserLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                const userIcon = L.divIcon({
                    className: 'custom-marker user-location',
                    html: `
                        <div class="marker-pin user" style="background-color: #f39c12">
                            <span class="marker-text"></span>
                        </div>
                    `,
                    iconSize: [30, 42],
                    iconAnchor: [15, 42]
                });

                const userMarker = L.marker([this.userLocation.lat, this.userLocation.lng], { icon: userIcon })
                    .addTo(this.map)
                    .bindPopup('Your current location');

                this.markers.push(userMarker);

                this.map.setView([this.userLocation.lat, this.userLocation.lng], 13);

                this.findNearestCenter();
            },
            (error) => {
                alert('Unable to retrieve your location: ' + error.message);
            }
        );
    }

    findNearestCenter() {
        if (!this.userLocation) {
            alert('Please enable location services first');
            return;
        }

        let nearestLocation = null;
        let shortestDistance = Infinity;

        this.locations.forEach(location => {
            const distance = this.calculateDistance(
                this.userLocation.lat, this.userLocation.lng,
                location.coordinates[0], location.coordinates[1]
            );

            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestLocation = location;
            }
        });

        if (nearestLocation) {
            this.showLocationDetails(nearestLocation);
            this.map.setView(nearestLocation.coordinates, 14);
            
            const infoElement = document.getElementById('locationInfo');
            if (infoElement) {
                const distanceInfo = document.createElement('div');
                distanceInfo.className = 'distance-info';
                distanceInfo.innerHTML = `<p> <strong>Distance from your location:</strong> ${shortestDistance.toFixed(1)} km</p>`;
                infoElement.appendChild(distanceInfo);
            }
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    searchAddress() {
        const addressInput = document.getElementById('addressSearch');
        if (!addressInput || !addressInput.value.trim()) return;

        const address = addressInput.value.trim();
        
        const randomOffset = () => (Math.random() - 0.5) * 0.1;
        const simulatedCoords = [
            -26.2041 + randomOffset(),
            28.0473 + randomOffset()
        ];

        const searchIcon = L.divIcon({
            className: 'custom-marker search-result',
            html: `
                <div class="marker-pin search" style="background-color: #9b59b6">
                    <span class="marker-text">🔍</span>
                </div>
            `,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        const searchMarker = L.marker(simulatedCoords, { icon: searchIcon })
            .addTo(this.map)
            .bindPopup(`Search: ${address}`)
            .openPopup();

        this.map.setView(simulatedCoords, 14);
    }

    searchLocations() {
        const searchInput = document.getElementById('locationSearch');
        if (!searchInput) return;

        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            this.loadLocations();
            return;
        }

        const filteredLocations = this.locations.filter(location =>
            location.name.toLowerCase().includes(query) ||
            location.address.toLowerCase().includes(query) ||
            location.services.some(service => service.toLowerCase().includes(query))
        );

        this.displayFilteredLocations(filteredLocations);
    }

    displayFilteredLocations(locations) {
        this.clearMarkers();
        
        locations.forEach(location => {
            const marker = this.createMarker(location);
            this.markers.push(marker);
            marker.addTo(this.map);
        });

        if (locations.length > 0) {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }

        this.updateLocationsList(locations);
    }

    showAllLocations() {
        this.loadLocations();
    }

    clearMarkers() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }

    updateLocationsList(filteredLocations = null) {
        const locationsContainer = document.getElementById('locationsContainer');
        if (!locationsContainer) return;

        const locationsToShow = filteredLocations || this.locations;

        locationsContainer.innerHTML = locationsToShow.map(location => `
            <div class="location-card" data-location-id="${location.id}">
                <div class="location-header">
                    <h3>${location.name}</h3>
                    <span class="type-badge ${location.type}">${this.formatType(location.type)}</span>
                </div>
                <div class="location-body">
                    <p class="location-address"> ${location.address}</p>
                    <p class="location-hours"> ${location.hours}</p>
                    <p class="location-phone"> ${location.phone}</p>
                    <div class="location-services">
                        ${location.services.slice(0, 3).map(service => 
                            `<span class="service-tag">${service}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="location-actions">
                    <button onclick="hopeHandsMap.showLocationDetails(${location.id})" class="btn-primary btn-small">
                        View on Map
                    </button>
                </div>
            </div>
        `).join('');
    }

    getDirections(locationId) {
        const location = this.locations.find(loc => loc.id === locationId);
        if (!location) return;

        const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates[0]},${location.coordinates[1]}`;
        window.open(url, '_blank');
    }

    shareLocation(locationId) {
        const location = this.locations.find(loc => loc.id === locationId);
        if (!location) return;

        const shareText = `Check out ${location.name} - ${location.address}. Services: ${location.services.join(', ')}`;
        
        if (navigator.share) {
            navigator.share({
                title: location.name,
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Location details copied to clipboard!');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('interactiveMap') || document.getElementById('fullMap')) {
        window.hopeHandsMap = new HopeHandsMap();
    }
});