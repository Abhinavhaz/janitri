import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alerts: [
    {
      id: "ALT001",
      deviceId: "DEV002",
      deviceType: "Patient Monitor",
      facilityId: "FAC002",
      facilityName: "Metro Medical Center",
      alertType: "Battery Low",
      severity: "Medium",
      message: "Device battery level is below 50%",
      createdDate: "2024-01-20",
      status: "Open",
      assignedTo: "Sarah Johnson",
      resolutionNotes: "",
      photos: [],
    },
  ],
  loading: false,
  error: null,
};

const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addAlert: (state, action) => {
      state.alerts.push(action.payload);
    },
    updateAlert: (state, action) => {
      const index = state.alerts.findIndex((alert) => alert.id === action.payload.id);
      if (index !== -1) {
        state.alerts[index] = action.payload;
      }
    },
    deleteAlert: (state, action) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
    },
  },
});

export const { addAlert, updateAlert, deleteAlert } = alertSlice.actions;
export default alertSlice.reducer; 