import { Box, List, ListItem, ListItemText, Chip, Typography } from "@mui/material";
import { useSelector } from "react-redux";

export default function AlertsSummary() {
  const alerts = useSelector((state) => state.alerts.alerts);
  const openAlerts = alerts.filter((alert) => alert.status === "Open").slice(0, 5);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "error";
      case "High":
        return "warning";
      case "Medium":
        return "info";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  if (openAlerts.length === 0) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <Typography variant="body1" color="text.secondary">
          No active alerts
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: "100%", maxHeight: 300, overflow: "auto" }}>
      {openAlerts.map((alert) => (
        <ListItem key={alert.id} divider>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {alert.alertType}
                </Typography>
                <Chip label={alert.severity} size="small" color={getSeverityColor(alert.severity)} />
              </Box>
            }
            secondary={
              <Box>
                <Typography variant="caption" display="block">
                  {alert.facilityName} - {alert.deviceType}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {alert.message}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
} 