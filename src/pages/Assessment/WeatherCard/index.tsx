import { Box, CardContent, Typography } from '@mui/material';
import { Cloud, WbSunny, Opacity, AcUnit, Thunderstorm } from '@mui/icons-material';
import { StyledCard } from '../styles';
import { Red } from '@/shared/colors/red';
import { White } from '@/shared/colors/white';

interface WeatherCardProps {
  weather: {
    main: string;
    description: string;
    temp: number;
    icon: string;
  } | null;
}

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  if (!weather) {
    return (
      <StyledCard sx={{ height: 'fit-content' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Cloud sx={{ color: Red.BASE, fontSize: '1.2rem' }} />
            <Typography variant="h6" fontWeight={700} color={Red.DARK} fontSize="1rem">
              Condições Climáticas
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
            Aguardando análise...
          </Typography>
        </CardContent>
      </StyledCard>
    );
  }

  const getWeatherIcon = () => {
    const main = weather.main.toLowerCase();
    if (main.includes('clear') || main.includes('sun')) return <WbSunny />;
    if (main.includes('rain')) return <Opacity />;
    if (main.includes('cloud')) return <Cloud />;
    if (main.includes('snow')) return <AcUnit />;
    if (main.includes('thunder')) return <Thunderstorm />;
    return <Cloud />;
  };

  const getWeatherColor = () => {
    const main = weather.main.toLowerCase();
    if (main.includes('clear')) return '#f59e0b';
    if (main.includes('rain') || main.includes('thunder')) return '#3b82f6';
    if (main.includes('cloud')) return '#6b7280';
    if (main.includes('snow')) return '#60a5fa';
    return '#6b7280';
  };

  return (
    <StyledCard sx={{ height: 'fit-content' }}>
      <CardContent sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              p: 0.75,
              background: `linear-gradient(135deg, ${Red.LIGHT} 0%, ${White.BASE} 100%)`,
              border: `1px solid ${Red.LIGHT}`,
              borderRadius: '8px',
            }}
          >
            <Cloud sx={{ color: Red.BASE, fontSize: '1.1rem' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color={Red.DARK} fontSize="1rem">
            Condições Climáticas
          </Typography>
        </Box>

        {/* Weather Display */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            background: Red.LIGHT,
            borderRadius: '8px',
            border: `1px solid ${Red.MEDIUM}`,
          }}
        >
          <Box
            sx={{
              fontSize: '2.5rem',
              color: getWeatherColor(),
            }}
          >
            {getWeatherIcon()}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={700} color={Red.DARK} fontSize="1.3rem">
              {Math.round(weather.temp)}°C
            </Typography>
            <Typography
              variant="body2"
              color={Red.DARK}
              fontSize="0.75rem"
              sx={{ textTransform: 'capitalize' }}
            >
              {weather.description}
            </Typography>
          </Box>
        </Box>

        {/* Weather Impact */}
        <Box
          sx={{
            mt: 1.5,
            p: 1,
            background: White.BASE,
            borderRadius: '6px',
            border: `1px solid ${Red.LIGHT}`,
          }}
        >
          <Typography variant="caption" color={Red.DARK} fontWeight={600} fontSize="0.7rem">
            Impacto no Risco de Acidentes
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary" fontSize="0.65rem">
            {weather.main.toLowerCase().includes('rain') ||
            weather.main.toLowerCase().includes('thunder')
              ? '⚠️ Aumenta significativamente o risco'
              : weather.main.toLowerCase().includes('cloud')
              ? '⚡ Impacto moderado no risco'
              : '✅ Condições favoráveis'}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};
