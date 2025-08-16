import { Outlet } from 'react-router-dom';
import { Container, Content, MainContainer } from './styles';
import { Sidebar } from './Sidebar';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { Header } from './Header';

export const MainLayout = () => {
  const isSidebarOpen = useAppSelector((store) => store.app.isSidebarOpen);

  return (
    <Container>
      <Sidebar />
      <MainContainer isSidebarOpen={isSidebarOpen}>
        <Header />
        <Content>
          <Outlet />
        </Content>
      </MainContainer>
    </Container>
  );
};
