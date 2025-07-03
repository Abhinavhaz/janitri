import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Contract {
  id: string
  deviceId: string
  deviceType: string
  facilityId: string
  facilityName: string
  contractType: "AMC" | "CMC"
  startDate: string
  endDate: string
  status: "Active" | "Expired" | "Expiring Soon"
  value: number
  terms: string
  renewalDate: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
}

interface ContractState {
  contracts: Contract[]
  loading: boolean
  error: string | null
}

const initialState: ContractState = {
  contracts: [
    {
      id: "AMC001",
      deviceId: "DEV001",
      deviceType: "Ventilator",
      facilityId: "FAC001",
      facilityName: "City General Hospital",
      contractType: "AMC",
      startDate: "2023-06-01",
      endDate: "2024-06-01",
      status: "Active",
      value: 15000,
      terms: "Annual maintenance contract including quarterly preventive maintenance",
      renewalDate: "2024-05-01",
      contactPerson: "Dr. Michael Brown",
      contactEmail: "michael.brown@cityhospital.com",
      contactPhone: "+1-555-0123",
    },
  ],
  loading: false,
  error: null,
}

const contractSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    addContract: (state, action: PayloadAction<Contract>) => {
      state.contracts.push(action.payload)
    },
    updateContract: (state, action: PayloadAction<Contract>) => {
      const index = state.contracts.findIndex((contract) => contract.id === action.payload.id)
      if (index !== -1) {
        state.contracts[index] = action.payload
      }
    },
    deleteContract: (state, action: PayloadAction<string>) => {
      state.contracts = state.contracts.filter((contract) => contract.id !== action.payload)
    },
  },
})

export const { addContract, updateContract, deleteContract } = contractSlice.actions
export default contractSlice.reducer
