import { PaymentLinkResponse } from "../payments/Payments";
import { Product } from "../product/ProductTypes";
import { Address, User } from "../user/UserTypes";


export  interface OrderState{



    orders:Order[];
    orderItem:OrderItem | null;
    currentOrder:Order | null;
    paymentOrder:any| null;
    loading:boolean | null;
    error:string |null;
    orderCancelled:boolean;
    paymentLink:PaymentLinkResponse | null;
}

export interface Order{

    id:number;
    orderId:number;
    user:User;
    sellerId?:number;
    orderItems:OrderItem[];
    orderDate:string;
    shippingAddress:Address;
    paymentDetails:any;
    paymentStatus:string;
    totalMrpPrice:number;
    totalSellingPrice:number;
    discount?:number;
    orderStatus:OrderStatus;
    escrowStatus: EscrowPayment;
    totalItem:number;
    deliveryDate:string;
}



export interface OrderItem{

    id:number;
    order:Order;
    product:Product;
    size:string[];
    quantity:number;
    mrpPrice:number;
    sellingPrice:number;
    userId:number;
}



export enum OrderStatus {
    PLACED = 'PLACED',
    CONFIRMED = 'CONFIRMED',
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
  }
  
  export enum EscrowPayment {
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PAYMENT_HELD = 'PAYMENT_HELD',
    DELIVERED = 'DELIVERED',
    DISPUTED = 'DISPUTED',
    FUNDS_RELEASED = 'FUNDS_RELEASED',
    REFUNDED = 'REFUNDED',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
  }