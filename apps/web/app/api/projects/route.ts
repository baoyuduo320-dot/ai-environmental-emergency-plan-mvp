import { NextResponse } from "next/server";

function slugifyProjectId(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "project";
}

export async function POST(request: Request) {
  const body = await request.json();
  const seed = typeof body.companyName === "string" ? body.companyName : "project";
  const suffix = Date.now().toString(36);

  return NextResponse.json({
    projectId: `project-${slugifyProjectId(seed)}-${suffix}`,
    ...body
  });
}
