import { NextResponse } from "next/server";

const ALLOWED_PREFIX = "https://raw.githubusercontent.com/PokeAPI/sprites/";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");

  if (!url || !url.startsWith(ALLOWED_PREFIX)) {
    return NextResponse.json({ error: "Image URL is not allowed" }, { status: 400 });
  }

  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const buffer = await response.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
