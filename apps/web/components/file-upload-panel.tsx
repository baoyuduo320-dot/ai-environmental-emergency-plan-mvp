export function FileUploadPanel({
  onFilesSelected,
  uploading,
  helperText,
  statusText
}: {
  onFilesSelected: (files: File[]) => void;
  uploading: boolean;
  helperText: string;
  statusText?: string;
}) {
  return (
    <section className="border border-[#d8e4dc] bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#4d6f5f]">持续学习</p>
          <h2 className="mt-1 text-xl font-semibold text-[#16231c]">上传历史预案</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#4d6f5f]">
          每次上传、补充和重新生成都会沉淀为项目知识，用于优化后续预案内容。
        </p>
      </div>
      <input
        className="mt-4 block w-full border border-[#c7d8cc] bg-[#fbfdfb] px-3 py-3 text-sm text-[#16231c]"
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        aria-label="资料上传"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length) {
            onFilesSelected(files);
            event.currentTarget.value = "";
          }
        }}
        disabled={uploading}
      />
      {statusText ? (
        <p
          aria-live="polite"
          className="mt-3 border border-[#9fc5aa] bg-[#eef8f0] px-3 py-2 text-sm font-medium text-[#123c2b]"
        >
          {statusText}
        </p>
      ) : null}
      <p className="mt-3 text-sm leading-6 text-[#4d6f5f]">
        {uploading
          ? "正在唤醒后端并抽取资料，首次上传可能需要 30 秒左右..."
          : helperText ||
            "支持上传历史预案、环评资料、备案材料的 pdf、docx、doc，系统会抽取企业基础信息、风险源、应急资源和组织架构。"}
      </p>
      {!uploading ? (
        <p className="mt-2 text-xs leading-5 text-[#6c7d71]">
          首次上传可能需要 30 秒左右用于唤醒后端抽取服务，请保持页面打开。
        </p>
      ) : null}
    </section>
  );
}
