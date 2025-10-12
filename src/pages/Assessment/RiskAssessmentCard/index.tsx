import { Box, CardContent, Typography, Zoom, LinearProgress } from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Security,
  Shield,
  GppBad,
} from '@mui/icons-material';
import { PrimaryCard, RiskChip, MetricCard } from '../styles';
import { Red } from '@/shared/colors/red';
import { White } from '@/shared/colors/white';

interface RiskAssessment {
  level: 'low' | 'medium' | 'high';
  percentage: number;
  factors: string[];
}

interface RiskAssessmentCardProps {
  riskAssessment: RiskAssessment | null;
}

export const RiskAssessmentCard = ({ riskAssessment }: RiskAssessmentCardProps) => {
  if (!riskAssessment) return null;

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <Shield sx={{ fontSize: '2rem' }} />;
      case 'medium':
        return <Security sx={{ fontSize: '2rem' }} />;
      case 'high':
        return <GppBad sx={{ fontSize: '2rem' }} />;
      default:
        return <Security sx={{ fontSize: '2rem' }} />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return '#22C55E';
      case 'medium':
        return '#F59E0B';
      case 'high':
        return '#E53E3E';
      default:
        return '#F59E0B';
    }
  };

  return (
    <Zoom in={!!riskAssessment} style={{ transitionDelay: '200ms' }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Card Principal de Risco */}
        <PrimaryCard sx={{ mb: 2, flex: '0 0 auto' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {getRiskIcon(riskAssessment.level)}
              <Typography variant="h6" fontWeight={700} color={White.BASE} fontSize="1rem">
                Análise de Risco
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,

                    background: `conic-gradient(${getRiskColor(riskAssessment.level)} ${
                      riskAssessment.percentage * 3.6
                    }deg, rgba(255,255,255,0.2) 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: 60,
                      height: 60,
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={900}
                    color={White.BASE}
                    sx={{ position: 'relative', zIndex: 1 }}
                  >
                    {riskAssessment.percentage}%
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 1 }}>
                <RiskChip
                  risk={riskAssessment.level}
                  label={`Risco ${
                    riskAssessment.level === 'low'
                      ? 'Baixo'
                      : riskAssessment.level === 'medium'
                      ? 'Médio'
                      : 'Alto'
                  }`}
                  icon={
                    riskAssessment.level === 'low' ? (
                      <CheckCircleIcon />
                    ) : riskAssessment.level === 'medium' ? (
                      <InfoIcon />
                    ) : (
                      <WarningIcon />
                    )
                  }
                />
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={riskAssessment.percentage}
              sx={{
                height: 6,

                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getRiskColor(riskAssessment.level),
                },
              }}
            />
          </CardContent>
        </PrimaryCard>

        {/* Card de Fatores */}
        <MetricCard sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              fontWeight={700}
              color={Red.DARK}
              sx={{ mb: 1.5 }}
            >
              Fatores Identificados
            </Typography>

            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, overflowY: 'auto' }}
            >
              {riskAssessment.factors.slice(0, 6).map((factor, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1,

                    background: `linear-gradient(135deg, ${Red.LIGHT} 0%, ${White.BASE} 100%)`,
                    border: `1px solid ${Red.LIGHT}`,
                  }}
                >
                  <Typography variant="body2" fontWeight={600} color={Red.DARK} fontSize="0.8rem">
                    • {factor}
                  </Typography>
                </Box>
              ))}
            </Box>

            {riskAssessment.level !== 'low' && (
              <Box
                sx={{
                  mt: 1.5,
                  p: 1.5,

                  background:
                    riskAssessment.level === 'high'
                      ? `linear-gradient(135deg, rgba(229, 62, 62, 0.1) 0%, #FEF2F2 100%)`
                      : `linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)`,
                  border: `2px solid ${riskAssessment.level === 'high' ? '#FC8181' : '#FED7AA'}`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '3px',
                    height: '100%',
                    background: riskAssessment.level === 'high' ? '#E53E3E' : '#F59E0B',
                  },
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  color={riskAssessment.level === 'high' ? '#C53030' : '#EA580C'}
                  sx={{ mb: 0.5 }}
                >
                  Recomendação
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={riskAssessment.level === 'high' ? '#9B2C2C' : '#9A3412'}
                  fontSize="0.75rem"
                >
                  {riskAssessment.level === 'medium'
                    ? 'Cautela recomendada. Considere horários alternativos.'
                    : 'Alto risco identificado. Considere rotas alternativas.'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </MetricCard>
      </Box>
    </Zoom>
  );
};
