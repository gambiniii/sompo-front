import { useState } from 'react';
import {
  HeaderContainer,
  HeaderLogo,
  HeaderUser,
  UserImage,
  UserMenuButtonContainer,
  UserName,
  UserOptionsArrowDown,
  UserOptionsArrowUp,
} from './styles';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { logout } from '@/store/auth';
import { useAppDispatch } from '@/shared/hooks/use-app-dispatch';
import { MenuIcon, MenuSidebarAndLogo } from '../Sidebar/styles';
import { toggleSidebar } from '@/store/app';
import { ExitToApp } from '@mui/icons-material';
import SompoLogo from '@/assets/layout_set_logo.png'

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector((store) => store.auth.user?.name);
  const isSidebarOpen = useAppSelector((store) => store.app.isSidebarOpen);
  const [isUserOptionsOpen, setIsUserOptionsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleUserOptionMenu = (target: EventTarget & HTMLButtonElement) => {
    setIsUserOptionsOpen((prev) => !prev);
    setAnchorEl(target);
  };

  const handleCloseOptionMenu = () => {
    setIsUserOptionsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const openSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <HeaderContainer>
      <MenuSidebarAndLogo>
        {!isSidebarOpen && (
          <IconButton onClick={openSidebar}>
            <MenuIcon />
          </IconButton>
        )}
        <HeaderLogo src={SompoLogo} />
      </MenuSidebarAndLogo>
      <HeaderUser>
        <UserImage />
        <UserName>{username}</UserName>
        <UserMenuButtonContainer
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            toggleUserOptionMenu(e.currentTarget)
          }
        >
          {isUserOptionsOpen ? <UserOptionsArrowUp /> : <UserOptionsArrowDown />}
        </UserMenuButtonContainer>
        <Menu
          open={isUserOptionsOpen}
          onClose={handleCloseOptionMenu}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleLogout} disableRipple>
            <ListItemIcon>
              <ExitToApp fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sair</ListItemText>
          </MenuItem>
        </Menu>
      </HeaderUser>
    </HeaderContainer>
  );
};
