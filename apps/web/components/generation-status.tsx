export function GenerationStatus({
  issues
}: {
  issues: string[];
}) {
  return (
    <section>
      <h2>校核结果</h2>
      {issues.length ? (
        <ul>
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : (
        <p>当前版本未发现结构缺项或占位符问题。</p>
      )}
    </section>
  );
}
