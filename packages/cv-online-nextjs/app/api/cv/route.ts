import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Implement CV creation logic with backend API
    // For now, just return success response
    console.log("Creating CV:", body);

    // Mock response - replace with actual API call
    const mockResponse = {
      id: Date.now(),
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(mockResponse, { status: 201 });
  } catch (error) {
    console.error("Error creating CV:", error);
    return NextResponse.json(
      { error: "Failed to create CV" },
      { status: 500 }
    );
  }
}

