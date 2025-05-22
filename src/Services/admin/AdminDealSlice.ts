import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { Deal, DealState, ApiResponse } from "../../types/DealTypes";


export const fetchDeals = createAsyncThunk<Deal[], void>(
    "deals/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/auth/deals/get-all/deals");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An unknown error occurred");
        }
    }
);

export const createDeal = createAsyncThunk<ApiResponse, any>(
    "deals/create",
    async (deal, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/deals/create", deal);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An unknown error occurred");
        }
    }
);

export const updateDeal = createAsyncThunk<ApiResponse, Deal>(
    "deals/update",
    async (deal, { rejectWithValue }) => {
        try {
            const response = await api.put(`/deals/${deal.id}`, deal);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An unknown error occurred");
        }
    }
);

export const deleteDeal = createAsyncThunk<ApiResponse, number>(
    "deals/delete",
    async (dealId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/auth/deals/delete/${dealId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An unknown error occurred");
        }
    }
);


const initialstate: DealState = {
    deals: [],
    loading: false,
    error: null,
    dealUpdate: false,
    isCreated: false,
};


const dealSlice = createSlice({
    name: "deals",
    initialState: initialstate,
    reducers: {
        resetDealStatus: (state) => {
            state.isCreated = false;
            state.dealUpdate = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Deals
            .addCase(fetchDeals.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDeals.fulfilled, (state, action) => {
                state.loading = false;
                state.deals = action.payload;
            })
            .addCase(fetchDeals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create Deal
            .addCase(createDeal.pending, (state) => {
                state.loading = true;
            })
            .addCase(createDeal.fulfilled, (state, action) => {
                state.loading = false;
                state.isCreated = true;
                state.deals.push(action.meta.arg);
            })
            .addCase(createDeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update Deal
            .addCase(updateDeal.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDeal.fulfilled, (state, action) => {
                state.loading = false;
                state.dealUpdate = true;
                const updatedDeal = action.meta.arg;
                state.deals = state.deals.map((deal) =>
                    deal.id === updatedDeal.id ? updatedDeal : deal
                );
            })
            .addCase(updateDeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete Deal
            .addCase(deleteDeal.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteDeal.fulfilled, (state, action) => {
                state.loading = false;
                const deletedDealId = action.meta.arg;
                state.deals = state.deals.filter((deal) => deal.id !== deletedDealId);
            })
            .addCase(deleteDeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const { resetDealStatus } = dealSlice.actions;
export default dealSlice.reducer;
