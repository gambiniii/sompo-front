import { Button, styled } from '@mui/material';
import { Red } from '../colors/red';

interface Props {
  width?: string;
}

export const PrimaryButton = styled(Button)(({ width }: Props) => ({
  height: '40px',
  width: width ?? '150px',
  borderRadius: '8px',
  textTransform: 'initial',
  fontSize: '16px',
  fontWeight: 500,
  backgroundColor: Red.BASE,
}));
