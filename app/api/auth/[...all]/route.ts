import { auth } from "@/app/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const baseURL = process.env.BETTER_AUTH_URL as string; 

const handlers = toNextJsHandler(auth );

function rewriteRequest(req: NextRequest) {
  const { search, pathname } = req.nextUrl;

  const url = new URL(`${baseURL}${pathname}`)
  url.search = search

  return new NextRequest(url, req);
}

export async function GET(req: NextRequest) {
  const modified = rewriteRequest(req)
  return handlers.GET(modified);
}

export async function POST(req: NextRequest) {
  const modified = rewriteRequest(req)
  return handlers.POST(modified)
}

