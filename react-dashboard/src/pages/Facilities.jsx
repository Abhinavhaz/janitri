import { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete, Business, Devices } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { addFacility, updateFacility, deleteFacility } from "../store/slices/facilitySlice";
import Layout from "../components/Layout/Layout";

export default function FacilitiesPage() {
  const dispatch = useDispatch();
  const facilities = useSelector((state) => state.facilities.facilities);
  const devices = useSelector((state) => state.devices.devices);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [formData, setFormData] = useState({});

  const getDeviceCountForFacility = (facilityId) => {
    return devices.filter((device) => device.facilityId === facilityId).length;
  };

  const handleAddFacility = () => {
    setEditingFacility(null);
    setFormData({});
    setDialogOpen(true);
  };

  const handleEditFacility = (facility) => {
    setEditingFacility(facility);
    setFormData(facility);
    setDialogOpen(true);
  };

  const handleDeleteFacility = (facilityId) => {
    const deviceCount = getDeviceCountForFacility(facilityId);
    if (deviceCount > 0) {
      alert(`Cannot delete facility. It has ${deviceCount} devices assigned to it.`);
      return;
    }

    if (window.confirm("Are you sure you want to delete this facility?")) {
      dispatch(deleteFacility(facilityId));
    }
  };

  const handleSaveFacility = () => {
    if (editingFacility) {
      dispatch(updateFacility(formData));
    } else {
      const newFacility = {
        ...formData,
        id: `FAC${Date.now()}`,
        deviceCount: 0,
        lastVisitDate: new Date().toISOString().split("T")[0],
      };
      dispatch(addFacility(newFacility));
    }
    setDialogOpen(false);
  };

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4">Facility Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddFacility}>
            Add Facility
          </Button>
        </Box>

        <Grid container spacing={3}>
          {facilities.map((facility) => {
            const deviceCount = getDeviceCountForFacility(facility.id);
            return (
              <Grid item xs={12} md={6} lg={4} key={facility.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <Business color="primary" />
                      <Typography variant="h6" component="div">
                        {facility.name}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Address:</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {facility.address}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {facility.city}, {facility.state} {facility.zipCode}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                      <strong>Contact:</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {facility.contactPerson}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {facility.contactEmail}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {facility.contactPhone}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                      <Chip icon={<Devices />} label={`${deviceCount} Devices`} color="primary" variant="outlined" />
                      <Typography variant="caption" color="text.secondary">
                        Last visit: {new Date(facility.lastVisitDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button size="small" onClick={() => handleEditFacility(facility)}>
                      <Edit fontSize="small" />
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteFacility(facility.id)}
                      disabled={deviceCount > 0}
                    >
                      <Delete fontSize="small" />
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Add/Edit Facility Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingFacility ? "Edit Facility" : "Add New Facility"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Facility Name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.state || ""}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={formData.zipCode || ""}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  value={formData.contactPerson || ""}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={formData.contactPhone || ""}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveFacility} variant="contained">
              {editingFacility ? "Update" : "Add"} Facility
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
} 