import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../Utils/api";
import { Product } from "../../types/product/ProductTypes";


// Helper function for API calls
const fetchFromApi = async (endpoint: string, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Fetch product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetch-product-ById",
  async (productId: number, { rejectWithValue }) => {
    try {
      return await fetchFromApi(`/auth/product/${productId}/product`);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Search products
export const searchProducts = createAsyncThunk(
  "products/search-products",
  async (query: Record<string, any>, { rejectWithValue }) => {
    try {
      return await fetchFromApi("/auth/product/find-product", query);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update product (full product data)
export const updateProductQuantity = createAsyncThunk(
  "products/update-product",
  async (
    { jwt, productId, ...productData }: { jwt: string; productId: number } & Partial<Product>,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        `/auth/update-product/${productId}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data; // Expecting the updated Product object
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "products/delete-product",
  async (
    { jwt, productId }: { jwt: string; productId: number },
    { rejectWithValue }
  ) => {
    try {
      await api.delete(`/auth/delete/product-with/${productId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return productId; // Return the ID of the deleted product
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "products/fetch-all-products",
  async (params: Record<any, any>, { rejectWithValue }) => {
    try {
      return await fetchFromApi("/auth/product/get-all-products", {
        ...params,
      });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

interface ProductState {
  product: Product | null;
  products: Product[];
  totalPages: number;
  loading: boolean;
  searchProduct: Product[];
  error: string | null | undefined | any;
}

const initialState: ProductState = {
  product: null,
  products: [],
  totalPages: 1,
  loading: false,
  searchProduct: [],
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update product
      .addCase(updateProductQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductQuantity.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const updatedProductIndex = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (updatedProductIndex >= 0) {
          state.products[updatedProductIndex] = action.payload;
        }
      })
      .addCase(updateProductQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;