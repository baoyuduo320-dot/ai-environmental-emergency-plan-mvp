export function FileUploadPanel({
  onFilesSelected,
  uploading,
  helperText
}: {
  onFilesSelected: (files: File[]) => void;
  uploading: boolean;
  helperText: string;
}) {
  return (
    <section>
      <h2>资料上传</h2>
      <input
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
      <p>
        {uploading
          ? "资料抽取中..."
          : helperText || "支持上传 pdf、docx、doc，抽取后的文本会自动回填到下方。"}
      </p>
    </section>
  );
}
