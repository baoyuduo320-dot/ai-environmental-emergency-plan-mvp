const serviceModes = [
  {
    name: "自助生成",
    description: "适合资料较完整、先快速形成初稿的企业。"
  },
  {
    name: "辅助编制",
    description: "适合需要系统持续追问、补齐资料和校核缺项的项目。"
  },
  {
    name: "专业代编",
    description: "为后续专家服务、机构协作和按项目收费预留。"
  }
];

export function ProjectCreateForm() {
  return (
    <main className="min-h-screen bg-[#f5f7f4] px-5 py-8 text-[#17211b]">
      <form className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_340px]">
        <section className="border border-[#cbd8d1] bg-white p-6">
          <div className="mb-6">
            <p className="text-sm font-medium text-[#4d6f5f]">项目初始化</p>
            <h1 className="mt-1 text-3xl font-semibold">创建环境应急预案项目</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#526b60]">
              请先录入企业基础信息、风险特征和服务模式。后续账号额度、项目计费和专家协作会基于这些选项扩展。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium">
              企业名称
              <input
                aria-label="企业名称"
                className="mt-2 w-full border border-[#b8ccc2] px-3 py-3"
                name="companyName"
                placeholder="例如：某某环保科技有限公司"
              />
            </label>
            <label className="block text-sm font-medium">
              所属行业
              <input
                aria-label="所属行业"
                className="mt-2 w-full border border-[#b8ccc2] px-3 py-3"
                name="industry"
                placeholder="例如：精细化工、表面处理、仓储"
              />
            </label>
            <label className="block text-sm font-medium">
              所在地区
              <input
                aria-label="所在地区"
                className="mt-2 w-full border border-[#b8ccc2] px-3 py-3"
                name="region"
                placeholder="省 / 市 / 区县"
              />
            </label>
            <label className="block text-sm font-medium">
              企业规模
              <select
                aria-label="企业规模"
                className="mt-2 w-full border border-[#b8ccc2] bg-white px-3 py-3"
                name="companyScale"
              >
                <option>小微企业</option>
                <option>中型企业</option>
                <option>大型企业</option>
                <option>园区多企业项目</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              环境风险等级
              <select
                aria-label="环境风险等级"
                className="mt-2 w-full border border-[#b8ccc2] bg-white px-3 py-3"
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
                className="mt-2 w-full border border-[#b8ccc2] bg-white px-3 py-3"
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
                className="mt-2 w-full border border-[#b8ccc2] bg-white px-3 py-3"
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
                className="mt-2 w-full border border-[#b8ccc2] bg-white px-3 py-3"
                name="legacyPlan"
              >
                <option>无历史预案</option>
                <option>已有旧版 Word/PDF</option>
                <option>已有备案材料包</option>
              </select>
            </label>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="border border-[#cbd8d1] bg-white p-5">
            <label className="block text-sm font-medium">
              服务模式
              <select
                aria-label="服务模式"
                className="mt-2 w-full border border-[#b8ccc2] bg-white px-3 py-3"
                name="serviceMode"
              >
                {serviceModes.map((mode) => (
                  <option key={mode.name}>{mode.name}</option>
                ))}
              </select>
            </label>
            <div className="mt-5 space-y-3">
              {serviceModes.map((mode) => (
                <div className="border border-[#d8e1dc] p-3" key={mode.name}>
                  <p className="text-sm font-semibold">{mode.name}</p>
                  <p className="mt-1 text-xs leading-5 text-[#5b7167]">
                    {mode.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-[#cbd8d1] bg-white p-5">
            <p className="text-sm font-medium text-[#4d6f5f]">套餐预留</p>
            <div className="mt-3 grid gap-3">
              <label className="flex items-start gap-3 border border-[#d8e1dc] p-3 text-sm">
                <input defaultChecked name="tier" type="radio" value="free" />
                <span>
                  <strong className="block">免费体验</strong>
                  1 个项目，预览部分生成结果。
                </span>
              </label>
              <label className="flex items-start gap-3 border border-[#d8e1dc] p-3 text-sm">
                <input name="tier" type="radio" value="standard" />
                <span>
                  <strong className="block">标准版</strong>
                  完整生成、校核和 Word 导出。
                </span>
              </label>
              <label className="flex items-start gap-3 border border-[#d8e1dc] p-3 text-sm">
                <input name="tier" type="radio" value="pro" />
                <span>
                  <strong className="block">专业版</strong>
                  团队协作、项目台账和规则库更新。
                </span>
              </label>
            </div>
          </section>

          <button
            className="w-full bg-[#123c2b] px-5 py-3 font-semibold text-white"
            type="submit"
          >
            创建项目
          </button>
        </aside>
      </form>
    </main>
  );
}
