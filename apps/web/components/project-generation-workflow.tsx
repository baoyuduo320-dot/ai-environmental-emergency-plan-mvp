"use client";

import { useState } from "react";

import { generateProject, type GenerateProjectResponse } from "../lib/api";
import { ExportPanel } from "./export-panel";
import { FileUploadPanel } from "./file-upload-panel";
import { GenerationStatus } from "./generation-status";
import { QuestionnairePanel } from "./questionnaire-panel";

const DEFAULT_SOURCE_TEXT = `企业名称：苏州示例化工有限公司
所在地区：苏州市工业园区
所属行业：精细化工`;

export function ProjectGenerationWorkflow({
  projectId
}: {
  projectId: string;
}) {
  const [sourceText, setSourceText] = useState(DEFAULT_SOURCE_TEXT);
  const [result, setResult] = useState<GenerateProjectResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const nextResult = await generateProject(projectId, sourceText);
      setResult(nextResult);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "生成失败，请稍后重试"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <FileUploadPanel />
      <section>
        <h2>原始资料文本</h2>
        <textarea
          aria-label="原始资料文本"
          rows={8}
          value={sourceText}
          onChange={(event) => setSourceText(event.target.value)}
        />
        <button type="button" onClick={handleGenerate} disabled={loading}>
          {loading ? "生成中..." : "开始生成"}
        </button>
        {error ? <p>{error}</p> : null}
      </section>
      {result ? (
        <>
          <QuestionnairePanel questions={result.questions} />
          <GenerationStatus issues={result.issues} />
          <ExportPanel
            coverTitle={result.export_payload.cover_title}
            body={result.export_payload.body}
          />
        </>
      ) : null}
    </main>
  );
}
