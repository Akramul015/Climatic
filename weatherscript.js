document.addEventListener("DOMContentLoaded", () => {
    const datetimeElement = document.getElementById("datetime");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const API_KEY = "8d22ce0933eef57171be1352464f8dde"; // Replace with your OpenWeatherMap API Key

    // Update Date and Time
    setInterval(() => {
        const now = new Date();
        datetimeElement.textContent = now.toLocaleString();
    }, 1000);

    const normalLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 });
    const satelliteLayer = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        maxZoom: 19,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
    });

    const map = L.map("map", { layers: [normalLayer] }).setView([0, 0], 2);
    let marker;

    function displayWeather(data) {
        document.getElementById("city-name").textContent = `City: ${data.name}`;
        document.getElementById("weather").textContent = `Weather: ${data.weather[0].description}`;
        document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;

        if (marker) map.removeLayer(marker);
        marker = L.marker([data.coord.lat, data.coord.lon]).addTo(map);
        map.setView([data.coord.lat, data.coord.lon], 10);
    }

    function fetchWeather(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        fetch(url)
            .then((response) => response.json())
            .then(displayWeather)
            .catch(console.error);
    }

    navigator.geolocation.getCurrentPosition(
        ({ coords }) => fetchWeather(coords.latitude, coords.longitude),
        () => alert("Geolocation failed.")
    );

    document.getElementById("search-btn").addEventListener("click", () => {
        const city = document.getElementById("location-search").value;
        if (!city) return alert("Enter a city!");
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        fetch(url)
            .then((response) => response.json())
            .then(displayWeather)
            .catch(() => alert("City not found."));
    });

    document.getElementById("normal-map-btn").addEventListener("click", () => {
        map.addLayer(normalLayer);
        map.removeLayer(satelliteLayer);
    });

    document.getElementById("satellite-map-btn").addEventListener("click", () => {
        map.addLayer(satelliteLayer);
        map.removeLayer(normalLayer);
    });

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        document.querySelector("header").classList.toggle("dark-mode");
        document.querySelector(".weather-card").classList.toggle("dark-mode");

        const buttons = document.querySelectorAll("button");
        buttons.forEach(button => button.classList.toggle("dark-mode"));
    });
});
