import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the password from the request headers
  const password = request.headers.get("X-Admin-Password");
  console.log("password", password);
  // Create a new headers object
  const requestHeaders = new Headers(request.headers);

  // Attach the password to a server-only header
  requestHeaders.set("X-Server-Admin-Password", password || "");

  // Return the response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: "/klarna/:path*",
};
