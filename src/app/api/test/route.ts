import { NextRequest, NextResponse } from "next/server";
import { connectToDataBase } from "../../../../dataBase/dbConfig";

export async function GET(request: NextRequest) {
  try {
    console.log('Test endpoint called');
    
    // Test database connection
    await connectToDataBase();
    console.log('Database connection successful');
    
    return NextResponse.json({
      success: true,
      message: "Test endpoint working",
      timestamp: new Date().toISOString(),
      database: "connected"
    });
    
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json({
      success: false,
      message: "Test endpoint failed",
      error: (error as Error).message
    }, { status: 500 });
  }
}