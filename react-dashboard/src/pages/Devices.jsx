import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Box,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Search,
  GetApp,
  Battery1Bar,
  Battery2Bar,
  Battery3Bar,
  BatteryFull,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { addDevice, updateDevice, deleteDevice } from "../store/slices/deviceSlice";
import Layout from "../components/Layout/Layout";

export default function DevicesPage() {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices.devices);
  const facilities = useSelector((state) => state.facilities.facilities);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({});

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.facilityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Online":
        return "success";
      case "Offline":
        return "error";
      case "Maintenance":
        return "warning";
      default:
        return "default";
    }
  };

  const getBatteryIcon = (level) => {
    if (level > 75) return <BatteryFull color="success" />;
    if (level > 50) return <Battery3Bar color="info" />;
    if (level > 25) return <Battery2Bar color="warning" />;
    return <Battery1Bar color="error" />;
  };

  const handleAddDevice = () => {
    setEditingDevice(null);
    setFormData({});
    setDialogOpen(true);
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setFormData(device);
    setDialogOpen(true);
  };

  const handleDeleteDevice = (deviceId) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      dispatch(deleteDevice(deviceId));
    }
  };

  const handleSaveDevice = () => {
    if (editingDevice) {
      dispatch(updateDevice(formData));
    } else {
      const newDevice = {
        ...formData,
        id: `DEV${Date.now()}`,
      };
      dispatch(addDevice(newDevice));
    }
    setDialogOpen(false);
  };

  const exportToCSV = () => {
    const headers = ["ID", "Type", "Model", "Facility", "Status", "Battery %", "Last Service", "AMC Status"];
    const csvContent = [
      headers.join(","),
      ...filteredDevices.map((device) =>
        [
          device.id,
          device.type,
          device.model,
          device.facilityName,
          device.status,
          device.batteryLevel,
          device.lastServiceDate,
          device.amcStatus,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devices.csv";
    a.click();
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ marginTop: "-180px"}}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4">Device Inventory</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" startIcon={<GetApp />} onClick={exportToCSV}>
              Export CSV
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={handleAddDevice}>
              Add Device
            </Button>
          </Box>
        </Box>

        <Paper sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select value={statusFilter} label="Status Filter" onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Facility</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Battery</TableCell>
                <TableCell>Last Service</TableCell>
                <TableCell>AMC Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.id}</TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>{device.model}</TableCell>
                  <TableCell>{device.facilityName}</TableCell>
                  <TableCell>
                    <Chip label={device.status} color={getStatusColor(device.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {getBatteryIcon(device.batteryLevel)}
                      {device.batteryLevel}%
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(device.lastServiceDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={device.amcStatus}
                      color={
                        device.amcStatus === "Active"
                          ? "success"
                          : device.amcStatus === "Expiring Soon"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditDevice(device)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteDevice(device.id)} size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Device Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingDevice ? "Edit Device" : "Add New Device"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Device Type"
                  value={formData.type || ""}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Model"
                  value={formData.model || ""}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={formData.serialNumber || ""}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Facility</InputLabel>
                  <Select
                    value={formData.facilityId || ""}
                    label="Facility"
                    onChange={(e) => {
                      const facility = facilities.find((f) => f.id === e.target.value);
                      setFormData({
                        ...formData,
                        facilityId: e.target.value,
                        facilityName: facility ? facility.name : "",
                      });
                    }}
                  >
                    {facilities.map((facility) => (
                      <MenuItem key={facility.id} value={facility.id}>
                        {facility.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status || ""}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="Online">Online</MenuItem>
                    <MenuItem value="Offline">Offline</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Battery Level (%)"
                  type="number"
                  value={formData.batteryLevel || ""}
                  onChange={(e) => setFormData({ ...formData, batteryLevel: Number.parseInt(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Assigned Engineer"
                  value={formData.assignedEngineer || ""}
                  onChange={(e) => setFormData({ ...formData, assignedEngineer: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDevice} variant="contained">
              {editingDevice ? "Update" : "Add"} Device
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
} 