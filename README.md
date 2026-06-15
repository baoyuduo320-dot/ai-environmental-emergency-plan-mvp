# AI Environmental Emergency Plan MVP

## Workspace Checks

- Root workspace uses pnpm workspaces
- apps/web exists
- apps/worker exists

## Services

- `apps/web`: internal operator web app
- `apps/worker`: parsing, generation, validation, export service

## Local MVP Run

1. Start the worker service on port 8001
2. Start the web app on port 3000
3. Open the project creation page
4. Upload source material
5. Review missing questions, issues, and export preview
