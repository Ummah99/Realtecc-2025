import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem } from '../../types/CartTypes';
import { sumCartItemMrpPrice, sumCartItemSellingPrice } from '../utils/CashPricesCalculations';
import { api } from '../config/Api';

// Fetch User Cart
export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async ({ jwt }: { jwt: string }, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/find-user-cart', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Unknown error occurred');
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async ({ cartItem, jwt }: { cartItem: any; jwt: string | null }, { rejectWithValue }) => {
    try {
      const response = await api.patch('/auth/add/to-cart', cartItem, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Unknown error occurred');
    }
  }
);


// Delete Cart Item
export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({cartItemId,jwt}:{jwt:string | null, cartItemId:number}, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/auth/delete/${cartItemId}`,{

        headers: {
          Authorization: `Bearer ${jwt}`,
        }
      });
      return { cartItemId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Unknown error occurred');
    }
  }
);

// Update Cart Item
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (
    { jwt, cartItemId, cartItem }: { jwt: string | null; cartItemId: number; cartItem: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/auth/update/cart-item/${cartItemId}`, cartItem , {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Unknown error occurred');
    }
  }
);

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action: PayloadAction<Cart>) => {
    state.cart = action.payload;

    // ✅ Use values from backend instead of recalculating
    state.cart.totalMrpPrice = action.payload.totalMrpPrice;
    state.cart.totalSellingPrice = action.payload.totalSellingPrice;

    state.loading = false;
})

      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Item to Cart
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        if (state.cart) {
          state.cart.cartItems.push(action.payload);
          state.cart.totalMrpPrice = sumCartItemMrpPrice(state.cart.cartItems);
          state.cart.totalSellingPrice = sumCartItemSellingPrice(state.cart.cartItems);
        }
        state.loading = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Cart Item
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart.cartItems = state.cart.cartItems.filter(
            (item) => item.id !== action.payload.cartItemId
          );
          state.cart.totalMrpPrice = sumCartItemMrpPrice(state.cart.cartItems);
          state.cart.totalSellingPrice = sumCartItemSellingPrice(state.cart.cartItems);
        }
        state.loading = false;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem>) => {
        if (state.cart) {
            state.cart.cartItems = state.cart.cartItems.map((item) =>
                item.id === action.payload.id ? { ...item, ...action.payload } : item
            );
    
            // ✅ Only calculate once, preventing multiple quantity multiplications
            state.cart.totalSellingPrice = sumCartItemSellingPrice(state.cart.cartItems);
        }
        state.loading = false;
    })
    
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
