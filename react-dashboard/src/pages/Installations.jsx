import { useState } from "react";
import {
  Container,
  Typography,
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
  List,
  ListItem,
  Checkbox,
  FormControlLabel,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { Add, Edit, Delete, PhotoCamera, CheckCircle } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { addInstallation, updateInstallation, deleteInstallation } from "../store/slices/installationSlice";
import Layout from "../components/Layout/Layout";

export default function InstallationsPage() {
  const dispatch = useDispatch();
  const installations = useSelector((state) => state.installations.installations);
  const devices = useSelector((state) => state.devices.devices);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInstallation, setEditingInstallation] = useState(null);
  const [formData, setFormData] = useState({});

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

  const handleAddInstallation = () => {
    setEditingInstallation(null);
    setFormData({
      checklist: [
        { item: "Device unpacked and inspected", completed: false },
        { item: "Power connection verified", completed: false },
        { item: "Network configuration completed", completed: false },
        { item: "Calibration performed", completed: false },
        { item: "Safety checks completed", completed: false },
      ],
      unboxingPhotos: [],
      completionPhotos: [],
    });
    setDialogOpen(true);
  };

  const handleEditInstallation = (installation) => {
    setEditingInstallation(installation);
    setFormData(installation);
    setDialogOpen(true);
  };

  const handleDeleteInstallation = (installationId) => {
    if (window.confirm("Are you sure you want to delete this installation record?")) {
      dispatch(deleteInstallation(installationId));
    }
  };

  const handleSaveInstallation = () => {
    if (editingInstallation) {
      dispatch(updateInstallation(formData));
    } else {
      const newInstallation = {
        ...formData,
        id: `INST${Date.now()}`,
      };
      dispatch(addInstallation(newInstallation));
    }
    setDialogOpen(false);
  };

  const handleChecklistChange = (index, completed) => {
    const updatedChecklist = [...(formData.checklist || [])];
    updatedChecklist[index] = { ...updatedChecklist[index], completed };
    setFormData({ ...formData, checklist: updatedChecklist });
  };

  const handlePhotoUpload = (type) => {
    // Simulate photo upload
    const newPhoto = "/placeholder.svg?height=200&width=300";
    if (type === "unboxing") {
      setFormData({
        ...formData,
        unboxingPhotos: [...(formData.unboxingPhotos || []), newPhoto],
      });
    } else {
      setFormData({
        ...formData,
        completionPhotos: [...(formData.completionPhotos || []), newPhoto],
      });
    }
  };

  return (
    <Layout>
      <Container  sx={{
    marginTop: {
      xs: "-50px",   // for mobile screens
      sm: "-50px",   // for tablets
      md: "-200px",  // for desktop and up
    },
    width: "100vw",
  }}>
        <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 3,
    flexDirection: { xs: "column", sm: "row" }, // stack on mobile
    gap: 2,
  }}
>
  <Typography
    sx={{
      fontSize: {
        xs: "1.2rem", // small screens
        sm: "1.5rem", // small-medium
        md: "1.8rem", // medium
        lg: "2rem",   // large
      },
      fontWeight: 600,
      textAlign: { xs: "center", sm: "left" },
    }}
  >
    Installation & Training
  </Typography>

  <Button
    variant="contained"
    startIcon={<Add />}
    onClick={handleAddInstallation}
    sx={{
      fontSize: {
        xs: "0.7rem",
        sm: "0.8rem",
        md: "0.9rem",
        lg: "1rem",
      },
      py: {
        xs: 1,
        sm: 1.2,
        md: 1.3,
      },
      px: {
        xs: 2,
        sm: 3,
      },
    }}
  >
    New Installation
  </Button>
</Box>


        <Grid container spacing={3} sx={{ textAlign: "left" }}>
  {installations.map((installation) => (
    <Grid item xs={12} md={6} lg={4} key={installation.id}>
      <Card
        sx={{
          height: {
            xs: 300,
            sm: 300,
            md: 300,
            lg: 320,
          },
          width: {
            xs: "100vw",
            sm: "100vw",
            md: "100vw",
            lg: "20vw",
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, gap: 2 }}>
            <Typography variant="h6" component="div">
              {installation.deviceType}
            </Typography>
            <Chip label={installation.status} color={getStatusColor(installation.status)} size="small" />
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Facility:</strong> {installation.facilityName}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Engineer:</strong> {installation.engineer}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Date:</strong> {new Date(installation.installationDate).toLocaleDateString()}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Progress:</strong>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ flexGrow: 1, height: 8, backgroundColor: "#e0e0e0", borderRadius: 1 }}>
                <Box
                  sx={{
                    height: "100%",
                    backgroundColor: installation.status === "Completed" ? "#4caf50" : "#ff9800",
                    borderRadius: 1,
                    width: `${
                      (installation.checklist.filter((item) => item.completed).length /
                        installation.checklist.length) *
                      100
                    }%`,
                  }}
                />
              </Box>
              <Typography variant="caption">
                {installation.checklist.filter((item) => item.completed).length}/{installation.checklist.length}
              </Typography>
            </Box>
          </Box>

          {installation.trainingCompleted && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <CheckCircle color="success" fontSize="small" />
              <Typography variant="body2" color="success.main">
                Training Completed
              </Typography>
            </Box>
          )}
        </CardContent>

        <CardActions>
          <Button size="small" onClick={() => handleEditInstallation(installation)}>
            <Edit fontSize="small" />
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => handleDeleteInstallation(installation.id)}>
            <Delete fontSize="small" />
            Delete
          </Button>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>


        {/* Add/Edit Installation Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>{editingInstallation ? "Edit Installation" : "New Installation"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Basic Information */}
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
                <TextField
                  fullWidth
                  label="Installation Date"
                  type="date"
                  value={formData.installationDate || ""}
                  onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Engineer"
                  value={formData.engineer || ""}
                  onChange={(e) => setFormData({ ...formData, engineer: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status || ""}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="Scheduled">Scheduled</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Installation Checklist */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Installation Checklist
                </Typography>
                <List>
                  {(formData.checklist || []).map((item, index) => (
                    <ListItem key={index} dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.completed}
                            onChange={(e) => handleChecklistChange(index, e.target.checked)}
                          />
                        }
                        label={item.item}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* Training Section */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Training
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.trainingCompleted || false}
                      onChange={(e) => setFormData({ ...formData, trainingCompleted: e.target.checked })}
                    />
                  }
                  label="Training Completed"
                />
                <TextField
                  fullWidth
                  label="Training Notes"
                  multiline
                  rows={3}
                  value={formData.trainingNotes || ""}
                  onChange={(e) => setFormData({ ...formData, trainingNotes: e.target.value })}
                  sx={{ mt: 2 }}
                />
              </Grid>

              {/* Photo Upload Sections */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Unboxing Photos
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  onClick={() => handlePhotoUpload("unboxing")}
                  sx={{ mb: 2 }}
                >
                  Add Photo
                </Button>
                <ImageList cols={2} rowHeight={120}>
                  {(formData.unboxingPhotos || []).map((photo, index) => (
                    <ImageListItem key={index}>
                      <img src={photo || "/placeholder.svg"} alt={`Unboxing ${index + 1}`} loading="lazy" />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Completion Photos
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  onClick={() => handlePhotoUpload("completion")}
                  sx={{ mb: 2 }}
                >
                  Add Photo
                </Button>
                <ImageList cols={2} rowHeight={120}>
                  {(formData.completionPhotos || []).map((photo, index) => (
                    <ImageListItem key={index}>
                      <img src={photo || "/placeholder.svg"} alt={`Completion ${index + 1}`} loading="lazy" />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveInstallation} variant="contained">
              {editingInstallation ? "Update" : "Create"} Installation
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
} 