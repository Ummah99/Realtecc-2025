import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "../Services/AuthServices/Auth";
import cartReducer from "../Services/cart/CartSlice";
import homeReducer from "../Services/customer/customerSlice";
import productReducer from "../Services/customer/ProductSlice";
import wishlistReducer from "../Services/wishlist/WushListSlice";
import orderReducer from "../Services/order/OrderSlice";
import orderSellerActionsReducer from "../Services/order/OrderSellerActionsSlice";
import orderBuyerActionsReducer from "../Services/order/OrderActionsBuyerSlice";
import reviewsReducer from "../Services/reviews/ReviewsSlice";
import sellerReducer from "../Services/seller/SellerSlice";
import sellerProductReducer from "../Services/seller/SellerProductSlice";
import couponReducer from "../Services/coupon/CouponSlice";
import transactionReducer from "../Services/transaction/TransactionSlice";
import adminReducer from "../Services/admin/AdminSlice";
import dealReducer from "../Services/admin/AdminDealSlice";
import userReducer from "../Services/user/UserSlice";
import chatReducer from "../Services/chat/ChatSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist configurations
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["jwt", "isLoggedIn", "user"]
};

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["cart"]
};

const wishlistPersistConfig = {
  key: "wishList",
  storage,
  whitelist: ["wishlist"]
};

const sellerPersistConfig = {
  key: "seller",
  storage,
  whitelist: ["seller"]
};

const rootReducer = combineReducers({
    seller: persistReducer(sellerPersistConfig, sellerReducer),
    sellerProduct: sellerProductReducer,
    product: productReducer,
    auth: persistReducer(authPersistConfig, authReducer),
    cart: persistReducer(cartPersistConfig, cartReducer),
    order: orderReducer,
    wishList: persistReducer(wishlistPersistConfig, wishlistReducer),
    reviews: reviewsReducer,
    transactions: transactionReducer,
    admin: adminReducer,
    deals: dealReducer,
    coupon: couponReducer,
    home: homeReducer,
    user: userReducer,
    orderBuyerActions: orderBuyerActionsReducer,
    orderSellerActions: orderSellerActionsReducer,
    chat: chatReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store; 