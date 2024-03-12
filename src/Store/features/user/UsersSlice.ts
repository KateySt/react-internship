import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from 'Types/User'
import { AppDispatch, RootState } from '../../store'

export interface UserState {
    user: User
}

const initialState: UserState = {
    user: {} as User,
}

export const UsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
    },
})

export const { setUser } = UsersSlice.actions

export const selectUser = (state: RootState) => state.users.user

export const setUserAsync = (user: User) => async (dispatch: AppDispatch) => {
    // await fetch().then().catch();
    dispatch(setUser(user))
}
export default UsersSlice.reducer
