import { Box, CardContent, Typography, LinearProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Search as SearchIcon, Schedule, TravelExplore, LocalShipping } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { StyledCard, StyledButton } from '../styles';
import { Red } from '@/shared/colors/red';
import { White } from '@/shared/colors/white';

interface TripConfigCardProps {
  departureDate: Date | null;
  setDepartureDate: (date: Date | null) => void;
  cargoType: string;
  setCargoType: (type: string) => void;
  handleSearchRoute: () => void;
  isLoading: boolean;
  from: string;
  to: string;
}

const CARGO_TYPES = [
  'Cargas Fracionadas',
  'Cigarros',
  'Medicamentos',
  'Alimentício',
  'Eletroeletrônicos',
  'Peças/Autopeças',
  'Higiene/Cosmético',
  'Produto p/ Saúde',
  'Minérios',
  'Agrícola',
  'Bebidas',
];

export const TripConfigCard = ({
  departureDate,
  setDepartureDate,
  cargoType,
  setCargoType,
  handleSearchRoute,
  isLoading,
  from,
  to,
}: TripConfigCardProps) => {
  return (
    <StyledCard sx={{ position: 'relative', overflow: 'hidden', height: 'fit-content' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              p: 0.75,
              background: `linear-gradient(135deg, ${Red.LIGHT} 0%, ${White.BASE} 100%)`,
              border: `1px solid ${Red.LIGHT}`,
            }}
          >
            <TravelExplore sx={{ color: Red.BASE, fontSize: '1.1rem' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color={Red.DARK} fontSize="1rem">
            Configuração da Viagem
          </Typography>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocalShipping sx={{ color: Red.BASE, fontSize: '1rem' }} />
            <Typography variant="subtitle2" fontWeight={600} color={Red.DARK} fontSize="0.85rem">
              Tipo de carga
            </Typography>
          </Box>
          <FormControl fullWidth size="medium">
            <InputLabel sx={{ '&.Mui-focused': { color: Red.BASE } }}>Tipo de Carga</InputLabel>
            <Select
              value={cargoType}
              label="Tipo de Carga"
              onChange={(e) => setCargoType(e.target.value)}
              sx={{
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: Red.MEDIUM,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: Red.BASE,
                },
              }}
            >
              {CARGO_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Schedule sx={{ color: Red.BASE, fontSize: '1rem' }} />
            <Typography variant="subtitle2" fontWeight={600} color={Red.DARK} fontSize="0.85rem">
              Data e hora
            </Typography>
          </Box>
          <DateTimePicker
            label="Data e Hora da Viagem"
            value={departureDate}
            onChange={(newValue) => setDepartureDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
                size: 'medium',
                sx: {
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: Red.MEDIUM,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: Red.BASE,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: Red.BASE,
                  },
                },
              },
            }}
            ampm={false}
          />
        </Box>

        <StyledButton
          fullWidth
          variant="contained"
          size="small"
          startIcon={<SearchIcon />}
          onClick={handleSearchRoute}
          disabled={isLoading || !from || !to}
          sx={{
            py: 1.25,
            fontSize: '0.9rem',
            boxShadow: `0 4px 16px rgba(239, 68, 68, 0.25)`,
          }}
        >
          {isLoading ? 'Analisando...' : 'Analisar Risco'}
        </StyledButton>

        {isLoading && (
          <Box sx={{ mt: 1.5 }}>
            <LinearProgress
              sx={{
                height: 3,

                backgroundColor: Red.LIGHT,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: Red.BASE,
                },
              }}
            />
            <Box
              sx={{
                mt: 1,
                p: 1,

                background: `linear-gradient(135deg, ${Red.LIGHT} 0%, ${White.BASE} 100%)`,
                border: `1px solid ${Red.LIGHT}`,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" fontWeight={600} color={Red.DARK} fontSize="0.8rem">
                Calculando risco...
              </Typography>
              <Typography
                variant="caption"
                color={Red.DARK}
                sx={{ opacity: 0.8, fontSize: '0.7rem' }}
              >
                Analisando dados
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};
