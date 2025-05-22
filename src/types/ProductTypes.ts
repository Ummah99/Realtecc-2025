import { Seller } from "./SellerTypes";


export interface Product {

    id: number;
    name: string;
    title: string;
    description: string;
    mrpPrice: number;
    sellingPrice: number;
    discountPercentage: number;
    quantity: number;
    colour: string;
    images: string[];
    numbsRatings?: number;
    category?: Category;
    seller?: Seller;
    createdAt: Date;
    sizeType: string;
    availableSizes: string[];
    viewCount: number;
    reviews?: Review[];
    brand?: string;
    specifications?: Record<string, any>;
}

export interface Review {
    id?: number; 
    reviewText: string; 
    rating: number; 
    productImage: string[];
    productId: number; 
    userId?: number | null; 
    createdAt: Date; 
}

export interface Category {
    id?: number;
    name: string;
    categoryId: string;
    parentCategory: Category;
    level: number;
}


export interface WishList{
    id:number;
    wishListProducts:Product[] | null;   
}