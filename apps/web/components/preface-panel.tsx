export function PrefacePanel({
  filingForm,
  releaseOrder,
  filingDirectory,
  compilationNotes
}: {
  filingForm: string;
  releaseOrder: string;
  filingDirectory: string;
  compilationNotes: string;
}) {
  return (
    <section>
      <h2>前置材料</h2>
      <h3>备案表</h3>
      <pre>{filingForm}</pre>
      <h3>发布令</h3>
      <pre>{releaseOrder}</pre>
      <h3>备案目录</h3>
      <pre>{filingDirectory}</pre>
      <h3>编制说明</h3>
      <pre>{compilationNotes}</pre>
    </section>
  );
}
