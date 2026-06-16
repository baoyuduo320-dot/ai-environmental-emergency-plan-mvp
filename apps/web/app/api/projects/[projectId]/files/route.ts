const DEFAULT_WORKER_URL = "http://127.0.0.1:8001";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const formData = await request.formData();
  const { projectId } = await params;
  const workerFormData = new FormData();

  for (const entry of formData.getAll("files")) {
    if (entry instanceof File) {
      workerFormData.append("files", entry, entry.name);
    }
  }

  const workerResponse = await fetch(
    `${process.env.WORKER_BASE_URL ?? DEFAULT_WORKER_URL}/extract-text`,
    {
      method: "POST",
      body: workerFormData
    }
  );

  if (!workerResponse.ok) {
    return new Response(`Worker 文件抽取接口调用失败: ${projectId}`, {
      status: 502
    });
  }

  return new Response(await workerResponse.text(), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
