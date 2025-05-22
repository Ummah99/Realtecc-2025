import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../config/Api';

interface OrderBuyerActionsState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: OrderBuyerActionsState = {
  loading: false,
  error: null,
  success: null,
};

// ✅ Confirm Delivery (Buyer)
export const confirmDelivery = createAsyncThunk(
  'orderBuyerActions/confirmDelivery',
  async ({ orderId, jwt }: { orderId: number; jwt: string }, { rejectWithValue }) => {
    try {
      

      const response = await api.post(
        `/api/orders/payment/confirm-delivery/${orderId}`,
        {}, 
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      return response.data;
    } catch (error: any) {
      console.error("Confirm Delivery Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to confirm delivery');
    }
  }
);

// ✅ Raise Dispute (Buyer)
export const raiseDispute = createAsyncThunk(
  'orderBuyerActions/raiseDispute',
  async ({ orderId, reason, jwt }: { orderId: number; reason: string; jwt: string }, { rejectWithValue }) => {
    try {
      

      const response = await api.post(
        `/api/orders/payment/dispute`,
        { orderId, reason },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      return response.data;
    } catch (error: any) {
      console.error("Raise Dispute Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to raise dispute');
    }
  }
);

// ✅ Slice
const orderBuyerActionsSlice = createSlice({
  name: 'orderBuyerActions',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Confirm Delivery
    builder
      .addCase(confirmDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(confirmDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Delivery confirmed successfully';
      })
      .addCase(confirmDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Raise Dispute
    builder
      .addCase(raiseDispute.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(raiseDispute.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || 'Dispute raised successfully';
      })
      .addCase(raiseDispute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = orderBuyerActionsSlice.actions;
export default orderBuyerActionsSlice.reducer;
