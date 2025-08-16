import { Red } from '@/shared/colors/red';
import { PrimaryButton } from '@/shared/styles/primary-button';
import { styled } from '@mui/material';

export const FormContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '35px 0',
  gap: '10px',
});

export const LoginButton = styled(PrimaryButton)({
  height: '50px',
  borderRadius: '8px',
  backgroundColor: Red.BASE,
  textTransform: 'capitalize',
  fontSize: '18px',
});
