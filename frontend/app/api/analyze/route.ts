import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("video") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 }
      );
    }

    // Log file details for debugging
    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const backendFormData = new FormData();
    backendFormData.append("file", file, file.name);

    const response = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "Analysis failed" },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const healthData = await response.json();

    return NextResponse.json({
      backend_status: healthData,
      frontend_status: "healthy",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Backend connection failed" },
      { status: 503 }
    );
  }
}
