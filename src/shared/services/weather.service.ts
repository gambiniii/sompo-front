import axios from 'axios';

// OpenWeatherMap API (gratuita)
// Para usar, você precisa criar uma conta em: https://openweathermap.org/api
// e obter uma API key gratuita

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  main: string; // "Clear", "Rain", "Clouds", etc.
  description: string; // "clear sky", "light rain", etc.
  temp: number; // Temperatura em Celsius
  icon: string; // Código do ícone
}

/**
 * Mapeamento de condições do OpenWeatherMap para condições do modelo brasileiro
 */
const WEATHER_MAPPING: Record<string, string> = {
  Clear: 'Céu Claro',
  Clouds: 'Nublado',
  Rain: 'Chuva',
  Drizzle: 'Garoa/Chuvisco',
  Thunderstorm: 'Chuva',
  Snow: 'Neve',
  Mist: 'Nevoeiro/Neblina',
  Fog: 'Nevoeiro/Neblina',
  Haze: 'Nevoeiro/Neblina',
  Smoke: 'Nevoeiro/Neblina',
  Dust: 'Vento',
  Sand: 'Vento',
  Squall: 'Vento',
};

/**
 * Busca o clima atual para uma localização
 */
export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric', // Celsius
        lang: 'pt_br',
      },
    });

    return {
      main: response.data.weather[0].main,
      description: response.data.weather[0].description,
      temp: response.data.main.temp,
      icon: response.data.weather[0].icon,
    };
  } catch (error) {
    console.error('Erro ao buscar clima:', error);
    // Retornar clima padrão em caso de erro
    return {
      main: 'Clear',
      description: 'clear sky',
      temp: 25,
      icon: '01d',
    };
  }
};

/**
 * Busca previsão do tempo para uma data/hora específica (até 5 dias)
 */
export const getForecastWeather = async (
  lat: number,
  lon: number,
  targetDate: Date,
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        lang: 'pt_br',
      },
    });

    // Encontrar a previsão mais próxima da data alvo
    const forecasts = response.data.list;
    const targetTime = targetDate.getTime();

    let closestForecast = forecasts[0];
    let minDiff = Math.abs(new Date(forecasts[0].dt * 1000).getTime() - targetTime);

    for (const forecast of forecasts) {
      const forecastTime = new Date(forecast.dt * 1000).getTime();
      const diff = Math.abs(forecastTime - targetTime);

      if (diff < minDiff) {
        minDiff = diff;
        closestForecast = forecast;
      }
    }

    return {
      main: closestForecast.weather[0].main,
      description: closestForecast.weather[0].description,
      temp: closestForecast.main.temp,
      icon: closestForecast.weather[0].icon,
    };
  } catch (error) {
    console.error('Erro ao buscar previsão:', error);
    // Fallback para clima atual
    return getCurrentWeather(lat, lon);
  }
};

/**
 * Converte condição do OpenWeatherMap para formato do modelo brasileiro
 */
export const mapWeatherToModelFormat = (weatherMain: string): string => {
  return WEATHER_MAPPING[weatherMain] || 'Céu Claro';
};

/**
 * Busca clima para uma rota (usa ponto inicial)
 */
export const getWeatherForRoute = async (
  routeCoords: [number, number][],
  departureDate?: Date,
): Promise<{ raw: WeatherData; modelFormat: string }> => {
  if (routeCoords.length === 0) {
    throw new Error('Rota vazia');
  }

  // Usar primeiro ponto da rota (ponto de partida)
  const [lat, lon] = routeCoords[0];

  // Se tem data de partida futura, usar previsão
  const now = new Date();
  const targetDate = departureDate || now;
  const hoursDiff = (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  let weather: WeatherData;

  // Se for mais de 1 hora no futuro e menos de 5 dias, usar previsão
  if (hoursDiff > 1 && hoursDiff < 120) {
    weather = await getForecastWeather(lat, lon, targetDate);
  } else {
    weather = await getCurrentWeather(lat, lon);
  }

  return {
    raw: weather,
    modelFormat: mapWeatherToModelFormat(weather.main),
  };
};
