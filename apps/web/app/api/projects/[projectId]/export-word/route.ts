const DEFAULT_WORKER_URL = "http://127.0.0.1:8001";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const body = await request.json();
  const { projectId } = await params;
  const workerResponse = await fetch(
    `${process.env.WORKER_BASE_URL ?? DEFAULT_WORKER_URL}/export-word`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        project_id: body.project_id ?? projectId,
        source_text: body.source_text ?? "",
        attachments_payload: body.attachments_payload ?? null
      })
    }
  );

  if (!workerResponse.ok) {
    return new Response("Worker Word 导出接口调用失败", { status: 502 });
  }

  const documentBytes = await workerResponse.arrayBuffer();
  return new Response(documentBytes, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition":
        workerResponse.headers.get("content-disposition") ??
        `attachment; filename="${projectId}-emergency-plan-review.docx"`
    }
  });
}
