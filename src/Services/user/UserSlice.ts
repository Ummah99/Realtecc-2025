import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/UserTypes";
import { api } from "../config/Api";

export const updateUserDetails = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("/user/change/profile", async (jwt: string, { rejectWithValue }) => {
  try {
    const response = await api.post("update/profile", {}, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return response.data; 

  } catch (e: any) {
    return rejectWithValue("Error updating profile. Please try again.");
  }
});




interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
  }
  
  const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
  };
  
  const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      clearError(state) {
        state.error = null;
      },
      clearUser(state) {
        state.user = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(updateUserDetails.pending, (state) => {
          state.loading = true;
          state.error = null; 
        })
        .addCase(updateUserDetails.fulfilled, (state, action: PayloadAction<User>) => {
          state.loading = false; 
          state.user = action.payload;
        })
        .addCase(updateUserDetails.rejected, (state, action) => {
          state.loading = false; 
          state.error = action.payload as string;
        });
    },
  });
  
  export const { clearError, clearUser } = userSlice.actions;
  
  export default userSlice.reducer;