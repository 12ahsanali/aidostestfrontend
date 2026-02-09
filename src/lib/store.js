import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
        },
      }),
  })
}

export const store = makeStore();