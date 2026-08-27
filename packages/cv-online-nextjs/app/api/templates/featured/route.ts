import { NextResponse } from "next/server";

const INTERNAL_API_URL =
  process.env.NEST_API_URL || "http://backend:9999/api";

export async function GET() {
  try {
    const response = await fetch(
      `${INTERNAL_API_URL}/templates?page=1&limit=3&sortBy=popularityScore&sortOrder=desc`,
      { next: { revalidate: 60 } },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Không thể tải các mẫu CV nổi bật." },
        { status: response.status },
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Không thể tải các mẫu CV nổi bật:", error);
    return NextResponse.json(
      { message: "Không thể kết nối tới dịch vụ mẫu CV." },
      { status: 502 },
    );
  }
}
