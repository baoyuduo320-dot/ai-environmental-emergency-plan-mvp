import { ProjectGenerationWorkflow } from "../../../components/project-generation-workflow";

export default async function ProjectDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { projectId } = await params;
  const initialParams = await searchParams;
  const initialProject = {
    companyName: readParam(initialParams.companyName),
    industry: readParam(initialParams.industry),
    region: readParam(initialParams.region),
    riskLevel: readParam(initialParams.riskLevel)
  };

  return (
    <ProjectGenerationWorkflow
      projectId={projectId}
      initialProject={initialProject}
    />
  );
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
