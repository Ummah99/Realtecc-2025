import React, { useState, useEffect } from 'react';
import './CreateProduct.css';
import { 
  Box, 
  TextField, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Grid,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  IconButton, 
  Divider, 
  InputAdornment, 
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import { 
  PhotoCamera, 
  Close, 
  ArrowBack, 
  ArrowForward, 
  Add, 
  Search,
  ColorLens,
  Category,
  CurrencyRupee
} from '@mui/icons-material';
import { mainCategory } from '../../data/category/MainCtegory';
import { sizeTypes } from './util/sizeTypes';
import { uploadToCloudinary } from '../../Utils/CloudinaryUpload';
import { showSuccessToast, showErrorToast, showInfoToast } from '../../Utils/toast';
import { getJwtToken } from '../../Utils/authUtils';
import { useAppDispatch } from '../../Store/Store';
import { createProduct } from '../../Services/seller/SellerProductSlice';
import { Product } from '../../types/ProductTypes';

interface ProductFormData {
  title: string;
  description: string;
  mrpPrice: string;
  sellingPrice: string;
  color: string;
  images: string[];
  category: string;
  category2: string;
  category3: string;
  sizeType: string;
  availableSizes: string[];
  quantity: string;
}

export const CreateProduct: React.FC = () => {
  // Step management for wizard
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Information', 'Images & Appearance', 'Categories', 'Pricing & Inventory'];
  
  // Form data state
  const [colors] = useState(['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Orange', 'Purple', 'Brown', 'Gray']);
  const [loading, setLoading] = useState(false);
  const [categories] = useState(mainCategory);
  
  // Data validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [stepsCompleted, setStepsCompleted] = useState<boolean[]>([false, false, false, false]);
  
  // Categories handling
  const [filteredSecondCategories, setFilteredSecondCategories] = useState<any[]>([]);
  const [filteredThirdCategories, setFilteredThirdCategories] = useState<any[]>([]);
  const [categoryPath, setCategoryPath] = useState('');
  
  // Form data
  const [request, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    mrpPrice: '',
    sellingPrice: '',
    color: '',
    images: [],
    category: '',
    category2: '',
    category3: '',
    sizeType: '',
    availableSizes: [],
    quantity: '0',
  });

  // Image upload handling
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Size handling
  const [sizeType, setSizeType] = useState('');
  const [availableSizesOptions, setAvailableSizesOptions] = useState<string[]>([]);

  // Category search
  const [categorySearch, setCategorySearch] = useState('');
  const [category2Search, setCategory2Search] = useState('');
  const [category3Search, setCategory3Search] = useState('');

  // Dispatch for creating product
  const dispatch = useAppDispatch();

  // Validate the current step to enable/disable "Next" button
  useEffect(() => {
    validateStep(activeStep);
  }, [request, activeStep]);

  // Update second categories based on first category selection
  useEffect(() => {
    if (request.category) {
      const selectedMainCategory = categories.find(cat => cat.name === request.category);
      if (selectedMainCategory) {
        setFilteredSecondCategories(selectedMainCategory.levelTwoCategory);
        setFormData(prev => ({ ...prev, category2: '', category3: '' }));
        setFilteredThirdCategories([]);
      }
    } else {
      setFilteredSecondCategories([]);
      setFilteredThirdCategories([]);
    }
  }, [request.category, categories]);

  // Update third categories based on second category selection
  useEffect(() => {
    if (request.category2) {
      const selectedSecondCategory = filteredSecondCategories.find(cat => cat.name === request.category2);
      if (selectedSecondCategory) {
        setFilteredThirdCategories(selectedSecondCategory.subCategories);
        setFormData(prev => ({ ...prev, category3: '' }));
      }
    } else {
      setFilteredThirdCategories([]);
    }
  }, [request.category2, filteredSecondCategories]);

  // Update category path breadcrumb
  useEffect(() => {
    let path = '';
    if (request.category) {
      path = request.category;
      if (request.category2) {
        path += ' > ' + request.category2;
        if (request.category3) {
          path += ' > ' + request.category3;
        }
      }
    }
    setCategoryPath(path);
  }, [request.category, request.category2, request.category3]);

  // Validate each step's required fields
  const validateStep = (step: number) => {
    let isValid = true;
    const newErrors: {[key: string]: string} = {};
    
    switch(step) {
      case 0: // Basic Information
        if (!request.title) {
          newErrors.title = 'Title is required';
          isValid = false;
        }
        if (!request.description) {
          newErrors.description = 'Description is required';
          isValid = false;
        }
        break;
        
      case 1: // Images & Appearance
        if (request.images.length === 0) {
          newErrors.images = 'At least one product image is required';
          isValid = false;
        }
        if (!request.color) {
          newErrors.color = 'Color selection is required';
          isValid = false;
        }
        if (!request.sizeType) {
          newErrors.sizeType = 'Size type is required';
          isValid = false;
        }
        if (request.availableSizes.length === 0) {
          newErrors.availableSizes = 'At least one size must be selected';
          isValid = false;
        }
        break;
        
      case 2: // Categories
        if (!request.category) {
          newErrors.category = 'First category is required';
          isValid = false;
        }
        if (!request.category2) {
          newErrors.category2 = 'Second category is required';
          isValid = false;
        }
        break;
        
      case 3: // Pricing & Inventory
        if (!request.mrpPrice) {
          newErrors.mrpPrice = 'MRP Price is required';
          isValid = false;
        }
        if (!request.sellingPrice) {
          newErrors.sellingPrice = 'Selling Price is required';
          isValid = false;
        }
        if (Number(request.sellingPrice) > Number(request.mrpPrice)) {
          newErrors.sellingPrice = 'Selling price cannot be higher than MRP';
          isValid = false;
        }
        if (Number(request.quantity) <= 0) {
          newErrors.quantity = 'Quantity must be positive';
          isValid = false;
        }
        break;
    }
    
    setErrors(newErrors);
    const newStepsCompleted = [...stepsCompleted];
    newStepsCompleted[step] = isValid;
    setStepsCompleted(newStepsCompleted);
    return isValid;
  };
  
  // Form input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeTypeChange = (event: SelectChangeEvent<string>) => {
    const type = event.target.value as string;
    setSizeType(type);
    // Type assertion for accessing sizeTypes with a dynamic key
    setAvailableSizesOptions(sizeTypes[type as keyof typeof sizeTypes] || []);
    setFormData((prev) => ({ ...prev, sizeType: type, availableSizes: [] }));
  };

  const handleSizeSelect = (event: SelectChangeEvent<string[]>) => {
    const newSelectedSizes = event.target.value as string[];
    setFormData((prev) => ({ ...prev, availableSizes: newSelectedSizes }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, field: keyof ProductFormData) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Step navigation
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Drag and drop handlers for image upload
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
  };
  
  // Process uploaded files
  const handleFiles = async (files: FileList) => {
    setUploading(true);
    setUploadSuccess(false);
    try {
      const uploadedImages = await Promise.all(
        Array.from(files).map((file) => uploadToCloudinary(file))
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
      showInfoToast("Images Uploaded Successfully");
      setUploadSuccess(true);
    } catch (error: any) {
      showErrorToast(error.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((url) => url !== imageUrl),
    }));
  };

  // Submit form handler
  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return;
    }
    
    setLoading(true);
    
    try {
      const jwt = await getJwtToken();
      
      if (!jwt) {
        showErrorToast('Authentication token missing, please log in again');
        setLoading(false);
        return;
      }

      // Convert form data to Product type expected by the API
      const productData: Partial<Product> = {
        name: request.title,
        title: request.title,
        description: request.description,
        mrpPrice: Number(request.mrpPrice),
        sellingPrice: Number(request.sellingPrice),
        discountPercentage: Math.round(((Number(request.mrpPrice) - Number(request.sellingPrice)) / Number(request.mrpPrice)) * 100),
        quantity: Number(request.quantity),
        colour: request.color,
        images: request.images,
        sizeType: request.sizeType,
        availableSizes: request.availableSizes,
        viewCount: 0,
        createdAt: new Date(),
      };

      const response = await dispatch(createProduct({ request: productData as Product, jwt }));
      if (response.meta.requestStatus === "fulfilled") {
        showSuccessToast("Product Created Successfully");
        // Reset form
        setFormData({
          title: '',
          description: '',
          mrpPrice: '',
          sellingPrice: '',
          color: '',
          images: [],
          category: '',
          category2: '',
          category3: '',
          sizeType: '',
          availableSizes: [],
          quantity: '0',
        });
        setSizeType('');
        setActiveStep(0);
      } else {
        showErrorToast("Error Creating Product");
      }
    } catch (error: any) {
      console.error("Product creation failed:", error);
      showErrorToast("An error occurred while creating the product.");
    } finally {
      setLoading(false);
    }
  };

  // Filter functions for category search
  const filteredMainCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredSecondCategoriesWithSearch = filteredSecondCategories.filter(cat => 
    cat.name.toLowerCase().includes(category2Search.toLowerCase())
  );

  const filteredThirdCategoriesWithSearch = filteredThirdCategories.filter(cat => 
    cat.name.toLowerCase().includes(category3Search.toLowerCase())
  );

  // Render functions for each step content
  const renderBasicInfo = () => (
    <Box className="step-content">
      <TextField
        label="Product Title"
        name="title"
        value={request.title}
        onChange={handleInputChange}
        fullWidth
        required
        error={!!errors.title}
        helperText={errors.title}
        placeholder="Enter a descriptive product title"
        className="input-field"
      />

      <TextField
        label="Product Description"
        name="description"
        value={request.description}
        onChange={handleInputChange}
        fullWidth
        multiline
        rows={5}
        required
        error={!!errors.description}
        helperText={errors.description}
        placeholder="Describe your product in detail, including features and benefits"
        className="input-field"
      />
    </Box>
  );

  const renderImagesAndAppearance = () => (
    <Box className="step-content">
      <Typography variant="subtitle1" gutterBottom className="section-title">
        Product Images
      </Typography>
      
      {/* Drag and drop image upload */}
      <Box
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`dropzone ${dragActive ? 'active' : ''} ${errors.images ? 'error' : ''}`}
      >
        <input 
          type="file" 
          multiple 
          id="image-upload" 
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />
        <label htmlFor="image-upload" className="upload-label">
          <PhotoCamera sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            Drag & drop images here or click to browse
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload high-quality product images (max 5MB each)
          </Typography>
          {errors.images && (
            <Typography color="error" variant="caption">
              {errors.images}
            </Typography>
          )}
        </label>
        {uploading && <CircularProgress size={40} className="upload-progress" />}
      </Box>

      {/* Image preview grid */}
      {request.images.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }} className="image-grid">
          {request.images.map((imageUrl, index) => (
            <Box sx={{ width: { xs: '50%', sm: '33.33%', md: '25%' }, p: 1 }} key={index}>
              <Box className="image-preview-container">
                <img src={imageUrl} alt={`Product ${index + 1}`} className="image-preview" />
                <IconButton 
                  className="remove-image-btn"
                  onClick={() => handleRemoveImage(imageUrl)}
                  size="small"
                >
                  <Close />
                </IconButton>
                {index === 0 && (
                  <Chip label="Main Image" size="small" className="main-image-label" />
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Color Selection */}
        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          <FormControl fullWidth error={!!errors.color}>
          <InputLabel>Color</InputLabel>
          <Select
            value={request.color}
            onChange={(e) => handleSelectChange(e, 'color')}
            required
              startAdornment={
                <InputAdornment position="start">
                  <ColorLens />
                </InputAdornment>
              }
          >
            {colors.map((color) => (
              <MenuItem key={color} value={color}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: color.toLowerCase(),
                        border: '1px solid #ddd'
                      }}
                    />
                {color}
                  </Box>
              </MenuItem>
            ))}
          </Select>
            {errors.color && (
              <Typography variant="caption" color="error">
                {errors.color}
              </Typography>
            )}
        </FormControl>
        </Box>

        {/* Size Type Selection */}
        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          <FormControl fullWidth error={!!errors.sizeType}>
          <InputLabel>Size Type</InputLabel>
          <Select value={sizeType} onChange={handleSizeTypeChange} required>
            {Object.keys(sizeTypes).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
            {errors.sizeType && (
              <Typography variant="caption" color="error">
                {errors.sizeType}
              </Typography>
            )}
        </FormControl>
        </Box>

        {/* Size Selection */}
        <Box sx={{ width: '100%', p: 1 }}>
        {sizeType && (
            <FormControl fullWidth error={!!errors.availableSizes}>
    <InputLabel>Select Available Sizes</InputLabel>
    <Select
      multiple
      value={request.availableSizes}
      onChange={handleSizeSelect}
      renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} className="size-chip" />
          ))}
        </Box>
      )}
    >
      {availableSizesOptions.map((size) => (
        <MenuItem key={size} value={size}>
          {size}
        </MenuItem>
      ))}
    </Select>
              {errors.availableSizes && (
                <Typography variant="caption" color="error">
                  {errors.availableSizes}
                </Typography>
              )}
  </FormControl>
)}
        </Box>
      </Box>
    </Box>
  );

  const renderCategories = () => (
    <Box className="step-content">
      {/* Category path breadcrumb */}
      {categoryPath && (
        <Paper elevation={0} className="category-path">
          <Category sx={{ mr: 1, color: '#00927c' }} fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {categoryPath}
          </Typography>
        </Paper>
      )}
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* First Category Selection */}
        <Box sx={{ width: '100%', p: 1 }}>
          <FormControl fullWidth error={!!errors.category}>
          <InputLabel>First Category</InputLabel>
          <Select
            value={request.category}
            onChange={(e) => handleSelectChange(e, 'category')}
            required
          >
              <MenuItem>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search category..."
                  variant="outlined"
                  value={categorySearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategorySearch(e.target.value)}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </MenuItem>
              {filteredMainCategories.map((category) => (
              <MenuItem key={category.categoryId} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
            {errors.category && (
              <Typography variant="caption" color="error">
                {errors.category}
              </Typography>
            )}
        </FormControl>
        </Box>
        
        {/* Second Category Selection */}
        <Box sx={{ width: '100%', p: 1 }}>
          <FormControl fullWidth disabled={!request.category} error={!!errors.category2}>
          <InputLabel>Second Category</InputLabel>
          <Select
            value={request.category2}
            onChange={(e) => handleSelectChange(e, 'category2')}
            required
          >
              <MenuItem>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search category..."
                  variant="outlined"
                  value={category2Search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory2Search(e.target.value)}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </MenuItem>
              {filteredSecondCategoriesWithSearch.map((category) => (
              <MenuItem key={category.categoryId} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
            {errors.category2 && (
              <Typography variant="caption" color="error">
                {errors.category2}
              </Typography>
            )}
        </FormControl>
        </Box>
        
        {/* Third Category Selection */}
        <Box sx={{ width: '100%', p: 1 }}>
          <FormControl fullWidth disabled={!request.category2}>
            <InputLabel>Third Category (Optional)</InputLabel>
          <Select
            value={request.category3}
            onChange={(e) => handleSelectChange(e, 'category3')}
            >
              <MenuItem>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search category..."
                  variant="outlined"
                  value={category3Search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory3Search(e.target.value)}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </MenuItem>
              {filteredThirdCategoriesWithSearch.map((category) => (
                  <MenuItem key={category.categoryId} value={category.name}>
                    {category.name}
                  </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Box>
      </Box>
    </Box>
  );

  const renderPricingAndInventory = () => (
    <Box className="step-content">
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* MRP Price */}
        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          <TextField
            label="MRP Price (₹)"
            name="mrpPrice"
            type="number"
            value={request.mrpPrice}
            onChange={handleInputChange}
            required
            fullWidth
            error={!!errors.mrpPrice}
            helperText={errors.mrpPrice}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupee />
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        {/* Selling Price */}
        <Box sx={{ width: { xs: '100%', md: '50%' }, p: 1 }}>
          <TextField
            label="Selling Price (₹)"
            name="sellingPrice"
            type="number"
            value={request.sellingPrice}
            onChange={handleInputChange}
            required
            fullWidth
            error={!!errors.sellingPrice}
            helperText={errors.sellingPrice}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupee />
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        {/* Inventory Quantity */}
        <Box sx={{ width: '100%', p: 1 }}>
          <TextField
            label="Quantity in Stock"
            name="quantity"
            type="number"
            value={request.quantity}
            onChange={handleInputChange}
            required
            fullWidth
            error={!!errors.quantity}
            helperText={errors.quantity || "How many items do you have available to sell?"}
          />
        </Box>
      </Box>
      
      {/* Discount Display */}
      {request.mrpPrice && request.sellingPrice && Number(request.mrpPrice) > Number(request.sellingPrice) && (
        <Paper elevation={0} className="discount-display">
          <Typography variant="body1">
            You're offering a discount of{" "}
            <Typography component="span" color="success.main" fontWeight="bold">
              {(((Number(request.mrpPrice) - Number(request.sellingPrice)) / Number(request.mrpPrice)) * 100).toFixed(0)}%
            </Typography>
          </Typography>
        </Paper>
      )}
      
      {/* Summary before submission */}
      <Box className="product-summary">
        <Typography variant="h6" gutterBottom>
          Product Summary
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ width: '50%', p: 1 }}>
            <Typography variant="body2" color="text.secondary">Product Title:</Typography>
            <Typography variant="body1">{request.title || "Not specified"}</Typography>
          </Box>
          <Box sx={{ width: '50%', p: 1 }}>
            <Typography variant="body2" color="text.secondary">Category:</Typography>
            <Typography variant="body1">{categoryPath || "Not specified"}</Typography>
          </Box>
          <Box sx={{ width: '50%', p: 1 }}>
            <Typography variant="body2" color="text.secondary">MRP Price:</Typography>
            <Typography variant="body1">₹{request.mrpPrice || "Not specified"}</Typography>
          </Box>
          <Box sx={{ width: '50%', p: 1 }}>
            <Typography variant="body2" color="text.secondary">Selling Price:</Typography>
            <Typography variant="body1">₹{request.sellingPrice || "Not specified"}</Typography>
          </Box>
          <Box sx={{ width: '50%', p: 1 }}>
            <Typography variant="body2" color="text.secondary">Color:</Typography>
            <Typography variant="body1">{request.color || "Not specified"}</Typography>
          </Box>
          <Box sx={{ width: '50%', p: 1 }}>
            <Typography variant="body2" color="text.secondary">Size Type:</Typography>
            <Typography variant="body1">{request.sizeType || "Not specified"}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box className="add-product-container">
      <Paper elevation={3} className="product-form-wrapper">
        <Typography variant="h5" className="page-title">
          Add New Product
        </Typography>
        
        {/* Stepper Header */}
        <Stepper activeStep={activeStep} alternativeLabel className="form-stepper">
          {steps.map((label, index) => (
            <Step key={label} completed={stepsCompleted[index]}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Step Content */}
        <Box className="step-container">
          {activeStep === 0 && renderBasicInfo()}
          {activeStep === 1 && renderImagesAndAppearance()}
          {activeStep === 2 && renderCategories()}
          {activeStep === 3 && renderPricingAndInventory()}
          
          {/* Navigation Buttons */}
          <Box className="form-actions">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
              variant="outlined"
            >
              Back
            </Button>
            
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                disabled={!stepsCompleted[activeStep]}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!stepsCompleted[activeStep] || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
              >
                {loading ? "Creating Product..." : "Create Product"}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProduct; 