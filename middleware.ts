// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const allowedOrigin = "http://localhost:3001";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};