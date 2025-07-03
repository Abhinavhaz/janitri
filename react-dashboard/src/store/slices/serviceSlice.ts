import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface ServiceVisit {
  id: string
  deviceId: string
  deviceType: string
  facilityId: string
  facilityName: string
  visitDate: string
  engineer: string
  purpose: "Preventive" | "Breakdown" | "Installation" | "Training"
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
  notes: string
  attachments: string[]
  timeSpent: number
  issuesFound: string[]
  resolutionNotes: string
}

interface ServiceState {
  visits: ServiceVisit[]
  loading: boolean
  error: string | null
}

const initialState: ServiceState = {
  visits: [
    {
      id: "SRV001",
      deviceId: "DEV001",
      deviceType: "Ventilator",
      facilityId: "FAC001",
      facilityName: "City General Hospital",
      visitDate: "2024-01-15",
      engineer: "John Smith",
      purpose: "Preventive",
      status: "Completed",
      notes: "Routine maintenance completed. All systems functioning normally.",
      attachments: ["/placeholder.svg?height=200&width=300"],
      timeSpent: 2.5,
      issuesFound: [],
      resolutionNotes: "No issues found during preventive maintenance.",
    },
  ],
  loading: false,
  error: null,
}

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    addServiceVisit: (state, action: PayloadAction<ServiceVisit>) => {
      state.visits.push(action.payload)
    },
    updateServiceVisit: (state, action: PayloadAction<ServiceVisit>) => {
      const index = state.visits.findIndex((visit) => visit.id === action.payload.id)
      if (index !== -1) {
        state.visits[index] = action.payload
      }
    },
    deleteServiceVisit: (state, action: PayloadAction<string>) => {
      state.visits = state.visits.filter((visit) => visit.id !== action.payload)
    },
  },
})

export const { addServiceVisit, updateServiceVisit, deleteServiceVisit } = serviceSlice.actions
export default serviceSlice.reducer
