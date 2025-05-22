
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../config/Api';

interface OrderSellerActionsState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: OrderSellerActionsState = {
  loading: false,
  error: null,
  success: null,
};

// Verify OTP and Release Funds (Seller)
export const verifyOtpAndReleaseFunds = createAsyncThunk(
  'orderSellerActions/verifyOtpAndReleaseFunds',
  async ({ orderId, otp, jwt }: { orderId: number; otp: string; jwt: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/orders/payment/verify-otp-and-release`,
        { orderId, otp },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP and release funds');
    }
  }
);

const orderSellerActionsSlice = createSlice({
  name: 'orderSellerActions',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtpAndReleaseFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(verifyOtpAndReleaseFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Funds released successfully';
      })
      .addCase(verifyOtpAndReleaseFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = orderSellerActionsSlice.actions;
export default orderSellerActionsSlice.reducer;