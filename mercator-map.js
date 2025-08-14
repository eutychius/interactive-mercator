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
        // Mouse events for dragging to change projection center
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            const rect = this.canvas.getBoundingClientRect();
            this.lastMouseX = e.clientX - rect.left;
            this.lastMouseY = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            if (this.isDragging) {
                // Get the world coordinates under the mouse
                const worldCoords = this.pixelToLatLon(mouseX, mouseY);
                
                // Set this as the new projection center
                this.centerLon = worldCoords.lon;
                this.centerLat = worldCoords.lat;
                
                // Clamp latitude to valid Mercator range
                this.centerLat = Math.max(-85, Math.min(85, this.centerLat));
                
                // Wrap longitude
                this.centerLon = ((this.centerLon + 180) % 360) - 180;
                
                this.draw();
                this.updateCoordinateDisplay();
            } else {
                // Update coordinate display on hover
                const coords = this.pixelToLatLon(mouseX, mouseY);
                
                document.getElementById('coordinates').innerHTML = 
                    `Hover: Lat: ${coords.lat.toFixed(2)}°, Lon: ${coords.lon.toFixed(2)}°<br>Center: Lat: ${this.centerLat.toFixed(2)}°, Lon: ${this.centerLon.toFixed(2)}°<br>Zoom: ${this.zoom.toFixed(1)}x`;
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
            
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom *= zoomFactor;
            this.zoom = Math.max(0.1, Math.min(10, this.zoom));
            
            this.draw();
            this.updateCoordinateDisplay();
        });
    }
    
    // Convert latitude/longitude to Mercator projection coordinates with custom center
    latLonToMercator(lat, lon) {
        // Adjust longitude relative to projection center
        let adjustedLon = lon - this.centerLon;
        
        // Wrap longitude to [-180, 180] range
        while (adjustedLon > 180) adjustedLon -= 360;
        while (adjustedLon < -180) adjustedLon += 360;
        
        // Adjust latitude relative to projection center
        let adjustedLat = lat - this.centerLat;
        
        // Apply rotation transformation for the new center
        const centerLatRad = this.centerLat * Math.PI / 180;
        const centerLonRad = this.centerLon * Math.PI / 180;
        const latRad = lat * Math.PI / 180;
        const lonRad = lon * Math.PI / 180;
        
        // Spherical rotation to make centerLat, centerLon the new "equator center"
        const cosLat = Math.cos(latRad);
        const sinLat = Math.sin(latRad);
        const cosLon = Math.cos(lonRad - centerLonRad);
        const sinLon = Math.sin(lonRad - centerLonRad);
        const cosCenterLat = Math.cos(centerLatRad);
        const sinCenterLat = Math.sin(centerLatRad);
        
        // New latitude after rotation
        const newLatSin = sinLat * cosCenterLat - cosLat * sinCenterLat * cosLon;
        const newLat = Math.asin(Math.max(-1, Math.min(1, newLatSin)));
        
        // New longitude after rotation
        const newLonY = cosLat * sinLon;
        const newLonX = sinLat * sinCenterLat + cosLat * cosCenterLat * cosLon;
        const newLon = Math.atan2(newLonY, newLonX);
        
        // Apply Mercator projection to the rotated coordinates
        const x = newLon;
        const y = Math.log(Math.tan(Math.PI / 4 + newLat / 2));
        
        return { x, y };
    }
    
    // Convert Mercator coordinates to pixel coordinates
    mercatorToPixel(mercX, mercY) {
        // Center the projection on screen
        const x = this.canvas.width / 2 + mercX * this.canvas.width * this.zoom / (2 * Math.PI);
        const y = this.canvas.height / 2 - mercY * this.canvas.width * this.zoom / (2 * Math.PI);
        
        return { x, y };
    }
    
    // Convert latitude/longitude directly to pixel coordinates
    latLonToPixel(lat, lon) {
        const merc = this.latLonToMercator(lat, lon);
        return this.mercatorToPixel(merc.x, merc.y);
    }
    
    // Convert pixel coordinates back to lat/lon
    pixelToLatLon(pixelX, pixelY) {
        // Convert pixel to Mercator coordinates
        const mercX = (pixelX - this.canvas.width / 2) * 2 * Math.PI / (this.canvas.width * this.zoom);
        const mercY = -(pixelY - this.canvas.height / 2) * 2 * Math.PI / (this.canvas.width * this.zoom);
        
        // Convert Mercator back to lat/lon (rotated coordinates)
        const rotatedLon = mercX;
        const rotatedLat = 2 * Math.atan(Math.exp(mercY)) - Math.PI / 2;
        
        // Reverse the spherical rotation
        const centerLatRad = this.centerLat * Math.PI / 180;
        const centerLonRad = this.centerLon * Math.PI / 180;
        const cosCenterLat = Math.cos(centerLatRad);
        const sinCenterLat = Math.sin(centerLatRad);
        const cosRotLat = Math.cos(rotatedLat);
        const sinRotLat = Math.sin(rotatedLat);
        const cosRotLon = Math.cos(rotatedLon);
        const sinRotLon = Math.sin(rotatedLon);
        
        // Reverse rotation
        const originalLatSin = sinRotLat * cosCenterLat + cosRotLat * sinCenterLat * cosRotLon;
        const originalLat = Math.asin(Math.max(-1, Math.min(1, originalLatSin)));
        
        const originalLonY = cosRotLat * sinRotLon;
        const originalLonX = sinRotLat * sinCenterLat - cosRotLat * cosCenterLat * cosRotLon;
        const originalLon = Math.atan2(originalLonY, originalLonX) + centerLonRad;
        
        // Convert back to degrees and normalize
        let lat = originalLat * 180 / Math.PI;
        let lon = originalLon * 180 / Math.PI;
        
        // Normalize longitude to [-180, 180]
        while (lon > 180) lon -= 360;
        while (lon < -180) lon += 360;
        
        return { lat, lon };
    }
    
    generateWorldData() {
        // Realistic world country data with proper shapes
        return [
            // North America
            {
                name: "United States",
                color: "#8FBC8F",
                coordinates: [
                    [-158.2, 21.8], [-157.8, 21.3], [-155.5, 19.0], [-154.8, 18.9], [-154.8, 19.9], [-156.3, 20.2], [-157.3, 21.6], [-158.2, 21.8], // Hawaii
                    null, // Separate polygon
                    [-171.8, 66.1], [-162.8, 68.9], [-164.9, 68.6], [-167.5, 65.7], [-171.8, 66.1], // Alaska west
                    null,
                    [-141.0, 69.6], [-141.0, 60.3], [-130.0, 54.4], [-124.8, 49.0], [-124.2, 48.4], [-123.0, 48.4], [-95.2, 49.0], [-95.2, 49.4], [-88.4, 48.0], [-84.8, 46.9], [-82.3, 42.0], [-75.3, 45.0], [-67.8, 47.1], [-67.8, 44.8], [-69.2, 43.8], [-70.6, 41.8], [-74.0, 40.7], [-75.5, 39.5], [-81.9, 24.6], [-80.0, 25.8], [-84.0, 30.1], [-89.4, 30.3], [-94.0, 29.8], [-96.6, 25.8], [-99.0, 26.4], [-104.1, 29.4], [-111.1, 31.3], [-114.7, 32.5], [-117.1, 32.5], [-117.1, 49.0], [-130.0, 54.4], [-141.0, 60.3], [-141.0, 69.6]
                ]
            },
            {
                name: "Canada", 
                color: "#DDA0DD",
                coordinates: [
                    [-141.0, 69.6], [-56.0, 50.0], [-57.0, 50.4], [-61.8, 57.1], [-61.5, 62.6], [-69.0, 68.8], [-106.0, 69.0], [-141.0, 69.6]
                ]
            },
            {
                name: "Mexico",
                color: "#F0E68C", 
                coordinates: [
                    [-117.1, 32.5], [-114.7, 32.5], [-111.1, 31.3], [-108.2, 31.3], [-108.2, 25.3], [-99.0, 26.4], [-96.6, 25.8], [-97.1, 22.1], [-97.7, 22.1], [-90.5, 14.7], [-92.2, 14.5], [-92.2, 14.9], [-114.2, 19.0], [-117.1, 22.8], [-117.1, 32.5]
                ]
            },
            
            // South America
            {
                name: "Brazil",
                color: "#98FB98",
                coordinates: [
                    [-73.9, 7.0], [-34.8, 7.3], [-34.8, -7.3], [-35.0, -9.1], [-37.2, -11.0], [-37.2, -20.2], [-40.3, -20.3], [-41.0, -21.0], [-41.9, -22.9], [-43.2, -22.9], [-44.7, -22.8], [-48.6, -25.9], [-48.6, -28.8], [-50.0, -30.8], [-53.4, -33.1], [-53.6, -33.5], [-69.5, -22.2], [-68.8, -21.0], [-68.8, -14.4], [-69.6, -10.9], [-70.0, -9.7], [-70.1, -2.5], [-68.4, -1.1], [-68.4, 1.8], [-67.9, 1.7], [-67.3, 2.0], [-67.3, 1.1], [-61.2, 5.2], [-60.7, 5.2], [-55.9, 2.0], [-55.9, 2.5], [-51.7, 4.8], [-51.0, 5.8], [-49.9, 5.8], [-49.9, 6.9], [-47.0, 5.9], [-44.5, 2.1], [-44.0, 2.1], [-35.4, 5.4], [-73.9, 7.0]
                ]
            },
            {
                name: "Argentina", 
                color: "#87CEFA",
                coordinates: [
                    [-73.4, -49.5], [-68.6, -52.3], [-68.6, -54.9], [-54.9, -54.9], [-64.9, -22.1], [-69.5, -22.2], [-73.4, -49.5]
                ]
            },
            {
                name: "Chile",
                color: "#FFB6C1",
                coordinates: [
                    [-75.6, -17.5], [-69.5, -22.2], [-73.4, -49.5], [-74.9, -52.9], [-71.9, -55.0], [-68.6, -54.9], [-68.6, -52.3], [-73.4, -49.5], [-70.8, -33.0], [-71.0, -30.0], [-70.4, -18.3], [-75.6, -17.5]
                ]
            },
            
            // Europe
            {
                name: "Russia",
                color: "#FFB6C1",
                coordinates: [
                    [19.6, 69.1], [33.0, 69.6], [40.0, 67.0], [180.0, 64.9], [180.0, 71.5], [19.6, 71.5], [19.6, 69.1]
                ]
            },
            {
                name: "Norway",
                color: "#DEB887",
                coordinates: [
                    [4.6, 62.4], [5.9, 58.9], [10.9, 58.9], [12.7, 56.1], [14.1, 56.1], [15.1, 57.8], [16.1, 58.8], [19.1, 60.3], [28.2, 69.1], [20.6, 69.1], [16.6, 68.6], [12.6, 64.1], [5.0, 61.8], [4.6, 62.4]
                ]
            },
            {
                name: "Sweden",
                color: "#F0E68C",
                coordinates: [
                    [11.0, 58.9], [23.9, 67.9], [24.2, 65.7], [21.2, 63.8], [17.1, 61.3], [12.0, 60.0], [11.0, 58.9]
                ]
            },
            {
                name: "Finland",
                color: "#E6E6FA",
                coordinates: [
                    [20.6, 69.1], [28.2, 69.1], [31.6, 62.4], [28.4, 60.2], [21.3, 60.2], [20.6, 69.1]
                ]
            },
            
            // Africa
            {
                name: "Algeria",
                color: "#CD853F",
                coordinates: [
                    [-8.7, 27.4], [11.8, 23.5], [12.0, 23.5], [12.0, 32.0], [8.5, 36.9], [-2.2, 35.2], [-8.7, 27.4]
                ]
            },
            {
                name: "Libya", 
                color: "#DEB887",
                coordinates: [
                    [11.8, 23.5], [25.0, 20.0], [25.0, 31.6], [12.0, 32.0], [11.8, 23.5]
                ]
            },
            {
                name: "Egypt",
                color: "#F0E68C",
                coordinates: [
                    [25.0, 31.6], [25.0, 20.0], [37.0, 22.0], [35.0, 29.5], [34.3, 31.2], [25.0, 31.6]
                ]
            },
            {
                name: "South Africa",
                color: "#98FB98",
                coordinates: [
                    [16.3, -28.6], [32.8, -26.9], [32.1, -29.4], [31.3, -29.4], [29.4, -30.9], [28.2, -30.2], [26.4, -29.5], [25.0, -28.2], [23.5, -28.2], [22.1, -29.0], [20.1, -28.8], [18.9, -28.9], [18.4, -29.1], [17.8, -28.9], [16.3, -28.6]
                ]
            },
            
            // Asia
            {
                name: "China",
                color: "#FFA07A", 
                coordinates: [
                    [73.6, 39.4], [96.4, 42.7], [125.0, 53.1], [133.9, 48.4], [134.8, 47.4], [134.7, 43.4], [133.1, 42.8], [131.3, 44.4], [128.8, 44.8], [125.8, 43.6], [123.6, 41.6], [119.8, 39.4], [118.9, 37.4], [117.3, 34.8], [115.4, 32.7], [108.1, 34.5], [102.3, 41.1], [94.2, 40.8], [87.4, 41.4], [80.1, 40.9], [76.0, 40.3], [73.6, 39.4]
                ]
            },
            {
                name: "India",
                color: "#20B2AA",
                coordinates: [
                    [68.2, 23.7], [78.9, 34.3], [78.9, 29.3], [79.7, 28.2], [81.1, 28.4], [84.1, 28.8], [85.8, 28.2], [88.1, 27.3], [88.1, 24.7], [88.7, 22.6], [90.0, 22.0], [92.5, 20.7], [93.4, 19.4], [94.1, 18.2], [94.6, 17.3], [94.6, 14.6], [93.3, 12.5], [92.2, 10.8], [90.6, 7.3], [87.0, 7.0], [80.2, 8.8], [77.8, 8.3], [76.6, 10.2], [75.8, 11.6], [72.8, 19.2], [68.8, 23.6], [68.2, 23.7]
                ]
            },
            {
                name: "Japan",
                color: "#FFE4E1",
                coordinates: [
                    [129.4, 31.4], [131.0, 33.1], [135.8, 35.5], [139.8, 35.7], [140.8, 41.8], [145.5, 43.3], [145.8, 44.5], [143.9, 44.2], [142.1, 43.3], [140.9, 41.5], [139.6, 41.6], [139.4, 38.2], [140.9, 37.1], [140.9, 35.9], [138.9, 34.7], [135.1, 34.4], [132.6, 33.5], [130.3, 33.3], [129.4, 31.4]
                ]
            },
            
            // Oceania
            {
                name: "Australia",
                color: "#FFE4B5",
                coordinates: [
                    [112.9, -21.8], [153.6, -10.7], [153.6, -28.2], [149.9, -37.5], [147.7, -42.7], [145.4, -42.7], [140.9, -38.1], [136.3, -35.0], [129.0, -32.3], [123.7, -35.0], [115.6, -35.0], [112.9, -32.0], [112.9, -21.8]
                ]
            },
            {
                name: "New Zealand", 
                color: "#F0F8FF",
                coordinates: [
                    [166.5, -34.4], [178.5, -34.4], [178.8, -47.2], [166.5, -47.2], [166.5, -34.4]
                ]
            },
            
            // Polar regions
            {
                name: "Greenland",
                color: "#F0F8FF",
                coordinates: [
                    [-73.0, 83.6], [-12.0, 83.6], [-12.0, 59.8], [-42.2, 59.8], [-73.0, 68.7], [-73.0, 83.6]
                ]
            },
            {
                name: "Antarctica",
                color: "#F8F8FF", 
                coordinates: [
                    [-180.0, -63.3], [180.0, -63.3], [180.0, -90.0], [-180.0, -90.0], [-180.0, -63.3]
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
            this.ctx.lineWidth = 0.5;
            
            // Handle countries with multiple polygons (separated by null)
            const polygons = this.splitPolygons(country.coordinates);
            
            polygons.forEach(polygon => {
                this.ctx.beginPath();
                
                let firstPoint = true;
                for (let i = 0; i < polygon.length; i++) {
                    const coord = polygon[i];
                    const pixel = this.latLonToPixel(coord[1], coord[0]); // lat, lon
                    
                    // Skip points that are way off screen for performance
                    if (pixel.x < -1000 || pixel.x > this.canvas.width + 1000 || 
                        pixel.y < -1000 || pixel.y > this.canvas.height + 1000) {
                        continue;
                    }
                    
                    if (firstPoint) {
                        this.ctx.moveTo(pixel.x, pixel.y);
                        firstPoint = false;
                    } else {
                        this.ctx.lineTo(pixel.x, pixel.y);
                    }
                }
                
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            });
            
            // Draw country labels
            if (this.showLabels && this.zoom > 0.5) {
                // Find a good center point for the label
                const mainPolygon = polygons[0] || country.coordinates;
                if (mainPolygon.length > 0) {
                    // Calculate centroid
                    let sumLat = 0, sumLon = 0, count = 0;
                    mainPolygon.forEach(coord => {
                        if (coord && coord.length === 2) {
                            sumLon += coord[0];
                            sumLat += coord[1];
                            count++;
                        }
                    });
                    
                    if (count > 0) {
                        const centerLat = sumLat / count;
                        const centerLon = sumLon / count;
                        const centerPixel = this.latLonToPixel(centerLat, centerLon);
                        
                        // Only draw label if it's on screen
                        if (centerPixel.x >= 0 && centerPixel.x <= this.canvas.width &&
                            centerPixel.y >= 0 && centerPixel.y <= this.canvas.height) {
                            
                            this.ctx.fillStyle = '#000';
                            this.ctx.font = `${Math.max(10, 12 * this.zoom)}px Arial`;
                            this.ctx.textAlign = 'center';
                            this.ctx.strokeStyle = '#fff';
                            this.ctx.lineWidth = 3;
                            this.ctx.strokeText(country.name, centerPixel.x, centerPixel.y);
                            this.ctx.fillText(country.name, centerPixel.x, centerPixel.y);
                        }
                    }
                }
            }
        });
    }
    
    splitPolygons(coordinates) {
        // Split coordinates array at null values (which separate multiple polygons)
        const polygons = [];
        let currentPolygon = [];
        
        coordinates.forEach(coord => {
            if (coord === null) {
                if (currentPolygon.length > 0) {
                    polygons.push(currentPolygon);
                    currentPolygon = [];
                }
            } else {
                currentPolygon.push(coord);
            }
        });
        
        // Add the last polygon if it exists
        if (currentPolygon.length > 0) {
            polygons.push(currentPolygon);
        }
        
        return polygons.length > 0 ? polygons : [coordinates];
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
        
        // Draw projection center indicator
        this.drawProjectionCenter();
        
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
    
    drawProjectionCenter() {
        // The projection center should appear at the screen center in the new projection
        const centerPixel = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.8;
        
        // Draw crosshair
        const size = 20;
        this.ctx.beginPath();
        this.ctx.moveTo(centerPixel.x - size, centerPixel.y);
        this.ctx.lineTo(centerPixel.x + size, centerPixel.y);
        this.ctx.moveTo(centerPixel.x, centerPixel.y - size);
        this.ctx.lineTo(centerPixel.x, centerPixel.y + size);
        this.ctx.stroke();
        
        // Draw circle around center
        this.ctx.beginPath();
        this.ctx.arc(centerPixel.x, centerPixel.y, 10, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Draw label
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Projection Center', centerPixel.x, centerPixel.y - 30);
        
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
            `Projection Center:<br>Lat: ${this.centerLat.toFixed(2)}°, Lon: ${this.centerLon.toFixed(2)}°<br>Zoom: ${this.zoom.toFixed(1)}x`;
    }
}
