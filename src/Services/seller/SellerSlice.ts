import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { SellerReport } from "../../types/SellerTypes";

// Existing thunks (unchanged)
export const verifySellerOtp = createAsyncThunk(
  "/auth/verify-seller-otp",
  async ({ otp }: { otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/auth/verify/${otp}`);
      return response.data;
    } catch (e: any) {
      console.error("❌ Error verifying seller OTP", e);
      return rejectWithValue(e.response?.data || "OTP verification failed");
    }
  }
);

export const fetchSellerProfile = createAsyncThunk(
  "/auth/seller-profile",
  async (jwt: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/seller-profile", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (e: any) {
      console.error("Error fetching seller profile", e);
      return rejectWithValue(e.response?.data || "An error occurred");
    }
  }
);

export const fetchSellerReport = createAsyncThunk<SellerReport, string, { rejectValue: string }>(
  "seller/fetchSellerReport",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/get-report", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch seller report");
    }
  }
);

export const createSeller = createAsyncThunk(
  "/auth/create-seller",
  async ({ values }: { values: any }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/create-seller", values);
      return response.data;
    } catch (e: any) {
      console.error("Error creating seller", e);
      return rejectWithValue(e.response?.data || "An error occurred");
    }
  }
);

// New thunk to update seller profile
export const updateSellerProfile = createAsyncThunk(
  "/auth/update-seller-profile",
  async ({ jwt, updates }: { jwt: string; updates: any }, { rejectWithValue }) => {
    try {
      const response = await api.patch("/auth/update-seller", updates, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (e: any) {
      console.error("❌ Error updating seller profile", e);
      return rejectWithValue(e.response?.data || "Failed to update seller profile");
    }
  }
);

// Seller slice state definition
interface SellerState {
  sellers: any[];
  selectedSeller: any;
  profile: any;
  report: SellerReport | null;
  loading: boolean;
  error: any;
  otpVerified: boolean;
}

const initialState: SellerState = {
  sellers: [],
  selectedSeller: null,
  profile: null,
  report: null,
  loading: false,
  error: null,
  otpVerified: false,
};

// Seller Slice
const SellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch seller profile
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetch seller report
      .addCase(fetchSellerReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchSellerReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle create seller
      .addCase(createSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.sellers.push(action.payload);
      })
      .addCase(createSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle verify seller OTP
      .addCase(verifySellerOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySellerOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.selectedSeller = action.payload;
      })
      .addCase(verifySellerOtp.rejected, (state, action) => {
        state.loading = false;
        state.otpVerified = false;
        state.error = action.payload;
      })

      // Handle update seller profile
      .addCase(updateSellerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload; // Update the profile with the new data
      })
      .addCase(updateSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default SellerSlice.reducer;