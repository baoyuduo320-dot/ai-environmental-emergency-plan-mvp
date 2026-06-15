export function ExportPanel({
  coverTitle,
  body
}: {
  coverTitle: string;
  body: string;
}) {
  return (
    <section>
      <h2>{coverTitle}</h2>
      <pre>{body}</pre>
      <button type="button">导出 Word</button>
    </section>
  );
}
