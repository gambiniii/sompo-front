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
import { RiskAssessmentCard } from './RiskAssessmentCard';
import { TripConfigCard } from './TripConfigCard';
import { MapComponent } from './MapComponent';
import { assessRiskOnRoute } from '@/shared/http/sompo-api/assessment/assess-risk-on-route.request';
import { SP_CENTER } from '@/shared/config/sp_center';

export const AssessmentComponent = () => {
  const mapRef = useRef<MapRef | null>(null);

  const [hexagons, setHexagons] = useState<H3IndexInput[]>([]);
  const [, setMainHexagon] = useState<H3IndexInput>('');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState<GeoJSON.Feature | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState<{
    level: 'low' | 'medium' | 'high';
    percentage: number;
    factors: string[];
  } | null>(null);
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
  }, [SP_CENTER.latitude, SP_CENTER.longitude]);

  const handleSearchRoute = async () => {
    if (!from || !to) {
      toast.error('Preencha os pontos de partida e chegada.');
      return;
    }

    setIsLoading(true);
    setRiskAssessment(null);
    setRouteInfo(null);

    try {
      const loadingToastId = toast.loading('Analisando rota, aguarde...', {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });

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

      const mapInstance = mapRef.current?.getMap();
      if (!mapInstance) return;
      const coords: [number, number][] = route.coordinates;
      const bounds = coords.reduce(
        (b: mapboxgl.LngLatBounds, coord: [number, number]) => b.extend(coord),
        new mapboxgl.LngLatBounds(coords[0], coords[0]),
      );
      mapInstance.fitBounds(bounds, { padding: 50 });

      try {
        const routeCoordinates = route.coordinates.map((coord: [number, number]) => [
          coord[1],
          coord[0],
        ]);

        const expectedHour = departureDate ? departureDate.getHours() : new Date().getHours();
        const weekday = departureDate ? departureDate.getDay() : new Date().getDay();

        const riskResponse = await assessRiskOnRoute({
          route: routeCoordinates,
          expected_hour: expectedHour,
          weekday: weekday,
        });

        const averageRiskPercentage = riskResponse.average_normalized
          ? riskResponse.average_normalized * 100
          : riskResponse.results.reduce(
              (sum: number, result: any) => sum + (result.risk_percentage || 0),
              0,
            ) / riskResponse.results.length;

        let riskLevel: 'low' | 'medium' | 'high';
        if (averageRiskPercentage <= 30) {
          riskLevel = 'low';
        } else if (averageRiskPercentage <= 70) {
          riskLevel = 'medium';
        } else {
          riskLevel = 'high';
        }

        const riskFactors = [];

        // Analisa confiabilidade
        if (riskResponse.confidence < 0.7) {
          riskFactors.push('Baixa confiabilidade dos dados');
        } else if (riskResponse.confidence >= 0.9) {
          riskFactors.push('Alta confiabilidade dos dados');
        }

        // Analisa quantidade de pontos
        if (riskResponse.points_analyzed < 10) {
          riskFactors.push('Poucos pontos analisados');
        } else if (riskResponse.points_analyzed >= 30) {
          riskFactors.push(`${riskResponse.points_analyzed} pontos analisados`);
        }

        // Encontra pontos de maior risco
        const highRiskPoints = riskResponse.results.filter(
          (point: any) => point.risk_percentage > 80,
        );
        if (highRiskPoints.length > 0) {
          riskFactors.push(`${highRiskPoints.length} ponto(s) de alto risco identificado(s)`);
        }

        // Fatores baseados no nível de risco geral
        if (averageRiskPercentage > 80) {
          riskFactors.push('Rota de alto risco');
          riskFactors.push('Evitar se possível');
        } else if (averageRiskPercentage > 60) {
          riskFactors.push('Risco elevado na rota');
          riskFactors.push('Considere horários alternativos');
        } else if (averageRiskPercentage > 40) {
          riskFactors.push('Risco moderado identificado');
          riskFactors.push('Mantenha-se alerta');
        } else if (averageRiskPercentage > 20) {
          riskFactors.push('Risco baixo a moderado');
        } else {
          riskFactors.push('Rota segura');
          riskFactors.push('Baixo risco de incidentes');
        }

        const assessment = {
          level: riskLevel,
          percentage: Math.round(averageRiskPercentage),
          factors: riskFactors,
        };

        setRiskAssessment(assessment);
        setIsLoading(false);

        toast.update(loadingToastId, {
          render: `Análise concluída! Risco: ${assessment.percentage}%`,
          type:
            assessment.level === 'low'
              ? 'success'
              : assessment.level === 'medium'
              ? 'warning'
              : 'error',
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          draggable: true,
        });
      } catch (riskError) {
        console.error('Erro na análise de risco:', riskError);
        setIsLoading(false);
        toast.update(loadingToastId, {
          render: 'Erro na análise de risco. Usando dados simulados.',
          type: 'warning',
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });

        // Fallback para simulação
        const riskLevel = Math.random();
        let assessment: typeof riskAssessment;

        if (riskLevel < 0.3) {
          assessment = {
            level: 'low',
            percentage: Math.floor(Math.random() * 30 + 10),
            factors: ['Região segura', 'Horário adequado', 'Rota conhecida'],
          };
        } else if (riskLevel < 0.7) {
          assessment = {
            level: 'medium',
            percentage: Math.floor(Math.random() * 40 + 30),
            factors: ['Tráfego moderado', 'Área comercial', 'Horário de pico'],
          };
        } else {
          assessment = {
            level: 'high',
            percentage: Math.floor(Math.random() * 30 + 70),
            factors: ['Alta criminalidade', 'Região de risco', 'Horário noturno'],
          };
        }

        setRiskAssessment(assessment);
      }
    } catch (error) {
      console.error('Erro ao buscar rota:', error);
      setIsLoading(false);
      toast.error('Não foi possível processar a rota.');
    }
  };

  return (
    <Box
      sx={{
        height: 'calc(100vh - 75px)', // Altura total menos header
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
      {/* Layout em 3 colunas para melhor aproveitamento */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '280px 280px 1fr',
          gridTemplateRows: '1fr',
          height: '100%',
          gap: 2,
          p: 2,
        }}
      >
        {/* Coluna 1: Config + Info da Rota */}
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
            handleSearchRoute={handleSearchRoute}
            isLoading={isLoading}
            from={from}
            to={to}
          />

          <RouteInfoCard routeInfo={routeInfo} />
        </Box>

        {/* Coluna 2: Análise de Risco */}
        <Box
          sx={{
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <RiskAssessmentCard riskAssessment={riskAssessment} />
        </Box>

        {/* Coluna 3: Mapa (maior) */}
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
    </Box>
  );
};
