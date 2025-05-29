const fetch = require('node-fetch');

const API_URL = 'https://api.nrfcloud.com/v1/messages?deviceId=nrf-351901930761014';
const API_KEY = '2101d3d2d30f96a178fe89838b888027d7f4b836';

exports.handler = async function(event, context) {
  // Permitir CORS para el frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Preflight para CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Ruta para /api/sensor
  if (event.path.endsWith('/sensor')) {
    try {
      const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });
      const data = await response.json();

      // Extraer datos de sensores
      const sensorData = {};
      if (data.items) {
        data.items.forEach(item => {
          const message = item.message;
          if (message.appId === "TEMP") sensorData.temperature = message.data;
          if (message.appId === "HUMID") sensorData.humidity = message.data;
          if (message.appId === "AIR_PRESS") sensorData.pressure = message.data;
          if (message.appId === "AIR_QUAL") sensorData.airQuality = message.data;
          if (message.appId === "BATTERY") sensorData.battery = message.data;
        });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(sensorData)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // Ruta para /api/ubicacion
  if (event.path.endsWith('/ubicacion')) {
    try {
      const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });
      const data = await response.json();

      // Extraer coordenadas GNSS
      let locationData = {};
      if (data.items) {
        data.items.forEach(item => {
          const message = item.message;
          if (
            message.appId === "GNSS" &&
            message.data &&
            typeof message.data.lat === "number" &&
            (typeof message.data.lon === "number" || typeof message.data.lng === "number")
          ) {
            locationData = {
              lat: message.data.lat,
              lon: message.data.lon !== undefined ? message.data.lon : message.data.lng
            };
          }
        });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(locationData)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // Ruta no encontrada
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found' })
  };
};