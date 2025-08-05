import type { NextRequest } from "next/server";
import { auth0 } from "../auth0";

export async function auth0Middleware(request: NextRequest) {
  return await auth0.middleware(request);
}