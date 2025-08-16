import { Box, Typography, styled } from "@mui/material";
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from "@/shared/config/layouts";

interface MainContainerProps {
  isSidebarOpen: boolean;
}

export const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  backgroundColor: theme.palette.background.default,
}));

export const Content = styled("main")(({ theme }) => ({
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  overflowY: "auto",
  backgroundColor: theme.palette.background.paper,
  padding: "35px 80px",
}));

export const MainContainer = styled(Box)(
  ({ isSidebarOpen }: MainContainerProps) => ({
    position: "fixed",
    width: isSidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : "100%",
    minHeight: "100vh",
    transition: "width 0.1s linear",
    right: 0,
  })
);

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: 34,
  fontWeight: "bold",
  marginBottom: theme.spacing(3),
}));
