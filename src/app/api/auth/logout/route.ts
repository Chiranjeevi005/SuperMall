import { NextRequest } from "next/server";
import { clearAuthCookie } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Clear the authentication cookie and return success response
    return clearAuthCookie();
  } catch (error) {
    console.error("Error in logout:", error);
    return clearAuthCookie(); // Still clear the cookie even if there's an error
  }
}