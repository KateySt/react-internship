import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './features/user/UsersSlice'
import uiReducer from './features/ui/uiSlice'

export const store = configureStore({
    reducer: {
        users: usersReducer,
        ui: uiReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
