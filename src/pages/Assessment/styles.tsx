import { Card, Button, Chip, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Red } from '@/shared/colors/red';
import { White } from '@/shared/colors/white';
import { Gray } from '@/shared/colors/gray';

export const StyledCard = styled(Card)(() => ({
  background: `linear-gradient(135deg, ${White.BASE} 0%, ${White.SOLITUDE} 100%)`,
  border: `1px solid ${Red.LIGHT}`,
  boxShadow: `0 10px 40px rgba(239, 68, 68, 0.08)`,
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${Red.BASE} 0%, ${Red.DARK} 100%)`,
  },
}));

export const PrimaryCard = styled(Card)(() => ({
  background: `linear-gradient(135deg, ${Red.BASE} 0%, ${Red.DARK} 100%)`,
  color: White.BASE,
  boxShadow: `0 15px 50px rgba(239, 68, 68, 0.25)`,
  overflow: 'hidden',
}));

export const StyledButton = styled(Button)(() => ({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1.1rem',
  padding: '16px 32px',
  background: `linear-gradient(135deg, ${Red.BASE} 0%, ${Red.DARK} 100%)`,
  border: 'none',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
  },
  '&:disabled': {
    backgroundColor: Gray.SILVER_SAND,
    color: Gray.BASE,
    transform: 'none',
    boxShadow: 'none',
    background: Gray.SILVER_SAND,
  },
}));

export const RiskChip = styled(Chip)<{ risk: 'low' | 'medium' | 'high' }>(({ risk }) => {
  const colors = {
    low: {
      bg: `linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, #F0FDF4 100%)`,
      color: '#166534',
      icon: '#22C55E',
      border: '#BBF7D0'
    },
    medium: {
      bg: `linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, #FFFBEB 100%)`,
      color: '#EA580C',
      icon: '#FB923C',
      border: '#FED7AA'
    },
    high: {
      bg: `linear-gradient(135deg, rgba(229, 62, 62, 0.1) 0%, #FEF2F2 100%)`,
      color: '#9B2C2C',
      icon: '#E53E3E',
      border: '#FC8181'
    },
  };

  const safeRisk = risk || 'medium';
  const colorConfig = colors[safeRisk] || colors.medium;

  return {
    background: colorConfig.bg,
    color: colorConfig.color,
    fontWeight: 700,
    fontSize: '0.9rem',
    padding: '8px 16px',
    border: `2px solid ${colorConfig.border}`,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    '& .MuiChip-icon': {
      color: colorConfig.icon,
      fontSize: '1.2rem',
    },
  };
});

export const GradientBox = styled(Box)(() => ({
  background: `linear-gradient(135deg, ${Red.LIGHT} 0%, ${White.BASE} 50%, ${Red.LIGHT} 100%)`,
  padding: '2rem',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `conic-gradient(from 0deg, ${Red.LIGHT}, ${Red.MEDIUM}, ${Red.LIGHT})`,
    animation: 'rotate 20s linear infinite',
    opacity: 0.1,
  },
  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}));

export const MetricCard = styled(Card)(() => ({
  background: White.BASE,
  border: `2px solid ${Red.LIGHT}`,
  boxShadow: `0 8px 25px rgba(239, 68, 68, 0.1)`,
  position: 'relative',
  overflow: 'hidden',
}));