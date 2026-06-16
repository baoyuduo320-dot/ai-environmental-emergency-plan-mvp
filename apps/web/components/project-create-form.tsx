const serviceModes = ["自助生成", "辅助编制", "专业代编"];

const tiers = [
  {
    name: "免费体验",
    description: "预览生成流程"
  },
  {
    name: "标准版",
    description: "完整生成与导出"
  },
  {
    name: "专业版",
    description: "协作、台账与规则更新"
  }
];

export function ProjectCreateForm() {
  return (
    <main className="min-h-screen bg-[#eef5ef] px-5 py-8 text-[#16231c]">
      <form className="mx-auto max-w-5xl overflow-hidden border border-[#c7d8cc] bg-white shadow-sm">
        <section className="grid gap-8 bg-[#123c2b] px-6 py-8 text-white md:grid-cols-[1fr_220px] md:px-8">
          <div>
            <p className="text-sm font-medium text-[#b9d8c4]">环保应急预案</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">
              创建环境应急预案项目
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#d9eadf]">
              围绕企业环境风险、应急资源和备案用途建立项目档案，先把关键信息整理清楚，再进入 AI 编制流程。
            </p>
          </div>
          <div className="border border-[#79a489] bg-[#1d4b36] p-5">
            <p className="text-sm text-[#b9d8c4]">工作目标</p>
            <p className="mt-2 text-2xl font-semibold">守住环境风险底线</p>
          </div>
        </section>

        <section className="grid gap-8 px-6 py-8 md:px-8">
          <div>
            <div className="flex items-center gap-3 border-b border-[#d8e4dc] pb-3">
              <span className="grid h-8 w-8 place-items-center bg-[#dce9df] text-sm font-semibold text-[#123c2b]">
                01
              </span>
              <h2 className="text-xl font-semibold">基础信息</h2>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium">
                企业名称
                <input
                  aria-label="企业名称"
                  className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
                  name="companyName"
                  placeholder="例如：某某环保科技有限公司"
                />
              </label>
              <label className="block text-sm font-medium">
                所属行业
                <input
                  aria-label="所属行业"
                  className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
                  name="industry"
                  placeholder="例如：精细化工、表面处理、仓储"
                />
              </label>
              <label className="block text-sm font-medium">
                所在地区
                <input
                  aria-label="所在地区"
                  className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
                  name="region"
                  placeholder="省 / 市 / 区县"
                />
              </label>
              <label className="block text-sm font-medium">
                企业规模
                <select
                  aria-label="企业规模"
                  className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
                  name="companyScale"
                >
                  <option>小微企业</option>
                  <option>中型企业</option>
                  <option>大型企业</option>
                  <option>园区多企业项目</option>
                </select>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 border-b border-[#d8e4dc] pb-3">
              <span className="grid h-8 w-8 place-items-center bg-[#dce9df] text-sm font-semibold text-[#123c2b]">
                02
              </span>
              <h2 className="text-xl font-semibold">风险与用途</h2>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium">
                环境风险等级
                <select
                  aria-label="环境风险等级"
                  className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
                  name="riskLevel"
                >
                  <option>待系统判定</option>
                  <option>一般</option>
                  <option>较大</option>
                  <option>重大</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                是否涉及危化品
                <select
                  aria-label="是否涉及危化品"
                  className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
                  name="hazardousChemicals"
                >
                  <option>待确认</option>
                  <option>涉及</option>
                  <option>不涉及</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                预案用途
                <select
                  aria-label="预案用途"
                  className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
                  name="planPurpose"
                >
                  <option>首次备案</option>
                  <option>修订备案</option>
                  <option>专家评审前校核</option>
                  <option>内部演练与培训</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                历史预案状态
                <select
                  aria-label="历史预案状态"
                  className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
                  name="legacyPlan"
                >
                  <option>无历史预案</option>
                  <option>已有旧版 Word/PDF</option>
                  <option>已有备案材料包</option>
                </select>
              </label>
            </div>
          </div>

          <div className="grid gap-5 border-t border-[#d8e4dc] pt-6 lg:grid-cols-[1fr_1.4fr_auto] lg:items-end">
            <label className="block text-sm font-medium">
              服务模式
              <select
                aria-label="服务模式"
                className="mt-2 w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#2f6b4f]"
                name="serviceMode"
              >
                {serviceModes.map((mode) => (
                  <option key={mode}>{mode}</option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend className="text-sm font-medium text-[#4d6f5f]">套餐预留</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {tiers.map((tier, index) => (
                  <label
                    className="flex min-h-20 gap-3 border border-[#d8e4dc] bg-[#fbfdfb] p-3 text-sm"
                    key={tier.name}
                  >
                    <input
                      defaultChecked={index === 0}
                      name="tier"
                      type="radio"
                      value={tier.name}
                    />
                    <span>
                      <strong className="block">{tier.name}</strong>
                      <span className="mt-1 block text-xs leading-5 text-[#5b7167]">
                        {tier.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              className="h-12 bg-[#123c2b] px-8 font-semibold text-white transition hover:bg-[#0d2d20]"
              type="submit"
            >
              创建项目
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}
