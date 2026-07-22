# Collaborative Task Management

Canonical terms and ubiquitous language for the Collaborative Task Management Platform.

## Language

**Organization**:
The top-level tenant isolation boundary and billing entity.
_Avoid_: Account, Company, Enterprise

**Workspace**:
A logical group of team members, projects, and boards within an Organization.
_Avoid_: Team, Project group, Workspace folder

**Board**:
A Kanban-style visual collection of tasks with configurable workflow columns.
_Avoid_: Task list, Project view, Workflow canvas

**Task**:
The fundamental unit of work containing status, assignees, comments, attachments, and time logs.
_Avoid_: Issue, Ticket, Item, Work item

**Column**:
A visual lane on a Board representing a workflow step.
_Avoid_: Lane, List, Stage

**Status Category**:
The semantic classification of a Task state (`To Do`, `In Progress`, `Completed`, `Archived`).
_Avoid_: Task state, Progress phase

**Transition Guard**:
An optional policy rule attached to a Column or Board that validates whether a Task transition is permitted.
_Avoid_: Workflow rule, State constraint

**Member**:
A user explicitly granted access and a role within an Organization or Workspace.
_Avoid_: User account, Teammate

**Real-Time Hub**:
The WebSocket gateway subsystem responsible for broadcasting domain events and tracking user presence across Boards.
_Avoid_: WebSocket broker, Socket server

**Presence**:
Transient real-time telemetry indicating which Members are currently viewing a Board or interacting with a Task.
_Avoid_: Online status, Active state

**Time Entry**:
An immutable log record capturing a duration of work spent by a Member on a Task.
_Avoid_: Worklog, Time card, Logged hours

**Estimated Duration**:
The projected time required to complete a Task.
_Avoid_: Time estimate, Story points

**Active Timer**:
A live transient stopwatch associated with a Member and a Task that automatically converts into a Time Entry upon stopping.
_Avoid_: Running timer, Live log

**Task Key**:
A human-readable, workspace-unique identifier prefixing a numeric sequence (e.g. `APP-104`) used for cross-referencing Tasks in commits, PRs, and external tools.
_Avoid_: Task ID, Issue key, Ticket number

**Integration Connector**:
An adapter subsystem that bridges external third-party services (GitHub, Slack) with internal domain events and commands.
_Avoid_: Webhook plugin, Bot integration

**Port**:
An interface boundary defining how core domain use cases receive driving requests or call driven infrastructure capabilities.
_Avoid_: Core interface, Gateway contract

**Adapter**:
An implementation module translating external protocols (HTTP/WebSocket/DB drivers) into domain Port contracts.
_Avoid_: Controller plugin, Driver implementation

**Read Model**:
A query-optimized data view populated asynchronously by domain events to serve UI dashboards without impacting write transactions.
_Avoid_: Reporting schema, Analytical cache

**Projection Handler**:
An event consumer that transforms domain events into updated Read Model state.
_Avoid_: Event listener plugin, Report builder

**Lead Time**:
The total elapsed time from Task creation until Task completion.
_Avoid_: Total turnaround, Creation-to-done

**Cycle Time**:
The elapsed time from when work actively begins on a Task (`In Progress`) until it reaches completion.
_Avoid_: Processing time, Working duration
