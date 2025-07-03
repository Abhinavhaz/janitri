import { Container, Grid, Paper, Typography } from "@mui/material";
import Layout from "../components/Layout/Layout";
import DeviceStatusChart from "../components/Dashboard/DeviceStatusChart";
import AlertsSummary from "../components/Dashboard/AlertsSummary";
import RecentActivities from "../components/Dashboard/RecentActivities";
import QuickStats from "../components/Dashboard/QuickStats";

export default function Home() {
  return (
    <Layout>
      <Container maxWidth="xl" sx={{
    marginTop: {
      xs: "-50px",   // for mobile screens
      sm: "-10px",   // for tablets
      md: "-50px",  // for desktop and up
    }
    ,
    // width: "100vw",
    minHeight: "100vh",
    overflowY: "auto",
  }}>
        <Typography
  variant="h4"
  gutterBottom
  sx={{
    fontSize: {
      xs: "1.2rem", // mobile
      sm: "1.5rem", // tablet
      md: "2rem",   // small desktop
      lg: "2.4rem", // large screen
    },
    fontWeight: 600,
    textAlign: { xs: "center", sm: "left" }, // optional
  }}
>
  Medical Device Management Dashboard
</Typography>


        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12}>
            <QuickStats />
          </Grid>

          {/* Device Status Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Device Status Overview
              </Typography>
              <DeviceStatusChart />
            </Paper>
          </Grid>

          {/* Alerts Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Active Alerts
              </Typography>
              <AlertsSummary />
            </Paper>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <RecentActivities />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
} 