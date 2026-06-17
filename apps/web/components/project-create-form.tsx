"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const learningSteps = [
  "上传历史预案",
  "抽取企业风险信息",
  "形成项目知识库",
  "生成后持续优化"
];

export function ProjectCreateForm() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("创建项目失败，请稍后重试");
      }

      const data = (await response.json()) as { projectId?: string };
      if (!data.projectId) {
        throw new Error("创建项目失败，未返回项目编号");
      }

      const nextParams = new URLSearchParams();
      for (const key of ["companyName", "industry", "region", "riskLevel"]) {
        const value = payload[key];
        if (typeof value === "string" && value.trim()) {
          nextParams.set(key, value);
        }
      }
      const query = nextParams.toString();
      router.push(`/projects/${data.projectId}${query ? `?${query}` : ""}`);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "创建项目失败，请稍后重试");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#edf4ee] px-5 py-8 text-[#16231c]">
      <form
        className="mx-auto max-w-4xl overflow-hidden border border-[#c7d8cc] bg-white shadow-sm"
        onSubmit={handleSubmit}
      >
        <section className="grid gap-8 bg-[#123c2b] px-6 py-8 text-white md:grid-cols-[1fr_240px] md:px-8">
          <div>
            <p className="text-sm font-medium text-[#b9d8c4]">
              环境应急预案智能编制
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">
              创建企业预案项目
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#d9eadf]">
              先整理企业基础信息，再上传历史预案。系统会从每次上传、补充和生成结果中持续学习企业风险特征，让后续预案更贴近实际。
            </p>
          </div>
          <div className="border border-[#79a489] bg-[#1d4b36] p-5">
            <p className="text-sm text-[#b9d8c4]">持续学习企业风险特征</p>
            <ul className="mt-3 space-y-2 text-sm leading-5 text-[#eef7f0]">
              {learningSteps.map((step) => (
                <li className="flex gap-2" key={step}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#b9d8c4]" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
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

          <section className="border border-[#d8e4dc] bg-[#f7faf7] p-5">
            <h2 className="text-lg font-semibold">形成项目知识库</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d6f5f]">
              历史预案、环评资料、备案材料和后续补充内容会汇总为项目知识。每次重新生成都会基于这些资料更新企业风险源、应急资源、组织架构和处置措施。
            </p>
          </section>

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

          <div className="flex flex-col gap-3 border-t border-[#d8e4dc] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-[#4d6f5f]">
              创建后进入项目工作台，优先上传历史预案，让系统从旧资料开始学习。
            </p>
            <button
              className="h-12 shrink-0 bg-[#123c2b] px-8 font-semibold text-white transition hover:bg-[#0d2d20]"
              disabled={creating}
              type="submit"
            >
              {creating ? "创建中..." : "创建项目"}
            </button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </section>
      </form>
    </main>
  );
}
