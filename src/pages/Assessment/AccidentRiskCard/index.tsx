import { Box, CardContent, Typography, Chip } from '@mui/material';
import { DirectionsCar, Warning, CheckCircle, Error, Cloud } from '@mui/icons-material';
import { StyledCard } from '../styles';
import { Red } from '@/shared/colors/red';
import { White } from '@/shared/colors/white';

interface AccidentRiskCardProps {
  accidentRisk: {
    risk_score: number;
    risk_category: 'BAIXO' | 'MÉDIO' | 'ALTO' | 'CRÍTICO';
    weather_condition: string;
    weather_multiplier: number;
    critical_segments: any[];
    spatial_risk_max: number;
    temporal_multiplier: number;
  } | null;
}

export const AccidentRiskCard = ({ accidentRisk }: AccidentRiskCardProps) => {
  if (!accidentRisk) {
    return (
      <StyledCard sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <DirectionsCar sx={{ color: Red.BASE, fontSize: '1.2rem' }} />
            <Typography variant="h6" fontWeight={700} color={Red.DARK} fontSize="1rem">
              Risco de Acidentes
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Aguardando análise...
          </Typography>
        </CardContent>
      </StyledCard>
    );
  }

  const getRiskColor = () => {
    switch (accidentRisk.risk_category) {
      case 'BAIXO':
        return '#10b981';
      case 'MÉDIO':
        return '#f59e0b';
      case 'ALTO':
        return '#ef4444';
      case 'CRÍTICO':
        return '#991b1b';
      default:
        return Red.BASE;
    }
  };

  const getRiskIcon = () => {
    switch (accidentRisk.risk_category) {
      case 'BAIXO':
        return <CheckCircle />;
      case 'MÉDIO':
        return <Warning />;
      case 'ALTO':
      case 'CRÍTICO':
        return <Error />;
      default:
        return <Warning />;
    }
  };

  const percentage = Math.round(accidentRisk.risk_score * 100);

  return (
    <StyledCard sx={{ height: '100%' }}>
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
            <DirectionsCar sx={{ color: Red.BASE, fontSize: '1.1rem' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color={Red.DARK} fontSize="1rem">
            Risco de Acidentes
          </Typography>
        </Box>

        {/* Score principal */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `conic-gradient(${getRiskColor()} ${percentage}%, ${Red.LIGHT} ${percentage}%)`,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: White.BASE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              {getRiskIcon()}
              <Typography variant="h6" fontWeight={700} color={getRiskColor()} fontSize="1.1rem">
                {percentage}%
              </Typography>
            </Box>
          </Box>
          <Chip
            label={accidentRisk.risk_category}
            sx={{
              backgroundColor: getRiskColor(),
              color: White.BASE,
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        {/* Detalhes */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            sx={{
              p: 1,
              background: Red.LIGHT,
              borderRadius: '6px',
              border: `1px solid ${Red.MEDIUM}`,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Cloud sx={{ fontSize: '0.9rem', color: Red.DARK }} />
            <Box>
              <Typography variant="caption" color={Red.DARK} fontWeight={600} fontSize="0.7rem">
                {accidentRisk.weather_condition || 'Não especificado'}
              </Typography>
              {accidentRisk.weather_multiplier > 1.0 && (
                <Typography variant="caption" display="block" color={Red.DARK} fontSize="0.65rem">
                  Fator: {accidentRisk.weather_multiplier.toFixed(2)}x
                </Typography>
              )}
            </Box>
          </Box>

          {accidentRisk.critical_segments.length > 0 && (
            <Box
              sx={{
                p: 1,
                background: Red.LIGHT,
                borderRadius: '6px',
                border: `1px solid ${Red.MEDIUM}`,
              }}
            >
              <Typography variant="caption" color={Red.DARK} fontWeight={600} fontSize="0.7rem">
                🔴 {accidentRisk.critical_segments.length} trecho(s) crítico(s)
              </Typography>
            </Box>
          )}

          {accidentRisk.weather_multiplier > 1.3 && (
            <Box
              sx={{
                p: 1,
                background: Red.LIGHT,
                borderRadius: '6px',
                border: `1px solid ${Red.MEDIUM}`,
              }}
            >
              <Typography variant="caption" color={Red.DARK} fontSize="0.7rem">
                🌧️ Condições climáticas adversas
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};
