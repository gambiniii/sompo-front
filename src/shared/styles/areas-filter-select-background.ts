import { styled } from '@mui/material';

export const SelectBackground = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
  width: '15%',

  '& h2': {
    margin: 0,
    fontSize: '1rem',
  },

  '& .MuiInputBase-root': {
    minWidth: '50%',
  },
});
