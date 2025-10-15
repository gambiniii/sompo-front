import { MapRef } from 'react-map-gl';
import { gridDisk, latLngToCell, H3IndexInput } from 'h3-js';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';
import { RouteInfoCard } from './RouteInfoCard';
import { TheftRiskCard } from './TheftRiskCard';
import { AccidentRiskCard } from './AccidentRiskCard';
import { WeatherCard } from './WeatherCard';
import { TripConfigCard } from './TripConfigCard';
import { MapComponent } from './MapComponent';
import { assessSeparatedRisk, SeparatedRiskResponse } from '@/shared/http/sompo-api/assessment/assess-separated-risk.request';
import { getWeatherForRoute } from '@/shared/services/weather.service';
import { SP_CENTER } from '@/shared/config/sp_center';

export const AssessmentComponent = () => {
  const mapRef = useRef<MapRef | null>(null);

  const [hexagons, setHexagons] = useState<H3IndexInput[]>([]);
  const [, setMainHexagon] = useState<H3IndexInput>('');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [cargoType, setCargoType] = useState('');
  const [routeGeoJSON, setRouteGeoJSON] = useState<GeoJSON.Feature | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para os 3 tipos de dados
  const [theftRisk, setTheftRisk] = useState<SeparatedRiskResponse['theft_risk'] | null>(null);
  const [accidentRisk, setAccidentRisk] = useState<SeparatedRiskResponse['accident_risk'] | null>(null);
  const [weather, setWeather] = useState<{ main: string; description: string; temp: number; icon: string } | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    estimatedCost: string;
  } | null>(null);

  // Inicializa hexágonos
  useEffect(() => {
    const resolution = 7;
    const mainCell = latLngToCell(SP_CENTER.latitude, SP_CENTER.longitude, resolution);
    setMainHexagon(mainCell);
    const ringCells = gridDisk(mainCell, 4);
    setHexagons([mainCell, ...ringCells]);
  }, []);

  const handleSearchRoute = async () => {
    if (!from || !to) {
      toast.error('Preencha os pontos de partida e chegada.');
      return;
    }

    if (!cargoType) {
      toast.error('Selecione um tipo de carga.');
      return;
    }

    setIsLoading(true);
    setTheftRisk(null);
    setAccidentRisk(null);
    setWeather(null);
    setRouteInfo(null);
    setRecommendations([]);

    try {
      const loadingToastId = toast.loading('Analisando rota e condições climáticas...', {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });

      // 1. Buscar rota do Mapbox
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${from};${to}?geometries=geojson&access_token=${
          import.meta.env.VITE_MAPBOX_TOKEN
        }`,
      );

      const routeData = response.data.routes[0];
      const route = routeData.geometry;
      setRouteGeoJSON({ type: 'Feature', geometry: route, properties: {} });

      // Extrai informações da rota
      const distance = (routeData.distance / 1000).toFixed(1);
      const duration = Math.round(routeData.duration / 60);
      const estimatedCost = (parseFloat(distance) * 0.5 + 15).toFixed(2);

      setRouteInfo({
        distance: `${distance} km`,
        duration: `${duration} min`,
        estimatedCost: `R$ ${estimatedCost}`,
      });

      // Ajustar mapa
      const mapInstance = mapRef.current?.getMap();
      if (mapInstance) {
        const coords: [number, number][] = route.coordinates;
        const bounds = coords.reduce(
          (b: mapboxgl.LngLatBounds, coord: [number, number]) => b.extend(coord),
          new mapboxgl.LngLatBounds(coords[0], coords[0]),
        );
        mapInstance.fitBounds(bounds, { padding: 50 });
      }

      // 2. Processar coordenadas (converter de [lng, lat] para [lat, lng])
      const routeCoordinates = route.coordinates.map((coord: [number, number]) => [
        coord[1],
        coord[0],
      ]);

      const expectedHour = departureDate ? departureDate.getHours() : new Date().getHours();
      const weekday = departureDate ? departureDate.getDay() : new Date().getDay();

      // 3. Buscar clima
      toast.update(loadingToastId, {
        render: 'Consultando condições climáticas...',
      });

      let weatherData = null;
      let weatherCondition = null;

      try {
        const weatherResult = await getWeatherForRoute(routeCoordinates, departureDate || undefined);
        weatherData = weatherResult.raw;
        weatherCondition = weatherResult.modelFormat;
        setWeather(weatherData);
        console.log('Clima obtido:', weatherResult);
      } catch (error) {
        console.error('Erro ao buscar clima:', error);
        toast.warning('Não foi possível obter dados climáticos. Continuando sem informação de clima.');
      }

      // 4. Chamar endpoint combinado
      toast.update(loadingToastId, {
        render: 'Analisando riscos de roubo e acidentes...',
      });

      try {
        const combinedResponse = await assessSeparatedRisk({
          route: routeCoordinates,
          expected_hour: expectedHour,
          weekday: weekday,
          cargo_type: cargoType,
          weather_condition: weatherCondition || undefined,
        });

        console.log('Resposta combinada:', combinedResponse);

        setTheftRisk(combinedResponse.theft_risk);
        setAccidentRisk(combinedResponse.accident_risk);
        setRecommendations(combinedResponse.recommendations);

        setIsLoading(false);

        // Determinar tipo de toast baseado no risco geral
        const overallCategory = combinedResponse.overall_risk_category;
        const toastType =
          overallCategory === 'BAIXO'
            ? 'success'
            : overallCategory === 'MÉDIO'
            ? 'info'
            : overallCategory === 'ALTO'
            ? 'warning'
            : 'error';

        toast.update(loadingToastId, {
          render: `Análise concluída! Risco geral: ${overallCategory}`,
          type: toastType,
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          draggable: true,
        });
      } catch (riskError: any) {
        console.error('Erro na análise de risco:', riskError);
        setIsLoading(false);

        toast.update(loadingToastId, {
          render: `Erro ao analisar riscos: ${riskError.response?.data?.detail || riskError.message}`,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          draggable: true,
        });
      }
    } catch (error: any) {
      console.error('Erro ao buscar rota:', error);
      setIsLoading(false);
      toast.error('Não foi possível processar a rota.');
    }
  };

  return (
    <Box
      sx={{
        height: 'calc(100vh - 75px)',
        margin: '-35px -80px',
        background: `linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 25%, #FEF2F2 75%, #FFFFFF 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Layout em grid: Config + Weather | Theft | Accident | Map */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '280px 280px 280px 1fr',
          gridTemplateRows: '1fr',
          height: '100%',
          gap: 2,
          p: 2,
        }}
      >
        {/* Coluna 1: Config + Clima */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <TripConfigCard
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            cargoType={cargoType}
            setCargoType={setCargoType}
            handleSearchRoute={handleSearchRoute}
            isLoading={isLoading}
            from={from}
            to={to}
          />

          <WeatherCard weather={weather} />

          <RouteInfoCard routeInfo={routeInfo} />
        </Box>

        {/* Coluna 2: Risco de Roubo */}
        <Box
          sx={{
            height: '100%',
            overflow: 'auto',
          }}
        >
          <TheftRiskCard theftRisk={theftRisk} />
        </Box>

        {/* Coluna 3: Risco de Acidente */}
        <Box
          sx={{
            height: '100%',
            overflow: 'auto',
          }}
        >
          <AccidentRiskCard accidentRisk={accidentRisk} />
        </Box>

        {/* Coluna 4: Mapa (maior) */}
        <Box
          sx={{
            height: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.1)',
            border: '1px solid #FECACA',
            background: '#FFFFFF',
          }}
        >
          <MapComponent
            hexagons={hexagons}
            routeGeoJSON={routeGeoJSON}
            setFrom={setFrom}
            setTo={setTo}
            mapRef={mapRef}
          />
        </Box>
      </Box>

      {/* Recomendações (opcional, pode adicionar depois) */}
      {recommendations.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '80%',
            background: 'white',
            p: 2,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '2px solid #EF4444',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {recommendations.map((rec, idx) => (
              <Box key={idx} sx={{ fontSize: '0.85rem', color: '#991b1b' }}>
                {rec}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
