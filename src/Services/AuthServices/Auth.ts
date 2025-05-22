import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/UserTypes";
import { api } from "../../Utils/api";
import jwtService from "../../Utils/JwtService";


export const SendLoginSignUpOTP = createAsyncThunk(
  "/auth/login-signup-otp",
  async (
      { email, role }: { email: string; role: string },
      { rejectWithValue }
  ) => {
      try {
          const response = await api.post("/auth/login-signup-otp", { email, role });
          console.log("login-otp-response", response);
          return response.data;
      } catch (e:any) {
          console.error("error", e);
          return rejectWithValue(e.response?.data || "Something went wrong");
      }
  }
);

export const signInUser = createAsyncThunk(
    "/auth/login-seller",
    async (loginRequest: { email: string; otp: string }, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/sign-in", loginRequest);
            console.log("sign in response", response);
            const jwt = response.data.jwt;
            await jwtService.setToken(jwt);
          
            return response.data;
        } catch (e:any) {
            console.error("error", e);
            return rejectWithValue(e.response?.data || "Something went wrong");
        }
    }
);

export const signInSeller = createAsyncThunk(
  "/auth/login-seller",
  async (values: { email: string; otp: string }, { rejectWithValue }) => {
      try {
          const response = await api.post("/auth/login-seller", values);
          console.log("sign in response", response);
          const jwt = response.data.jwt;
          await jwtService.setToken(jwt);
          
          return response.data;
      } catch (e:any) {
          console.error("error", e);
          return rejectWithValue(e.response?.data || "Something went wrong");
      }
  }
);

export const signUpUser = createAsyncThunk(
    "/auth/signup",
    async (signupRequest: { email: string; otp: string; fullName: string }, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/signup", signupRequest);
            console.log("sign up response", response.data);
            const jwt = response.data.jwt;
            await jwtService.setToken(jwt);
            return response.data;
        } catch (e:any) {
            console.error("error", e);
            return rejectWithValue(e.response?.data || "Something went wrong");
        }
    }
);


export const fetchUserProfile = createAsyncThunk<any, any>(
    "auth/fetchUserProfile",
    async ({ jwt }, { rejectWithValue }) => {
      try {
        const response = await api.get("/auth/users/profiles", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        console.log("User profile fetched:", response.data);
        return response.data; 
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        return rejectWithValue(error?.response?.data || "Failed to fetch user profile.");
      }
    }
  );

  export const updateUserAddress = createAsyncThunk<any, any>(
    "auth/fetchUserProfile",
    async ({ jwt, values}, { rejectWithValue }) => {
      try {
        const response = await api.put("/auth/update-address" ,values, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        console.log("User address updated:", response.data);
        return response.data; 
      } catch (error: any) {
        console.error("Error updating user address:", error);
        
        return rejectWithValue(error?.response?.data || "Failed to update user profile.");
      }
    }
  );


  export const createUserAddress = createAsyncThunk<any, any>(
    "auth/fetchUserProfile",
    async ({ jwt, values}, { rejectWithValue }) => {
      try {
        const response = await api.post("/auth/create-or-update-user-address" ,values, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        console.log("User address created:", response.data);
        return response.data; 
      } catch (error: any) {
        console.error("Error creating user address:", error);
        
        return rejectWithValue(error?.response?.data || "Failed to create user profile.");
      }
    }
  );

export const logOutUser = createAsyncThunk(
    "/auth/logout",
    async (navigate: (path: string) => void, { rejectWithValue }) => {
        try {
            await jwtService.removeToken();
            localStorage.clear(); 
            console.log("Log Out Success");
            navigate("/");
        } catch (e) {
            console.error("error", e);
            return rejectWithValue("Failed to log out");
        }
    }
);


interface AuthState {
    jwt: string | null;
    isLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    jwt: null,
    isLoggedIn: false,
    user: null,
    loading: false,
    error: null,
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signInUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.loading = false;
                state.jwt = action.payload.jwt;
                state.isLoggedIn = true;
                state.user = action.payload.user;
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signUpUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.jwt = action.payload.jwt;
                state.isLoggedIn = true;
                state.user = action.payload.user;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logOutUser.fulfilled, (state) => {
                state.jwt = null;
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(fetchUserProfile.pending,(state)=>{

                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled,(state,action)=>{
                state.loading=false;
                state.error=null;
                state.user = action.payload;
                state.isLoggedIn = true;
            })
    },
});

export default authSlice.reducer;
