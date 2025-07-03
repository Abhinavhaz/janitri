import { Box, List, ListItem, ListItemText, Typography, Chip } from "@mui/material";
import { useSelector } from "react-redux";

export default function RecentActivities() {
  const services = useSelector((state) => state.services.visits);
  const installations = useSelector((state) => state.installations.installations);

  // Combine and sort recent activities
  const activities = [
    ...services.map((service) => ({
      id: service.id,
      type: "Service Visit",
      description: `${service.purpose} - ${service.deviceType} at ${service.facilityName}`,
      date: service.visitDate,
      status: service.status,
      engineer: service.engineer,
    })),
    ...installations.map((installation) => ({
      id: installation.id,
      type: "Installation",
      description: `${installation.deviceType} installation at ${installation.facilityName}`,
      date: installation.installationDate,
      status: installation.status,
      engineer: installation.engineer,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "warning";
      case "Scheduled":
        return "info";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <List sx={{ width: "100%" }}>
      {activities.map((activity) => (
        <ListItem key={`${activity.type}-${activity.id}`} divider>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  {activity.description}
                </Typography>
                <Chip label={activity.status} size="small" color={getStatusColor(activity.status)} />
              </Box>
            }
            secondary={
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="caption">
                  {activity.type} by {activity.engineer}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(activity.date).toLocaleDateString()}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
} 