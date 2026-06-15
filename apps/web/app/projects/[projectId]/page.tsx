import { ProjectGenerationWorkflow } from "../../../components/project-generation-workflow";

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectGenerationWorkflow projectId={projectId} />;
}
