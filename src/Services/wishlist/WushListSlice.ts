import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { Product } from "../../types/ProductTypes";

interface WishList {
  id: number;
  wishListProducts: Product[];
}

interface WishListState {
  wishlist: WishList | null;
  loading: boolean;
  error: string | null;
}

const initialState: WishListState = {
  wishlist: null,
  loading: false,
  error: null,
};

// Fetch Wishlist
export const fetchWishList = createAsyncThunk<WishList, {jwt:string}>(
  "/auth/wishlist",
  async ({jwt}, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/wishlist/get/list", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data || "An error occurred");
    }
  }
);
// Add Product to Wishlist
export const addToWishList = createAsyncThunk<
  Product,
  { productId?: number; jwt: string }
>("/auth/wishlist/add", async ({ productId, jwt }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `/auth/wishlist/add/list/${productId}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (e: any) {
    return rejectWithValue(e.response?.data || "An error occurred");
  }
});


const WishListSlice = createSlice({
  name: "WishList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishList.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToWishList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishList.fulfilled, (state, action) => {
        state.loading = false;
        if (state.wishlist) {
          state.wishlist.wishListProducts.push(action.payload);
        }
      })
      .addCase(addToWishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default WishListSlice.reducer;
