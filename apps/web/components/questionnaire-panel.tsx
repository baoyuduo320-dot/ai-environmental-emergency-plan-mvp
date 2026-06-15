export function QuestionnairePanel({
  questions
}: {
  questions: Record<string, string>;
}) {
  return (
    <section>
      <h2>待补充信息</h2>
      <ul>
        {Object.entries(questions).map(([key, value]) => (
          <li key={key}>
            <strong>{key}</strong>
            <p>{value}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
