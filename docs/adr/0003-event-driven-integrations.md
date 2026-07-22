# Bi-Directional Event-Driven Integrations for GitHub and Slack

We decided to build an event-driven Integration Layer that processes inbound webhooks (GitHub PRs, Slack Slash commands) and subscribes to internal domain events (Task state changes, Member mentions). Inbound GitHub PR events automatically link commits/PRs to Tasks by Task Key (e.g. `APP-104`) and trigger workflow transitions (`In Review`, `Completed`). Outbound events dispatch real-time summaries to configured Slack channels.
