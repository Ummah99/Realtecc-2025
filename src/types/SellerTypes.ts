import { Order } from "./OrderTypes";
import { User } from "./UserTypes";

export interface Seller{

    id:number;
    mobile:string;
    otp:string;
    gstin:string;
    pickUpAddress:PickUpAddress;
    bankDetails:BankDetails;
    sellerName:string;
    email:string;   
    businessDetails:BusinessDetails;
    password:string;
    accountStatus:string;


}

export interface PickUpAddress{

    name: string;
    mobile:string;
    pinCode:string;
    address:string;
    locality:string;
    city:string;
    state:string;   
}

export interface BankDetails{

    accountNumber:string;
    ifcsCode:string;
    accountHolderName:string;  
}

export interface BusinessDetails{
    businessName:string;  
}

export interface SellerReport{

    id?: number;
    seller:Seller;
    totalEarnings:number;
    totalSales:number;
    totalRefunds :number;
    totalTax:number;
    netEarnings:number;  
    totalOrders:number;
    canceledOrders:number;
    totalTransactions:number; 


}

export interface SellerState {
    report: SellerReport | null;
    loading: boolean;
    error: string | null;
  }

  export interface Transaction{

    id: number;
    customer:User;
    order:Order;
    seller:Seller;
    data:string

  }