import React from 'react';
import './ProductSummary.css';
import { ProductCategory, ProductVariant, ProductAttribute, CategoryGroup, ProductTag, ShippingInfo, Currency, CurrencySymbols } from './types';

interface ProductSummaryProps {
  // Basic Information (Step 1)
  productName: string;
  productDescription: string;
  productCategory: number | string | ''; // Adjustment for compatibility with CreateProduct
  productSKU: string;
  productImages: File[];
  imagePreviewUrls: string[];
  
  // Variants & Attributes (Step 2)
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  
  // Categories and Tags
  categories: ProductCategory[];
  categoryGroups: CategoryGroup[];
  selectedTags: number[] | ProductTag[]; // Adjustment for compatibility with CreateProduct
  availableTags: ProductTag[];
  
  // Shipping Information
  shippingInfo: ShippingInfo;
  
  // Currency
  currency: Currency;
  currencySymbols: CurrencySymbols;
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({
  productName,
  productDescription,
  productCategory,
  productSKU,
  productImages,
  imagePreviewUrls,
  variants,
  attributes,
  categories,
  categoryGroups,
  selectedTags,
  availableTags,
  shippingInfo,
  currency,
  currencySymbols
}) => {
  // Helper function to get category name
  const getCategoryName = (categoryId: string | number | null): string => {
    if (!categoryId) return 'No category selected';
    const categoryIdString = typeof categoryId === 'number' ? String(categoryId) : categoryId;
    const category = categories.find(cat => String(cat.id) === categoryIdString);
    if (!category) return 'Unknown category';
    
    if (category.groupId) {
      const group = categoryGroups.find(g => g.id === category.groupId);
      return `${group ? group.name : ''} > ${category.name}`;
    }
    
    return category.name;
  };
  
  // Truncate description for summary view
  const truncateDescription = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Function for price formatting
  const formatPrice = (price?: number) => {
    if (price === undefined) return '0.00 ' + currencySymbols[currency];
    return `${price.toFixed(2)} ${currencySymbols[currency]}`;
  };

  // Function to convert tags
  const getTagItems = () => {
    if (Array.isArray(selectedTags) && selectedTags.length > 0) {
      if (typeof selectedTags[0] === 'number') {
        // If selectedTags is an array of numbers
        return (selectedTags as number[]).map(tagId => {
          const tag = availableTags.find(t => t.id === tagId);
          return tag ? tag : { id: tagId, name: `Tag ${tagId}` };
        });
      } else {
        // If selectedTags is already an array of ProductTag objects
        return selectedTags as ProductTag[];
      }
    }
    return [];
  };

  return (
    <div className="product-summary">
      <div className="product-summary-section">
        <div className="summary-confirmation">
          <p>Please review all information above before publishing your product. Once published, you can still edit your product later.</p>
        </div>
      </div>
      
      <div className="product-summary-section">
        <h3>Basic Information</h3>
        <div className="product-summary-content">
          <div className="product-summary-row">
            <span className="product-summary-label">Name:</span>
            <span className="product-summary-value">{productName}</span>
          </div>
          <div className="product-summary-row">
            <span className="product-summary-label">SKU:</span>
            <span className="product-summary-value">{productSKU}</span>
          </div>
          <div className="product-summary-row">
            <span className="product-summary-label">Category:</span>
            <span className="product-summary-value">{getCategoryName(productCategory)}</span>
          </div>
          <div className="product-summary-row">
            <span className="product-summary-label">Description:</span>
            <div className="product-summary-value description">{truncateDescription(productDescription)}</div>
          </div>
        </div>
      </div>
      
      <div className="product-summary-section">
        <h3>Product Images</h3>
        <div className="product-images-preview">
          {imagePreviewUrls.length > 0 ? (
            imagePreviewUrls.map((url, index) => (
              <div key={index} className="product-image-thumbnail">
                <img src={url} alt={`Product image ${index + 1}`} />
              </div>
            ))
          ) : (
            <p>No images uploaded</p>
          )}
        </div>
      </div>
      
      <div className="product-summary-section">
        <h3>Variants ({variants.length})</h3>
        {variants.length > 0 ? (
          <div className="variants-table">
            <div className="variants-header">
              <div className="variant-cell">Name</div>
              <div className="variant-cell">SKU</div>
              <div className="variant-cell">Price</div>
              <div className="variant-cell">Stock</div>
            </div>
            {variants.map((variant) => (
              <div key={variant.id} className="variant-row">
                <div className="variant-cell">
                  {variant.name || 
                    [
                      variant.color && `Color: ${variant.color}`,
                      variant.size && `Size: ${variant.size}`,
                      variant.material && `Material: ${variant.material}`
                    ].filter(Boolean).join(', ') || 'Standard'
                  }
                </div>
                <div className="variant-cell">{variant.sku || '-'}</div>
                <div className="variant-cell">{formatPrice(variant.price)}</div>
                <div className="variant-cell">{variant.stock}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No variants defined</p>
        )}
      </div>
      
      <div className="product-summary-section">
        <h3>Attributes ({attributes.length})</h3>
        {attributes.length > 0 ? (
          <div className="attributes-table">
            <div className="attributes-header">
              <div className="attribute-cell">Name</div>
              <div className="attribute-cell">Weight</div>
              <div className="attribute-cell">Dimensions</div>
            </div>
            {attributes.map((attribute) => (
              <div key={attribute.id} className="attribute-row">
                <div className="attribute-cell">{attribute.name}</div>
                <div className="attribute-cell">{attribute.weight || '0'} kg</div>
                <div className="attribute-cell">
                  {attribute.length && attribute.width && attribute.height ? 
                    `${attribute.length} × ${attribute.width} × ${attribute.height} cm` : 
                    'No dimensions specified'
                  }
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No attributes defined</p>
        )}
      </div>
      
      <div className="product-summary-section">
        <h3>Tags</h3>
        <div className="tags-container">
          {getTagItems().length > 0 ? (
            getTagItems().map((tag) => (
              <span key={tag.id} className="product-tag">{tag.name}</span>
            ))
          ) : (
            <p>No tags selected</p>
          )}
        </div>
      </div>
      
      <div className="product-summary-section">
        <h3>Shipping Information</h3>
        <div className="product-summary-content">
          <div className="product-summary-row">
            <span className="product-summary-label">Shipping time:</span>
            <span className="product-summary-value">
              {shippingInfo.shippingTime || shippingInfo.processingTime || 'Not specified'} 
              {(shippingInfo.shippingTime || shippingInfo.processingTime) ? ' days' : ''}
            </span>
          </div>
          <div className="product-summary-row">
            <span className="product-summary-label">Shipping costs:</span>
            <span className="product-summary-value">
              {shippingInfo.shippingCost !== undefined ? 
                formatPrice(shippingInfo.shippingCost) : 
                (shippingInfo.shippingFee || '0') + ' ' + currencySymbols[currency]
              }
            </span>
          </div>
          <div className="product-summary-row">
            <span className="product-summary-label">Free shipping:</span>
            <span className="product-summary-value">{shippingInfo.freeShipping ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 