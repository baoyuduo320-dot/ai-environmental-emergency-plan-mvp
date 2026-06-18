import Link from "next/link";

const stats = [
  ["15+", "报告类型覆盖"],
  ["<5 分钟", "平均生成时间"],
  ["98%", "准确率保障"],
  ["国标合规", "法规自动匹配"]
];

const features = [
  {
    title: "环境应急预案",
    icon: "盾",
    detail:
      "智能生成突发环境事件应急预案、风险评估报告、应急资源调查报告，自动匹配 HJ 941 等标准规范。"
  },
  {
    title: "环评报告",
    icon: "评",
    detail:
      "环境影响评价报告书/表快速生成，涵盖工程分析、环境现状、影响预测等全流程章节。"
  },
  {
    title: "排污许可申请",
    icon: "证",
    detail:
      "排污许可证申请表自动生成，智能填报排放口信息、污染物种类、执行标准等关键内容。"
  },
  {
    title: "验收监测报告",
    icon: "验",
    detail:
      "竣工环保验收监测报告一键生成，标准自动适配，数据表格规范输出。"
  },
  {
    title: "法规智能匹配",
    icon: "法",
    detail:
      "实时同步最新环保法规标准库，生成报告时自动匹配适用条款，确保合规无忧。"
  },
  {
    title: "一键导出下载",
    icon: "出",
    detail:
      "生成报告支持 Word/PDF 格式导出，排版规范、即拿即用，可直接提交审核。"
  }
];

const steps = [
  {
    title: "选择报告类型",
    detail: "从 15+ 报告模板中选择所需类型，或自定义描述您的需求"
  },
  {
    title: "输入关键信息",
    detail: "填写企业基本信息、工艺流程、污染物种类等核心参数"
  },
  {
    title: "一键生成导出",
    detail: "AI 自动生成完整报告，审核后直接导出 Word/PDF"
  }
];

const templates = [
  "突发环境事件应急预案",
  "环境风险评估报告",
  "应急资源调查报告",
  "环境影响评价报告书",
  "环境影响评价报告表",
  "排污许可证申请表",
  "竣工环保验收报告",
  "环境监测方案",
  "清洁生产审核报告",
  "土壤污染状况调查报告",
  "固废管理计划",
  "VOCs 治理方案"
];

const previewSections = [
  "总则（编制目的、依据、适用范围、工作原则）",
  "企业基本情况及周边环境概况",
  "环境风险源识别与风险评估",
  "应急组织机构及职责",
  "预防与预警机制",
  "应急响应（分级响应、处置措施）",
  "后期处置与恢复",
  "应急保障措施",
  "预案管理与演练",
  "附则与附件"
];

function LeafLogo() {
  return (
    <svg aria-hidden="true" className="h-9 w-9" viewBox="0 0 40 40" fill="none">
      <circle
        cx="20"
        cy="20"
        fill="#dcf5e3"
        r="18"
        stroke="#43b272"
        strokeWidth="2"
      />
      <path
        d="M14 28c0-6 4-10 6-12 2 2 6 6 6 12"
        fill="none"
        stroke="#2d7a4d"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <line
        stroke="#2d7a4d"
        strokeLinecap="round"
        strokeWidth="2"
        x1="18"
        x2="18"
        y1="20"
        y2="28"
      />
      <line
        stroke="#2d7a4d"
        strokeLinecap="round"
        strokeWidth="2"
        x1="22"
        x2="22"
        y1="20"
        y2="28"
      />
    </svg>
  );
}

function LeafDecoration({
  className,
  fill
}: {
  className: string;
  fill: string;
}) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 40 40">
      <path
        d="M20 5c-3 5-8 10-8 18 0 8 8 12 8 12s8-4 8-12c0-8-5-13-8-18z"
        fill={fill}
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#1f2937]">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#dcf5e3] bg-white/85 px-6 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
          <Link
            className="flex items-center gap-2 text-xl font-bold text-[#235c3b]"
            href="/"
          >
            <LeafLogo />
            AI 环保助手
          </Link>
          <div className="hidden items-center gap-8 text-[15px] font-medium text-[#4b5563] md:flex">
            <a className="transition hover:text-[#38965f]" href="#features">
              功能
            </a>
            <a className="transition hover:text-[#38965f]" href="#how">
              流程
            </a>
            <a className="transition hover:text-[#38965f]" href="#templates">
              报告模板
            </a>
            <a className="transition hover:text-[#38965f]" href="#cta">
              开始使用
            </a>
          </div>
          <Link
            className="rounded-full bg-[#38965f] px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2d7a4d]"
            href="/projects/new"
          >
            免费试用
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eefaf1_0%,#ffffff_100%)] px-6 pb-28 pt-40 text-center">
        <div className="absolute -right-36 -top-48 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(67,178,114,.08)_0%,transparent_70%)]" />
        <div className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(109,201,139,.1)_0%,transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#dcf5e3] px-5 py-2 text-sm font-semibold text-[#235c3b]">
            <span className="h-2 w-2 rounded-full bg-[#43b272]" />
            AI 驱动 · 专业高效
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-[#1a3c2a] sm:text-6xl">
            让
            <span className="text-[#38965f]">报告编制</span>
            <br />
            更智能
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#4b5563] sm:text-xl">
            专为环保从业者打造的 AI 助手，快速生成环境应急预案、环评报告、排污许可申请等专业文档，告别繁琐撰写，聚焦核心工作。
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              className="inline-flex items-center rounded-full bg-[#38965f] px-9 py-3.5 text-base font-semibold text-white shadow-[0_4px_16px_rgba(67,178,114,.3)] transition hover:-translate-y-0.5 hover:bg-[#2d7a4d]"
              href="/projects/new"
            >
              立即生成报告
            </Link>
            <a
              className="rounded-full border-2 border-[#c0eacd] bg-white px-9 py-3.5 text-base font-semibold text-[#2d7a4d] transition hover:border-[#43b272] hover:bg-[#eefaf1]"
              href="#features"
            >
              了解更多
            </a>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 grid max-w-[900px] overflow-hidden rounded-2xl bg-white py-8 shadow-[0_12px_40px_rgba(0,0,0,.1)] sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label], index) => (
          <div
            className={`px-8 py-4 text-center ${
              index < stats.length - 1 ? "lg:border-r lg:border-[#dcf5e3]" : ""
            }`}
            key={label}
          >
            <p className="text-4xl font-extrabold text-[#2d7a4d]">{value}</p>
            <p className="mt-1 text-sm text-[#4b5563]">{label}</p>
          </div>
        ))}
      </section>

      <section className="px-6 py-24" id="features">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-bold tracking-wide text-[#2d7a4d]">
            核心功能
          </p>
          <h2 className="text-3xl font-extrabold tracking-normal text-[#1a3c2a] sm:text-4xl">
            一站式环保报告生成
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-7 text-[#4b5563]">
            覆盖环境应急、环评、排污许可等关键场景，智能匹配最新国标与地方法规。
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                className="rounded-2xl border border-[#dcf5e3] bg-white p-8 transition hover:-translate-y-1 hover:border-[#95d9aa] hover:shadow-[0_12px_40px_rgba(0,0,0,.1)]"
                key={feature.title}
              >
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-[14px] bg-[#eefaf1] text-lg font-extrabold text-[#38965f]">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1f2937]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[15px] leading-7 text-[#4b5563]">
                  {feature.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eefaf1] px-6 py-24" id="how">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-bold tracking-wide text-[#2d7a4d]">
            使用流程
          </p>
          <h2 className="text-3xl font-extrabold tracking-normal text-[#1a3c2a] sm:text-4xl">
            三步完成，报告立等可取
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-7 text-[#4b5563]">
            无需学习成本，像聊天一样简单操作。
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            {steps.map((step, index) => (
              <article
                className="relative min-w-[220px] max-w-[280px] flex-1 text-center"
                key={step.title}
              >
                <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-[#38965f] text-xl font-extrabold text-white">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#1f2937]">
                  {step.title}
                </h3>
                <p className="text-sm leading-6 text-[#4b5563]">{step.detail}</p>
                {index < steps.length - 1 ? (
                  <span className="absolute right-[-28px] top-6 hidden text-2xl text-[#95d9aa] lg:block">
                    →
                  </span>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24" id="templates">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-bold tracking-wide text-[#2d7a4d]">
            报告模板
          </p>
          <h2 className="text-3xl font-extrabold tracking-normal text-[#1a3c2a] sm:text-4xl">
            覆盖环保全场景
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-7 text-[#4b5563]">
            以下为平台支持的报告类型，持续更新中。
          </p>
          <div className="mt-12 rounded-2xl border-2 border-dashed border-[#c0eacd] bg-[#f9fafb] p-6 sm:p-12">
            <h3 className="mb-6 text-center text-xl font-bold text-[#235c3b]">
              点击标签预览模板结构
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {templates.map((template, index) => (
                <span
                  className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${
                    index === 0
                      ? "border-[#38965f] bg-[#38965f] text-white"
                      : "border-[#c0eacd] bg-white text-[#2d7a4d]"
                  }`}
                  key={template}
                >
                  {template}
                </span>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-[#dcf5e3] bg-white p-8 text-left">
              <h4 className="mb-4 text-lg font-bold text-[#235c3b]">
                突发环境事件应急预案 — 章节结构
              </h4>
              <ol className="list-decimal space-y-1 pl-5 text-[15px] leading-8 text-[#4b5563]">
                {previewSections.map((section) => (
                  <li key={section}>{section}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24" id="cta">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[linear-gradient(135deg,#235c3b,#38965f)] px-6 py-16 text-center text-white sm:px-12">
          <h2 className="text-3xl font-extrabold tracking-normal sm:text-4xl">
            让 AI 帮您告别繁琐报告撰写
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-7 text-white/90">
            立即体验 AI 环保助手，输入关键信息即可生成专业合规的环保报告，节省 80% 撰写时间。
          </p>
          <Link
            className="mt-8 inline-flex rounded-full bg-white px-9 py-3.5 text-base font-semibold text-[#2d7a4d] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#eefaf1]"
            href="/projects/new"
          >
            免费开始使用
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#dcf5e3] px-6 py-8 text-center text-sm text-[#4b5563]">
        © 2026 AI 环保助手 · 智能环境应急预案生成平台
      </footer>

      <LeafDecoration
        className="pointer-events-none fixed left-[8%] top-full z-0 h-10 w-10 animate-[float_12s_ease-in-out_infinite] opacity-15"
        fill="#43b272"
      />
      <LeafDecoration
        className="pointer-events-none fixed left-[22%] top-full z-0 h-8 w-8 animate-[float_12s_ease-in-out_infinite] opacity-15 [animation-delay:-4s]"
        fill="#6dc98b"
      />
      <LeafDecoration
        className="pointer-events-none fixed left-[35%] top-full z-0 h-9 w-9 animate-[float_12s_ease-in-out_infinite] opacity-15 [animation-delay:-8s]"
        fill="#95d9aa"
      />
    </main>
  );
}
