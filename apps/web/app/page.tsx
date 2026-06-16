import Link from "next/link";

const planTiers = [
  {
    name: "免费体验",
    price: "0 元",
    detail: "1 个试用项目，适合演示和资料梳理",
    features: ["智能问卷", "资料抽取预览", "生成框架预览"]
  },
  {
    name: "标准版",
    price: "按项目计费",
    detail: "完整生成预案和备案材料包",
    features: ["完整正文", "Word 导出", "备案表与发布令"]
  },
  {
    name: "专业版",
    price: "企业/机构套餐",
    detail: "面向多企业管理和持续规则更新",
    features: ["项目台账", "专家评审辅助", "规则库持续更新"]
  }
];

const capabilityItems = [
  "智能问卷",
  "资料抽取",
  "风险校核",
  "备案材料",
  "专家评审",
  "规则更新"
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f7f4] text-[#17211b]">
      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10">
        <div className="space-y-8">
          <header className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded bg-[#123c2b] text-sm font-semibold text-white">
              E
            </div>
            <div>
              <p className="text-sm font-medium text-[#4d6f5f]">环境应急预案 SaaS</p>
              <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">
                AI 环保应急预案编制助手
              </h1>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-stretch">
            <div className="space-y-6">
              <p className="max-w-2xl text-lg leading-8 text-[#385247]">
                面向企业、园区和第三方编制机构，把资料收集、缺项追问、预案生成、备案材料和导出交付集中在一个工作台中。
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {capabilityItems.map((item) => (
                  <div
                    className="border border-[#cbd8d1] bg-white px-4 py-3 text-sm font-medium text-[#234437]"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-72 overflow-hidden border border-[#b8ccc2] bg-[#e8f0eb]">
              <div className="absolute left-6 top-6 h-16 w-16 border-4 border-[#2f6b4f]" />
              <div className="absolute right-6 top-8 h-20 w-20 rounded-full border-4 border-[#86a894]" />
              <div className="absolute bottom-6 left-7 right-7 h-24 border border-[#a7beb2] bg-white" />
              <div className="absolute bottom-12 left-12 right-12 h-1 bg-[#2f6b4f]" />
              <div className="absolute bottom-20 left-12 h-1 w-28 bg-[#d29f45]" />
              <div className="absolute bottom-28 left-12 grid grid-cols-4 gap-2">
                <span className="h-3 w-8 bg-[#123c2b]" />
                <span className="h-3 w-8 bg-[#6f927f]" />
                <span className="h-3 w-8 bg-[#d29f45]" />
                <span className="h-3 w-8 bg-[#a7beb2]" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-[#123c2b]" />
              <div className="absolute bottom-10 right-12 h-28 w-12 bg-[#6f927f]" />
              <div className="absolute bottom-10 right-28 h-20 w-12 bg-[#a7beb2]" />
              <div className="absolute bottom-10 right-44 h-16 w-12 bg-[#d29f45]" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3" id="plans">
            {planTiers.map((tier) => (
              <article className="border border-[#cbd8d1] bg-white p-5" key={tier.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg font-semibold">{tier.name}</h2>
                  <p className="text-sm font-medium text-[#2f6b4f]">{tier.price}</p>
                </div>
                <p className="mt-2 min-h-12 text-sm leading-6 text-[#526b60]">{tier.detail}</p>
                <ul className="mt-4 space-y-2 text-sm text-[#263c32]">
                  {tier.features.map((feature) => (
                    <li className="flex gap-2" key={feature}>
                      <span className="mt-2 h-1.5 w-1.5 bg-[#d29f45]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <aside className="border border-[#b8ccc2] bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-[#4d6f5f]">进入工作台</p>
              <h2 className="mt-1 text-2xl font-semibold">选择试用场景</h2>
            </div>
            <label className="block text-sm font-medium">
              使用身份
              <select className="mt-2 w-full border border-[#b8ccc2] bg-white px-3 py-3">
                <option>企业填报人员</option>
                <option>第三方编制机构</option>
                <option>园区管理人员</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              预案用途
              <select className="mt-2 w-full border border-[#b8ccc2] bg-white px-3 py-3">
                <option>综合预案编制</option>
                <option>备案材料整理</option>
                <option>专家评审前校核</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              商业模式
              <select className="mt-2 w-full border border-[#b8ccc2] bg-white px-3 py-3">
                <option>先免费体验</option>
                <option>按项目购买标准版</option>
                <option>咨询企业/机构套餐</option>
              </select>
            </label>
            <div className="grid gap-3 pt-2">
              <Link
                className="bg-[#123c2b] px-5 py-3 text-center font-semibold text-white"
                href="/projects/new"
              >
                开始创建项目
              </Link>
              <Link
                className="border border-[#b8ccc2] px-5 py-3 text-center font-semibold text-[#123c2b]"
                href="#plans"
              >
                查看套餐与服务
              </Link>
            </div>
            <p className="text-xs leading-5 text-[#6b7d75]">
              当前版本为部署演示版，账号、权限、套餐额度和支付能力已在入口信息架构中预留，后续可逐步接入。
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
