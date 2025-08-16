import { Box, styled } from '@mui/material';
import { White } from '../../shared/colors/white';
import { Gray } from '../../shared/colors/gray';
import { HEADER_HEIGHT } from '../../shared/config/layouts';

export const Page = styled(Box)({
  height: '100vh',
  width: '100%',
  background: White.BASE,
});

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: HEADER_HEIGHT,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(0, 2),
  border: `solid ${Gray.BASE}`,
}));

export const HeaderLogo = styled('img')({
  width: '230px',
  height: '50px',
  marginLeft: '12.5%',
});
