import { DashboardOutlined, Public } from '@mui/icons-material';
import {
  Container,
  IconContainer,
  MenuOpenIcon,
  SidebarHeader,
  SidebarLink,
  SidebarTitle,
} from './styles';
import { matchPath, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/enums/routes';
import { IconButton } from '@mui/material';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { useAppDispatch } from '@/shared/hooks/use-app-dispatch';
import { toggleSidebar } from '@/store/app';

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isSidebarOpen = useAppSelector((store) => store.app.isSidebarOpen);

  const options = [
    {
      name: 'Dashboard',
      icon: <DashboardOutlined />,
      pathname: ROUTES.DASHBOARD,
    },
    { name: 'Predição', icon: <Public />, pathname: ROUTES.ASSESSMENT },
  ];

  const closeSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Container isSidebarOpen={isSidebarOpen}>
      <SidebarHeader>
        <IconButton onClick={closeSidebar}>
          <MenuOpenIcon />
        </IconButton>
      </SidebarHeader>
      {options.map(({ name, icon, pathname }, index) => (
        <SidebarLink
          key={`${name}-${index}`}
          to={pathname}
          title={name}
          active={Boolean(matchPath(pathname, location.pathname))}
        >
          <IconContainer active={Boolean(matchPath(pathname, location.pathname))}>
            {icon}
          </IconContainer>
          <SidebarTitle active={Boolean(matchPath(pathname, location.pathname))}>
            {name}
          </SidebarTitle>
        </SidebarLink>
      ))}
    </Container>
  );
};
