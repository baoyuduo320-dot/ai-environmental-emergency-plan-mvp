const DEFAULT_WORKER_URL = "http://127.0.0.1:8001";

async function buildFallbackExtraction(files: File[]) {
  const extractedFiles = await Promise.all(
    files.map(async (file) => {
      const text =
        typeof file.text === "function"
          ? await file.text()
          : new TextDecoder().decode(await file.arrayBuffer());
      return {
        filename: file.name,
        text,
        warnings: text.trim() ? [] : ["文件未抽取到可用文本，请在抽取结果中手动补充。"]
      };
    })
  );

  return {
    extracted_text: extractedFiles
      .map((file) => file.text)
      .filter(Boolean)
      .join("\n\n"),
    warnings: extractedFiles.flatMap((file) => file.warnings),
    files: extractedFiles
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const formData = await request.formData();
  const { projectId } = await params;
  const workerFormData = new FormData();
  const files: File[] = [];

  for (const entry of formData.getAll("files")) {
    if (entry instanceof File) {
      files.push(entry);
      workerFormData.append("files", entry, entry.name);
    }
  }

  try {
    const workerResponse = await fetch(
      `${process.env.WORKER_BASE_URL ?? DEFAULT_WORKER_URL}/extract-text`,
      {
        method: "POST",
        body: workerFormData
      }
    );

    if (workerResponse.ok) {
      return new Response(await workerResponse.text(), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  } catch {
    // Fall back to browser-readable file text for MVP deployments without worker.
  }

  return Response.json(await buildFallbackExtraction(files), {
    headers: {
      "X-Fallback-Reason": `worker-file-extraction-unavailable-${projectId}`
    }
  });
}
