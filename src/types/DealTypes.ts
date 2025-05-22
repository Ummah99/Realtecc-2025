import { HomeCategory } from "./HomeCategory";


export interface Deal{

    id: number;
    discount?:number;
    category:HomeCategory;
}

export interface ApiResponse{
    message:string;
    status:boolean;
}

export interface DealState{
    deals:Deal[],
    error:string | null,
    loading:boolean,
    isCreated:boolean;
    dealUpdate:boolean
}