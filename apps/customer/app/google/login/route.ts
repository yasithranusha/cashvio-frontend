import { BACKEND_URL } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.redirect(
    new URL(`${BACKEND_URL}auth/auth/google/login`, request.url)
  );
}
