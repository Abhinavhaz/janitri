import { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Switch,
  FormControlLabel,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Devices,
  Build,
  Assignment,
  Warning,
  Business,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: Dashboard, path: "/" },
  { text: "Device Inventory", icon: Devices, path: "/devices" },
  { text: "Installations", icon: Build, path: "/installations" },
  { text: "Service Visits", icon: Assignment, path: "/services" },
  { text: "Contracts", icon: Assignment, path: "/contracts" },
  { text: "Alerts", icon: Warning, path: "/alerts" },
  { text: "Facilities", icon: Business, path: "/facilities" },
];

// Stub for theme context
const useTheme = () => ({ darkMode: false, toggleTheme: () => {} });

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const alerts = useSelector((state) => state.alerts.alerts);
  const openAlerts = alerts.filter((alert) => alert.status === "Open").length;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          MedDevice Admin
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton selected={location.pathname === item.path} onClick={() => navigate(item.path)}>
              <ListItemIcon>
                {item.text === "Alerts" ? (
                  <Badge badgeContent={openAlerts} color="error">
                    <item.icon />
                  </Badge>
                ) : (
                  <item.icon />
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Medical Device Management System
          </Typography>
          <FormControlLabel
              control={
                <Switch checked={darkMode} onChange={toggleTheme} icon={<Brightness7 />} checkedIcon={<Brightness4 />} />
              }
              label=""
            />
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 