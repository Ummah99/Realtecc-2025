import { Deal } from "./DealTypes";

export interface HomeCategory {
    id?: string;
    categoryId?: string;  
    homeSection?: string;
    name: string;
    image: string;
    description?:string;
    
    
  }
  

export interface HomeData{

    
    grid:HomeCategory[];
    shopByCategory:HomeCategory[];
    electricCategories:HomeCategory[];
    deals:Deal[];
    dealCategories:HomeCategory[];
}