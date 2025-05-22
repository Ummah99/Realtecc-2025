import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { OrderState, Order } from "../../types/OrderTypes";
import { api } from "../config/Api";
import { RepeatOneSharp } from "@mui/icons-material";
import { PaymentLinkResponse } from "../../types/Payments";




interface Address{


  pinCode:string;
  address:string;
  locality:string;
  city:string;
  state:string;
  
  }
  export const createOrder = createAsyncThunk<
  PaymentLinkResponse,
  { jwt: string; address: Address; paymentMethod: string; phoneNumber?: string },
  { rejectValue: string }
>(
  "order/createOrder",
  async ({ jwt, address, paymentMethod, phoneNumber }, { rejectWithValue }) => {
    try {
      // ✅ Construct the API URL with query parameters
      let apiUrl = `/api/orders/order?paymentMethod=${paymentMethod}`;
      if (paymentMethod === "M_PESA" && phoneNumber) {
        apiUrl += `&phoneNumber=${encodeURIComponent(phoneNumber)}`;
      }

      const response = await api.post(
        apiUrl, 
        address, 
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Order creation failed:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "An error occurred while creating the order."
      );
    }
  }
);




export const fetchOrders = createAsyncThunk<Order[], {
  jwt: string;
}, { rejectValue: string }>(
  "order/fetchOrders",
  async ({ jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "An error occurred while fetching orders.");
    }
  }
);



export const fetchSellerOrders = createAsyncThunk<Order[], {
  jwt: string;
}, { rejectValue: string }>(
  "order/fetchSellerOrders",
  async ({ jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/seller/orders/get-all-orders", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "An error occurred while fetching orders.");
    }
  }
);

export const fetchOrderById = createAsyncThunk<Order, {
  orderId: number;
  jwt: string;
}, { rejectValue: string }>(
  "order/fetchOrderById",
  async ({ orderId, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get(`api/orders/get/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "An error occurred while fetching the order.");
    }
  }
);

// fetching an order by ID
export const fetchUserOrders = createAsyncThunk<Order[], {
 
  jwt: string;
}, { rejectValue: string }>(
  "order/fetch-user-order",
  async ({  jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/orders/get-all-orders", 
        {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "An error occurred while fetching the order.");
    }
  }
);

// Thunk for updating an order status
export const updateOrderStatus = createAsyncThunk<Order, {
  orderId: number;
  status: string; 
  jwt: string;
}, { rejectValue: string }>(
  "order/updateOrderStatus",
  async ({ orderId, status, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/auth/seller/orders/update-order/${orderId}/${status}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      return response.data; 
    } catch (error: any) {
      
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred while updating the order status.";
      return rejectWithValue(errorMessage);
    }
  }
);


// Thunk for updating the payment details of an order
export const updateOrderPayment = createAsyncThunk<Order, {
  orderId: number;
  paymentDetails: any; // Payment data to update
  jwt: string;
}, { rejectValue: string }>(
  "order/updateOrderPayment",
  async ({ orderId, paymentDetails, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/payment`, paymentDetails, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "An error occurred while updating the payment details.");
    }
  }
);

// Thunk for deleting an order
export const deleteOrder = createAsyncThunk<void, {
  orderId: number;
  jwt: string;
}, { rejectValue: string }>(
  "order/deleteOrder",
  async ({ orderId, jwt }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/orders/cancel-order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "An error occurred while deleting the order.");
    }
  }
);


const initialState: OrderState = {
  orders: [],
  orderItem: null,
  currentOrder: null,
  paymentOrder: null,
  loading: false,
  error: null,
  orderCancelled: false,
  paymentLink: null
};

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.orders = [];
      state.orderItem = null;
      state.currentOrder = null;
      state.paymentOrder = null;
      state.loading = false;
      state.error = null;
      state.orderCancelled = false;
      state.paymentLink = null;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<PaymentLinkResponse>) => {
        state.loading = false;
        state.paymentLink = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      // Fetch seller Orders
    builder
    .addCase(fetchSellerOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchSellerOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
      state.loading = false;
      state.orders = action.payload;
      state.error = null;
    })
    .addCase(fetchSellerOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload; 
        // Update the orders array with the new status
        const updatedOrder = action.payload;
        const orderIndex = state.orders.findIndex((order) => order.id === updatedOrder.id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder; // Replace the old order with the updated one
        } else {
          state.orders.push(updatedOrder); // If not found, add it (unlikely but safe)
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      // fwtc user order
    builder
    .addCase(fetchUserOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
      state.loading = false;
      state.orders = action.payload;
      state.error = null;
    })
    .addCase(fetchUserOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Order Payment
    builder
      .addCase(updateOrderPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderPayment.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(updateOrderPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Order
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.id !== action.meta.arg.orderId);
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
