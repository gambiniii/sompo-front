import { Map, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import { cellToBoundary } from 'h3-js';
import { Select, MenuItem, FormControl, InputLabel, CircularProgress, Box } from '@mui/material';
import { toast } from 'react-toastify';
import {
  getAccidentsHeatmap,
  H3Cell,
} from '@/shared/http/sompo-api/heatmap/get-accidents-heatmap.request';
import { getTheftsHeatmap } from '@/shared/http/sompo-api/heatmap/get-thefts-heatmap.request';
import { TheftChart } from './TheftChart';
import { AccidentsChart } from './AccidentsChart';
import { SP_CENTER } from '@/shared/config/sp_center';

type HeatmapType = 'accidents' | 'thefts' | 'all';

export const DashboardComponent = () => {
  const [heatmapType, setHeatmapType] = useState<HeatmapType>('all');
  const [accidentsCells, setAccidentsCells] = useState<H3Cell[]>([]);
  const [theftsCells, setTheftsCells] = useState<H3Cell[]>([]);
  const [isLoadingHeatmap, setIsLoadingHeatmap] = useState(false);

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingHeatmap(true);
      try {
        const [accidentsHeat, theftsHeat] = await Promise.all([
          getAccidentsHeatmap(2000),
          getTheftsHeatmap(2000),
        ]);
        setAccidentsCells(accidentsHeat.cells);
        setTheftsCells(theftsHeat.cells);
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar dados');
      } finally {
        setIsLoadingHeatmap(false);
      }
    };

    loadData();
  }, []);

  const getH3GeoJSON = () => {
    let cellsToShow: H3Cell[] = [];
    if (heatmapType === 'accidents') cellsToShow = accidentsCells;
    else if (heatmapType === 'thefts') cellsToShow = theftsCells;
    else cellsToShow = [...accidentsCells, ...theftsCells];

    return {
      type: 'FeatureCollection' as const,
      features: cellsToShow.map((cell) => ({
        type: 'Feature' as const,
        properties: {
          h3_id: cell.h3_id,
          count: cell.count,
          intensity: cell.intensity,
          cellType: cell.type,
        },
        geometry: { type: 'Polygon' as const, coordinates: [cellToBoundary(cell.h3_id, true)] },
      })),
    };
  };

  const cellsToDisplay =
    heatmapType === 'accidents'
      ? accidentsCells
      : heatmapType === 'thefts'
      ? theftsCells
      : [...accidentsCells, ...theftsCells];

  return (
    <div style={{ display: 'flex', height: '80vh', gap: '20px' }}>
      {/* Container dos Gráficos */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Acidentes por mês */}
        <AccidentsChart />

        {/* Roubos por mês */}
        <TheftChart />
      </div>

      {/* Mapa */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
            backgroundColor: 'white',
            borderRadius: 2,
            padding: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Visualização H3</InputLabel>
            <Select
              value={heatmapType}
              label="Visualização H3"
              onChange={(e) => setHeatmapType(e.target.value as HeatmapType)}
              disabled={isLoadingHeatmap}
            >
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
          {!isLoadingHeatmap && cellsToDisplay.length > 0 && (
            <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary', textAlign: 'center' }}>
              {cellsToDisplay.length} células H3
            </Box>
          )}
        </Box>

        <Map
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={SP_CENTER}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          mapStyle="mapbox://styles/mapbox/light-v11"
        >
          {!isLoadingHeatmap && cellsToDisplay.length > 0 && (
            <Source id="h3-cells" type="geojson" data={getH3GeoJSON()}>
              <Layer
                id="h3-cells-fill"
                type="fill"
                paint={{
                  'fill-color': [
                    'case',
                    ['==', heatmapType, 'all'],
                    [
                      'case',
                      ['==', ['get', 'cellType'], 'accident'],
                      [
                        'interpolate',
                        ['linear'],
                        ['get', 'intensity'],
                        0,
                        '#FFA500',
                        5,
                        '#FF6347',
                        10,
                        '#DC143C',
                      ],
                      [
                        'interpolate',
                        ['linear'],
                        ['get', 'intensity'],
                        0,
                        '#9370DB',
                        10,
                        '#8B008B',
                        20,
                        '#4B0082',
                      ],
                    ],
                    ['==', heatmapType, 'accidents'],
                    [
                      'interpolate',
                      ['linear'],
                      ['get', 'intensity'],
                      0,
                      '#FFA500',
                      5,
                      '#FF6347',
                      10,
                      '#DC143C',
                    ],
                    [
                      'interpolate',
                      ['linear'],
                      ['get', 'intensity'],
                      0,
                      '#9370DB',
                      10,
                      '#8B008B',
                      20,
                      '#4B0082',
                    ],
                  ],
                  'fill-opacity': 0.6,
                }}
              />
              <Layer
                id="h3-cells-line"
                type="line"
                paint={{ 'line-color': '#ffffff', 'line-width': 0.5, 'line-opacity': 0.8 }}
              />
            </Source>
          )}
        </Map>
      </div>
    </div>
  );
};
