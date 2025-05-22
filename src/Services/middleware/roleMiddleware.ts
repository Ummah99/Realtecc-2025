import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../../Store/Store';

// Actions that should only be dispatched for users, not for sellers
const userOnlyActions = [
  'cart/fetchUserCart',
  'wishList/fetchWishList',
  'orderBuyerActions',  // All actions from this slice
];

// Actions that should only be dispatched for sellers, not for regular users
const sellerOnlyActions = [
  'seller/fetchSellerProfile',
  'sellerProduct/fetchSellerProduct',
  'orderSellerActions', // All actions from this slice
];

// Admin-only actions
const adminOnlyActions = [
  'admin/',  // All actions starting with admin/
  'deals/',  // All actions starting with deals/
  'coupon/', // All actions starting with coupon/
];

/**
 * Middleware to prevent dispatching actions based on user role
 */
export const roleMiddleware: Middleware = store => next => action => {
  const state = store.getState() as RootState;
  const userRole = state.auth.user?.role;
  
  // Skip role checks for actions without a type property or non-string types
  if (!action || typeof action !== 'object' || !('type' in action) || typeof action.type !== 'string') {
    return next(action);
  }
  
  const actionType = action.type as string;

  // Check if the user is logged in
  if (state.auth.isLoggedIn && userRole) {
    // For seller users, block user-only actions
    if (userRole === 'ROLE_SELLER') {
      if (userOnlyActions.some(prefix => actionType.startsWith(prefix))) {
        console.warn(`Action ${actionType} blocked: Sellers cannot perform user actions`);
        return;
      }
    }
    
    // For regular users, block seller-only actions
    // Check for both possible user role values
    const isRegularUser = ['ROLE_USER', 'ROLE_CUSTOMER'].includes(userRole as string);
    if (isRegularUser) {
      if (sellerOnlyActions.some(prefix => actionType.startsWith(prefix))) {
        console.warn(`Action ${actionType} blocked: Regular users cannot perform seller actions`);
        return;
      }
    }
    
    // For non-admin users, block admin-only actions
    if (userRole !== 'ROLE_ADMIN') {
      if (adminOnlyActions.some(prefix => actionType.startsWith(prefix))) {
        console.warn(`Action ${actionType} blocked: Only admins can perform this action`);
        return;
      }
    }
  }
  
  // Let the action through if it passed all checks
  return next(action);
}; 