import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api"; // adjust the API import as necessary
import { Coupon, CouponState } from "../../types/CouponTypes";




export const fetchAllCoupons = createAsyncThunk(
    "coupons/fetchAll",
    async ({ jwt }: { jwt: string }, { rejectWithValue }) => {
        try {
            const response = await api.get("/auth/coupon/get-all/coupons", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An unknown error occurred");
        }
    }
);


export const createCoupon = createAsyncThunk(
    "coupons/create",
    async ({ couponData, jwt }: { couponData: Coupon; jwt: string }, { rejectWithValue }) => {
        try {
            const response = await api.put(
                "/auth/coupon/create",
                couponData,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "An unknown error occurred");
        }
    }
);



export const deleteCoupon = createAsyncThunk(
    "coupons/delete",
    async ({ couponId, jwt }: { couponId: number, jwt: string }, { rejectWithValue }) => {
      try {
        const response = await api.delete(`auth/coupon/delete/${couponId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        return couponId; 
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "An unknown error occurred");
      }
    }
  );
  

const initialState: CouponState = {
    coupons: [],
    cart: null,
    loading: false,
    error: null,
    couponCreated: false,
    couponApplied: false,
};

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        setCart(state, action) {
            state.cart = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCoupons.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            .addCase(fetchAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createCoupon.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons.push(action.payload);
                state.couponCreated = true;
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteCoupon.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = state.coupons.filter(coupon => coupon.id !== action.payload);
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setCart } = couponSlice.actions;

export default couponSlice.reducer;
