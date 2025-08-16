import { Red } from '@/shared/colors/red';
import { HEADER_HEIGHT } from '@/shared/config/layouts';
import { Box, Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';

export const Container = styled(Box)({
  display: 'flex',
  width: '100%',
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
});

export const LoginPageImageContainer = styled(Box)({
  display: 'flex',
  width: '80%',
  height: '100%',
});

export const LoginPageImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const LoginContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

export const LoginFormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '500px',
  marginTop: '20%',
});

export const Title = styled(Typography)({
  fontWeight: 600,
  fontSize: 32,
});

export const ForgotPasswordButton = styled(Link)({
  padding: 0,
  width: '200px',
  fontWeight: 600,
  color: Red.BASE,
  textDecoration: 'none',
  ':hover': {
    cursor: 'pointer',
  },
});
