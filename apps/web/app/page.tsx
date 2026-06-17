import Link from "next/link";

const workflow = [
  {
    title: "上传历史预案",
    detail: "导入旧版 Word、PDF 和备案材料"
  },
  {
    title: "提取风险信息",
    detail: "识别企业、行业、风险源和应急资源"
  },
  {
    title: "生成预案报告",
    detail: "形成正文、附件和可导出的 Word 文档"
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#eef4ee] text-[#13231b]">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,24,16,0.9),rgba(8,24,16,0.72)_44%,rgba(8,24,16,0.34)),url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=80')] bg-cover bg-center" />
        <div className="relative mx-auto grid min-h-screen max-w-6xl gap-8 px-5 py-6 md:grid-cols-[1fr_380px] md:items-center md:px-8">
          <section className="max-w-2xl pt-16 text-white md:pt-0">
            <p className="text-sm font-semibold text-[#bfe0c8]">
              环境应急预案智能编制
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
              环保风险治理工作台
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
              面向企业突发环境事件应急预案编制，集中管理历史预案、风险信息、应急资源和报告生成流程。
            </p>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {workflow.map((item, index) => (
                <article
                  className="border border-white/20 bg-white/10 p-4 backdrop-blur"
                  key={item.title}
                >
                  <p className="text-xs font-semibold text-[#bfe0c8]">
                    0{index + 1}
                  </p>
                  <h2 className="mt-5 text-base font-semibold">{item.title}</h2>
                  <p className="mt-2 text-xs leading-5 text-white/70">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <aside className="border border-white/25 bg-[#f7fbf7] p-6 shadow-2xl">
            <p className="text-sm font-medium text-[#52715f]">进入工作台</p>
            <h2 className="mt-2 text-2xl font-semibold">创建或继续项目</h2>
            <p className="mt-3 text-sm leading-6 text-[#5a6f62]">
              先建立企业项目信息，再上传历史预案。首次上传或生成时，后端服务可能需要短暂唤醒。
            </p>
            <Link
              className="mt-6 flex h-12 items-center justify-center bg-[#123c2b] px-5 text-sm font-semibold text-white transition hover:bg-[#0d2d20]"
              href="/projects/new"
            >
              开始创建项目
            </Link>
            <div className="mt-6 border-t border-[#d8e4dc] pt-5">
              <p className="text-xs font-semibold text-[#52715f]">系统状态提示</p>
              <p className="mt-2 text-sm leading-6 text-[#405a4b]">
                上传历史预案和生成报告会调用后端抽取服务；如为首次访问，请等待服务唤醒完成。
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
