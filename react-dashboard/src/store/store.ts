import { configureStore } from "@reduxjs/toolkit"
import deviceReducer from "./slices/deviceSlice"
import installationReducer from "./slices/installationSlice"
import serviceReducer from "./slices/serviceSlice"
import contractReducer from "./slices/contractSlice"
import alertReducer from "./slices/alertSlice"
import facilityReducer from "./slices/facilitySlice"

export const store = configureStore({
  reducer: {
    devices: deviceReducer,
    installations: installationReducer,
    services: serviceReducer,
    contracts: contractReducer,
    alerts: alertReducer,
    facilities: facilityReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
