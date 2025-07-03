import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ImageList,
  ImageListItem,
  Tabs,
  Tab,
} from "@mui/material";
import { Add, Edit, Delete, PhotoCamera, CheckCircle, Warning, Error, Info, BatteryAlert } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { addAlert, updateAlert, deleteAlert } from "../store/slices/alertSlice";
import Layout from "../components/Layout/Layout";

export default function AlertsPage() {
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alerts.alerts);
  const devices = useSelector((state) => state.devices.devices);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formData, setFormData] = useState({});
  const [tabValue, setTabValue] = useState(0);

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

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "Critical":
        return <Error />;
      case "High":
        return <Warning />;
      case "Medium":
        return <Info />;
      case "Low":
        return <CheckCircle />;
      default:
        return <Info />;
    }
  };

  const getAlertTypeIcon = (alertType) => {
    switch (alertType) {
      case "Battery Low":
        return <BatteryAlert />;
      case "Device Offline":
        return <Error />;
      case "Maintenance Due":
        return <Warning />;
      case "Contract Expiring":
        return <Info />;
      case "Critical Error":
        return <Error />;
      default:
        return <Warning />;
    }
  };

  const filterAlertsByStatus = (status) => {
    return alerts.filter((alert) => alert.status === status);
  };

  const handleAddAlert = () => {
    setEditingAlert(null);
    setFormData({
      photos: [],
    });
    setDialogOpen(true);
  };

  const handleEditAlert = (alert) => {
    setEditingAlert(alert);
    setFormData(alert);
    setDialogOpen(true);
  };

  const handleDeleteAlert = (alertId) => {
    if (window.confirm("Are you sure you want to delete this alert?")) {
      dispatch(deleteAlert(alertId));
    }
  };

  const handleSaveAlert = () => {
    if (editingAlert) {
      dispatch(updateAlert(formData));
    } else {
      const newAlert = {
        ...formData,
        id: `ALT${Date.now()}`,
        createdDate: new Date().toISOString().split("T")[0],
      };
      dispatch(addAlert(newAlert));
    }
    setDialogOpen(false);
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const newPhoto = "/placeholder.svg?height=200&width=300";
    setFormData({
      ...formData,
      photos: [...(formData.photos || []), newPhoto],
    });
  };

  const handleResolveAlert = (alertId) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      dispatch(updateAlert({ ...alert, status: "Resolved" }));
    }
  };

  const handleAcknowledgeAlert = (alertId) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      dispatch(updateAlert({ ...alert, status: "Acknowledged" }));
    }
  };

  const getAlertsForTab = () => {
    switch (tabValue) {
      case 0:
        return filterAlertsByStatus("Open");
      case 1:
        return filterAlertsByStatus("Acknowledged");
      case 2:
        return filterAlertsByStatus("Resolved");
      default:
        return alerts;
    }
  };

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4">Alerts & Photo Logs</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddAlert}>
            Create Alert
          </Button>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`Open (${filterAlertsByStatus("Open").length})`} />
            <Tab label={`Acknowledged (${filterAlertsByStatus("Acknowledged").length})`} />
            <Tab label={`Resolved (${filterAlertsByStatus("Resolved").length})`} />
          </Tabs>
        </Paper>

        <Grid container spacing={3}>
          {getAlertsForTab().map((alert) => (
            <Grid item xs={12} md={6} lg={4} key={alert.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {getAlertTypeIcon(alert.alertType)}
                      <Typography variant="h6" component="div">
                        {alert.alertType}
                      </Typography>
                    </Box>
                    <Chip
                      label={alert.severity}
                      color={getSeverityColor(alert.severity)}
                      size="small"
                      icon={getSeverityIcon(alert.severity)}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Device:</strong> {alert.deviceType} ({alert.deviceId})
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Facility:</strong> {alert.facilityName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Assigned to:</strong> {alert.assignedTo}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Created:</strong> {new Date(alert.createdDate).toLocaleDateString()}
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {alert.message}
                  </Typography>

                  {alert.resolutionNotes && (
                    <Box sx={{ mt: 2, p: 1, backgroundColor: "success.light", borderRadius: 1 }}>
                      <Typography variant="body2" color="success.contrastText">
                        <strong>Resolution:</strong> {alert.resolutionNotes}
                      </Typography>
                    </Box>
                  )}

                  {alert.photos.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Photos ({alert.photos.length}):</strong>
                      </Typography>
                      <ImageList cols={2} rowHeight={80}>
                        {alert.photos.slice(0, 4).map((photo, index) => (
                          <ImageListItem key={index}>
                            <img src={photo || "/placeholder.svg"} alt={`Alert photo ${index + 1}`} loading="lazy" />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}
                </CardContent>

                <CardActions>
                  {alert.status === "Open" && (
                    <>
                      <Button size="small" onClick={() => handleAcknowledgeAlert(alert.id)} color="warning">
                        Acknowledge
                      </Button>
                      <Button size="small" onClick={() => handleResolveAlert(alert.id)} color="success">
                        Resolve
                      </Button>
                    </>
                  )}
                  <Button size="small" onClick={() => handleEditAlert(alert)}>
                    <Edit fontSize="small" />
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteAlert(alert.id)}>
                    <Delete fontSize="small" />
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add/Edit Alert Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingAlert ? "Edit Alert" : "Create New Alert"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Device</InputLabel>
                  <Select
                    value={formData.deviceId || ""}
                    label="Device"
                    onChange={(e) => {
                      const device = devices.find((d) => d.id === e.target.value);
                      setFormData({
                        ...formData,
                        deviceId: e.target.value,
                        deviceType: device ? device.type : "",
                        facilityId: device ? device.facilityId : "",
                        facilityName: device ? device.facilityName : "",
                      });
                    }}
                  >
                    {devices.map((device) => (
                      <MenuItem key={device.id} value={device.id}>
                        {device.type} - {device.model} ({device.id})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Alert Type</InputLabel>
                  <Select
                    value={formData.alertType || ""}
                    label="Alert Type"
                    onChange={(e) => setFormData({ ...formData, alertType: e.target.value })}
                  >
                    <MenuItem value="Battery Low">Battery Low</MenuItem>
                    <MenuItem value="Maintenance Due">Maintenance Due</MenuItem>
                    <MenuItem value="Contract Expiring">Contract Expiring</MenuItem>
                    <MenuItem value="Device Offline">Device Offline</MenuItem>
                    <MenuItem value="Critical Error">Critical Error</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={formData.severity || ""}
                    label="Severity"
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
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
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="Acknowledged">Acknowledged</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Alert Message"
                  multiline
                  rows={3}
                  value={formData.message || ""}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={formData.assignedTo || ""}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Resolution Notes"
                  multiline
                  rows={3}
                  value={formData.resolutionNotes || ""}
                  onChange={(e) => setFormData({ ...formData, resolutionNotes: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Typography variant="h6">Photos</Typography>
                  <Button variant="outlined" startIcon={<PhotoCamera />} onClick={handlePhotoUpload}>
                    Add Photo
                  </Button>
                </Box>
                <ImageList cols={3} rowHeight={120}>
                  {(formData.photos || []).map((photo, index) => (
                    <ImageListItem key={index}>
                      <img src={photo || "/placeholder.svg"} alt={`Photo ${index + 1}`} loading="lazy" />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAlert} variant="contained">
              {editingAlert ? "Update" : "Create"} Alert
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
} 