# Updating Queue

- You cannot change an existing queue type (e.g. `quorum` to `classic` or vice versa)!
- But you can change these settings of an existing queue:
  - Routing key.
  - Exchange (basically it is adding the new binding to the list of existing bindings).
  - And policies.

![Updating exchange](./update-exchange.png)
