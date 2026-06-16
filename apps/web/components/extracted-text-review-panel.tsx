export function ExtractedTextReviewPanel({
  extractedText,
  warnings,
  confirming,
  onConfirm,
  onChange
}: {
  extractedText: string;
  warnings: string[];
  confirming: boolean;
  onConfirm: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <section>
      <h2>抽取结果确认</h2>
      {warnings.length ? <p>{warnings.join("；")}</p> : null}
      <textarea
        aria-label="抽取结果文本"
        rows={10}
        value={extractedText}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="button" onClick={onConfirm} disabled={confirming}>
        {confirming ? "生成中..." : "确认抽取结果并生成"}
      </button>
    </section>
  );
}
