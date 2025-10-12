import { Map, Source, Layer, MapRef } from 'react-map-gl';
import {
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
} from '@mui/material';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { cellToBoundary, H3IndexInput } from 'h3-js';
import { Red } from '@/shared/colors/red';
import { MapLegend } from '../MapLegend';
import { StyledCard } from '../styles';
import { useEffect, useState } from 'react';
import {
  getAccidentsHeatmap,
  H3Cell,
} from '@/shared/http/sompo-api/heatmap/get-accidents-heatmap.request';
import { getTheftsHeatmap } from '@/shared/http/sompo-api/heatmap/get-thefts-heatmap.request';
import { toast } from 'react-toastify';
import { Blue } from '@/shared/colors/blue';
import { SP_CENTER } from '@/shared/config/sp_center';

type HeatmapType = 'none' | 'accidents' | 'thefts' | 'all';

interface MapComponentProps {
  hexagons: H3IndexInput[];
  routeGeoJSON: GeoJSON.Feature | null;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
  mapRef: React.RefObject<MapRef | null>;
}

export const MapComponent = ({ routeGeoJSON, setFrom, setTo, mapRef }: MapComponentProps) => {
  const [heatmapType, setHeatmapType] = useState<HeatmapType>('none');
  const [accidentsCells, setAccidentsCells] = useState<H3Cell[]>([]);
  const [theftsCells, setTheftsCells] = useState<H3Cell[]>([]);
  const [isLoadingHeatmap, setIsLoadingHeatmap] = useState(false);

  // Carregar dados do heatmap
  useEffect(() => {
    const loadHeatmapData = async () => {
      setIsLoadingHeatmap(true);
      try {
        const [accidents, thefts] = await Promise.all([
          getAccidentsHeatmap(2000), // Reduzido para melhor performance
          getTheftsHeatmap(2000),
        ]);

        setAccidentsCells(accidents.cells);
        setTheftsCells(thefts.cells);
      } catch (error) {
        console.error('Erro ao carregar dados do heatmap:', error);
        toast.error('Erro ao carregar dados do mapa de calor');
      } finally {
        setIsLoadingHeatmap(false);
      }
    };

    loadHeatmapData();
  }, []);

  // Criar GeoJSON otimizado com todas as células
  const getH3GeoJSON = () => {
    if (heatmapType === 'none') return { type: 'FeatureCollection' as const, features: [] };

    let cellsToShow: H3Cell[] = [];

    if (heatmapType === 'accidents') {
      cellsToShow = accidentsCells;
    } else if (heatmapType === 'thefts') {
      cellsToShow = theftsCells;
    } else {
      cellsToShow = [...accidentsCells, ...theftsCells];
    }

    // Converter para GeoJSON FeatureCollection
    return {
      type: 'FeatureCollection' as const,
      features: cellsToShow.map((cell) => ({
        type: 'Feature' as const,
        properties: {
          h3_id: cell.h3_id,
          count: cell.count,
          intensity: cell.intensity,
          cellType: cell.type, // 'accident' ou 'theft'
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [cellToBoundary(cell.h3_id, true)],
        },
      })),
    };
  };

  const cellsCount =
    heatmapType === 'none'
      ? 0
      : heatmapType === 'accidents'
      ? accidentsCells.length
      : heatmapType === 'thefts'
      ? theftsCells.length
      : accidentsCells.length + theftsCells.length;

  return (
    <StyledCard sx={{ height: 'fit-content', position: 'relative' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Filtro de Heatmap */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Células H3</InputLabel>
            <Select
              value={heatmapType}
              label="Células H3"
              onChange={(e) => setHeatmapType(e.target.value as HeatmapType)}
              disabled={isLoadingHeatmap}
            >
              <MenuItem value="none">Nenhum</MenuItem>
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="accidents">Acidentes</MenuItem>
              <MenuItem value="thefts">Roubos de Carga</MenuItem>
            </Select>
          </FormControl>
          {isLoadingHeatmap && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <CircularProgress size={20} />
            </Box>
          )}
          {!isLoadingHeatmap && cellsCount > 0 && (
            <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary', textAlign: 'center' }}>
              {cellsCount} células
            </Box>
          )}
        </Box>

        <Map
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={SP_CENTER}
          style={{ width: '100%', height: '70vh', borderRadius: '16px' }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          onLoad={() => {
            const map = mapRef.current?.getMap();
            if (!map) return;

            // Geocoder Ponto de partida
            const geocoderFrom = new MapboxGeocoder({
              accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
              placeholder: 'Ponto de partida',
            });
            geocoderFrom.on('result', (e: { result: { center: number[] } }) =>
              setFrom(e.result.center.join(',')),
            );
            map.addControl(geocoderFrom, 'top-left');

            // Geocoder Ponto de chegada
            const geocoderTo = new MapboxGeocoder({
              accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
              placeholder: 'Ponto de chegada',
            });
            geocoderTo.on('result', (e: { result: { center: number[] } }) =>
              setTo(e.result.center.join(',')),
            );
            map.addControl(geocoderTo, 'top-left');
          }}
        >
          {/* Células H3 de Ocorrências - Otimizado com Single Source */}
          {!isLoadingHeatmap && heatmapType !== 'none' && cellsCount > 0 && (
            <Source id="h3-cells" type="geojson" data={getH3GeoJSON()}>
              {/* Fill Layer com cores dinâmicas */}
              <Layer
                id="h3-cells-fill"
                type="fill"
                paint={{
                  'fill-color': [
                    'case',
                    ['==', heatmapType, 'all'],
                    [
                      'case',
                      // 🔴 Acidentes → tons de vermelho
                      ['==', ['get', 'cellType'], 'accident'],
                      [
                        'interpolate',
                        ['linear'],
                        ['get', 'intensity'],
                        0,
                        Red.MEDIUM, // vermelho mais suave
                        5,
                        Red.BASE, // vermelho principal
                        10,
                        Red.DARK, // vermelho escuro
                      ],
                      // 🔵 Roubos → tons de azul
                      [
                        'interpolate',
                        ['linear'],
                        ['get', 'intensity'],
                        0,
                        Blue.LIGHT_BLUE, // azul claro
                        10,
                        Blue.BASE, // azul principal
                        20,
                        Blue.DARK_BLUE, // azul escuro
                      ],
                    ],
                    // 🔴 Apenas acidentes
                    ['==', heatmapType, 'accidents'],
                    [
                      'interpolate',
                      ['linear'],
                      ['get', 'intensity'],
                      0,
                      Red.MEDIUM,
                      5,
                      Red.BASE,
                      10,
                      Red.DARK,
                    ],
                    // 🔵 Apenas roubos
                    [
                      'interpolate',
                      ['linear'],
                      ['get', 'intensity'],
                      0,
                      Blue.LIGHT_BLUE,
                      10,
                      Blue.BASE,
                      20,
                      Blue.DARK_BLUE,
                    ],
                  ],
                  'fill-opacity': 0.5,
                }}
              />

              {/* Line Layer para bordas */}
              <Layer
                id="h3-cells-line"
                type="line"
                paint={{
                  'line-color': '#ffffff',
                  'line-width': 0.5,
                  'line-opacity': 0.6,
                }}
              />
            </Source>
          )}

          {/* Rota (por cima) */}
          {routeGeoJSON && (
            <Source key={Date.now()} type="geojson" data={routeGeoJSON}>
              <Layer
                type="line"
                paint={{
                  'line-color': Red.BASE,
                  'line-width': 6,
                  'line-opacity': 0.8,
                }}
              />
            </Source>
          )}
        </Map>

        <MapLegend />
      </CardContent>
    </StyledCard>
  );
};
