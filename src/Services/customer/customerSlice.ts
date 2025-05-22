import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { HomeData, HomeCategory } from "../../types/HomeCategory";

const postToApi = async (endpoint: string, data: any) => {
  try {
    const response = await api.post(endpoint, data);
    console.log(`API Success: Endpoint - ${endpoint}, Data -`, data, "Response Data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`API Error: Endpoint - ${endpoint}, Data -`, data, "Error Message:", error.message);
    throw error;
  }
};

export const createHomeCategory = createAsyncThunk<
  HomeData, 
  HomeCategory[], 
  { rejectValue: string }
>(
  "home/createHomeCategory",
  async (homeCategories, { rejectWithValue }) => {
    try {
      return await postToApi("/auth/home/categories", homeCategories);
    } catch (error: any) {
      console.error("Error creating Home Categories:", error.message);
      return rejectWithValue(
        error.response?.data?.message || error.message || "An unknown error occurred"
      );
    }
  }
);

interface HomeState {
  homeData: HomeData | null;
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  homeData: null,
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createHomeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHomeCategory.fulfilled, (state, action: PayloadAction<HomeData>) => {
        state.loading = false;
        state.homeData = action.payload;
      })
      .addCase(createHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create Home Categories";
      });
  },
});

export default homeSlice.reducer;
