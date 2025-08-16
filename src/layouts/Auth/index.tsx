import { Outlet } from 'react-router-dom';
import { Header, HeaderLogo, Page } from './styles';
import SompoHeaderLogo from '@/assets/layout_set_logo.png'

export const AuthLayout: React.FC = () => {
  return (
    <Page>
      <Header>
        <HeaderLogo src={SompoHeaderLogo} />
      </Header>
      <Outlet />
    </Page>
  );
};
