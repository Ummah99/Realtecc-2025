import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { HomeCategory } from "../../types/HomeCategory";
import { Seller } from "../../types/SellerTypes";


export const fetchAllSellers = createAsyncThunk(
    "sellers/fetchAll",
    async ({ jwt }: { jwt: string | null}, { rejectWithValue }) => {
        try {
            const response = await api.get("/auth/get-all-seller", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response.data;
        } catch (error: any) {
            console.error("Fetch all sellers error:", error);
            return rejectWithValue(error.response?.data || "An unknown error occurred");
        }
    }
);


export const changeSellerStatus = createAsyncThunk(
    "sellers/changeStatus",
    async ({ jwt, sellerStatus, sellerId }: { jwt: string | null, sellerStatus: string, sellerId: number }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/auth/admin/seller/change/${sellerId}/${sellerStatus}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                }
            });

            return response.data;
        } catch (error: any) {
            console.error("Fail changing status:", error);
            return rejectWithValue(error.response?.data || "An unknown error occurred");
        }
    }
);


export const updateHomeCategory = createAsyncThunk(
    "homeCategory/update",
    async (
        { id, data }: { id: number; data: HomeCategory },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.post(`/update-home-category/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Update Home Category error:", error);
            return rejectWithValue(error.response?.data || "An unknown error occurred");
        }
    }
);


export const fetchHomeCategory = createAsyncThunk(
    "homeCategory/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/fetch/home/category");
            return response.data;
        } catch (error: any) {
            console.error("Fetch Home Categories error:", error);
            return rejectWithValue(error.response?.data || "An unknown error occurred");
        }
    }
);

const homeCategorySlice = createSlice({
    name: "admin",
    initialState: {
        sellers: [] as Seller[],
        homeCategories: [] as HomeCategory[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
           
            .addCase(fetchAllSellers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllSellers.fulfilled, (state, action) => {
                state.loading = false;
                state.sellers = action.payload;
            })
            .addCase(fetchAllSellers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            
            .addCase(changeSellerStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(changeSellerStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedSeller = action.payload;
                state.sellers = state.sellers.map((seller) =>
                    seller.id === updatedSeller.sellerId ? updatedSeller : seller
                );
            })
            .addCase(changeSellerStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            
            .addCase(updateHomeCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateHomeCategory.fulfilled, (state, action) => {
                state.loading = false;
                const updatedCategory = action.payload;
                state.homeCategories = state.homeCategories.map((category) =>
                    category.id === updatedCategory.id ? updatedCategory : category
                );
            })
            .addCase(updateHomeCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch home category
            .addCase(fetchHomeCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchHomeCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.homeCategories = action.payload;
            })
            .addCase(fetchHomeCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default homeCategorySlice.reducer;
