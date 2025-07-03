import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";

export default function DeviceStatusChart() {
  const devices = useSelector((state) => state.devices.devices);

  const statusCounts = devices.reduce(
    (acc, device) => {
      acc[device.status] = (acc[device.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const total = devices.length;
  const getPercentage = (count) => (total > 0 ? (count / total) * 100 : 0);

  const statusData = [
    { status: "Online", count: statusCounts.Online || 0, color: "#4caf50" },
    { status: "Offline", count: statusCounts.Offline || 0, color: "#f44336" },
    { status: "Maintenance", count: statusCounts.Maintenance || 0, color: "#ff9800" },
  ];

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 300 }}>
          {statusData.map((item, index) => (
            <Box key={item.status} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">{item.status}</Typography>
                <Typography variant="body2">
                  {item.count} ({getPercentage(item.count).toFixed(1)}%)
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: 20,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${getPercentage(item.count)}%`,
                    height: "100%",
                    backgroundColor: item.color,
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
} 