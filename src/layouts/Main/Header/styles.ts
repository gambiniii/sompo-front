import { HEADER_HEIGHT } from '@/shared/config/layouts';
import { White } from '@/shared/colors/white';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Avatar, Box, IconButton, styled, Typography } from '@mui/material';
import { Gray } from '@/shared/colors/gray';

export const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  height: HEADER_HEIGHT,
  backgroundColor: White.BASE,
  borderBottom: `1px solid ${Gray.BASE}`,
  justifyContent: 'space-between',
}));

export const HeaderLogo = styled('img')({
  width: '230px',
  height: '50px',
  marginLeft: '25px',
});

export const HeaderUser = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginRight: '25px',
});

export const UserImage = styled(Avatar)({});

export const UserName = styled(Typography)({
  fontWeight: 500,
});

export const UserOptionsArrowDown = styled(KeyboardArrowDown)({
  cursor: 'pointer',
});

export const UserOptionsArrowUp = styled(KeyboardArrowUp)({
  cursor: 'pointer',
});

export const UserMenuButtonContainer = styled(IconButton)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
