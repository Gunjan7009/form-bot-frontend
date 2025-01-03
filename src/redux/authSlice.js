import { createSlice } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';

const initialState = {
    token: null,
    user: null,
    name: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
           try {
               const decoded = jwtDecode(action.payload);
               state.user = decoded;
               state.name = decoded.name;
               state.isAuthenticated = true;
               localStorage.setItem('token', action.payload);
           } catch (error) {
               console.error("Error decoding  JWT token", error);
               state.user = null;
               state.name = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
           }
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.name = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        }
    }
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;