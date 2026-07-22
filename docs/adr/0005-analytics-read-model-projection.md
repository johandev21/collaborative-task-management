# Asynchronous Event-Driven Read-Model Projection for Analytics

We decided to decouple analytics reporting from transactional OLTP tables by maintaining an asynchronous read-model projection. Domain events (`task.created`, `task.moved`, `task.completed`, `time_entry.logged`) update pre-aggregated analytical tables in the `Analytics` context. Executing complex analytical rollups directly on transactional write tables was rejected to preserve write performance and guarantee sub-second dashboard load times.
