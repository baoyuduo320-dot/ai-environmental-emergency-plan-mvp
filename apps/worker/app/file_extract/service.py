import re
import subprocess
import tempfile
import zlib
from pathlib import Path


def _extract_with_textutil(content: bytes, suffix: str) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_file.write(content)
        temp_path = Path(temp_file.name)

    try:
        result = subprocess.run(
            ["textutil", "-convert", "txt", "-stdout", str(temp_path)],
            capture_output=True,
            check=False,
        )
        if result.returncode != 0:
            message = result.stderr.decode("utf-8", errors="ignore").strip()
            raise ValueError(message or "系统文本转换失败")
        return result.stdout.decode("utf-8", errors="ignore").strip()
    finally:
        temp_path.unlink(missing_ok=True)


def _decode_pdf_literal(value: bytes) -> str:
    value = value.replace(rb"\(", b"(").replace(rb"\)", b")").replace(rb"\r", b"\r")
    return value.decode("utf-8", errors="ignore") or value.decode("latin-1", errors="ignore")


def _parse_cmap(stream: bytes) -> dict[str, str]:
    text = stream.decode("latin-1", errors="ignore")
    mapping: dict[str, str] = {}

    for src, dst in re.findall(r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", text):
        try:
            mapping[src.upper()] = bytes.fromhex(dst).decode("utf-16-be", errors="ignore")
        except Exception:
            continue

    for start, end, dst in re.findall(
        r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", text
    ):
        try:
            start_int = int(start, 16)
            end_int = int(end, 16)
            dst_int = int(dst, 16)
        except ValueError:
            continue
        for offset, code in enumerate(range(start_int, end_int + 1)):
            try:
                mapping[f"{code:X}".upper()] = bytes.fromhex(
                    f"{dst_int + offset:04X}"
                ).decode("utf-16-be", errors="ignore")
            except Exception:
                continue

    return mapping


def _decode_pdf_hex_with_cmap(hex_text: str, cmap: dict[str, str]) -> str:
    normalized = hex_text.upper()
    decoded_parts: list[str] = []
    key_lengths = sorted({len(key) for key in cmap.keys()}, reverse=True)
    position = 0

    while position < len(normalized):
        matched = False
        for length in key_lengths:
            chunk = normalized[position: position + length]
            if chunk in cmap:
                decoded_parts.append(cmap[chunk])
                position += length
                matched = True
                break
        if not matched:
            return ""

    return "".join(decoded_parts)


def _decode_pdf_hex(hex_text: str, cmaps: list[dict[str, str]]) -> str:
    candidates: list[str] = []

    for cmap in cmaps:
        decoded = _decode_pdf_hex_with_cmap(hex_text, cmap)
        if decoded:
            candidates.append(decoded)

    try:
        candidates.append(bytes.fromhex(hex_text).decode("utf-16-be", errors="ignore"))
    except Exception:
        pass

    try:
        candidates.append(bytes.fromhex(hex_text).decode("utf-8", errors="ignore"))
    except Exception:
        pass

    def score(text: str) -> tuple[int, int]:
        cjk_count = sum("\u4e00" <= char <= "\u9fff" for char in text)
        visible_count = sum(char.strip() != "" for char in text)
        return (cjk_count, visible_count)

    clean_candidates = [candidate for candidate in candidates if candidate.strip()]
    if not clean_candidates:
        return ""
    return max(clean_candidates, key=score)


def _extract_pdf_text(content: bytes) -> str:
    streams: list[bytes] = []
    for match in re.finditer(rb"stream\r?\n(.*?)endstream", content, re.S):
        stream_bytes = match.group(1).rstrip(b"\r\n")
        try:
            streams.append(zlib.decompress(stream_bytes))
        except Exception:
            streams.append(stream_bytes)

    cmaps = [
        cmap for cmap in (_parse_cmap(stream) for stream in streams) if cmap
    ]
    parts: list[str] = []

    for stream in streams:
        if b"Tj" not in stream and b"TJ" not in stream:
            continue

        for literal in re.findall(rb"\((.*?)(?<!\\)\)", stream, re.S):
            decoded = _decode_pdf_literal(literal).strip()
            if decoded:
                parts.append(decoded)

        for hex_text in re.findall(rb"<([0-9A-Fa-f]+)>", stream):
            decoded = _decode_pdf_hex(hex_text.decode("ascii"), cmaps).strip()
            if decoded:
                parts.append(decoded)

    text = "\n".join(parts)
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()


def clean_extracted_text(text: str) -> str:
    cleaned_lines: list[str] = []
    seen_consecutive = ""

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            if cleaned_lines and cleaned_lines[-1] != "":
                cleaned_lines.append("")
            continue

        # Drop common page noise and isolated page-number style lines.
        if re.fullmatch(r"[—\-_\s]*\d+[—\-_\s]*", line):
            continue
        if line in {"封面", "正文目录"}:
            continue
        if len(line) <= 2 and not re.search(r"[\u4e00-\u9fffA-Za-z]", line):
            continue

        if line == seen_consecutive:
            continue

        cleaned_lines.append(line)
        seen_consecutive = line

    cleaned_text = "\n".join(cleaned_lines)
    cleaned_text = re.sub(r"\n{3,}", "\n\n", cleaned_text)
    return cleaned_text.strip()


def extract_text_from_upload(filename: str, content: bytes) -> dict[str, object]:
    suffix = Path(filename).suffix.lower()
    warnings: list[str] = []

    if suffix in {".doc", ".docx"}:
        text = _extract_with_textutil(content, suffix)
    elif suffix == ".pdf":
        text = _extract_pdf_text(content)
        if not text:
            warnings.append(
                f"{filename} 的 PDF 文本抽取效果有限，建议优先上传 docx/doc 或补充粘贴关键信息。"
            )
    else:
        raise ValueError(f"暂不支持 {suffix or '该类型'} 文件，请上传 pdf、docx 或 doc。")

    if not text:
        warnings.append(f"{filename} 未提取到有效文本内容。")

    return {"text": clean_extracted_text(text), "warnings": warnings}
