import { Container, Grid, Paper, Typography } from "@mui/material";
import Layout from "../components/Layout/Layout";
import DeviceStatusChart from "../components/Dashboard/DeviceStatusChart";
import AlertsSummary from "../components/Dashboard/AlertsSummary";
import RecentActivities from "../components/Dashboard/RecentActivities";
import QuickStats from "../components/Dashboard/QuickStats";

export default function Home() {
  return (
    <Layout>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
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