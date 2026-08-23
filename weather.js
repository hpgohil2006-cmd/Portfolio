"use strict";


/* =========================================================
   WEATHER DASHBOARD
   Internship Task 4
========================================================= */


/* =========================================================
   API ENDPOINTS
========================================================= */

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";


const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const weatherForm =
    document.getElementById("weather-form");


const cityInput =
    document.getElementById("city-input");


const weatherStatus =
    document.getElementById("weather-status");


const weatherError =
    document.getElementById("weather-error");


const weatherResult =
    document.getElementById("weather-result");


const locationName =
    document.getElementById("location-name");


const locationDetails =
    document.getElementById("location-details");


const weatherIcon =
    document.getElementById("weather-icon");


const temperature =
    document.getElementById("temperature");


const weatherDescription =
    document.getElementById(
        "weather-description"
    );


const humidity =
    document.getElementById("humidity");


const windSpeed =
    document.getElementById("wind-speed");


const windDirection =
    document.getElementById(
        "wind-direction"
    );


const feelsLike =
    document.getElementById("feels-like");


const weatherTime =
    document.getElementById("weather-time");


/* =========================================================
   FORM SUBMISSION
========================================================= */

weatherForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const city =
            cityInput.value.trim();


        if (city === "") {

            showError(
                "Please enter a city name."
            );

            return;

        }


        await searchWeather(city);

    }
);


/* =========================================================
   MAIN WEATHER SEARCH
========================================================= */

async function searchWeather(city) {


    hideError();


    weatherResult.hidden = true;


    weatherStatus.textContent =
        "Searching for weather information...";


    try {


        /* -------------------------------------------------
           STEP 1: Find city coordinates
        ------------------------------------------------- */

        const location =
            await getLocation(city);


        /* -------------------------------------------------
           STEP 2: Get weather using coordinates
        ------------------------------------------------- */

        const weather =
            await getWeather(
                location.latitude,
                location.longitude
            );


        /* -------------------------------------------------
           STEP 3: Render weather data
        ------------------------------------------------- */

        renderWeather(
            location,
            weather
        );


        weatherStatus.textContent =
            "Weather data updated successfully.";


    }
    catch (error) {


        console.error(
            "Weather error:",
            error
        );


        showError(
            error.message ||
            "Unable to retrieve weather data. Please try again."
        );


        weatherStatus.textContent = "";

    }

}


/* =========================================================
   GEOCODING API
========================================================= */

async function getLocation(city) {


    const url =
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to connect to the location service."
        );

    }


    const data =
        await response.json();


    /*
       Nested JSON validation
    */

    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            `No location found for "${city}". Please check the city name.`
        );

    }


    return data.results[0];

}


/* =========================================================
   WEATHER API
========================================================= */

async function getWeather(
    latitude,
    longitude
) {


    const url =
        `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to retrieve weather information."
        );

    }


    const data =
        await response.json();


    if (
        !data.current
    ) {

        throw new Error(
            "Weather information is currently unavailable."
        );

    }


    return data;

}


/* =========================================================
   RENDER WEATHER
========================================================= */

function renderWeather(
    location,
    data
) {


    /*
       Accessing nested JSON object:

       data.current.temperature_2m
       data.current.relative_humidity_2m
       data.current.wind_speed_10m
    */


    const current =
        data.current;


    /* Location */

    locationName.textContent =
        `${location.name}, ${location.country}`;


    locationDetails.textContent =
        `${location.admin1 || "Local Area"} • ${data.timezone}`;


    /* Temperature */

    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    /* Weather description */

    weatherDescription.textContent =
        getWeatherDescription(
            current.weather_code
        );


    /* Weather icon */

    weatherIcon.textContent =
        getWeatherIcon(
            current.weather_code
        );


    /* Humidity */

    humidity.textContent =
        Math.round(
            current.relative_humidity_2m
        );


    /* Wind speed */

    windSpeed.textContent =
        Math.round(
            current.wind_speed_10m
        );


    /* Wind direction */

    windDirection.textContent =
        Math.round(
            current.wind_direction_10m
        );


    /* Feels like */

    feelsLike.textContent =
        Math.round(
            current.apparent_temperature
        );


    /* Update time */

    weatherTime.textContent =
        `Last updated: ${formatDateTime(current.time)}`;


    /* Show result */

    weatherResult.hidden = false;

}


/* =========================================================
   WEATHER DESCRIPTION
========================================================= */

function getWeatherDescription(
    code
) {


    const weatherCodes = {

        0:
            "Clear sky",

        1:
            "Mainly clear",

        2:
            "Partly cloudy",

        3:
            "Overcast",

        45:
            "Fog",

        48:
            "Depositing rime fog",

        51:
            "Light drizzle",

        53:
            "Moderate drizzle",

        55:
            "Dense drizzle",

        61:
            "Slight rain",

        63:
            "Moderate rain",

        65:
            "Heavy rain",

        71:
            "Slight snow",

        73:
            "Moderate snow",

        75:
            "Heavy snow",

        80:
            "Slight rain showers",

        81:
            "Moderate rain showers",

        82:
            "Violent rain showers",

        95:
            "Thunderstorm",

        96:
            "Thunderstorm with hail",

        99:
            "Thunderstorm with heavy hail"

    };


    return (
        weatherCodes[code] ||
        "Unknown weather condition"
    );

}


/* =========================================================
   WEATHER ICON
========================================================= */

function getWeatherIcon(
    code
) {


    if (code === 0) {

        return "☀️";

    }


    if (
        code === 1 ||
        code === 2
    ) {

        return "🌤️";

    }


    if (code === 3) {

        return "☁️";

    }


    if (
        code === 45 ||
        code === 48
    ) {

        return "🌫️";

    }


    if (
        code >= 51 &&
        code <= 67
    ) {

        return "🌧️";

    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return "❄️";

    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return "🌦️";

    }


    if (
        code >= 95
    ) {

        return "⛈️";

    }


    return "🌤️";

}


/* =========================================================
   DATE FORMATTING
========================================================= */

function formatDateTime(
    dateString
) {


    const date =
        new Date(dateString);


    return date.toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


/* =========================================================
   ERROR HANDLING
========================================================= */

function showError(
    message
) {


    weatherError.textContent =
        message;


    weatherError.hidden =
        false;


    weatherResult.hidden =
        true;

}


function hideError() {

    weatherError.textContent = "";

    weatherError.hidden = true;

}


/* =========================================================
   DEFAULT CITY
========================================================= */

searchWeather("Ahmedabad");