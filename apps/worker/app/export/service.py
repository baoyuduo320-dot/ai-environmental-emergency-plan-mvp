def render_export_payload(project_name: str, sections: dict[str, str]) -> dict[str, str]:
    ordered_titles = list(sections.keys())
    body_parts = [f"{title}\n{sections[title]}" for title in ordered_titles]
    return {
        "cover_title": "突发环境事件应急预案",
        "project_name": project_name,
        "table_of_contents": "\n".join(ordered_titles),
        "body": "\n\n".join(body_parts),
    }
