import { forwardRef } from 'react';
import { FC, PropsWithChildren } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { LinkProps } from '@mui/material/Link';
import { ptBR } from 'date-fns/locale/pt-BR';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useAppSelector } from './shared/hooks/use-app-selector';
import { ToastContainer, Slide } from 'react-toastify';
import { White } from './shared/colors/white';

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

export const AppTheme: FC<PropsWithChildren> = ({ children }) => {
  const appTheme = useAppSelector((state) => state.app.theme);

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1rem',
      },
    },
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        } as LinkProps,
      },
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehavior,
        },
      },
    },
    palette: {
      mode: appTheme,
      primary: {
        main: '#31b0c8',
        contrastText: White.BASE,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <CssBaseline />
        {children}
        <ToastContainer transition={Slide} theme={appTheme} />
      </LocalizationProvider>
    </ThemeProvider>
  );
};
