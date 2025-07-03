import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Device {
  id: string
  type: string
  model: string
  serialNumber: string
  facilityId: string
  facilityName: string
  status: "Online" | "Offline" | "Maintenance"
  batteryLevel: number
  lastServiceDate: string
  installationDate: string
  amcStatus: "Active" | "Expired" | "Expiring Soon"
  cmcStatus: "Active" | "Expired" | "Expiring Soon"
  location: string
  assignedEngineer: string
}

interface DeviceState {
  devices: Device[]
  loading: boolean
  error: string | null
}

const initialState: DeviceState = {
  devices: [
    {
      id: "DEV001",
      type: "Ventilator",
      model: "VentMax Pro",
      serialNumber: "VM001234",
      facilityId: "FAC001",
      facilityName: "City General Hospital",
      status: "Online",
      batteryLevel: 85,
      lastServiceDate: "2024-01-15",
      installationDate: "2023-06-01",
      amcStatus: "Active",
      cmcStatus: "Active",
      location: "ICU Ward 1",
      assignedEngineer: "John Smith",
    },
    {
      id: "DEV002",
      type: "Patient Monitor",
      model: "MonitorPro X1",
      serialNumber: "MP002345",
      facilityId: "FAC002",
      facilityName: "Metro Medical Center",
      status: "Maintenance",
      batteryLevel: 45,
      lastServiceDate: "2024-01-10",
      installationDate: "2023-08-15",
      amcStatus: "Expiring Soon",
      cmcStatus: "Active",
      location: "Emergency Room",
      assignedEngineer: "Sarah Johnson",
    },
  ],
  loading: false,
  error: null,
}

const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    addDevice: (state, action: PayloadAction<Device>) => {
      state.devices.push(action.payload)
    },
    updateDevice: (state, action: PayloadAction<Device>) => {
      const index = state.devices.findIndex((device) => device.id === action.payload.id)
      if (index !== -1) {
        state.devices[index] = action.payload
      }
    },
    deleteDevice: (state, action: PayloadAction<string>) => {
      state.devices = state.devices.filter((device) => device.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { addDevice, updateDevice, deleteDevice, setLoading, setError } = deviceSlice.actions
export default deviceSlice.reducer
