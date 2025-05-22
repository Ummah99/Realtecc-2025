import { CartItem } from "../../types/CartTypes";

export const sumCartItemMrpPrice = (cartItems: CartItem[]) => {
    return cartItems.reduce((acc, item) => acc + item.mrpPrice , 0);
};

export const sumCartItemSellingPrice = (cartItems: CartItem[]) => {
    return cartItems.reduce((acc, item) => acc + item.sellingPrice , 0);
};


