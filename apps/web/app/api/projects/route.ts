import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    projectId: "demo-project-001",
    ...body
  });
}
