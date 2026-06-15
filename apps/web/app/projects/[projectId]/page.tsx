import { FileUploadPanel } from "../../../components/file-upload-panel";
import { ExportPanel } from "../../../components/export-panel";
import { GenerationStatus } from "../../../components/generation-status";
import { QuestionnairePanel } from "../../../components/questionnaire-panel";

export default function ProjectDetailPage() {
  return (
    <main>
      <FileUploadPanel />
      <QuestionnairePanel
        questions={{
          risk_materials: "请补充风险物质名称、最大储量、存放位置和危险特性。"
        }}
      />
      <GenerationStatus issues={["missing_section:环境风险分析"]} />
      <ExportPanel coverTitle="突发环境事件应急预案" body={"总则\n总则内容"} />
    </main>
  );
}
