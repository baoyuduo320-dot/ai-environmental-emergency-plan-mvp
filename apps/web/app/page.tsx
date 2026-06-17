import Link from "next/link";

const scenarioCards = [
  {
    name: "山水场景",
    detail: "流域与园区敏感目标"
  },
  {
    name: "应急资源",
    detail: "物资、队伍、联络机制"
  },
  {
    name: "风险校核",
    detail: "等级判定与缺项提醒"
  },
  {
    name: "备案交付",
    detail: "预案正文与材料包"
  }
];

const metrics = [
  ["01", "资料梳理"],
  ["02", "风险识别"],
  ["03", "预案生成"]
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#191f1a] px-4 py-6 text-white sm:px-8">
      <section className="relative mx-auto min-h-[calc(100vh-48px)] max-w-7xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,18,12,0.86),rgba(10,22,15,0.58)_42%,rgba(10,19,15,0.34)),url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(196,221,184,0.2),transparent_28%),linear-gradient(0deg,rgba(7,13,10,0.86),transparent_38%)]" />

        <div className="relative flex min-h-[calc(100vh-48px)] flex-col px-6 py-6 sm:px-10">
          <header className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3 font-semibold">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/10">
                环
              </span>
              <span>环境应急预案 AI 工作台</span>
            </div>
            <nav className="hidden items-center gap-8 text-xs font-medium text-white/75 md:flex">
              <a href="#scenarios">场景</a>
              <a href="#workflow">流程</a>
              <Link href="/projects/new">创建项目</Link>
            </nav>
          </header>

          <div className="grid flex-1 items-end gap-8 py-10 lg:grid-cols-[1fr_520px]">
            <section className="max-w-2xl pb-4">
              <p className="mb-5 inline-flex border-l-2 border-[#f0b84b] pl-4 text-sm font-medium text-white/80">
                环境风险治理 / 预案编制 / 备案交付
              </p>
              <h1 className="text-5xl font-semibold leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
                守护企业
                <br />
                环境安全
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/78 sm:text-lg">
                用 AI 把企业资料、风险等级、应急资源和备案材料串成一条清晰工作流，让环境应急预案从收集到交付更可控。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="bg-[#f0b84b] px-6 py-3 text-sm font-semibold text-[#172016]"
                  href="/projects/new"
                >
                  开始创建项目
                </Link>
                <a
                  className="border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white"
                  href="#scenarios"
                >
                  查看能力场景
                </a>
              </div>
            </section>

            <aside className="space-y-5" id="scenarios">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
                {scenarioCards.map((card, index) => (
                  <article
                    className="min-h-40 border border-white/20 bg-white/14 p-4 shadow-xl backdrop-blur-md"
                    key={card.name}
                  >
                    <p className="text-xs font-semibold text-[#f0b84b]">
                      0{index + 1}
                    </p>
                    <h2 className="mt-16 text-xl font-semibold leading-tight">
                      {card.name}
                    </h2>
                    <p className="mt-2 text-xs leading-5 text-white/70">
                      {card.detail}
                    </p>
                  </article>
                ))}
              </div>

              <div
                className="grid gap-3 border-t border-white/25 pt-5 sm:grid-cols-3"
                id="workflow"
              >
                {metrics.map(([step, label]) => (
                  <div className="flex items-center gap-3" key={step}>
                    <span className="text-3xl font-semibold text-white">
                      {step}
                    </span>
                    <span className="text-sm text-white/70">{label}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
