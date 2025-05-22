const CLOUDINARY_UPLOAD_PRESET = 'realtecc_preset';
const CLOUDINARY_CLOUD_NAME = 'realtecc';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Uploads an image file to Cloudinary
 * @param file The image file to upload
 * @returns A Promise that resolves to the Cloudinary URL of the uploaded image
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit');
    }

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export default uploadToCloudinary; 