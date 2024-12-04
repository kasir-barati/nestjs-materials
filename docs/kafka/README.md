# Kafka

- AKA Apache Kafka.
- Open-source distributed event streaming platform.
- Ensuring a continuous flow and interpretation of data so that the right information is at the right place, at the right time.
- Battle-tested, [distributed][distributed-link], [highly scalable](scalability-link), [elastic][elastic-link], [fault-tolerant](fault-tolerant-link), and secure solution.
- Can be deployed on bare-metal hardware, virtual machines, and containers.
- Supports on-premise servers and cloud environments.

## Event streaming

- Digital equivalent of the human body's Central Nervous System ([CNS](https://en.wikipedia.org/wiki/Central_nervous_system)).
- Technological foundation for the 'always-on' world; where the user of software is other softwares.
- It means:
  - Capturing data in real-time.
  - From different event sources: e.g. databases, sensors, mobile devices, cloud services, and software applications.
  - In the form of streams of events.
  - To store these event streams durably for:
    - Later retrieval.
    - Manipulating.
    - Processing.
    - Reacting to the event streams in real-time as well as retrospectively.
    - Routing the event streams to different destinations.

### Event streaming use cases

- Processing payments and financial transactions in real-time (e.g. stock exchanges, banks, and insurances).
- Track and monitor cars, trucks, fleets, and shipments in real-time (e.g. logistics and the automotive industry).
- Capture and analyze sensor data from IoT devices or other equipment (e.g. inspections with robots).
- Collect and immediately react to customer interactions and orders.
- Monitor patients in hospital care and predict changes in condition.
- **Foundation for** data platforms, event-driven architectures, and **microservices**.

### Key capabilities

1. Pub/sub pattern.
2. Storing streams of events durably and reliably.

   > [!NOTE]
   >
   > Kafka's performance is <span title="Might not be absolutely constant!">effectively</span> constant with respect to data size, so storing data for a long time is perfectly fine.

3. Live or retrospective processing.

## How it works

- A distributed system consisting of [servers](#serverDefinition) and clients.
  - **Client**: SDK that read, write, and process streams of events.
- Communicates via a high-performance TCP network protocol.

![How Kafka works infographic](./how-it-works.png)

- Producers and consumers are fully decoupled and agnostic of each other, resulting high scalability.

### Glossary

<dl>
  <dt id="topicDefinition">
    <a href="#topicDefinition">#</a>
    Topic:
  </dt>
  <dd>A channel for categorizing events.</dd>
  <dd>A topic is similar to a folder in a filesystem.</dd>
  <dd>Multi-producer and multi-subscriber.</dd>
  <dd>
    Every topic can be replicated, even across geo-regions or datacenters, so that there are always multiple brokers that have a copy of the data. <b>A common production setting is a replication factor of 3</b>, i.e., there will always be three copies of your data.
  </dd>
  <dt id="eventDefinition">
    <a href="#eventDefinition">#</a>
    Event:
  </dt>
  <dd>AKA record or message.</dd>
  <dd>
    Usually has a
    <b>key</b>,
    <b>value</b>,
    <b>timestamp</b>,
    and optional <b>metadata headers</b>.
    Here's an example event.
  </dd>
  <dd>Similar to the files in a folder (topic).</dd>
  <dd>
    Can be read as often as needed (but can also guarantee to process events exactly-once).
  </dd>
  <dt id="partitioningDefinition">
    <a href="#partitioningDefinition">#</a>
    Partitioning:
  </dt>
  <dd>Topics are partitioned.</dd>
  <dd>A topic is spread over a number of "buckets" located on different Kafka brokers.</dd>
  <dd>
    Important for scalability, because it allows client apps to read/write data from/to many brokers at the same time.
  </dd>
  <dt id="producerDefinition">
    <a href="#producerDefinition">#</a>
    Producer:
  </dt>
  <dd>Client apps that send data to our Kafka topics.</dd>
  <dt id="consumerDefinition">
    <a href="#consumerDefinition">#</a>
    Consumer:
  </dt>
  <dd>Client apps that receive data from Kafka topics by subscribing to the events.</dd>
  <dt id=serverDefinition">
    <a href="#serverDefinition">#</a>
    Server:
  </dt>
  <dd>A cluster of one or more servers that can span multiple datacenters or cloud regions.</dd>
  <dd>Some of these servers form the storage layer, called the <b>brokers</b>.</dd>
  <dd>Some manages data distribution.</dd>
</dl>

## [Docker `wurstmeister/kafka`](https://github.com/wurstmeister/kafka-docker)

- Version format mirrors the Kafka format; `<scala version>-<kafka version>`.
- Customize any Kafka parameters by adding them as environment variables, [learn more](https://github.com/kasir-barati/docker/tree/main/docker-compose-files/kafka#kafkaParameters).

[elastic-link]: https://github.com/kasir-barati/paas-system/blob/cloud-practitioner/aws/glossary.md#elasticityGlobalGlossary
[fault-tolerant-link]: https://www.linkedin.com/posts/kasir-barati_aws-cloudabrengineer-highabravailability-activity-7215737348670504961-vWu6?utm_source=share&utm_medium=member_desktop
[scalability-link]: https://github.com/kasir-barati/paas-system/blob/cloud-practitioner/aws/glossary.md#scalabilityGlobalGlossary
[distributed-link]: https://github.com/kasir-barati/paas-system/blob/cloud-practitioner/aws/glossary.md#distributedSystems
