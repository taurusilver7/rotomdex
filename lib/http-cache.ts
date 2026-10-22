import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

export function createETag(body: string) {
  return `"${createHash("sha1").update(body).digest("hex")}"`;
}

export function cachedJsonResponse(
  request: Request,
  data: unknown,
  maxAgeSeconds = 300,
) {
  const body = JSON.stringify(data);
  const etag = createETag(body);

  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 2}`,
      },
    });
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ETag: etag,
      "Cache-Control": `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 2}`,
    },
  });
}