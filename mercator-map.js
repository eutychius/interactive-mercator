class InteractiveMercatorMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Map parameters
        this.centerLon = 0;
        this.centerLat = 0;
        this.zoom = 1;
        this.showGrid = true;
        this.showLabels = false;
        this.showDistortion = false;
        
        // Interaction state
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // World data (simplified country outlines)
        this.countries = this.generateWorldData();
        this.tissotCircles = this.generateTissotCircles();
        
        this.setupEventListeners();
        this.draw();
    }
    
    setupEventListeners() {
        // Mouse events for dragging
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMouseX;
                const deltaY = e.clientY - this.lastMouseY;
                
                // Convert pixel movement to longitude/latitude changes
                const lonChange = deltaX * 360 / (this.canvas.width * this.zoom);
                const latChange = deltaY * 180 / (this.canvas.height * this.zoom);
                
                this.centerLon -= lonChange;
                this.centerLat += latChange; // Y axis is inverted
                
                // Clamp latitude to valid range
                this.centerLat = Math.max(-85, Math.min(85, this.centerLat));
                
                // Wrap longitude
                this.centerLon = ((this.centerLon + 180) % 360) - 180;
                
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
                
                this.draw();
                this.updateCoordinateDisplay();
            } else {
                // Update coordinate display on hover
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const coords = this.pixelToLatLon(x, y);
                
                document.getElementById('coordinates').innerHTML = 
                    `Lat: ${coords.lat.toFixed(2)}°, Lon: ${coords.lon.toFixed(2)}°<br>Zoom: ${this.zoom.toFixed(1)}x`;
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });
        
        // Mouse wheel for zooming
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const beforeCoords = this.pixelToLatLon(mouseX, mouseY);
            
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom *= zoomFactor;
            this.zoom = Math.max(0.1, Math.min(10, this.zoom));
            
            const afterCoords = this.pixelToLatLon(mouseX, mouseY);
            
            // Adjust center to maintain mouse position
            this.centerLon += beforeCoords.lon - afterCoords.lon;
            this.centerLat += beforeCoords.lat - afterCoords.lat;
            
            this.draw();
            this.updateCoordinateDisplay();
        });
    }
    
    // Convert latitude/longitude to Mercator projection coordinates
    latLonToMercator(lat, lon) {
        const x = lon * Math.PI / 180;
        const y = Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
        return { x, y };
    }
    
    // Convert Mercator coordinates to pixel coordinates
    mercatorToPixel(mercX, mercY) {
        const centerMerc = this.latLonToMercator(this.centerLat, this.centerLon);
        
        const x = this.canvas.width / 2 + (mercX - centerMerc.x) * this.canvas.width * this.zoom / (2 * Math.PI);
        const y = this.canvas.height / 2 - (mercY - centerMerc.y) * this.canvas.width * this.zoom / (2 * Math.PI);
        
        return { x, y };
    }
    
    // Convert latitude/longitude directly to pixel coordinates
    latLonToPixel(lat, lon) {
        const merc = this.latLonToMercator(lat, lon);
        return this.mercatorToPixel(merc.x, merc.y);
    }
    
    // Convert pixel coordinates back to lat/lon
    pixelToLatLon(pixelX, pixelY) {
        const centerMerc = this.latLonToMercator(this.centerLat, this.centerLon);
        
        const mercX = centerMerc.x + (pixelX - this.canvas.width / 2) * 2 * Math.PI / (this.canvas.width * this.zoom);
        const mercY = centerMerc.y - (pixelY - this.canvas.height / 2) * 2 * Math.PI / (this.canvas.width * this.zoom);
        
        const lon = mercX * 180 / Math.PI;
        const lat = (2 * Math.atan(Math.exp(mercY)) - Math.PI / 2) * 180 / Math.PI;
        
        return { lat, lon };
    }
    
    generateWorldData() {
        // Simplified world country data
        return [
            // North America
            {
                name: "United States",
                color: "#8FBC8F",
                coordinates: [
                    [-125, 48], [-125, 32], [-117, 32], [-117, 48], [-125, 48], // West Coast
                    [-95, 49], [-95, 25], [-80, 25], [-80, 45], [-95, 49], // Central/East
                    [-160, 22], [-155, 22], [-155, 19], [-160, 19], [-160, 22] // Hawaii
                ]
            },
            {
                name: "Canada",
                color: "#DDA0DD",
                coordinates: [
                    [-140, 70], [-140, 49], [-95, 49], [-95, 60], [-75, 60], [-75, 45], [-60, 45], [-60, 70], [-140, 70]
                ]
            },
            {
                name: "Mexico",
                color: "#F0E68C",
                coordinates: [
                    [-117, 32], [-117, 14], [-87, 14], [-87, 25], [-95, 25], [-95, 32], [-117, 32]
                ]
            },
            
            // South America
            {
                name: "Brazil",
                color: "#98FB98",
                coordinates: [
                    [-73, 5], [-73, -33], [-35, -33], [-35, 5], [-73, 5]
                ]
            },
            {
                name: "Argentina",
                color: "#87CEFA",
                coordinates: [
                    [-73, -22], [-73, -55], [-54, -55], [-54, -22], [-73, -22]
                ]
            },
            
            // Europe
            {
                name: "Russia",
                color: "#FFB6C1",
                coordinates: [
                    [20, 70], [20, 45], [180, 45], [180, 70], [20, 70]
                ]
            },
            {
                name: "Scandinavia",
                color: "#DEB887",
                coordinates: [
                    [5, 71], [5, 55], [30, 55], [30, 71], [5, 71]
                ]
            },
            {
                name: "Western Europe",
                color: "#F5DEB3",
                coordinates: [
                    [-10, 60], [-10, 35], [20, 35], [20, 60], [-10, 60]
                ]
            },
            
            // Africa
            {
                name: "Africa",
                color: "#CD853F",
                coordinates: [
                    [-20, 37], [-20, -35], [50, -35], [50, 37], [-20, 37]
                ]
            },
            
            // Asia
            {
                name: "China",
                color: "#FFA07A",
                coordinates: [
                    [73, 53], [73, 18], [135, 18], [135, 53], [73, 53]
                ]
            },
            {
                name: "India",
                color: "#20B2AA",
                coordinates: [
                    [68, 37], [68, 8], [97, 8], [97, 37], [68, 37]
                ]
            },
            
            // Oceania
            {
                name: "Australia",
                color: "#FFE4B5",
                coordinates: [
                    [113, -10], [113, -44], [154, -44], [154, -10], [113, -10]
                ]
            },
            
            // Polar regions
            {
                name: "Greenland",
                color: "#F0F8FF",
                coordinates: [
                    [-73, 83], [-73, 60], [-12, 60], [-12, 83], [-73, 83]
                ]
            },
            {
                name: "Antarctica",
                color: "#F8F8FF",
                coordinates: [
                    [-180, -60], [-180, -90], [180, -90], [180, -60], [-180, -60]
                ]
            }
        ];
    }
    
    generateTissotCircles() {
        // Generate Tissot's indicatrix circles to show distortion
        const circles = [];
        for (let lat = -60; lat <= 60; lat += 30) {
            for (let lon = -180; lon <= 180; lon += 60) {
                circles.push({ lat, lon, radius: 5 }); // 5 degree radius
            }
        }
        return circles;
    }
    
    drawGrid() {
        if (!this.showGrid) return;
        
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.3;
        
        // Draw longitude lines (meridians)
        for (let lon = -180; lon <= 180; lon += 15) {
            this.ctx.beginPath();
            for (let lat = -85; lat <= 85; lat += 1) {
                const pixel = this.latLonToPixel(lat, lon);
                if (lat === -85) {
                    this.ctx.moveTo(pixel.x, pixel.y);
                } else {
                    this.ctx.lineTo(pixel.x, pixel.y);
                }
            }
            this.ctx.stroke();
        }
        
        // Draw latitude lines (parallels)
        for (let lat = -75; lat <= 75; lat += 15) {
            this.ctx.beginPath();
            for (let lon = -180; lon <= 180; lon += 1) {
                const pixel = this.latLonToPixel(lat, lon);
                if (lon === -180) {
                    this.ctx.moveTo(pixel.x, pixel.y);
                } else {
                    this.ctx.lineTo(pixel.x, pixel.y);
                }
            }
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    drawCountries() {
        this.countries.forEach(country => {
            this.ctx.fillStyle = country.color;
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 1;
            
            this.ctx.beginPath();
            
            for (let i = 0; i < country.coordinates.length; i++) {
                const coord = country.coordinates[i];
                const pixel = this.latLonToPixel(coord[1], coord[0]); // lat, lon
                
                if (i === 0) {
                    this.ctx.moveTo(pixel.x, pixel.y);
                } else {
                    this.ctx.lineTo(pixel.x, pixel.y);
                }
            }
            
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
            
            // Draw country labels
            if (this.showLabels && this.zoom > 0.5) {
                const centerCoord = country.coordinates[0];
                const centerPixel = this.latLonToPixel(centerCoord[1], centerCoord[0]);
                
                this.ctx.fillStyle = '#000';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(country.name, centerPixel.x, centerPixel.y);
            }
        });
    }
    
    drawTissotCircles() {
        if (!this.showDistortion) return;
        
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.7;
        
        this.tissotCircles.forEach(circle => {
            const centerPixel = this.latLonToPixel(circle.lat, circle.lon);
            
            // Calculate how the circle appears in Mercator projection
            const topPixel = this.latLonToPixel(circle.lat + circle.radius, circle.lon);
            const bottomPixel = this.latLonToPixel(circle.lat - circle.radius, circle.lon);
            const leftPixel = this.latLonToPixel(circle.lat, circle.lon - circle.radius);
            const rightPixel = this.latLonToPixel(circle.lat, circle.lon + circle.radius);
            
            const radiusY = Math.abs(topPixel.y - bottomPixel.y) / 2;
            const radiusX = Math.abs(rightPixel.x - leftPixel.x) / 2;
            
            // Draw ellipse to show distortion
            this.ctx.beginPath();
            this.ctx.ellipse(centerPixel.x, centerPixel.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
            this.ctx.stroke();
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid first (underneath everything)
        this.drawGrid();
        
        // Draw countries
        this.drawCountries();
        
        // Draw Tissot circles to show distortion
        this.drawTissotCircles();
        
        // Draw equator line
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.8;
        this.ctx.beginPath();
        for (let lon = -180; lon <= 180; lon += 1) {
            const pixel = this.latLonToPixel(0, lon);
            if (lon === -180) {
                this.ctx.moveTo(pixel.x, pixel.y);
            } else {
                this.ctx.lineTo(pixel.x, pixel.y);
            }
        }
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    resetView() {
        this.centerLon = 0;
        this.centerLat = 0;
        this.zoom = 1;
        this.draw();
        this.updateCoordinateDisplay();
    }
    
    toggleGrid() {
        this.showGrid = !this.showGrid;
        this.draw();
    }
    
    toggleCountryLabels() {
        this.showLabels = !this.showLabels;
        this.draw();
    }
    
    showDistortionComparison() {
        this.showDistortion = !this.showDistortion;
        this.draw();
    }
    
    updateCoordinateDisplay() {
        document.getElementById('coordinates').innerHTML = 
            `Lat: ${this.centerLat.toFixed(2)}°, Lon: ${this.centerLon.toFixed(2)}°<br>Zoom: ${this.zoom.toFixed(1)}x`;
    }
}
