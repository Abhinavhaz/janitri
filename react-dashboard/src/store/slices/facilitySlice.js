import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  facilities: [
    {
      id: "FAC001",
      name: "City General Hospital",
      address: "123 Medical Center Dr",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      contactPerson: "Dr. Michael Brown",
      contactEmail: "michael.brown@cityhospital.com",
      contactPhone: "+1-555-0123",
      deviceCount: 15,
      lastVisitDate: "2024-01-15",
    },
    {
      id: "FAC002",
      name: "Metro Medical Center",
      address: "456 Healthcare Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      contactPerson: "Dr. Lisa Wilson",
      contactEmail: "lisa.wilson@metromedical.com",
      contactPhone: "+1-555-0456",
      deviceCount: 8,
      lastVisitDate: "2024-01-10",
    },
  ],
  loading: false,
  error: null,
};

const facilitySlice = createSlice({
  name: "facilities",
  initialState,
  reducers: {
    addFacility: (state, action) => {
      state.facilities.push(action.payload);
    },
    updateFacility: (state, action) => {
      const index = state.facilities.findIndex((facility) => facility.id === action.payload.id);
      if (index !== -1) {
        state.facilities[index] = action.payload;
      }
    },
    deleteFacility: (state, action) => {
      state.facilities = state.facilities.filter((facility) => facility.id !== action.payload);
    },
  },
});

export const { addFacility, updateFacility, deleteFacility } = facilitySlice.actions;
export default facilitySlice.reducer; 