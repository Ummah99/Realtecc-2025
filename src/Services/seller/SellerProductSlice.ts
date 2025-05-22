import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { Product } from "../../types/ProductTypes";

//  Seller Products
export const fetchSellerProduct = createAsyncThunk<Product[], any>(
  "/auth/seller/product",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/seller/product", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (e: any) {
      console.error("Error fetching seller products", e);
      return rejectWithValue(e.response?.data || "An error occurred");
    }
  }
);

//  a New Product
export const createProduct = createAsyncThunk<Product,
  { request: any; jwt: string | null }
>(
  "/SellerProduct/auth/product/create-product",
  async ({ request, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/product/create-product", request, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (e: any) {
      console.error("Error creating seller product", e);
      return rejectWithValue(e.response?.data || "An error occurred");
    }
  }
);


interface SellerProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}


const initialState: SellerProductState = {
  products: [],
  loading: false,
  error: null,
};


const SellerProductSlice = createSlice({
  name: "SellerProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; 
      })
      .addCase(fetchSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); 
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default SellerProductSlice.reducer;
