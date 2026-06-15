export async function createProject(payload: {
  companyName: string;
  industry: string;
  region: string;
}) {
  return payload;
}

export type GenerateProjectResponse = {
  facts: Record<string, string>;
  questions: Record<string, string>;
  issues: string[];
  export_payload: {
    cover_title: string;
    body: string;
  };
};

export async function generateProject(
  projectId: string,
  sourceText: string
): Promise<GenerateProjectResponse> {
  const response = await fetch(`/api/projects/${projectId}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      project_id: projectId,
      source_text: sourceText
    })
  });

  if (!response.ok) {
    throw new Error("生成失败，请稍后重试");
  }

  return (await response.json()) as GenerateProjectResponse;
}
