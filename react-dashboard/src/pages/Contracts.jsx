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
  Alert,
} from "@mui/material";
import { Add, Edit, Delete, GetApp, Warning } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { addContract, updateContract, deleteContract } from "../store/slices/contractSlice";
import Layout from "../components/Layout/Layout";

export default function ContractsPage() {
  const dispatch = useDispatch();
  const contracts = useSelector((state) => state.contracts.contracts);
  const devices = useSelector((state) => state.devices.devices);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [formData, setFormData] = useState({});

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Expiring Soon":
        return "warning";
      case "Expired":
        return "error";
      default:
        return "default";
    }
  };

  const getExpiringContracts = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return contracts.filter((contract) => {
      const endDate = new Date(contract.endDate);
      return endDate <= thirtyDaysFromNow && endDate >= today;
    });
  };

  const handleAddContract = () => {
    setEditingContract(null);
    setFormData({});
    setDialogOpen(true);
  };

  const handleEditContract = (contract) => {
    setEditingContract(contract);
    setFormData(contract);
    setDialogOpen(true);
  };

  const handleDeleteContract = (contractId) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      dispatch(deleteContract(contractId));
    }
  };

  const handleSaveContract = () => {
    if (editingContract) {
      dispatch(updateContract(formData));
    } else {
      const newContract = {
        ...formData,
        id: `${formData.contractType}${Date.now()}`,
      };
      dispatch(addContract(newContract));
    }
    setDialogOpen(false);
  };

  const exportContractsReport = () => {
    const headers = [
      "Contract ID",
      "Device Type",
      "Facility",
      "Type",
      "Start Date",
      "End Date",
      "Status",
      "Value",
      "Contact Person",
    ];
    const csvContent = [
      headers.join(","),
      ...contracts.map((contract) =>
        [
          contract.id,
          contract.deviceType,
          contract.facilityName,
          contract.contractType,
          contract.startDate,
          contract.endDate,
          contract.status,
          contract.value,
          contract.contactPerson,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contracts-report.csv";
    a.click();
  };

  const expiringContracts = getExpiringContracts();

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4">AMC/CMC Contract Tracker</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" startIcon={<GetApp />} onClick={exportContractsReport}>
              Export Report
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={handleAddContract}>
              Add Contract
            </Button>
          </Box>
        </Box>

        {expiringContracts.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }} icon={<Warning />}>
            <Typography variant="subtitle1" gutterBottom>
              {expiringContracts.length} contract(s) expiring within 30 days:
            </Typography>
            {expiringContracts.map((contract) => (
              <Typography key={contract.id} variant="body2">
                • {contract.deviceType} at {contract.facilityName} (expires {new Date(contract.endDate).toLocaleDateString()})
              </Typography>
            ))}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contract ID</TableCell>
                <TableCell>Device Type</TableCell>
                <TableCell>Facility</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.id}</TableCell>
                  <TableCell>{contract.deviceType}</TableCell>
                  <TableCell>{contract.facilityName}</TableCell>
                  <TableCell>
                    <Chip
                      label={contract.contractType}
                      color={contract.contractType === "AMC" ? "primary" : "secondary"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={contract.status} color={getStatusColor(contract.status)} size="small" />
                  </TableCell>
                  <TableCell>${contract.value.toLocaleString()}</TableCell>
                  <TableCell>{contract.contactPerson}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditContract(contract)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteContract(contract.id)} size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Contract Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingContract ? "Edit Contract" : "Add New Contract"}</DialogTitle>
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
                  <InputLabel>Contract Type</InputLabel>
                  <Select
                    value={formData.contractType || ""}
                    label="Contract Type"
                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                  >
                    <MenuItem value="AMC">AMC (Annual Maintenance Contract)</MenuItem>
                    <MenuItem value="CMC">CMC (Comprehensive Maintenance Contract)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
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
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Expiring Soon">Expiring Soon</MenuItem>
                    <MenuItem value="Expired">Expired</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contract Value ($)"
                  type="number"
                  value={formData.value || ""}
                  onChange={(e) => setFormData({ ...formData, value: Number.parseFloat(e.target.value) })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contract Terms"
                  multiline
                  rows={3}
                  value={formData.terms || ""}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Renewal Date"
                  type="date"
                  value={formData.renewalDate || ""}
                  onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
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
            <Button onClick={handleSaveContract} variant="contained">
              {editingContract ? "Update" : "Add"} Contract
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
} 