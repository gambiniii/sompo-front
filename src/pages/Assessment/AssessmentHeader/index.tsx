import { Box, Typography } from '@mui/material';
import { Security, TravelExplore } from '@mui/icons-material';
import { Purple } from '@/shared/colors/purple';
import { White } from '@/shared/colors/white';

export const AssessmentHeader = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        mb: { xs: 4, sm: 6 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle, rgba(155, 89, 182, 0.1) 0%, transparent 70%)`,
          opacity: 0.3,
          zIndex: -1,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            p: 2,

            background: `linear-gradient(135deg, ${Purple.BASE} 0%, #8E44AD 100%)`,
            boxShadow: `0 8px 25px rgba(155, 89, 182, 0.3)`,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 2,

              background: `linear-gradient(135deg, rgba(155, 89, 182, 0.3) 0%, transparent 100%)`,
              opacity: 0.3,
            },
          }}
        >
          <Security sx={{ fontSize: 40, color: White.BASE, position: 'relative', zIndex: 1 }} />
        </Box>

        <Typography
          variant="h3"
          fontWeight={900}
          sx={{
            background: `linear-gradient(135deg, ${Purple.BASE} 0%, #8E44AD 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          }}
        >
          Avaliação de Risco
        </Typography>

        <Box
          sx={{
            p: 2,

            background: `linear-gradient(135deg, #8E44AD 0%, #7D3C98 100%)`,
            boxShadow: `0 8px 25px rgba(155, 89, 182, 0.3)`,
          }}
        >
          <TravelExplore sx={{ fontSize: 40, color: White.BASE }} />
        </Box>
      </Box>

      <Typography
        variant="h6"
        color="#7D3C98"
        fontWeight={600}
        sx={{
          maxWidth: '600px',
          mx: 'auto',
          lineHeight: 1.6,
          fontSize: { xs: '1rem', sm: '1.2rem' },
        }}
      >
        Analise o risco de segurança para sua viagem e receba recomendações personalizadas baseadas
        em dados reais
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {['Análise Geográfica', 'Horário Inteligente', 'Dados em Tempo Real'].map(
          (feature, index) => (
            <Box
              key={index}
              sx={{
                px: 3,
                py: 1,

                background: `linear-gradient(135deg, rgba(155, 89, 182, 0.1) 0%, ${White.BASE} 100%)`,
                border: `1px solid rgba(155, 89, 182, 0.3)`,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#7D3C98',
              }}
            >
              {feature}
            </Box>
          ),
        )}
      </Box>
    </Box>
  );
};
