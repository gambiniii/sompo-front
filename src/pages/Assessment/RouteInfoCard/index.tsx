import { Box, CardContent, Typography, Paper, Fade } from '@mui/material';
import { Route as RouteIcon, Schedule, AttachMoney, Straighten } from '@mui/icons-material';
import { StyledCard, MetricCard } from '../styles';
import { Red } from '@/shared/colors/red';
import { White } from '@/shared/colors/white';

interface RouteInfo {
  distance: string;
  duration: string;
  estimatedCost: string;
}

interface RouteInfoCardProps {
  routeInfo: RouteInfo | null;
}

export const RouteInfoCard = ({ routeInfo }: RouteInfoCardProps) => {
  if (!routeInfo) return null;

  const metrics = [
    {
      icon: <Straighten />,
      value: routeInfo.distance,
      label: 'Distância',
      color: Red.BASE
    },
    {
      icon: <Schedule />,
      value: routeInfo.duration,
      label: 'Duração',
      color: Red.DARK
    },
    {
      icon: <AttachMoney />,
      value: routeInfo.estimatedCost,
      label: 'Custo Est.',
      color: Red.DARKER
    }
  ];

  return (
    <Fade in={!!routeInfo} style={{ transitionDelay: '100ms' }}>
      <StyledCard>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              p: 1.5,
              background: `linear-gradient(135deg, ${Red.LIGHT} 0%, ${White.BASE} 100%)`,
              border: `1px solid ${Red.LIGHT}`
            }}>
              <RouteIcon sx={{ color: Red.BASE, fontSize: '1.5rem' }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color={Red.DARK}>
              📍 Informações da Rota
            </Typography>
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: 2
          }}>
            {metrics.map((metric, index) => (
              <MetricCard key={index} sx={{
                p: 2.5,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${metric.color} 0%, ${Red.MEDIUM} 100%)`,
                }
              }}>
                <Box sx={{ mb: 1, color: metric.color }}>
                  {metric.icon}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={metric.color}
                  sx={{ mb: 0.5 }}
                >
                  {metric.value}
                </Typography>
                <Typography
                  variant="caption"
                  color={Red.DARK}
                  fontWeight={600}
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  {metric.label}
                </Typography>
              </MetricCard>
            ))}
          </Box>
        </CardContent>
      </StyledCard>
    </Fade>
  );
};