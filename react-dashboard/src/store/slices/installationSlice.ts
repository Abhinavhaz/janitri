import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Installation {
  id: string
  deviceId: string
  deviceType: string
  facilityId: string
  facilityName: string
  installationDate: string
  engineer: string
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
  unboxingPhotos: string[]
  checklist: {
    item: string
    completed: boolean
  }[]
  trainingCompleted: boolean
  trainingNotes: string
  completionPhotos: string[]
}

interface InstallationState {
  installations: Installation[]
  loading: boolean
  error: string | null
}

const initialState: InstallationState = {
  installations: [
    {
      id: "INST001",
      deviceId: "DEV001",
      deviceType: "Ventilator",
      facilityId: "FAC001",
      facilityName: "City General Hospital",
      installationDate: "2023-06-01",
      engineer: "John Smith",
      status: "Completed",
      unboxingPhotos: ["/placeholder.svg?height=200&width=300"],
      checklist: [
        { item: "Device unpacked and inspected", completed: true },
        { item: "Power connection verified", completed: true },
        { item: "Network configuration completed", completed: true },
        { item: "Calibration performed", completed: true },
      ],
      trainingCompleted: true,
      trainingNotes: "Staff trained on basic operation and emergency procedures",
      completionPhotos: ["/placeholder.svg?height=200&width=300"],
    },
  ],
  loading: false,
  error: null,
}

const installationSlice = createSlice({
  name: "installations",
  initialState,
  reducers: {
    addInstallation: (state, action: PayloadAction<Installation>) => {
      state.installations.push(action.payload)
    },
    updateInstallation: (state, action: PayloadAction<Installation>) => {
      const index = state.installations.findIndex((inst) => inst.id === action.payload.id)
      if (index !== -1) {
        state.installations[index] = action.payload
      }
    },
    deleteInstallation: (state, action: PayloadAction<string>) => {
      state.installations = state.installations.filter((inst) => inst.id !== action.payload)
    },
  },
})

export const { addInstallation, updateInstallation, deleteInstallation } = installationSlice.actions
export default installationSlice.reducer
