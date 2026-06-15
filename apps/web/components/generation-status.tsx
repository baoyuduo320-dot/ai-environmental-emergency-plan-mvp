export function GenerationStatus({
  issues
}: {
  issues: string[];
}) {
  return (
    <section>
      <h2>校核结果</h2>
      <ul>
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
    </section>
  );
}
