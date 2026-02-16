# Classic VS Quorum

- Classic queues offer high throughput and low latency but limited fault tolerance, making them suitable for high-performance, non-critical applications
- Quorum queues use the Raft consensus algorithm for multi-node replication, providing strong durability and fault tolerance at the cost of lower throughput and higher latency
- Benchmark tests using RabbitMQ PerfTest tool showed Classic queues consistently outperformed Quorum queues in both sending and receiving rates across all scenarios
- Quorum queues introduce significantly more latency due to replication overhead but ensure message availability even during node failures
- Classic queues scale more efficiently, while Quorum queues show diminishing returns in throughput as more producers and consumers are added
- Resource usage differs significantly: Classic queues require less CPU, memory, and disk overhead (single node), while Quorum queues demand higher resources (multiple nodes)
- Why It Matters: The choice between Classic and Quorum queues depends on balancing performance requirements against reliability needs—Classic queues excel in speed and efficiency for non-critical workloads, while Quorum queues are essential for critical applications where message loss is unacceptable and high availability is required.

Why It Matters: The choice between Classic and Quorum queues depends on balancing performance requirements against reliability needs—Classic queues excel in speed and efficiency for non-critical workloads, while Quorum queues are essential for critical applications where message loss is unacceptable and high availability is required.

## Ref

https://dzone.com/articles/battle-of-the-rabbitmq-queues-performance-insights
