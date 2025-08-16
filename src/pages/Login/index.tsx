import { Typography } from '@mui/material';
import {
  Container,
  ForgotPasswordButton,
  LoginContainer,
  LoginFormContainer,
  LoginPageImage,
  LoginPageImageContainer,
  Title,
} from './styles';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { Form } from './Form';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/enums/routes';
import LoginImage from '@/assets/login_image.png';

const LoginPage: React.FC = () => {
  const user = useAppSelector((store) => store.auth.user);
  const forgotPasswordUrl = import.meta.env.VITE_FORGOT_PASSWORD_URL;

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} />;
  }

  return (
    <Container>
      <LoginPageImageContainer>
        <LoginPageImage src={LoginImage} />
      </LoginPageImageContainer>
      <LoginContainer>
        <LoginFormContainer>
          <Title>Entrar</Title>
          <Typography>Use suas credenciais de acesso</Typography>
          <Form />
          <ForgotPasswordButton to={forgotPasswordUrl}>Esqueceu sua senha?</ForgotPasswordButton>
        </LoginFormContainer>
      </LoginContainer>
    </Container>
  );
};

export default LoginPage;
