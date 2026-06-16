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
  attachments_payload: {
    appendix_catalog: string;
    communication_list: string;
    materials_list: string;
    communication_rows: Array<{
      role: string;
      name: string;
      phone: string;
    }>;
    materials_rows: Array<{
      item: string;
      quantity: string;
      location: string;
      owner: string;
      notes: string;
    }>;
  };
  preface_payload: {
    filing_form: string;
    release_order: string;
    filing_directory: string;
    compilation_notes: string;
  };
  export_payload: {
    cover_title: string;
    project_name?: string;
    table_of_contents?: string;
    body: string;
    full_preview: string;
  };
};

export type UploadProjectFilesResponse = {
  extracted_text: string;
  warnings: string[];
  files: Array<{
    filename: string;
    text: string;
    warnings: string[];
  }>;
};

export type AttachmentDraft = {
  appendix_catalog: string;
  communication_list: string;
  materials_list: string;
  communication_rows: Array<{
    role: string;
    name: string;
    phone: string;
  }>;
  materials_rows: Array<{
    item: string;
    quantity: string;
    location: string;
    owner: string;
    notes: string;
  }>;
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


export async function uploadProjectFiles(
  projectId: string,
  files: File[]
): Promise<UploadProjectFilesResponse> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file, file.name);
  }

  const response = await fetch(`/api/projects/${projectId}/files`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("文件抽取失败，请稍后重试");
  }

  return (await response.json()) as UploadProjectFilesResponse;
}


export async function exportProjectWord(
  projectId: string,
  sourceText: string,
  attachmentsPayload?: AttachmentDraft
) {
  const response = await fetch(`/api/projects/${projectId}/export-word`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      project_id: projectId,
      source_text: sourceText,
      attachments_payload: attachmentsPayload
    })
  });

  if (!response.ok) {
    throw new Error("Word 导出失败，请稍后重试");
  }

  return {
    blob: await response.blob(),
    fileName:
      response.headers
        .get("content-disposition")
        ?.match(/filename="(.+)"/)?.[1] ??
      `${projectId}-emergency-plan-review.docx`
  };
}


export function buildExportFileName(
  projectId: string,
  facts?: Record<string, string>
) {
  const companyName =
    facts?.company_name?.replace(/[\\/:*?"<>|]/g, "-").trim() || projectId;
  const planDate =
    facts?.plan_issue_date?.replace(/[\\/:*?"<>|]/g, "-").trim() || "送审稿";
  return `${companyName}-突发环境应急预案-${planDate}.docx`;
}
