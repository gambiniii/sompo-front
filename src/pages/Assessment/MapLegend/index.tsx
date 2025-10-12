import { Blue } from '@/shared/colors/blue';
import { Red } from '@/shared/colors/red';
import { Box, Typography } from '@mui/material';

export const MapLegend = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        bgcolor: 'white',
        p: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="caption" fontWeight={600} gutterBottom display="block">
        Legenda de Risco
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              bgcolor: Blue.STRONG_BLUE,
            }}
          />
          <Typography variant="caption">Roubo de carga</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              bgcolor: Red.BASE,
            }}
          />
          <Typography variant="caption">Acidente de Trânsito</Typography>
        </Box>
      </Box>
    </Box>
  );
};
