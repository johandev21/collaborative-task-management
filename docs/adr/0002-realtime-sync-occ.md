# Real-Time Synchronization via WebSocket and Optimistic Concurrency Control

We decided to use WebSocket broadcasting paired with Optimistic Concurrency Control (OCC) for real-time collaboration across Boards and Tasks. Each Task carries a version sequence number. Concurrent edits to the same Task version are rejected with conflict errors, prompting client state refreshes. Full CRDT/OT was rejected to avoid unnecessary complexity for discrete Kanban card state and field mutations.
