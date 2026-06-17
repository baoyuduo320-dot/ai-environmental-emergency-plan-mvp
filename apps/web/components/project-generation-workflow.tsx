"use client";

import { useState } from "react";

import {
  type AttachmentDraft,
  buildExportFileName,
  exportProjectWord,
  generateProject,
  uploadProjectFiles,
  type GenerateProjectResponse
} from "../lib/api";
import { AttachmentPanel } from "./attachment-panel";
import { ExtractedTextReviewPanel } from "./extracted-text-review-panel";
import { ExportPanel } from "./export-panel";
import { FileUploadPanel } from "./file-upload-panel";
import { GenerationStatus } from "./generation-status";
import { PrefacePanel } from "./preface-panel";
import { QuestionnairePanel } from "./questionnaire-panel";

const DEFAULT_SOURCE_TEXT = `企业名称：苏州示例化工有限公司
预案名称：苏州示例化工有限公司突发环境事件应急预案
实施日期：2026年6月15日
机构代码：91320500MA12345678
法定代表人：张三
联系人：李四
联系电话：13800000000
地址：苏州市工业园区示范路88号
经纬度：东经120°00′00″，北纬31°00′00″
所在地区：苏州市工业园区
所属行业：精细化工
风险级别：一般`;

const BASIC_FIELD_LABELS = {
  companyName: "企业名称",
  industry: "所属行业",
  region: "所在地区",
  riskLevel: "风险级别"
};

const SOURCE_TEXT_LABELS: Record<string, string> = {
  plan_name: "预案名称",
  plan_version: "预案版本号",
  plan_issue_date: "实施日期",
  compiler_org: "编制单位",
  legal_representative: "法定代表人",
  contact_person: "联系人",
  contact_phone: "联系电话",
  address: "地址",
  longitude_latitude: "经纬度",
  risk_level: "风险级别",
  risk_sources: "环境风险源",
  risk_materials: "风险物质",
  environmental_receptors: "周边环境风险受体",
  pollutant_discharge: "污染物排放与治理措施",
  emergency_org_structure: "应急组织体系",
  emergency_contacts: "应急联系人",
  emergency_resources: "应急资源",
  warning_mechanism: "预警机制",
  response_process: "应急响应流程",
  onsite_disposal: "现场处置措施",
  post_disposal: "后期处置",
  training_plan: "培训计划",
  drill_plan: "演练计划"
};

function mergeAnswersIntoSourceText(
  currentSourceText: string,
  answers: Record<string, string>
) {
  let nextSourceText = currentSourceText;

  for (const [key, rawValue] of Object.entries(answers)) {
    const value = rawValue.trim();
    if (!value) {
      continue;
    }
    const label = SOURCE_TEXT_LABELS[key] ?? key;
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const fieldPattern = new RegExp(`(^|\\n)${escapedLabel}[:：].*`, "m");
    const line = `${label}：${value}`;

    if (fieldPattern.test(nextSourceText)) {
      nextSourceText = nextSourceText.replace(fieldPattern, (_match, prefix) => {
        return `${prefix}${line}`;
      });
    } else {
      nextSourceText = `${nextSourceText.trimEnd()}\n${line}`;
    }
  }

  return nextSourceText;
}

function readSourceField(sourceText: string, label: string) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = sourceText.match(new RegExp(`(^|\\n)${escapedLabel}[:：]([^\\n]*)`));
  return match?.[2]?.trim() ?? "";
}

function upsertSourceField(sourceText: string, label: string, value: string) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const line = `${label}：${value}`;
  const fieldPattern = new RegExp(`(^|\\n)${escapedLabel}[:：].*`, "m");

  if (fieldPattern.test(sourceText)) {
    return sourceText.replace(fieldPattern, (_match, prefix) => `${prefix}${line}`);
  }

  return `${sourceText.trimEnd()}\n${line}`;
}

function buildCommunicationList(rows: AttachmentDraft["communication_rows"]) {
  return ["应急通讯录", ...rows.map((row) => `${row.role}：${row.name} ${row.phone}`)].join(
    "\n"
  );
}

function buildMaterialsList(rows: AttachmentDraft["materials_rows"]) {
  return [
    "应急物资与装备清单",
    ...rows.map(
      (row) =>
        `${row.item}｜数量：${row.quantity}｜位置：${row.location}｜责任人：${row.owner}｜备注：${row.notes}`
    )
  ].join("\n");
}

export function ProjectGenerationWorkflow({
  projectId
}: {
  projectId: string;
}) {
  const [sourceText, setSourceText] = useState(DEFAULT_SOURCE_TEXT);
  const [result, setResult] = useState<GenerateProjectResponse | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>(
    {}
  );
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadStatusText, setUploadStatusText] = useState("");
  const [pendingExtractedText, setPendingExtractedText] = useState("");
  const [pendingWarnings, setPendingWarnings] = useState<string[]>([]);
  const [attachmentDraft, setAttachmentDraft] = useState<AttachmentDraft | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  async function runGeneration(nextSourceText: string) {
    setLoading(true);
    setError("");
    try {
      const nextResult = await generateProject(projectId, nextSourceText);
      setResult(nextResult);
      setAttachmentDraft(nextResult.attachments_payload);
      setQuestionAnswers({});
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "生成失败，请稍后重试"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    await runGeneration(sourceText);
  }

  function handleBasicInfoChange(
    field: keyof typeof BASIC_FIELD_LABELS,
    value: string
  ) {
    setSourceText((currentSourceText) =>
      upsertSourceField(currentSourceText, BASIC_FIELD_LABELS[field], value)
    );
  }

  function handleAnswerChange(key: string, value: string) {
    setQuestionAnswers((currentAnswers) => ({
      ...currentAnswers,
      [key]: value
    }));
  }

  async function handleRegenerateWithAnswers() {
    const mergedSourceText = mergeAnswersIntoSourceText(sourceText, questionAnswers);
    setSourceText(mergedSourceText);
    await runGeneration(mergedSourceText);
  }

  async function handleExportWord() {
    setExporting(true);
    setError("");
    try {
      const { blob } = await exportProjectWord(
        projectId,
        sourceText,
        attachmentDraft ?? undefined
      );
      const fileName = buildExportFileName(projectId, result?.facts);
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      anchor.click();
      window.URL.revokeObjectURL(objectUrl);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Word 导出失败，请稍后重试"
      );
    } finally {
      setExporting(false);
    }
  }

  async function handleFilesSelected(files: File[]) {
    setUploading(true);
    setError("");
    setUploadMessage("");
    setUploadStatusText("");
    try {
      const result = await uploadProjectFiles(projectId, files);
      let nextSourceText = sourceText;
      if (result.extracted_text.trim()) {
        nextSourceText = result.extracted_text;
        setPendingExtractedText(nextSourceText);
      }

      setPendingWarnings(result.warnings);
      if (result.warnings.length) {
        setUploadMessage(result.warnings.join("；"));
      } else {
        setUploadMessage(`已完成 ${result.files.length} 个文件的文本抽取，请确认后生成。`);
        setUploadStatusText(
          `上传成功：已完成 ${result.files.length} 个文件文本抽取，请确认抽取结果后生成报告。`
        );
      }
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "文件抽取失败，请稍后重试"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleConfirmExtractedText() {
    const nextSourceText =
      !sourceText.trim() || sourceText === DEFAULT_SOURCE_TEXT
        ? pendingExtractedText
        : `${sourceText.trimEnd()}\n\n${pendingExtractedText}`;
    setSourceText(nextSourceText);
    await runGeneration(nextSourceText);
    setPendingExtractedText("");
    setPendingWarnings([]);
    setUploadMessage("抽取文本已确认并完成首次生成。");
    setUploadStatusText("");
  }

  function handleCommunicationRowsChange(
    rows: AttachmentDraft["communication_rows"]
  ) {
    setAttachmentDraft((currentDraft) =>
      currentDraft
        ? {
            ...currentDraft,
            communication_rows: rows,
            communication_list: buildCommunicationList(rows)
          }
        : currentDraft
    );
  }

  function handleMaterialsRowsChange(rows: AttachmentDraft["materials_rows"]) {
    setAttachmentDraft((currentDraft) =>
      currentDraft
        ? {
            ...currentDraft,
            materials_rows: rows,
            materials_list: buildMaterialsList(rows)
          }
        : currentDraft
    );
  }

  return (
    <main className="min-h-screen bg-[#edf4ee] px-5 py-8 text-[#16231c]">
      <div className="mx-auto grid max-w-5xl gap-5">
        <section className="border border-[#c7d8cc] bg-[#123c2b] px-6 py-7 text-white">
          <p className="text-sm font-medium text-[#b9d8c4]">项目工作台</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            环境应急预案智能编制
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#d9eadf]">
            从历史预案和补充信息中持续学习企业风险特征，逐步完善风险识别、应急资源、组织架构和现场处置内容。
          </p>
        </section>
      <section className="border border-[#d8e4dc] bg-white p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#4d6f5f]">项目信息</p>
            <h2 className="mt-1 text-xl font-semibold">企业基础信息</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#4d6f5f]">
            先确认企业名称、行业、地区和风险等级，这些信息会同步到原始资料文本并参与报告生成。
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            企业名称
            <input
              aria-label="企业名称"
              className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
              value={readSourceField(sourceText, BASIC_FIELD_LABELS.companyName)}
              onChange={(event) =>
                handleBasicInfoChange("companyName", event.target.value)
              }
            />
          </label>
          <label className="block text-sm font-medium">
            所属行业
            <input
              aria-label="所属行业"
              className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
              value={readSourceField(sourceText, BASIC_FIELD_LABELS.industry)}
              onChange={(event) =>
                handleBasicInfoChange("industry", event.target.value)
              }
            />
          </label>
          <label className="block text-sm font-medium">
            所在地区
            <input
              aria-label="所在地区"
              className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
              value={readSourceField(sourceText, BASIC_FIELD_LABELS.region)}
              onChange={(event) =>
                handleBasicInfoChange("region", event.target.value)
              }
            />
          </label>
          <label className="block text-sm font-medium">
            环境风险等级
            <select
              aria-label="环境风险等级"
              className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
              value={readSourceField(sourceText, BASIC_FIELD_LABELS.riskLevel)}
              onChange={(event) =>
                handleBasicInfoChange("riskLevel", event.target.value)
              }
            >
              <option>待系统判定</option>
              <option>一般</option>
              <option>较大</option>
              <option>重大</option>
            </select>
          </label>
        </div>
        <button
          className="mt-5 h-11 bg-[#123c2b] px-6 font-semibold text-white transition hover:bg-[#0d2d20]"
          type="button"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "正在唤醒后端并生成报告..." : "生成报告"}
        </button>
        {loading ? (
          <p className="mt-3 text-sm leading-6 text-[#4d6f5f]">
            首次生成可能需要等待 Render 后端启动，请保持页面打开。
          </p>
        ) : (
          <p className="mt-3 text-xs leading-5 text-[#6c7d71]">
            首次生成可能需要等待 Render 后端启动，系统会自动完成报告生成。
          </p>
        )}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </section>
      <FileUploadPanel
        onFilesSelected={handleFilesSelected}
        uploading={uploading}
        helperText={uploadMessage}
        statusText={uploadStatusText}
      />
      {pendingExtractedText ? (
        <ExtractedTextReviewPanel
          extractedText={pendingExtractedText}
          warnings={pendingWarnings}
          confirming={loading}
          onConfirm={handleConfirmExtractedText}
          onChange={setPendingExtractedText}
        />
      ) : null}
      <section className="border border-[#d8e4dc] bg-white p-5">
        <h2>原始资料文本</h2>
        <textarea
          className="mt-3 w-full border border-[#c7d8cc] bg-[#fbfdfb] p-3 text-sm leading-6 outline-none focus:border-[#2f6b4f]"
          aria-label="原始资料文本"
          rows={8}
          value={sourceText}
          onChange={(event) => setSourceText(event.target.value)}
        />
      </section>
      {result ? (
        <>
          <PrefacePanel
            filingForm={result.preface_payload.filing_form}
            releaseOrder={result.preface_payload.release_order}
            filingDirectory={result.preface_payload.filing_directory}
            compilationNotes={result.preface_payload.compilation_notes}
          />
          <AttachmentPanel
            appendixCatalog={
              attachmentDraft?.appendix_catalog ??
              result.attachments_payload.appendix_catalog
            }
            communicationList={
              attachmentDraft?.communication_list ??
              result.attachments_payload.communication_list
            }
            materialsList={
              attachmentDraft?.materials_list ??
              result.attachments_payload.materials_list
            }
            communicationRows={
              attachmentDraft?.communication_rows ??
              result.attachments_payload.communication_rows
            }
            materialsRows={
              attachmentDraft?.materials_rows ??
              result.attachments_payload.materials_rows
            }
            onCommunicationRowsChange={handleCommunicationRowsChange}
            onMaterialsRowsChange={handleMaterialsRowsChange}
          />
          <QuestionnairePanel
            questions={result.questions}
            answers={questionAnswers}
            onAnswerChange={handleAnswerChange}
            onRegenerate={handleRegenerateWithAnswers}
            regenerating={loading}
          />
          <GenerationStatus issues={result.issues} />
          <ExportPanel
            coverTitle={result.export_payload.cover_title}
            body={result.export_payload.body}
            fullPreview={result.export_payload.full_preview}
            onExportWord={handleExportWord}
            exporting={exporting}
          />
        </>
      ) : null}
      </div>
    </main>
  );
}
