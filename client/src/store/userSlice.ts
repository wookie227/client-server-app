import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  email: string | null;
  userId: number | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  email: null,
  userId: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ email: string; userId: number }>) => {
      state.email = action.payload.email;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.email = null;
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
