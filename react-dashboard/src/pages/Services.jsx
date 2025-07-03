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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

import { Add, Edit, Delete, Visibility, AttachFile } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { addServiceVisit, updateServiceVisit, deleteServiceVisit } from "../store/slices/serviceSlice";
import Layout from "../components/Layout/Layout";
import {useMediaQuery,useTheme} from "@mui/material";

export default function ServicesPage() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const services = useSelector((state) => state.services.visits);
  const devices = useSelector((state) => state.devices.devices);
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);
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

  const getPurposeColor = (purpose) => {
    switch (purpose) {
      case "Preventive":
        return "primary";
      case "Breakdown":
        return "error";
      case "Installation":
        return "success";
      case "Training":
        return "info";
      default:
        return "default";
    }
  };

  const handleAddService = () => {
    setEditingService(null);
    setFormData({
      attachments: [],
      issuesFound: [],
    });
    setDialogOpen(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setFormData(service);
    setDialogOpen(true);
  };

  const handleViewService = (service) => {
    setViewingService(service);
    setViewDialogOpen(true);
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service visit record?")) {
      dispatch(deleteServiceVisit(serviceId));
    }
  };

  const handleSaveService = () => {
    if (editingService) {
      dispatch(updateServiceVisit(formData));
    } else {
      const newService = {
        ...formData,
        id: `SRV${Date.now()}`,
      };
      dispatch(addServiceVisit(newService));
    }
    setDialogOpen(false);
  };

  const handleAttachmentUpload = () => {
    // Simulate file upload
    const newAttachment = "/placeholder.svg?height=200&width=300";
    setFormData({
      ...formData,
      attachments: [...(formData.attachments || []), newAttachment],
    });
  };

  return (
    <Layout>
      <Container  sx={{
    marginTop: {
      xs: "-50px",   // for mobile screens
      sm: "-10px",   // for tablets
      md: "-50px",  // for desktop and up
    }
    ,
    width: "100vw",
    minHeight: "100vh",
    overflowY: "auto",
  }}>
        <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 3,
    flexDirection: { xs: "column", sm: "row" },
    gap: 2,
  }}
>
  <Typography
    sx={{
      fontSize: {
        xs: "1.2rem",
        sm: "1.5rem",
        md: "1.8rem",
        lg: "2rem",
      },
      fontWeight: 600,
      textAlign: { xs: "center", sm: "left" },
    }}
  >
    Service Visit Logs
  </Typography>

  <Button
    variant="contained"
    startIcon={<Add />}
    onClick={handleAddService}
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
    Log Service Visit
  </Button>
</Box>


{isMobile ? (
  // Mobile: Card View
  <Box>
    {services.map((service) => (
      <Paper
        key={service.id}
        elevation={3}
        sx={{
          mb: 2,
          p: 2,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          textAlign:"left"
        }}
      >
        <Typography><strong>Visit ID:</strong> {service.id}</Typography>
        <Typography><strong>Device:</strong> {service.deviceType}</Typography>
        <Typography><strong>Facility:</strong> {service.facilityName}</Typography>
        <Typography><strong>Date:</strong> {new Date(service.visitDate).toLocaleDateString()}</Typography>
        <Typography><strong>Engineer:</strong> {service.engineer}</Typography>
        <Typography>
          <strong>Purpose:</strong>{" "}
          <Chip label={service.purpose} color={getPurposeColor(service.purpose)} size="small" />
        </Typography>
        <Typography>
          <strong>Status:</strong>{" "}
          <Chip label={service.status} color={getStatusColor(service.status)} size="small" />
        </Typography>
        <Typography><strong>Time Spent:</strong> {service.timeSpent}h</Typography>
        <Box sx={{ display: "flex",justifyContent:"space-around", gap: 1, mt: 1 }}>
          <IconButton onClick={() => handleViewService(service)} size="small">
            <Visibility />
          </IconButton>
          <IconButton onClick={() => handleEditService(service)} size="small">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDeleteService(service.id)} size="small">
            <Delete />
          </IconButton>
        </Box>
      </Paper>
    ))}
  </Box>
) : (
  // Desktop: Table View
  <TableContainer component={Paper} sx={{  mt: 2 }}>
    <Table sx={{ minWidth: 800 }}>
      <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
        <TableRow>
          <TableCell>Visit ID</TableCell>
          <TableCell>Device</TableCell>
          <TableCell>Facility</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Engineer</TableCell>
          <TableCell>Purpose</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Time Spent</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell>{service.id}</TableCell>
            <TableCell>{service.deviceType}</TableCell>
            <TableCell>{service.facilityName}</TableCell>
            <TableCell>{new Date(service.visitDate).toLocaleDateString()}</TableCell>
            <TableCell>{service.engineer}</TableCell>
            <TableCell>
              <Chip label={service.purpose} color={getPurposeColor(service.purpose)} size="small" />
            </TableCell>
            <TableCell>
              <Chip label={service.status} color={getStatusColor(service.status)} size="small" />
            </TableCell>
            <TableCell>{service.timeSpent}h</TableCell>
            <TableCell>
              <IconButton onClick={() => handleViewService(service)} size="small">
                <Visibility />
              </IconButton>
              <IconButton onClick={() => handleEditService(service)} size="small">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDeleteService(service.id)} size="small">
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)}



        {/* Add/Edit Service Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingService ? "Edit Service Visit" : "Log New Service Visit"}</DialogTitle>
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
                <TextField
                  fullWidth
                  label="Visit Date"
                  type="date"
                  value={formData.visitDate || ""}
                  onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
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
                  <InputLabel>Purpose</InputLabel>
                  <Select
                    value={formData.purpose || ""}
                    label="Purpose"
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  >
                    <MenuItem value="Preventive">Preventive</MenuItem>
                    <MenuItem value="Breakdown">Breakdown</MenuItem>
                    <MenuItem value="Installation">Installation</MenuItem>
                    <MenuItem value="Training">Training</MenuItem>
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
                    <MenuItem value="Scheduled">Scheduled</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Time Spent (hours)"
                  type="number"
                  value={formData.timeSpent || ""}
                  onChange={(e) => setFormData({ ...formData, timeSpent: Number.parseFloat(e.target.value) })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Notes"
                  multiline
                  rows={4}
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Issues Found (comma separated)"
                  value={(formData.issuesFound || []).join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      issuesFound: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s),
                    })
                  }
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
                  <Typography variant="h6">Attachments</Typography>
                  <Button variant="outlined" startIcon={<AttachFile />} onClick={handleAttachmentUpload}>
                    Add File
                  </Button>
                </Box>
                <List>
                  {(formData.attachments || []).map((attachment, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`Attachment ${index + 1}`} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveService} variant="contained">
              {editingService ? "Update" : "Log"} Service Visit
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Service Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Service Visit Details</DialogTitle>
          <DialogContent>
            {viewingService && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Visit ID
                    </Typography>
                    <Typography variant="body1">{viewingService.id}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Device
                    </Typography>
                    <Typography variant="body1">{viewingService.deviceType}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Facility
                    </Typography>
                    <Typography variant="body1">{viewingService.facilityName}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1">{new Date(viewingService.visitDate).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Engineer
                    </Typography>
                    <Typography variant="body1">{viewingService.engineer}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Time Spent
                    </Typography>
                    <Typography variant="body1">{viewingService.timeSpent} hours</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Service Notes
                </Typography>
                <Typography variant="body1" paragraph>
                  {viewingService.notes}
                </Typography>

                {viewingService.issuesFound.length > 0 && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Issues Found
                    </Typography>
                    <List dense>
                      {viewingService.issuesFound.map((issue, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={issue} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Resolution Notes
                </Typography>
                <Typography variant="body1" paragraph>
                  {viewingService.resolutionNotes}
                </Typography>

                {viewingService.attachments.length > 0 && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Attachments
                    </Typography>
                    <List>
                      {viewingService.attachments.map((attachment, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`Attachment ${index + 1}`} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
} 