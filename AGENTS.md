# AGENTS.md

## Agent skills

### Issue tracker

Issues live in GitHub Issues (uses `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Standard 5-role triage label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (`CONTEXT.md` + `docs/adr/` at repo root). See `docs/agents/domain.md`.

## Package Management

- Use `pnpm` as the package manager across all applications.
- When adding new dependencies, do not manually edit `package.json` with static versions. Always run package installation commands via CLI (e.g., `pnpm add <package>`) to install the latest library versions.

