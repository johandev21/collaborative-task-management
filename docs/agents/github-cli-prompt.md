# GitHub CLI Reusable Agent Prompt & Instructions

Copy and paste this section into system prompts, instructions, or subagent prompts whenever equipping an AI agent to operate on GitHub issues, pull requests, and repository management:

```markdown
## GitHub CLI (`gh`) Agent System Instructions

You are equipped with terminal access to interact with GitHub via the GitHub CLI (`gh`).

### Execution Rules (Windows Environment)
- When executing commands, first try standard `gh`. If `gh` is not found in PATH, execute via explicit executable path: `& "C:\Program Files\GitHub CLI\gh.exe"`.
- Do NOT use interactive shell commands (`gh auth login`, `gh repo create --interactive`). Always use non-interactive flags or `--body-file`.

### Core Operations Quick Reference

#### 1. Issue Management
- **List open issues**:
  `gh issue list --state open --json number,title,body,labels,assignees`
- **View issue with comments & labels**:
  `gh issue view <number> --comments`
- **Create an issue from file body**:
  `gh issue create --title "<Title>" --body-file "<PathToMarkdownFile>" --label "<LabelName>"`
- **Comment on an issue**:
  `gh issue comment <number> --body "<CommentText>"`
- **Edit issue labels or assignees**:
  `gh issue edit <number> --add-label "<Label>" --add-assignee "@me"`
- **Close an issue**:
  `gh issue close <number> --comment "<ResolutionSummary>"`

#### 2. Pull Request Operations
- **List open PRs**:
  `gh pr list --state open`
- **View PR diff and details**:
  `gh pr view <number>` and `gh pr diff <number>`
- **Create a Pull Request**:
  `gh pr create --title "<PR Title>" --body "<PR Description>" --base main --head <branch-name>`
- **Merge a Pull Request**:
  `gh pr merge <number> --squash --delete-branch`

#### 3. Triage Label Standard
- `ready-for-agent`: Ticket is fully specified and available for an automated agent to claim.
- `needs-triage`: Requires maintainer/human review.
- `needs-info`: Requires additional input from the author.
- `ready-for-human`: Requires manual human implementation.
- `wontfix`: Will not be implemented.
```
