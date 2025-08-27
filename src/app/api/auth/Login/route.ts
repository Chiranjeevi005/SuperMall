import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDataBase } from "../../../../../dataBase/dbConfig";
import { UserModels } from "../../../../../models/user";
import { generateToken, createAuthResponse } from "../../../../lib/auth";
import { errorResponse, validationErrorResponse } from "../../../../lib/api-response";

export async function POST(request: NextRequest) {
  try {
    await connectToDataBase();

    // Parse input
    const { email, password, adminKey } = await request.json();

    // Validate input
    const errors: string[] = [];
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Valid email is required");
    }
    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    // Admin key validation if provided
    if (adminKey !== undefined && adminKey !== null) {
      const ADMIN_KEY = process.env.ADMIN_KEY || "supermall-admin-key";
      if (adminKey !== ADMIN_KEY) {
        errors.push("Invalid admin key");
      }
    }

    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    // Find user with password field included
    const existingUser = await UserModels.findOne({ 
      email: email.toLowerCase() 
    }).select("+password");

    if (!existingUser) {
      return errorResponse("Invalid email or password", 401, "Login failed");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return errorResponse("Invalid email or password", 401, "Login failed");
    }

    // If admin key is provided, override user role to admin
    let userRole = existingUser.role;
    if (adminKey) {
      userRole = 'admin';
    }

    // Generate token
    const token = generateToken({
      id: existingUser._id.toString(),
      email: existingUser.email,
      role: userRole,
    });

    const userData = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: userRole,
      address: existingUser.address,
    };

    return createAuthResponse(
      {
        success: true,
        message: "Login successful",
        data: userData,
      },
      token
    );
  } catch (error) {
    console.error("Error in user login:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Login failed"
    );
  }
}