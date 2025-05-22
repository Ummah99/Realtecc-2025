import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Cart } from "../../types/CartTypes";
import { api } from "../config/Api";
import { Coupon, CouponState } from "../../types/CouponTypes";


export const applyCoupon = createAsyncThunk<Cart, {
    apply: string;
    couponCode: string;
    orderValue: number;
    jwt: string;
}, { rejectValue: string }>(
    "coupon/applyCoupon",
    async ({ apply, couponCode, orderValue, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.put(
                "auth/coupon/apply/coupon",
                null,
                {
                    params: { apply, couponCode, orderValue },
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("Error applying coupon:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "An error occurred while applying the coupon.");
        }
    }
);


const initialState: CouponState = {
    coupons: [],
    cart: null,
    loading: false,
    error: null,
    couponApplied: false,
    couponCreated: false,
};


const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        resetCouponState: (state) => {
            state.coupons = [];
            state.cart = null;
            state.loading = false;
            state.error = null;
            state.couponApplied = false;
            state.couponCreated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            
            .addCase(applyCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action: PayloadAction<Cart>) => {
                state.cart = action.payload;
                state.loading = false;
                state.couponApplied = true;
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                console.error("Failed to apply coupon:", action.payload);
            });
    },
});


export const { resetCouponState } = couponSlice.actions;
export default couponSlice.reducer;
