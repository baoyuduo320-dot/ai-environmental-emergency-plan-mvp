import { NextResponse } from "next/server";

const DEFAULT_WORKER_URL = "http://127.0.0.1:8001";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const body = await request.json();
  const { projectId } = await params;
  const workerResponse = await fetch(
    `${process.env.WORKER_BASE_URL ?? DEFAULT_WORKER_URL}/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        project_id: body.project_id ?? projectId,
        source_text: body.source_text ?? ""
      })
    }
  );

  if (!workerResponse.ok) {
    return NextResponse.json(
      { error: "Worker 生成接口调用失败" },
      { status: 502 }
    );
  }

  return NextResponse.json(await workerResponse.json());
}
