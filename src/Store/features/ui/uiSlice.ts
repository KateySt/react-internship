import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export type ColorSchema = 'light' | 'dark'

export interface ThemeState {
    theme: ColorSchema
}

const initialState: ThemeState = {
    theme: 'light',
}
export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark'
        },
    },
})

export const { toggleTheme } = uiSlice.actions

export const selectTheme = (state: RootState) => state.ui.theme

export default uiSlice.reducer
