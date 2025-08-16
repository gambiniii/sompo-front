import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

interface AuthState {
  authorization: any;
  user: any;
  permissions: any;
}

const initialState: AuthState = {
  authorization: null,
  user: null,
  permissions: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      const { authorization, permissions, user } = action.payload;

      state.authorization = authorization;
      state.permissions = permissions;
      state.user = user;
    },
    logout: (state) => {
      state.authorization = null;
      state.user = null;
      state.permissions = [];
    },
  },
});

export const { login, logout } = authSlice.actions;

const authPersistConfig = {
  key: "sompo:auth:v1",
  storage,
  version: 1,
};

export const reducer = persistReducer(authPersistConfig, authSlice.reducer);
