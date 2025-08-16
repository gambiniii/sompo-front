import type { PaletteMode } from '@mui/material';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { type PersistConfig, persistReducer } from 'redux-persist';

interface AppState {
  theme: PaletteMode;
  isSidebarOpen: boolean;
}

const initialState: AppState = {
  theme: 'light',
  isSidebarOpen: true,
};

export const appSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<PaletteMode>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { setTheme, toggleSidebar } = appSlice.actions;

const appPersistConfig: PersistConfig<AppState> = {
  key: 'sompo:app:v1',
  storage,
  version: 1,
  whitelist: ['theme'],
};

export const reducer = persistReducer(appPersistConfig, appSlice.reducer);
