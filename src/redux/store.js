import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import workspaceReducer from './workspaceSlice';

const store = configureStore({
    reducer: {
        workspaces: workspaceReducer,
        auth: authReducer,
    },
});

export default store;