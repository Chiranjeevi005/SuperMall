import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "../../../../../dataBase/dbConfig";
import { UserModels } from "../../../../../models/user";
import { getTokenFromRequest, verifyToken } from "../../../../lib/auth";
import { errorResponse, successResponse, unauthorizedResponse, notFoundResponse, validationErrorResponse } from "../../../../lib/api-response";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "../../../../lib/cloudinary";
import bcrypt from "bcryptjs";

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);
    const user = await UserModels.findById(decoded.id).select("-password");

    if (!user) {
      return notFoundResponse("User not found");
    }

    return successResponse({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      savedAddresses: user.savedAddresses || [],
      avatar: user.avatar || null,
    }, "Profile retrieved successfully");

  } catch (error) {
    console.error("Error getting profile:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to get profile"
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    await connectToDataBase();

    const token = getTokenFromRequest(request);
    if (!token) {
      return unauthorizedResponse("Authentication token required");
    }

    const decoded = verifyToken(token);
    const { name, address, currentPassword, newPassword, savedAddresses, avatar } = await request.json();

    const user = await UserModels.findById(decoded.id).select("+password");
    if (!user) {
      return notFoundResponse("User not found");
    }

    // Validate input
    const updates: any = {};
    if (name && name.trim().length >= 2) {
      updates.name = name.trim();
    }
    if (address !== undefined) {
      updates.address = address.trim();
    }
    
    // Handle avatar upload
    if (avatar !== undefined) {
      // If user had a previous avatar, delete it from Cloudinary
      if (user.avatar && avatar !== user.avatar) {
        try {
          // Extract public ID from the old avatar URL
          const publicId = user.avatar.split('/').pop()?.split('.')[0];
          if (publicId) {
            await deleteImageFromCloudinary(publicId);
          }
        } catch (error) {
          console.error("Error deleting old avatar:", error);
        }
      }
      
      // If a new avatar is provided (base64 string), upload it to Cloudinary
      if (avatar && avatar.startsWith('data:image')) {
        const uploadResult = await uploadImageToCloudinary(avatar, 'supermall/avatars');
        if (uploadResult.success) {
          updates.avatar = uploadResult.url;
        } else {
          return errorResponse("Failed to upload avatar image", 400);
        }
      } else if (avatar === null) {
        // If avatar is explicitly set to null, remove it
        updates.avatar = null;
      } else if (typeof avatar === 'string' && avatar.startsWith('http')) {
        // If avatar is already a URL, keep it as is
        updates.avatar = avatar;
      }
    }
    
    // Handle saved addresses
    if (savedAddresses !== undefined) {
      // Validate addresses
      if (Array.isArray(savedAddresses)) {
        const validationErrors: string[] = [];
        
        // Validate each address
        for (let i = 0; i < savedAddresses.length; i++) {
          const addr = savedAddresses[i];
          
          if (!addr.fullName || addr.fullName.trim().length < 2) {
            validationErrors.push(`Address ${i + 1}: Full name is required and must be at least 2 characters`);
          }
          
          if (!addr.phone || !/^\d{10}$/.test(addr.phone)) {
            validationErrors.push(`Address ${i + 1}: Please enter a valid 10-digit phone number`);
          }
          
          if (!addr.addressLine1 || addr.addressLine1.trim().length < 5) {
            validationErrors.push(`Address ${i + 1}: Address line 1 is required and must be at least 5 characters`);
          }
          
          if (!addr.city || addr.city.trim().length < 2) {
            validationErrors.push(`Address ${i + 1}: City is required and must be at least 2 characters`);
          }
          
          if (!addr.state || addr.state.trim().length < 2) {
            validationErrors.push(`Address ${i + 1}: State is required and must be at least 2 characters`);
          }
          
          if (!addr.postalCode || !/^\d{6}$/.test(addr.postalCode)) {
            validationErrors.push(`Address ${i + 1}: Please enter a valid 6-digit postal code`);
          }
          
          // Validate label if provided
          if (addr.label && !['home', 'work', 'other'].includes(addr.label)) {
            validationErrors.push(`Address ${i + 1}: Label must be either home, work, or other`);
          }
        }
        
        // Ensure only one address can be default
        const defaultAddresses = savedAddresses.filter((addr: any) => addr.isDefault);
        if (defaultAddresses.length > 1) {
          validationErrors.push("Only one address can be set as default");
        }
        
        if (validationErrors.length > 0) {
          return validationErrorResponse(validationErrors);
        }
        
        updates.savedAddresses = savedAddresses;
      }
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return errorResponse("Current password is required to change password", 400);
      }
      
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return errorResponse("Current password is incorrect", 400);
      }
      
      if (newPassword.length < 6) {
        return errorResponse("New password must be at least 6 characters long", 400);
      }
      
      updates.password = await bcrypt.hash(newPassword, 12);
    }

    // Update user
    const updatedUser = await UserModels.findByIdAndUpdate(
      decoded.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    return successResponse({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      address: updatedUser.address,
      savedAddresses: updatedUser.savedAddresses || [],
      avatar: updatedUser.avatar || null,
    }, "Profile updated successfully");

  } catch (error: any) {
    console.error("Error updating profile:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors: string[] = [];
      for (const field in error.errors) {
        errors.push(error.errors[field].message);
      }
      return validationErrorResponse(errors);
    }
    
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Failed to update profile"
    );
  }
}