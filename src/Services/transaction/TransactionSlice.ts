import { createAsyncThunk, createSlice, isAction } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { Transaction } from "../../types/SellerTypes";

interface TransactionState {
    transaction: Transaction | null;
    transactions: Transaction[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: TransactionState = {
    transaction: null,
    transactions: [],
    loading: false,
    error: null
};

export const fetchTransactionsBySeller = createAsyncThunk<
    Transaction[],
    string | null,
    { rejectValue: string }
>('transactions/fetchTransactionsBySeller', async (jwt, { rejectWithValue }) => {
    try {
        const response = await api.get<Transaction[]>('/auth/transactions/seller/transaction', {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else if (error.message) {
            return rejectWithValue(error.message);
        } else {
            return rejectWithValue('An unknown error occurred');
        }
    }
});


const transactionSlice = createSlice({

    name:"transactions",
    initialState,
    reducers:{},
    extraReducers: (builder)=>{

        builder.addCase(fetchTransactionsBySeller.pending, (state)=>{
            state.loading = true;
            state.error  = null;
        })

        .addCase(fetchTransactionsBySeller.fulfilled, (state,action)=>{
            state.loading = false;
            state.transactions = action.payload;
            state.error  = null;
        })

        .addCase(fetchTransactionsBySeller.rejected, (state,action)=>{
            state.loading = false;
            state.error  = action.payload || null;
        })


    }
})
export default transactionSlice.reducer;