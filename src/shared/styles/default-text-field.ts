import { styled, TextField } from '@mui/material';
import { Gray } from '../colors/gray';

export const DefaultTextField = styled(TextField)({
  backgroundColor: Gray.TEXTFIELD_GRAY,
  borderRadius: '8px',
  '& fieldset': { border: `1px solid ${Gray.BORDER_GRAY}` },
  zIndex: 1,
});
