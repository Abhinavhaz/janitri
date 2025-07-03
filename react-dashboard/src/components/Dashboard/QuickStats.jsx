import { Grid, Paper, Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Devices, Warning, Assignment, Business } from "@mui/icons-material";

export default function QuickStats() {
  const devices = useSelector((state) => state.devices.devices);
  const alerts = useSelector((state) => state.alerts.alerts);
  const contracts = useSelector((state) => state.contracts.contracts);
  const facilities = useSelector((state) => state.facilities.facilities);

  const onlineDevices = devices.filter((device) => device.status === "Online").length;
  const openAlerts = alerts.filter((alert) => alert.status === "Open").length;
  const expiringContracts = contracts.filter((contract) => contract.status === "Expiring Soon").length;

  const stats = [
    {
      title: "Total Devices",
      value: devices.length,
      subtitle: `${onlineDevices} Online`,
      icon: Devices,
      color: "#1976d2",
    },
    {
      title: "Active Alerts",
      value: openAlerts,
      subtitle: "Require Attention",
      icon: Warning,
      color: "#d32f2f",
    },
    {
      title: "Contracts",
      value: contracts.length,
      subtitle: `${expiringContracts} Expiring Soon`,
      icon: Assignment,
      color: "#ed6c02",
    },
    {
      title: "Facilities",
      value: facilities.length,
      subtitle: "Active Locations",
      icon: Business,
      color: "#2e7d32",
    },
  ];

  return (
    <Grid container spacing={3} >
      {stats.map((stat, index) => (
       <Grid item xs={12} sm={6} md={3} key={index}>
       <Paper
         sx={{
           p: 2,
           display: "flex",
           flexDirection: "row",
           alignItems: "center",
           justifyContent: "space-between",
           height: { xs: 160, sm: 180 }, // Adjusted for small screens
           width:  { xs: "65vw", md:"100%" }, // Ensure it fills the grid space
           boxSizing: "border-box",
         }}
       >
         <Box sx={{ flexGrow: 1 }}>
           <Typography
             variant="h4"
             component="div"
             sx={{
               fontSize: {
                 xs: "1.4rem", // mobile
                 sm: "1.6rem", // tablet
                 md: "2rem",   // desktop
               },
               color: stat.color,
               fontWeight: 600,
             }}
           >
             {stat.value}
           </Typography>
           <Typography
             variant="h6"
             sx={{
               fontSize: { xs: "1rem", sm: "1.2rem" },
               color: "text.primary",
             }}
           >
             {stat.title}
           </Typography>
           <Typography variant="body2" color="text.secondary">
             {stat.subtitle}
           </Typography>
         </Box>
         <stat.icon
           sx={{
             fontSize: { xs: 40, sm: 48 },
             color: stat.color,
             opacity: 0.7,
           }}
         />
       </Paper>
     </Grid>
     
      ))}
    </Grid>
  );
} 