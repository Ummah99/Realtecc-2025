// Type definitions for Product components
export interface ProductCategory {
  id: number | string;
  name: string;
  parentId?: number | string;
  groupId?: number | string;
}

export interface CategoryGroup {
  id: number | string;
  name: string;
  categories: ProductCategory[];
}

export interface ProductVariant {
  id: string;
  name?: string;
  color?: string;
  size?: string;
  material?: string;
  price: number;
  stock: number;
  sku?: string; // SKU for variants
}

export interface ProductTag {
  id: number;
  name: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  sku?: string; // Will use the variant's SKU if applicable
}

export interface ShippingInfo {
  freeShipping: boolean;
  shippingFee: string;
  processingTime: string;
  shippingTime?: string;
  shippingCost?: number;
}

export type Currency = 'RUB' | 'CNY';

export interface CurrencySymbols {
  [key: string]: string;
} 