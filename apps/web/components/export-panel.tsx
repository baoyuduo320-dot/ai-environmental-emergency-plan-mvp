export function ExportPanel({
  coverTitle,
  body,
  fullPreview,
  onExportWord,
  exporting
}: {
  coverTitle: string;
  body: string;
  fullPreview: string;
  onExportWord: () => void;
  exporting: boolean;
}) {
  return (
    <section>
      <h2>{coverTitle}</h2>
      <h3>单页整稿预览</h3>
      <pre>{fullPreview}</pre>
      <h3>正文提取</h3>
      <pre>{body}</pre>
      <button type="button" onClick={onExportWord} disabled={exporting}>
        {exporting ? "导出中..." : "导出 Word"}
      </button>
    </section>
  );
}
