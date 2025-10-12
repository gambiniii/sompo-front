import { Box, styled, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from "@/shared/config/layouts";
import { Menu, MenuOpen } from "@mui/icons-material";
import { Gray } from "@/shared/colors/gray";
import { White } from "@/shared/colors/white";
import { Black } from "@/shared/colors/black";
import { Red } from "@/shared/colors/red";

export interface ContainerProps {
  isSidebarOpen: boolean;
}

export const Container = styled(Box)(({ isSidebarOpen }: ContainerProps) => ({
  position: isSidebarOpen ? "relative" : "absolute",
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  minWidth: SIDEBAR_WIDTH,
  border: `1px solid ${Gray.BASE}`,
  padding: "10px 30px",
  transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
  transition: "0.3s ease-in",
}));

interface StyledLinkProps {
  active?: boolean;
}

export const SidebarLink = styled(Link, {
  shouldForwardProp: (prop) => !["active"].includes(prop as string),
})<StyledLinkProps>(({ active = false }) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  color: active ? White.BASE : Black.BASE,
  transition: "all .3s",
  padding: "15px 5px",
  textDecoration: "none",
  gap: "12px",
  borderRadius: "8px",
}));

export const MenuOpenIcon = styled(MenuOpen)({
  height: "28px",
  width: "28px",
  cursor: "pointer",
  color: Black.BASE,
});

export const IconContainer = styled("div", {
  shouldForwardProp: (prop) => !["active"].includes(prop as string),
})<StyledLinkProps>(({ active = false }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px",
  backgroundColor: active ? Red.BASE : Gray.BACKGROUND_SIDEBAR_GRAY,
  borderRadius: "10px",
}));

export const SidebarHeader = styled("div")({
  display: "flex",
  alignItems: "center",
  height: HEADER_HEIGHT,
  marginBottom: "20px",
});

export const SidebarTitle = styled(Typography, {
  shouldForwardProp: (prop) => !["active"].includes(prop as string),
})<StyledLinkProps>(({ active = false }) => ({
  color: active ? Red.BASE : Black.BASE,
  fontSize: "18px",
  fontWeight: active ? 600 : 400,
}));

export const MenuIcon = styled(Menu)({
  cursor: "pointer",
  color: Black.BASE,
  height: "25px",
  width: "25px",
});

export const MenuSidebarAndLogo = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
});
