import * as yup from 'yup';
import { toast } from 'react-toastify';
import { FormContainer, LoginButton } from './styles';
import { useAppDispatch } from '@/shared/hooks/use-app-dispatch';
import { login } from '@/store/auth';
import { LinearProgress } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DefaultTextField } from '@/shared/styles/default-text-field';
import { sompoAuthenticate } from '@/shared/http/sompo-api/auth/sompo-authenticate';

interface IFormInput {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().required('Senha obrigatória'),
});

export const Form: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await sompoAuthenticate(data);

      toast.success('Login realizado com sucesso');
      dispatch(login(response));
    } catch (error: any) {
      if (error.status === 401) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error('Não foi possível realizar o login');
      }
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <DefaultTextField
            type="email"
            placeholder="Entre com seu e-mail"
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isSubmitting}
            {...field}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <DefaultTextField
            type="password"
            placeholder="Senha"
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isSubmitting}
            {...field}
          />
        )}
      />

      <LoginButton type="submit" variant="contained" size="large" disabled={isSubmitting}>
        Entrar
      </LoginButton>

      {isSubmitting && <LinearProgress />}
    </FormContainer>
  );
};
