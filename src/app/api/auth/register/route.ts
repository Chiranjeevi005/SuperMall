import { NextRequest, NextResponse } from "next/server";
import { UserModels } from "../../../../../models/user";
import { connectToDataBase } from "../../../../../dataBase/dbConfig";
import bcrypt from "bcryptjs";
import { generateToken, createAuthResponse } from "../../../../lib/auth";
import { errorResponse, successResponse, validationErrorResponse } from "../../../../lib/api-response";

export async function POST(request: NextRequest) {
  try {
    // Ensure DB connection
    await connectToDataBase();

    // Parse input
    const body = await request.json();
    const { name, email, password, role, address } = body;

    // Validate input
    const errors: string[] = [];
    if (!name || name.trim().length < 2) errors.push("Name must be at least 2 characters long");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email is required");
    if (!password || password.length < 6) errors.push("Password must be at least 6 characters long");
    if (!role || !["admin", "vendor", "user", "deliveryPerson"].includes(role)) {
      errors.push("Role must be one of: admin, vendor, user, deliveryPerson");
    }

    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    // Check if user already exists
    const existing = await UserModels.findOne({ email });
    if (existing) {
      return errorResponse("User with this email already exists", 409, "Registration failed");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await UserModels.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      address: address?.trim() || "",
    });

    // Generate Token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    };

    return createAuthResponse(
      {
        success: true,
        message: "User registration successful",
        data: userData,
      },
      token
    );
  } catch (error) {
    console.error("Error in user registration:", error);
    return errorResponse(
      (error as Error).message || "Internal server error",
      500,
      "Registration failed"
    );
  }
}
