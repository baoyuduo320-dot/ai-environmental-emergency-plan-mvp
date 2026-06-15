export function ProjectCreateForm() {
  return (
    <form>
      <label>
        企业名称
        <input aria-label="企业名称" name="companyName" />
      </label>
      <label>
        所属行业
        <input aria-label="所属行业" name="industry" />
      </label>
      <label>
        所在地区
        <input aria-label="所在地区" name="region" />
      </label>
      <button type="submit">创建项目</button>
    </form>
  );
}
