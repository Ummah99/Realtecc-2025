import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { Review } from "../../types/ProductTypes";


interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null | undefined;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

// Helper function for API calls, includes JWT token in Authorization header
const fetchFromApi = async (endpoint: string, params = {}, method = "get", body = {}) => {
  const token = localStorage.getItem("jwt"); 

  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  try {
    const response = await api.request({
      url: endpoint,
      method,
      params,
      data: body,
      headers, 
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

// Fetch all reviews
export const fetchAllReviews = createAsyncThunk(
  "reviews/fetch-all-reviews",
  async (productId: number, { rejectWithValue }) => {
    try {
      return await fetchFromApi(`/auth/reviews/get-reviews/${productId}`, {});
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Add a review
export const addReview = createAsyncThunk(
  "reviews/add-review",
  async (
    { reviewData, productId }: { reviewData: Omit<Review, "userId" | "createdAt" |"productId">; productId: number | undefined },
    { rejectWithValue }
  ) => {
    if (productId === undefined) {
      return rejectWithValue("Product ID is required.");
    }

    try {
      const response = await fetchFromApi(`/auth/reviews/write-reviews/${productId}`, {}, "put", reviewData);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Delete a review
export const deleteReview = createAsyncThunk(
  "reviews/delete-review",
  async (reviewId: number, { rejectWithValue }) => {
    try {
      // Make an API request to delete the review
      await fetchFromApi(`/auth/reviews/delete-reviews/${reviewId}`, {}, "delete");
      return reviewId; 
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all reviews
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add a review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete a review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.reviews = state.reviews.filter((review) => review.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reviewSlice.reducer;
