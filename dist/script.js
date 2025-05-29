fetch('/api/sensor')
    .then(response => response.json())
    .then(data => {
        console.log("📌 Datos recibidos en el frontend:", data);
        // Carga de datos en la tabla
        document.getElementById('resultado').innerHTML = `
            <p><strong>Temperatura:</strong> ${data.temperature} °C</p>
            <p><strong>Humedad:</strong> ${data.humidity} %</p>
            <p><strong>Presión atmosférica:</strong> ${data.pressure} Pa</p>
            <p><strong>Calidad del aire:</strong> ${data.airQuality}</p>
            <p><strong>Nivel de batería:</strong> ${data.battery} %</p>
        `;
    })
    .catch(error => console.error('Error al obtener los datos del sensor:', error));

// Cargar el mapa con OpenStreetMap
document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("map").setView([0, 0], 13); // Coordenadas iniciales

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // Obtener coordenadas del backend
    fetch("/api/ubicacion")
        .then(response => response.json())
        .then(data => {
            console.log("📌 Coordenadas recibidas:", data);

            if (data.lat && data.lon) {
                // Mover el mapa a la ubicación del dispositivo
                map.setView([data.lat, data.lon], 13);

                // Agregar marcador en la ubicación del dispositivo
                L.marker([data.lat, data.lon]).addTo(map)
                    .bindPopup("<b>Dispositivo</b><br>Ubicación actual.")
                    .openPopup();
            } else {
                console.error("❌ No se encontraron coordenadas.");
            }
        })
        .catch(error => console.error("Error al obtener ubicación:", error));
});