import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary
 * @param fileBase64 - Base64 encoded image data
 * @param folder - Folder to upload to in Cloudinary
 * @returns Promise with the upload result
 */
export async function uploadImageToCloudinary(fileBase64: string, folder: string = 'supermall'): Promise<any> {
  try {
    // Remove the data URL prefix if present
    const base64Data = fileBase64.replace(/^data:image\/\w+;base64,/, '');
    
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64Data}`, {
      folder: folder,
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return {
      success: false,
      error: 'Failed to upload image'
    };
  }
}

/**
 * Deletes an image from Cloudinary
 * @param publicId - Public ID of the image to delete
 * @returns Promise with the deletion result
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<any> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      message: result.result === 'ok' ? 'Image deleted successfully' : 'Failed to delete image'
    };
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return {
      success: false,
      error: 'Failed to delete image'
    };
  }
}