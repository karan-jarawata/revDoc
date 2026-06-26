/* ============================================================
   Apache Kafka — learning content as structured blocks.
   Rendered by app.js (shared with the multithreading guide).
   Code is stored raw and auto-escaped on render, so < > & in
   code need no escaping. Avoid ${...} and backticks in code.
   ============================================================ */
window.CONTENT = {
  hero: {
    eyebrow: 'The Complete Guide',
    title: 'Apache Kafka',
    sub: 'From the append-only log up to Streams, Connect, multi-cluster DR and managed cloud. Fifteen phases covering every layer of Kafka — each concept explained with diagrams, real Java / Spring code, CLI snippets, and the production gotchas that actually bite. Built for deep study and fast revision.',
    stats: [
      { num: '15', label: 'Phases' },
      { num: '70+', label: 'Concepts' },
      { num: '60+', label: 'Code samples' },
      { num: 'KRaft', label: 'Modern Kafka' },
    ],
  },

  levels: [
    /* ========================================================
       PHASE 0 — Why Kafka?
       ======================================================== */
    {
      id: 'phase-0', num: '00', accent: 'rose', part: 'Context',
      eyebrow: 'Start Here · The Why',
      title: 'Why Kafka?',
      intro: 'Before the mechanics, the motivation. Kafka exists to solve a specific, painful problem that shows up in every growing system — and understanding that problem is exactly what tells you when to reach for Kafka (and when not to).',
      blocks: [
        { t: 'sub', text: 'The problem — integration spaghetti' },
        { t: 'prose', html: `As a system grows, every service needs other services' data. The naive fix is <strong>point-to-point integration</strong>: Orders calls Email directly, Payments writes to Analytics directly, everyone queries everyone. With N services you head toward <strong>N×M brittle connections</strong> — a tangle where one schema change ripples everywhere, a slow consumer backs up its producer, and the primary database gets hammered by every system that needs a copy of the data.` },
        { t: 'list', items: [
          `<strong>Tight coupling</strong> — every producer must know every consumer's address, format, and whether it's even online.`,
          `<strong>No replay</strong> — once a message is delivered (or lost) it's gone; you can't reprocess history or onboard a new consumer with old data.`,
          `<strong>Database overload</strong> — every downstream system polling the primary DB for changes piles load onto the one thing you can least afford to slow down.`,
          `<strong>Batch latency</strong> — nightly ETL means insights are hours stale; there's no real-time path.`,
          `<strong>Fragile backpressure</strong> — one slow or down consumer blocks or breaks the producer.`,
        ] },
        { t: 'diagram', name: 'pointToPoint', cap: 'Point-to-point integration explodes into N×M connections; Kafka collapses it to one hub' },

        { t: 'sub', text: 'What Kafka solved — and how' },
        { t: 'prose', html: `Kafka inserts a single, durable, append-only <strong>commit log</strong> between everyone — a "central nervous system" for your data. Producers publish an event <em>once</em> to a topic and walk away; any number of consumers subscribe independently and read at their own pace. The mechanism is deceptively simple: an ordered log on disk, written and read <strong>sequentially</strong>, replicated across brokers.` },
        { t: 'list', items: [
          `<strong>Decoupling</strong> — producers and consumers never talk directly. Add a new consumer without touching any producer.`,
          `<strong>Durability + replay</strong> — events are retained (not deleted on read), so you can rewind, reprocess, or bootstrap a brand-new service from history.`,
          `<strong>Throughput</strong> — sequential disk I/O, zero-copy, and batching push millions of messages/sec on modest hardware.`,
          `<strong>Scale &amp; resilience</strong> — partitions spread load horizontally; replication survives broker failure (Phase 2).`,
          `<strong>Buffering</strong> — the log absorbs spikes; a slow consumer simply lags behind instead of breaking the producer.`,
          `<strong>One source of event truth</strong> — every system reads the same ordered stream rather than N drifting copies.`,
        ] },
        { t: 'callout', kind: 'key', html: `<strong>The core shift:</strong> from "services calling services" to "services publishing and subscribing to a shared log". That one move — a durable log in the middle — buys you decoupling, replay, and real-time all at once.` },

        { t: 'sub', text: 'Where it is used — and how' },
        { t: 'prose', html: `The same append-only log powers wildly different use cases. The "how" is always the same shape: <strong>produce events to a topic, consume them somewhere useful.</strong>` },
        { t: 'cards', cols: 2, items: [
          { title: 'Event-driven microservices', body: `<strong>How:</strong> services emit domain events ("OrderPlaced") to topics; others react. Replaces brittle REST call-chains with loose, async coupling.` },
          { title: 'Real-time analytics', body: `<strong>How:</strong> stream clickstreams and app metrics into Kafka, process with Streams/Flink, and power live dashboards or fraud detection.` },
          { title: 'Log & data aggregation', body: `<strong>How:</strong> funnel logs/events from many services into one topic, then fan out to Elasticsearch, S3, or a warehouse via Kafka Connect.` },
          { title: 'Database sync (CDC)', body: `<strong>How:</strong> Debezium streams a database's change log into Kafka, keeping caches, search indexes, and other DBs in sync in real time.` },
          { title: 'Event sourcing', body: `<strong>How:</strong> store every state change as an immutable event; rebuild state — or a whole new read model — by replaying from offset 0.` },
          { title: 'Stream processing / ETL', body: `<strong>How:</strong> transform, join, and aggregate streams in flight with Kafka Streams (Phase 9) instead of slow nightly batch jobs.` },
          { title: 'Messaging & job queues', body: `<strong>How:</strong> topics + consumer groups act as a durable, replayable work queue with built-in load balancing and at-least-once delivery.` },
          { title: 'Metrics & IoT ingestion', body: `<strong>How:</strong> millions of devices publish telemetry to partitioned topics; consumers aggregate it without overwhelming any single database.` },
        ] },
        { t: 'callout', kind: 'note', html: `<strong>When NOT to reach for Kafka:</strong> tiny apps with a few services (the operational overhead isn't worth it), simple request/response RPC (use HTTP/gRPC), or when you need a classic transactional queue with per-message priority and TTL — a traditional broker may fit better. Kafka shines at <em>scale</em> and <em>streaming</em>.` },
      ],
    },

    /* ========================================================
       PHASE 1 — Core Mechanics
       ======================================================== */
    {
      id: 'phase-1', num: '01', accent: 'purple', part: 'Core',
      eyebrow: 'Phase 1 · The Fundamentals',
      title: 'Core Mechanics',
      intro: 'Kafka is a distributed, append-only commit log you can publish to and replay from. Before anything else, internalise the vocabulary — topics, partitions, offsets, producers, consumers — and the one idea everything rests on: the immutable log.',
      blocks: [
        { t: 'sub', text: 'Event-driven architecture' },
        { t: 'prose', html: `Traditional brokers (RabbitMQ, ActiveMQ) treat a message as a transient task: deliver it, the consumer acks, and it's <strong>deleted</strong>. Kafka treats data as an <strong>event stream</strong> — an ordered, durable, replayable log. Messages aren't removed when read; they stay until a retention policy expires them, so many independent consumers can read the same data and you can rewind and reprocess history.` },
        { t: 'table', head: ['', 'Kafka', 'Traditional broker'],
          rows: [
            ['Model', 'Distributed log (pull)', 'Queue / exchange (push)'],
            ['After read', 'Retained &amp; replayable', 'Deleted (acked)'],
            ['Consumers', 'Many, independent', 'Usually competing'],
            ['Throughput', 'Very high (sequential I/O)', 'Moderate'],
            ['Replay history', '<span class="yes">Yes</span>', '<span class="no">No</span>'],
          ] },
        { t: 'list', items: [
          `<strong>Real-time analytics</strong> — clickstreams, metrics, fraud detection on live data.`,
          `<strong>Log &amp; event aggregation</strong> — funnel everything into one durable pipe.`,
          `<strong>Event sourcing</strong> — the log <em>is</em> the source of truth; rebuild state by replaying.`,
          `<strong>Stream processing &amp; ETL</strong> — transform data in flight with Kafka Streams / Flink.`,
          `<strong>Microservice backbone</strong> — decouple services via events instead of direct calls.`,
        ] },

        { t: 'sub', text: 'The building blocks' },
        { t: 'diagram', name: 'pubSub', cap: 'Producers write, the broker stores durably across partitions, consumers pull' },
        { t: 'list', items: [
          `<strong>Event (message/record):</strong> an immutable unit — <code>Key</code>, <code>Value</code>, <code>Timestamp</code>, and <code>Headers</code>.`,
          `<strong>Topic:</strong> a named, append-only log. Think "a category of events" (e.g. <code>orders</code>).`,
          `<strong>Producer:</strong> a client that publishes records to a topic.`,
          `<strong>Consumer:</strong> a client that <em>polls</em> (pulls) records from a topic.`,
          `<strong>Broker:</strong> a server that stores data and serves clients. A cluster is many brokers.`,
          `<strong>Offset:</strong> a monotonically increasing integer id of a record <em>within a partition</em> — the consumer's bookmark.`,
          `<strong>Partition:</strong> a physical slice of a topic. Partitions are the unit of parallelism and ordering.`,
        ] },
        { t: 'diagram', name: 'log', cap: 'Each partition is an ordered log; producers append, consumers track an offset' },
        { t: 'callout', kind: 'key', html: `<strong>The whole mental model:</strong> a topic is split into partitions; each partition is an ordered, immutable log of records addressed by offset. Everything else — scaling, ordering, replication, consumer groups — is a consequence of this one structure.` },

        { t: 'sub', text: 'Message keys, routing & ordering' },
        { t: 'prose', html: `Which partition does a record land in? If you set a <strong>key</strong>, Kafka computes <code>hash(key) % numPartitions</code> — so every record with the same key always goes to the same partition. No key ⇒ records are spread round-robin (sticky-batched) across partitions.` },
        { t: 'diagram', name: 'partitioning', cap: 'Same key → same partition → guaranteed ordering for that key' },
        { t: 'callout', kind: 'warning', html: `<strong>Ordering is per-partition only.</strong> Kafka guarantees order <em>within</em> a partition, never across the whole topic. If order matters for an entity (e.g. a user's events), key by that entity so all its events share one partition.` },
        { t: 'code', title: 'Producer with a key (Java)', code:
`Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer",   "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
    // key = userId -> all of this user's events stay ordered on one partition
    producer.send(new ProducerRecord<>("orders", "user-42", "ORDER_PLACED"));
    producer.send(new ProducerRecord<>("orders", "user-42", "ORDER_PAID"));
    producer.flush();
}` },
        { t: 'callout', kind: 'note', html: `Need custom routing? Implement <code>org.apache.kafka.clients.producer.Partitioner</code> and set <code>partitioner.class</code> — but a good key is almost always enough.` },

        { t: 'sub', text: 'Try it from the CLI' },
        { t: 'code', title: 'kafka CLI', code:
`# create a topic with 3 partitions, replication 1 (single broker)
kafka-topics.sh --create --topic orders \\
  --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# produce (type messages, key:value with --property)
kafka-console-producer.sh --topic orders --bootstrap-server localhost:9092

# consume from the beginning, showing keys
kafka-console-consumer.sh --topic orders --bootstrap-server localhost:9092 \\
  --from-beginning --property print.key=true` },
      ],
    },

    /* ========================================================
       PHASE 2 — Architecture & Scalability
       ======================================================== */
    {
      id: 'phase-2', num: '02', accent: 'blue', part: 'Core',
      eyebrow: 'Phase 2 · The Engine Room',
      title: 'Architecture & Scalability',
      intro: 'How Kafka stays available and scales horizontally: partitions distribute load, replication survives failure, consumer groups parallelise reads, and KRaft coordinates the cluster.',
      blocks: [
        { t: 'sub', text: 'Replication & In-Sync Replicas (ISR)' },
        { t: 'prose', html: `Each partition has a configurable <strong>replication factor</strong> (typically 3). One replica is the <strong>leader</strong> (handles all reads/writes); the rest are <strong>followers</strong> that copy the leader. The <strong>ISR</strong> is the set of replicas fully caught up. If the leader dies, a replica from the ISR is promoted — no data loss.` },
        { t: 'diagram', name: 'replication', cap: 'Leader + followers; only ISR members are eligible to become leader' },
        { t: 'callout', kind: 'key', html: `<strong>The durability triangle:</strong> <code>replication.factor=3</code>, <code>min.insync.replicas=2</code>, producer <code>acks=all</code>. Together they mean a write is only acknowledged once it's on at least 2 replicas — you can lose a broker and still not lose data.` },
        { t: 'callout', kind: 'warning', html: `<code>unclean.leader.election.enable=true</code> lets a lagging out-of-sync replica become leader to restore availability — at the cost of <strong>silently losing</strong> the records it never received. Keep it <code>false</code> unless availability strictly beats durability.` },

        { t: 'sub', text: 'Consumer groups & load balancing' },
        { t: 'prose', html: `A <strong>consumer group</strong> is a team of instances sharing a <code>group.id</code>. Kafka divides the topic's partitions among them. The <strong>golden rule</strong>: within one group, each partition is consumed by <em>exactly one</em> instance. So a topic with 3 partitions can be processed by at most 3 active consumers in a group — a 4th sits idle.` },
        { t: 'diagram', name: 'consumerGroups', cap: 'Partitions split across a group; different groups each get the full stream' },
        { t: 'callout', kind: 'note', html: `<strong>Partition count is your parallelism ceiling.</strong> To scale consumers later, provision enough partitions up front — increasing them afterward breaks key-based ordering for existing keys.` },

        { t: 'sub', text: 'The rebalance protocol' },
        { t: 'prose', html: `When a consumer joins, leaves, or dies, Kafka triggers a <strong>rebalance</strong> — partitions are reassigned across the surviving members. During a (stop-the-world) rebalance, processing pauses, so you want them short and rare. <strong>Cooperative/incremental</strong> rebalancing (the modern default) reassigns only the partitions that need to move instead of revoking everything.` },
        { t: 'code', title: 'Rebalance listener (cleanup on revoke)', code:
`consumer.subscribe(List.of("orders"), new ConsumerRebalanceListener() {
    public void onPartitionsRevoked(Collection<TopicPartition> parts) {
        // commit offsets / flush state BEFORE losing these partitions
        consumer.commitSync();
    }
    public void onPartitionsAssigned(Collection<TopicPartition> parts) {
        // warm caches / seek as needed for newly assigned partitions
    }
});` },
        { t: 'table', head: ['Assignment strategy', 'Behaviour'],
          rows: [
            ['RangeAssignor', 'Per-topic ranges; can skew with multiple topics'],
            ['RoundRobinAssignor', 'Even spread across all subscribed partitions'],
            ['StickyAssignor', 'Even <em>and</em> minimises movement on rebalance'],
            ['CooperativeStickyAssignor', 'Sticky + incremental — no stop-the-world (preferred)'],
          ] },
        { t: 'callout', kind: 'tip', html: `<strong>Static membership</strong> (<code>group.instance.id</code>) + a higher <code>session.timeout.ms</code> lets a consumer restart (deploys, brief blips) <em>without</em> triggering a rebalance. Huge for reducing churn.` },

        { t: 'sub', text: 'Cluster management — KRaft' },
        { t: 'prose', html: `Kafka used to depend on an external <strong>ZooKeeper</strong> ensemble for metadata and controller election. Modern Kafka uses <strong>KRaft</strong> (Kafka Raft) — a built-in Raft consensus quorum of controllers that stores cluster metadata <em>as a Kafka log</em>. Fewer moving parts, faster failover, and scaling to millions of partitions.` },
        { t: 'diagram', name: 'kraft', cap: 'KRaft folds metadata + controller election into Kafka itself — no ZooKeeper' },

        { t: 'sub', text: 'Advanced consumer control' },
        { t: 'list', items: [
          `<strong>auto.offset.reset</strong> — what to do with no committed offset: <code>earliest</code> (replay all), <code>latest</code> (only new), <code>none</code> (throw).`,
          `<strong>subscribe()</strong> vs <strong>assign()</strong> — <code>subscribe</code> joins a group and gets auto-balanced partitions; <code>assign</code> pins explicit partitions (no group management, full manual control).`,
          `<strong>seek()</strong> — jump to a specific offset/timestamp to replay or skip.`,
          `<strong>session.timeout.ms / heartbeat.interval.ms</strong> — how fast a dead consumer is detected.`,
          `<strong>max.poll.records / max.poll.interval.ms</strong> — batch size per poll, and the deadline to call <code>poll()</code> again before you're considered dead.`,
        ] },
        { t: 'code', title: 'Polling loop with manual seek', code:
`var consumer = new KafkaConsumer<String,String>(props);
consumer.assign(List.of(new TopicPartition("orders", 0)));
consumer.seekToBeginning(consumer.assignment());   // replay this partition

while (running) {
    var records = consumer.poll(Duration.ofMillis(500));
    for (var rec : records) {
        handle(rec.key(), rec.value(), rec.offset());
    }
}` },
        { t: 'callout', kind: 'danger', html: `If processing a poll batch takes longer than <code>max.poll.interval.ms</code> (default 5 min), the broker assumes the consumer is dead and rebalances — causing duplicate processing. Shrink <code>max.poll.records</code> or move heavy work off the poll thread.` },
      ],
    },

    /* ========================================================
       PHASE 3 — Reliability & Fault Tolerance
       ======================================================== */
    {
      id: 'phase-3', num: '03', accent: 'rose', part: 'Reliability & Security',
      eyebrow: 'Phase 3 · The Architect Level',
      title: 'Reliability & Delivery Guarantees',
      intro: 'The heart of Kafka in production: choosing a delivery guarantee, configuring producers and offsets to honour it, and using transactions for exactly-once. Get this layer right and you sleep at night.',
      blocks: [
        { t: 'sub', text: 'The three delivery guarantees' },
        { t: 'diagram', name: 'deliveryGuarantees', cap: 'Where you commit the offset decides what happens on a crash' },
        { t: 'table', head: ['Guarantee', 'Commit timing', 'On crash', 'Trade-off'],
          rows: [
            ['At-most-once', 'Before processing', '<span class="no">Message lost</span>', 'Fast, lossy'],
            ['At-least-once', 'After processing', '<span class="mid">Reprocessed (dup)</span>', 'Safe, may duplicate'],
            ['Exactly-once', 'Transactional', '<span class="yes">Once, atomically</span>', 'Correct, more overhead'],
          ] },
        { t: 'prose', html: `Most systems run <strong>at-least-once</strong> and make their processing <strong>idempotent</strong> — so a reprocessed duplicate has no extra effect (e.g. upsert by a unique key, or dedupe on an event id). Consumers also choose an <strong>isolation level</strong>: <code>read_committed</code> hides records from in-flight/aborted transactions; <code>read_uncommitted</code> sees everything.` },
        { t: 'callout', kind: 'tip', html: `<strong>Idempotent consumer pattern:</strong> store each processed event id (or use a DB unique constraint / upsert). A duplicate then becomes a no-op — turning cheap at-least-once delivery into effectively-once <em>results</em>.` },

        { t: 'sub', text: 'Producer reliability — acks & more' },
        { t: 'prose', html: `<code>acks</code> controls when a send is considered successful: <code>0</code> (fire-and-forget), <code>1</code> (leader wrote it), <code>all</code> (all ISR wrote it). Pair <code>acks=all</code> with the <strong>idempotent producer</strong> (<code>enable.idempotence=true</code>) to eliminate duplicates from retries.` },
        { t: 'diagram', name: 'acks', cap: 'acks trades latency for durability: 0 → 1 → all' },
        { t: 'code', title: 'A durable, idempotent producer', code:
`Properties p = new Properties();
p.put("bootstrap.servers", "localhost:9092");
p.put("acks", "all");                 // wait for all in-sync replicas
p.put("enable.idempotence", true);    // no duplicates on retry
p.put("retries", Integer.MAX_VALUE);  // retry transient failures
p.put("max.in.flight.requests.per.connection", 5);  // safe with idempotence
p.put("compression.type", "lz4");     // cut network at small CPU cost
p.put("linger.ms", 10);               // wait up to 10ms to batch
p.put("batch.size", 32768);           // 32KB batches -> throughput
p.put("key.serializer",   "org.apache.kafka.common.serialization.StringSerializer");
p.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");` },
        { t: 'list', items: [
          `<strong>Batching</strong> — <code>linger.ms</code> waits a few ms to fill a batch; <code>batch.size</code> caps it. Bigger batches = more throughput, slightly more latency.`,
          `<strong>Compression</strong> — <code>lz4</code>/<code>snappy</code>/<code>zstd</code> shrink network &amp; disk at some CPU; compress the whole batch.`,
          `<strong>Retries + backoff</strong> — with idempotence on, retries are safe and won't reorder or duplicate.`,
          `<strong>Callbacks</strong> — pass a callback to <code>send()</code> to catch per-record failures and metadata.`,
        ] },
        { t: 'code', title: 'Send with a callback', code:
`producer.send(new ProducerRecord<>("orders", key, value), (meta, ex) -> {
    if (ex != null) log.error("send failed for key {}", key, ex);
    else log.info("ok: partition={} offset={}", meta.partition(), meta.offset());
});` },

        { t: 'sub', text: 'Offset management' },
        { t: 'prose', html: `A consumer's progress is its <strong>committed offset</strong>, stored in the internal <code>__consumer_offsets</code> topic. <strong>Auto-commit</strong> (<code>enable.auto.commit=true</code>) periodically commits in the background — convenient but dangerous: it can commit records you haven't finished processing, causing loss on a crash. <strong>Manual commit</strong> gives you control over <em>exactly when</em>.` },
        { t: 'diagram', name: 'consumerLag', cap: 'Lag is the gap between what was committed and the latest record' },
        { t: 'code', title: 'Manual commit — sync vs async', code:
`props.put("enable.auto.commit", false);

while (running) {
    var records = consumer.poll(Duration.ofMillis(500));
    for (var rec : records) process(rec);   // do the work FIRST

    // async on the hot path (fast, best-effort)...
    consumer.commitAsync();
}
// ...sync on shutdown / rebalance for a guaranteed final commit
consumer.commitSync();` },
        { t: 'callout', kind: 'danger', html: `<strong>Commit after processing, not before.</strong> Committing first = at-most-once (loss on crash). Auto-commit effectively does this on a timer — fine for metrics, risky for anything you can't lose.` },

        { t: 'sub', text: 'Transactions & exactly-once' },
        { t: 'prose', html: `For true exactly-once across a <em>read-process-write</em> flow, use <strong>transactional producers</strong>. A transaction atomically writes output records <em>and</em> the consumer offsets — so either everything commits or nothing does. Consumers reading downstream use <code>isolation.level=read_committed</code>.` },
        { t: 'code', title: 'Transactional read-process-write', code:
`producer.initTransactions();
try {
    producer.beginTransaction();
    for (var rec : records) {
        producer.send(new ProducerRecord<>("orders-enriched", transform(rec)));
    }
    // commit input offsets as PART of the transaction
    producer.sendOffsetsToTransaction(currentOffsets(consumer), consumer.groupMetadata());
    producer.commitTransaction();         // atomic: outputs + offsets
} catch (KafkaException e) {
    producer.abortTransaction();          // nothing becomes visible
}` },
        { t: 'callout', kind: 'note', html: `<strong>Transactional Outbox pattern:</strong> to keep a database write and a Kafka publish atomic, write the event to an <code>outbox</code> table <em>in the same DB transaction</em>, then let a CDC tool (Debezium) stream that table to Kafka. Avoids the dual-write problem entirely.` },

        { t: 'sub', text: 'Data-loss prevention checklist' },
        { t: 'list', items: [
          `Producer: <code>acks=all</code>, <code>enable.idempotence=true</code>, generous <code>retries</code>.`,
          `Topic: <code>replication.factor &gt;= 3</code>, <code>min.insync.replicas=2</code>.`,
          `Broker: <code>unclean.leader.election.enable=false</code>.`,
          `Consumer: manual commit <em>after</em> processing; idempotent handlers.`,
          `Cross-DC: replicate critical topics (MirrorMaker 2 — Phase 11) for disaster recovery.`,
        ] },
      ],
    },
    /* ========================================================
       PHASE 4 — Security & Governance
       ======================================================== */
    {
      id: 'phase-4', num: '04', accent: 'amber', part: 'Reliability & Security',
      eyebrow: 'Phase 4 · The Security Layer',
      title: 'Security & Governance',
      intro: 'Who can connect, who can read/write what, how data is protected in transit and at rest, and how you keep the whole estate compliant and organised. Three pillars: authentication, authorization, encryption — plus governance.',
      blocks: [
        { t: 'sub', text: 'Authentication — who are you?' },
        { t: 'prose', html: `Kafka authenticates clients with <strong>SASL</strong> over a (usually) <strong>TLS</strong>-encrypted connection. Pick the mechanism that fits your org:` },
        { t: 'table', head: ['Mechanism', 'What it is'],
          rows: [
            ['SASL/PLAIN', 'Username + password (only safe over TLS)'],
            ['SASL/SCRAM', 'Salted challenge-response — passwords never sent in clear'],
            ['SASL/GSSAPI (Kerberos)', 'Enterprise SSO / Active Directory'],
            ['SASL/OAUTHBEARER', 'OAuth 2.0 / OIDC bearer tokens'],
            ['mTLS', 'Mutual TLS — the client certificate <em>is</em> the identity'],
          ] },
        { t: 'code', title: 'Client SASL_SSL + SCRAM config', code:
`security.protocol=SASL_SSL
sasl.mechanism=SCRAM-SHA-512
ssl.truststore.location=/etc/kafka/truststore.jks
sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule \\
    required username="orders-svc" password="s3cr3t";` },

        { t: 'sub', text: 'Authorization — ACLs' },
        { t: 'prose', html: `Once authenticated, <strong>Access Control Lists</strong> decide what a principal may do. ACLs are granular: per-topic (read/write), per-consumer-group, and cluster-admin operations. Default-deny is the safe posture.` },
        { t: 'code', title: 'Grant a service write on a topic', code:
`kafka-acls.sh --bootstrap-server localhost:9092 --add \\
  --allow-principal User:orders-svc \\
  --operation Write --operation Describe \\
  --topic orders` },

        { t: 'sub', text: 'Encryption & data protection' },
        { t: 'list', items: [
          `<strong>In transit:</strong> TLS for client↔broker and broker↔broker — the baseline.`,
          `<strong>At rest:</strong> disk/volume encryption at the OS or cloud layer (Kafka doesn't encrypt its own log files).`,
          `<strong>Message-level:</strong> encrypt sensitive fields in the producer before sending — defence in depth for PII.`,
          `<strong>Key management:</strong> rotate keys/credentials via a vault (HashiCorp Vault, KMS); never hard-code.`,
        ] },
        { t: 'callout', kind: 'warning', html: `Compliance (<strong>GDPR, HIPAA, PCI-DSS</strong>) usually requires encryption in transit + at rest, audited access, and a deletion story. Kafka's append-only log makes "right to be forgotten" tricky — see governance below.` },

        { t: 'sub', text: 'Data governance' },
        { t: 'list', items: [
          `<strong>Topic naming conventions:</strong> e.g. <code>&lt;domain&gt;.&lt;entity&gt;.&lt;event&gt;.&lt;version&gt;</code> — discoverable and consistent.`,
          `<strong>Retention policies:</strong> time-based (<code>retention.ms</code>) or size-based (<code>retention.bytes</code>).`,
          `<strong>GDPR / right-to-be-forgotten:</strong> use <strong>log compaction</strong> + tombstones (a null value per key deletes it), or crypto-shredding (delete the key that decrypts that user's data).`,
          `<strong>Audit logging:</strong> record authorizer decisions — who accessed which topic.`,
          `<strong>Data classification:</strong> tag topics by sensitivity to drive access &amp; retention rules.`,
        ] },
        { t: 'callout', kind: 'tip', html: `<strong>Crypto-shredding</strong> is the pragmatic GDPR answer for an immutable log: encrypt each subject's data with a per-subject key; to "forget" them, throw away their key and the data is irrecoverable without rewriting history.` },
      ],
    },

    /* ========================================================
       PHASE 5 — Spring Boot Integration & Resilience
       ======================================================== */
    {
      id: 'phase-5', num: '05', accent: 'green', part: 'Application Layer',
      eyebrow: 'Phase 5 · The Application Layer',
      title: 'Spring Boot & Resilience',
      intro: 'How you actually use Kafka in a service. Spring Kafka turns producers and consumers into a few annotations, and gives you battle-tested error handling: retries, dead-letter topics, and non-blocking retry pipelines.',
      blocks: [
        { t: 'sub', text: 'Spring Kafka fundamentals' },
        { t: 'prose', html: `<code>KafkaTemplate</code> sends; <code>@KafkaListener</code> receives. <code>ProducerFactory</code> / <code>ConsumerFactory</code> hold config. Spring Boot auto-configures all of it from <code>application.yml</code>.` },
        { t: 'code', title: 'application.yml', code:
`spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      acks: all
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: orders-service
      auto-offset-reset: earliest
      enable-auto-commit: false
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "com.shop.events"
    listener:
      ack-mode: record        # commit after each record is processed` },
        { t: 'code', title: 'Producer & consumer (Java)', code:
`@Service
class OrderPublisher {
    private final KafkaTemplate<String, OrderEvent> template;
    OrderPublisher(KafkaTemplate<String, OrderEvent> t) { this.template = t; }

    void publish(OrderEvent e) {
        template.send("orders", e.userId(), e);   // key = userId
    }
}

@Component
class OrderListener {
    @KafkaListener(topics = "orders", groupId = "orders-service")
    void onOrder(@Payload OrderEvent event,
                 @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                 @Header(KafkaHeaders.OFFSET) long offset) {
        process(event);
    }
}` },
        { t: 'callout', kind: 'note', html: `<code>JsonSerializer</code>/<code>JsonDeserializer</code> map POJOs to/from JSON. Set <code>spring.json.trusted.packages</code> (or <code>*</code> in dev) so the deserializer is allowed to construct your types. For batch consumption, set <code>@KafkaListener(... batch = "true")</code> and take a <code>List&lt;T&gt;</code>.` },

        { t: 'sub', text: 'Error handling & dead-letter topics' },
        { t: 'prose', html: `What happens when a record fails processing? Without handling, the consumer retries the same record forever — a <strong>poison pill</strong> stalls the whole partition. Spring's <code>DefaultErrorHandler</code> retries with backoff, then routes the record to a <strong>dead-letter topic</strong> (<code>.DLT</code>) so the pipeline keeps moving.` },
        { t: 'diagram', name: 'dlq', cap: 'Failures flow through delay topics, then land in the DLT for inspection' },
        { t: 'code', title: 'Retry + DLT publishing', code:
`@Bean
DefaultErrorHandler errorHandler(KafkaTemplate<Object, Object> template) {
    var recoverer = new DeadLetterPublishingRecoverer(template);  // -> orders.DLT
    // retry 3 times, 2s apart, then send to the DLT
    var backoff = new FixedBackOff(2000L, 3);
    var handler = new DefaultErrorHandler(recoverer, backoff);
    handler.addNotRetryableExceptions(DeserializationException.class); // skip poison pills
    return handler;
}` },
        { t: 'callout', kind: 'danger', html: `<strong>Blocking retries stall the partition</strong> — every record behind the failing one waits. For anything but the briefest backoff, prefer non-blocking retries (below).` },

        { t: 'sub', text: 'Non-blocking retries' },
        { t: 'prose', html: `<code>@RetryableTopic</code> sends failures to <em>separate</em> retry topics (e.g. <code>orders-retry-1</code>, <code>-retry-2</code>) with increasing backoff, so the main topic never blocks. Exhausted retries land in the DLT.` },
        { t: 'code', title: '@RetryableTopic', code:
`@RetryableTopic(
    attempts = "4",
    backoff = @Backoff(delay = 2000, multiplier = 3.0),   // 2s, 6s, 18s
    dltStrategy = DltStrategy.FAIL_ON_ERROR,
    topicSuffixingStrategy = TopicSuffixingStrategy.SUFFIX_WITH_INDEX_VALUE)
@KafkaListener(topics = "orders", groupId = "orders-service")
void onOrder(OrderEvent event) { process(event); }

@DltHandler
void handleDlt(OrderEvent event) {
    alerting.notify("order landed in DLT", event);     // inspect / replay later
}` },

        { t: 'sub', text: 'Advanced patterns' },
        { t: 'list', items: [
          `<strong>Transactional processing:</strong> <code>@Transactional</code> + <code>KafkaTransactionManager</code> to keep DB writes and Kafka sends atomic.`,
          `<strong>Correlation IDs:</strong> propagate a trace id in record headers for distributed tracing.`,
          `<strong>Message filtering:</strong> a <code>RecordFilterStrategy</code> drops records before your listener runs.`,
          `<strong>Concurrency:</strong> <code>@KafkaListener(concurrency = "3")</code> runs 3 consumer threads (cap at the partition count).`,
        ] },
        { t: 'code', title: 'Concurrency & filtering', code:
`@KafkaListener(topics = "orders", concurrency = "3")   // 3 threads, <= partitions
void onOrder(OrderEvent e) { process(e); }

@Bean
RecordFilterStrategy<String, OrderEvent> highValueOnly() {
    return record -> record.value().amount() < 1000;   // 'true' => DROP
}` },

        { t: 'sub', text: 'Testing strategies' },
        { t: 'list', items: [
          `<strong>@EmbeddedKafka</strong> — spins up an in-memory broker for fast integration tests, no Docker.`,
          `<strong>TestContainers</strong> — a real Kafka in Docker for high-fidelity tests.`,
          `<strong>Contract tests</strong> — validate producer/consumer against the registered schema.`,
        ] },
        { t: 'code', title: '@EmbeddedKafka test', code:
`@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = {"orders"})
class OrderFlowTest {
    @Autowired KafkaTemplate<String, OrderEvent> template;

    @Test
    void publishesAndConsumes() {
        template.send("orders", "user-1", new OrderEvent("user-1", 42));
        await().atMost(5, SECONDS).untilAsserted(() ->
            assertThat(repo.findByUser("user-1")).isNotEmpty());
    }
}` },
      ],
    },

    /* ========================================================
       PHASE 6 — Performance Tuning
       ======================================================== */
    {
      id: 'phase-6', num: '06', accent: 'cyan', part: 'Performance & Observability',
      eyebrow: 'Phase 6 · The Tuning Lab',
      title: 'Performance Tuning',
      intro: 'Kafka is fast by design (sequential I/O, zero-copy), but throughput vs latency is a dial you set. Tune producers, consumers, and brokers for your workload — there is no universal "fast" config.',
      blocks: [
        { t: 'sub', text: 'Producer throughput' },
        { t: 'list', items: [
          `<strong>batch.size</strong> + <strong>linger.ms</strong> — the throughput levers. Wait a little, send bigger batches.`,
          `<strong>compression.type</strong> — <code>zstd</code> (best ratio), <code>lz4</code>/<code>snappy</code> (faster). Compresses whole batches.`,
          `<strong>buffer.memory</strong> — total memory for unsent records; if it fills, <code>send()</code> blocks.`,
          `<strong>max.request.size</strong> — cap per request; must align with broker <code>message.max.bytes</code>.`,
        ] },
        { t: 'callout', kind: 'key', html: `<strong>Throughput vs latency is the core trade-off.</strong> For throughput: raise <code>linger.ms</code>, <code>batch.size</code>, enable compression. For latency: <code>linger.ms=0</code>, smaller batches. You can't max both.` },

        { t: 'sub', text: 'Consumer throughput' },
        { t: 'table', head: ['Setting', 'Effect'],
          rows: [
            ['fetch.min.bytes', 'Wait for this much data before returning — fewer, bigger fetches'],
            ['fetch.max.wait.ms', 'Max wait if fetch.min.bytes not yet reached'],
            ['max.poll.records', 'Records per poll() — bounds per-batch work'],
            ['max.partition.fetch.bytes', 'Cap data pulled per partition per fetch'],
          ] },
        { t: 'callout', kind: 'tip', html: `If a single consumer can't keep up, the answer is usually <strong>more partitions + more consumers</strong> (horizontal), or moving processing off the poll thread — not just bigger fetches.` },

        { t: 'sub', text: 'Broker tuning' },
        { t: 'list', items: [
          `<strong>num.network.threads / num.io.threads</strong> — scale with cores and request load.`,
          `<strong>log.segment.bytes</strong> — segment size; affects retention granularity &amp; open file handles.`,
          `<strong>socket.send/receive.buffer.bytes</strong> — TCP buffers for high-bandwidth links.`,
          `<strong>Zero-copy</strong> — Kafka uses <code>sendfile()</code> to ship data from page cache straight to the socket, skipping user space. Keep plenty of RAM free for the OS page cache.`,
        ] },
        { t: 'callout', kind: 'note', html: `Kafka's speed comes from <strong>sequential disk I/O</strong> + the <strong>OS page cache</strong> + <strong>zero-copy</strong>. Don't starve the page cache by over-allocating JVM heap — brokers want modest heaps (6–8 GB) and lots of free RAM.` },

        { t: 'sub', text: 'Find the bottleneck' },
        { t: 'prose', html: `Tune by measurement, not guesswork. Watch JMX: producer <code>record-send-rate</code> and <code>record-error-rate</code>, consumer <code>records-lag-max</code> and <code>fetch-latency-avg</code>, broker <code>BytesInPerSec</code>/<code>BytesOutPerSec</code> and request-handler idle ratio. The constraint is almost always one of CPU, network, or disk I/O — confirm which before changing configs.` },
      ],
    },

    /* ========================================================
       PHASE 7 — Monitoring & Observability
       ======================================================== */
    {
      id: 'phase-7', num: '07', accent: 'orange', part: 'Performance & Observability',
      eyebrow: 'Phase 7 · The Watchtower',
      title: 'Monitoring & Observability',
      intro: 'You cannot operate what you cannot see. The signal that matters most is consumer lag; around it sit throughput, latency, error rates, and broker health — surfaced via Prometheus + Grafana and tied together with tracing.',
      blocks: [
        { t: 'sub', text: 'The metrics that matter' },
        { t: 'list', items: [
          `<strong>Consumer lag</strong> — the single most important number: how far behind real-time your consumers are. Rising lag = trouble.`,
          `<strong>End-to-end latency</strong> — produce timestamp → consume time.`,
          `<strong>Throughput</strong> — messages/bytes per second, in and out.`,
          `<strong>Error rates</strong> — failed produces/consumes, retries.`,
          `<strong>Under-replicated &amp; offline partitions</strong> — should be <strong>0</strong>; anything else means a replication/availability problem.`,
          `<strong>Broker health</strong> — disk usage, CPU, GC pause times.`,
        ] },
        { t: 'table', head: ['Cluster signal', 'Healthy value'],
          rows: [
            ['Active controllers', '<span class="yes">exactly 1</span>'],
            ['Offline partitions', '<span class="yes">0</span>'],
            ['Under-replicated partitions', '<span class="yes">0</span>'],
            ['Consumer lag', '<span class="yes">low &amp; stable</span>'],
          ] },

        { t: 'sub', text: 'Export & visualize' },
        { t: 'prose', html: `Kafka exposes everything via <strong>JMX</strong>. The standard pipeline: a <strong>JMX Exporter</strong> agent converts JMX → Prometheus format, <strong>Prometheus</strong> scrapes it, <strong>Grafana</strong> dashboards it, and alert rules fire on anomalies. Spring apps add <strong>Micrometer</strong> for client-side metrics.` },
        { t: 'code', title: 'Micrometer + Prometheus (Spring Boot)', code:
`# build.gradle
implementation 'io.micrometer:micrometer-registry-prometheus'

# application.yml — expose the scrape endpoint
management:
  endpoints:
    web:
      exposure:
        include: prometheus, health, metrics` },
        { t: 'callout', kind: 'tip', html: `Alert on <strong>lag trend</strong>, not an absolute number — a brief spike during a deploy is normal; <em>continuously growing</em> lag means consumers can't keep up and need scaling.` },

        { t: 'sub', text: 'Logging & distributed tracing' },
        { t: 'list', items: [
          `<strong>Structured logging</strong> (JSON) → aggregate in ELK / Splunk / CloudWatch.`,
          `<strong>Distributed tracing</strong> — OpenTelemetry + Jaeger/Zipkin to follow a message across services.`,
          `<strong>Correlation IDs</strong> — stamp a trace id into record headers so a request is traceable producer→consumer→downstream.`,
        ] },

        { t: 'sub', text: 'Alerting & SLOs' },
        { t: 'prose', html: `Define <strong>SLOs</strong> (e.g. "99% of orders processed within 5s") backed by <strong>SLIs</strong> (lag, latency). Track an <strong>error budget</strong>, design <strong>actionable</strong> alerts (page only on things a human must fix), and keep <strong>runbooks</strong> for common incidents.` },
        { t: 'callout', kind: 'warning', html: `<strong>Alert fatigue kills observability.</strong> Every page should be actionable and tied to user impact. Noisy, non-actionable alerts train on-call to ignore them — including the real one.` },
      ],
    },
    /* ========================================================
       PHASE 8 — Schema Registry & Data Contracts
       ======================================================== */
    {
      id: 'phase-8', num: '08', accent: 'pink', part: 'Data & Streaming',
      eyebrow: 'Phase 8 · Enterprise Integration',
      title: 'Schema Registry & Data Contracts',
      intro: 'Topics are just bytes — which means a producer can ship anything and break every consumer downstream. A Schema Registry enforces a contract: structured, versioned schemas with controlled evolution.',
      blocks: [
        { t: 'sub', text: 'Why a registry?' },
        { t: 'prose', html: `Without a contract, a producer renaming a field silently breaks consumers at runtime. The <strong>Schema Registry</strong> stores schemas centrally and versions them. Messages carry a tiny <strong>schema id</strong>, not the full schema — so payloads stay small and every consumer can resolve the exact shape it received.` },
        { t: 'diagram', name: 'schemaRegistry', cap: 'Producers register schemas; consumers resolve them by id — contracts enforced, payloads tiny' },
        { t: 'table', head: ['Format', 'Notes'],
          rows: [
            ['Avro', 'Compact binary, rich schema evolution — the Kafka default'],
            ['Protobuf', 'Google\'s format; great cross-language tooling'],
            ['JSON Schema', 'Human-readable; validates JSON payloads'],
          ] },

        { t: 'sub', text: 'Schema evolution & compatibility' },
        { t: 'prose', html: `The registry can <em>reject</em> a new schema version that would break readers, according to a compatibility mode you choose:` },
        { t: 'table', head: ['Mode', 'Guarantees'],
          rows: [
            ['BACKWARD', 'New consumers can read data written with the old schema'],
            ['FORWARD', 'Old consumers can read data written with the new schema'],
            ['FULL', 'Both backward and forward compatible'],
            ['NONE', 'No checks — anything goes (dangerous)'],
          ] },
        { t: 'list', items: [
          `<strong>Safe changes:</strong> add an optional field <em>with a default</em>, remove an optional field.`,
          `<strong>Breaking changes:</strong> rename a field, change a type, add a required field with no default.`,
          `<strong>Type promotions:</strong> <code>int → long</code>, <code>float → double</code> are allowed; the reverse isn't.`,
        ] },
        { t: 'code', title: 'Avro schema (orders v2 — adds an optional field)', code:
`{
  "type": "record",
  "name": "OrderEvent",
  "namespace": "com.shop.events",
  "fields": [
    { "name": "userId", "type": "string" },
    { "name": "amount", "type": "double" },
    { "name": "currency", "type": "string", "default": "USD" }
  ]
}` },
        { t: 'callout', kind: 'tip', html: `Default to <strong>BACKWARD</strong> compatibility: it lets you upgrade consumers before producers, the usual deploy order. Wire it into CI so a breaking schema fails the build, not production.` },

        { t: 'sub', text: 'Integration' },
        { t: 'code', title: 'Spring config for Avro + registry', code:
`spring:
  kafka:
    producer:
      value-serializer: io.confluent.kafka.serializers.KafkaAvroSerializer
      properties:
        schema.registry.url: http://localhost:8081
    consumer:
      value-deserializer: io.confluent.kafka.serializers.KafkaAvroDeserializer
      properties:
        schema.registry.url: http://localhost:8081
        specific.avro.reader: true` },
      ],
    },

    /* ========================================================
       PHASE 9 — Stream Processing
       ======================================================== */
    {
      id: 'phase-9', num: '09', accent: 'teal', part: 'Data & Streaming',
      eyebrow: 'Phase 9 · The Pipeline Layer',
      title: 'Kafka Streams & Real-Time Analytics',
      intro: 'Kafka Streams is a Java library (not a separate cluster) for transforming topics into topics. You build a topology of operators, and it handles state, scaling, fault tolerance, and exactly-once for you.',
      blocks: [
        { t: 'sub', text: 'Topology: sources, processors, sinks' },
        { t: 'prose', html: `A Streams app is a <strong>topology</strong> — a DAG that reads from source topics, runs operators, and writes to sink topics. Two core abstractions: a <strong>KStream</strong> is an unbounded stream of events; a <strong>KTable</strong> is a changelog — the latest value per key (like a materialised view).` },
        { t: 'diagram', name: 'streamsTopology', cap: 'A DAG of stateless and stateful processors between input and output topics' },
        { t: 'table', head: ['Operation', 'Type', 'Does'],
          rows: [
            ['map / mapValues', 'Stateless', 'Transform each record'],
            ['filter', 'Stateless', 'Keep records matching a predicate'],
            ['flatMap', 'Stateless', 'One record → many'],
            ['groupByKey + count', 'Stateful', 'Tally occurrences per key'],
            ['aggregate / reduce', 'Stateful', 'Fold records into running state'],
          ] },
        { t: 'code', title: 'Word count topology', code:
`StreamsBuilder builder = new StreamsBuilder();
KStream<String, String> lines = builder.stream("text-input");

lines.flatMapValues(v -> Arrays.asList(v.toLowerCase().split(" ")))
     .groupBy((key, word) -> word)
     .count(Materialized.as("counts-store"))   // stateful -> backed by a store
     .toStream()
     .to("word-counts", Produced.with(Serdes.String(), Serdes.Long()));

var streams = new KafkaStreams(builder.build(), config);
streams.start();` },

        { t: 'sub', text: 'Windowing & time semantics' },
        { t: 'prose', html: `Aggregations over time need <strong>windows</strong>. First, choose a notion of time: <strong>event time</strong> (when it happened), <strong>processing time</strong> (when you handle it), or <strong>ingestion time</strong> (when it entered Kafka). Event time is usually what you want for correctness.` },
        { t: 'diagram', name: 'windowing', cap: 'Tumbling (no overlap), hopping (overlapping), and session (activity-gap) windows' },
        { t: 'list', items: [
          `<strong>Tumbling</strong> — fixed size, no overlap (e.g. counts per 1-min bucket).`,
          `<strong>Hopping</strong> — fixed size, overlapping (e.g. 5-min window every 1 min).`,
          `<strong>Sliding</strong> — event-driven windows over a time difference.`,
          `<strong>Session</strong> — dynamic windows bounded by gaps of inactivity.`,
          `<strong>Grace period</strong> — how long to keep a window open for late-arriving events before final results.`,
        ] },
        { t: 'code', title: 'Tumbling window aggregation', code:
`clicks.groupByKey()
      .windowedBy(TimeWindows.ofSizeAndGrace(
          Duration.ofMinutes(1), Duration.ofSeconds(10)))   // 10s grace
      .count()
      .toStream()
      .to("clicks-per-minute");` },

        { t: 'sub', text: 'Joins' },
        { t: 'table', head: ['Join', 'Use'],
          rows: [
            ['KStream-KStream', 'Correlate two event streams within a time window'],
            ['KStream-KTable', 'Enrich each event with the latest table value'],
            ['KTable-KTable', 'Keep two materialised views joined'],
            ['KStream-GlobalKTable', 'Enrich from a fully-replicated lookup table'],
          ] },
        { t: 'code', title: 'Enrich a stream with a table', code:
`KStream<String, Order>  orders = builder.stream("orders");
KTable<String, Customer> customers = builder.table("customers");

orders.join(customers, (order, customer) ->
        new EnrichedOrder(order, customer.name(), customer.tier()))
      .to("orders-enriched");` },

        { t: 'sub', text: 'State management' },
        { t: 'prose', html: `Stateful operators keep <strong>local state stores</strong> (RocksDB-backed). Every store is backed by a <strong>changelog topic</strong> in Kafka, so on a crash the state is <strong>restored</strong> by replaying the changelog — durable local state without an external database. <strong>Interactive Queries</strong> let you read these stores directly for low-latency lookups.` },
        { t: 'callout', kind: 'key', html: `Kafka Streams supports end-to-end <strong>exactly-once</strong> (<code>processing.guarantee=exactly_once_v2</code>): it transactionally ties input offsets, state updates, and output records into one atomic unit.` },
      ],
    },

    /* ========================================================
       PHASE 10 — Kafka Connect
       ======================================================== */
    {
      id: 'phase-10', num: '10', accent: 'indigo', part: 'Data & Streaming',
      eyebrow: 'Phase 10 · The Connector Ecosystem',
      title: 'Kafka Connect & Data Integration',
      intro: 'Most Kafka data isn\'t produced by your code — it comes from databases, files, and APIs. Kafka Connect moves data in and out of Kafka with zero code: you configure connectors instead of writing producers and consumers.',
      blocks: [
        { t: 'sub', text: 'The Connect framework' },
        { t: 'prose', html: `Connect is a pluggable runtime. <strong>Source</strong> connectors pull data <em>into</em> Kafka; <strong>sink</strong> connectors push data <em>out</em>. It runs <strong>standalone</strong> (one process, dev) or <strong>distributed</strong> (a cluster of workers with automatic rebalancing and fault tolerance). Each connector splits work into parallel <strong>tasks</strong>.` },
        { t: 'diagram', name: 'connect', cap: 'Source connectors feed Kafka; sink connectors drain it — all by configuration' },

        { t: 'sub', text: 'Source connectors & Change Data Capture' },
        { t: 'list', items: [
          `<strong>Debezium (CDC)</strong> — streams every <code>INSERT/UPDATE/DELETE</code> from a database's transaction log into Kafka. The backbone of the outbox pattern.`,
          `<strong>JDBC Source</strong> — polls tables by a timestamp/incrementing column.`,
          `<strong>File / S3 / API sources</strong> — ingest files or poll external endpoints.`,
          `<strong>SMTs (Single Message Transforms)</strong> — lightweight per-record tweaks (rename fields, mask PII, route by value) without a stream processor.`,
        ] },
        { t: 'code', title: 'Debezium Postgres source (JSON config)', code:
`{
  "name": "orders-db-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.dbname": "shop",
    "table.include.list": "public.orders",
    "topic.prefix": "cdc",
    "transforms": "unwrap",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState"
  }
}` },

        { t: 'sub', text: 'Sink connectors' },
        { t: 'list', items: [
          `<strong>JDBC Sink</strong> — write records into relational tables (upsert supported).`,
          `<strong>Elasticsearch Sink</strong> — index events for search/analytics.`,
          `<strong>S3 Sink</strong> — archive to cheap object storage (data lake).`,
          `<strong>HTTP Sink</strong> — call webhooks; <strong>BigQuery/Snowflake</strong> — warehouse loading.`,
        ] },
        { t: 'callout', kind: 'tip', html: `Connect supports <strong>Dead Letter Queues</strong> for bad records (<code>errors.tolerance=all</code> + <code>errors.deadletterqueue.topic.name</code>) and <strong>exactly-once</strong> for supported connectors — so a malformed row doesn't halt the whole pipeline.` },
      ],
    },

    /* ========================================================
       PHASE 11 — Multi-Cluster & Advanced Architecture
       ======================================================== */
    {
      id: 'phase-11', num: '11', accent: 'purple', part: 'Scale, Testing & Ops',
      eyebrow: 'Phase 11 · The Enterprise Scale',
      title: 'Multi-Cluster & DR',
      intro: 'One cluster eventually isn\'t enough — you need disaster recovery, geo-locality, or migration. This is about replicating data between clusters and the high-availability topologies built on top.',
      blocks: [
        { t: 'sub', text: 'Cross-cluster replication' },
        { t: 'prose', html: `<strong>MirrorMaker 2</strong> (built on Kafka Connect) replicates topics — <em>and</em> consumer-group offsets — from one cluster to another, asynchronously. Confluent's <strong>Cluster Linking</strong> offers the same with byte-for-byte offset preservation.` },
        { t: 'diagram', name: 'mirrorMaker', cap: 'MirrorMaker 2 mirrors topics and offsets across clusters for DR and geo-distribution' },
        { t: 'callout', kind: 'note', html: `MM2 prefixes mirrored topics with the source alias (e.g. <code>A.orders</code>) so active-active setups don't create replication loops. Offset translation lets a failed-over consumer resume near where it left off.` },

        { t: 'sub', text: 'High availability & disaster recovery' },
        { t: 'table', head: ['Topology', 'Trade-off'],
          rows: [
            ['Active-Passive', 'Simple; standby cluster idle until failover'],
            ['Active-Active', 'Both serve traffic; needs conflict/loop handling'],
            ['Stretch cluster', 'One cluster across AZs; lowest RPO, latency-sensitive'],
          ] },
        { t: 'list', items: [
          `<strong>RPO</strong> (Recovery Point Objective) — how much data you can afford to lose. Async replication ⇒ RPO &gt; 0.`,
          `<strong>RTO</strong> (Recovery Time Objective) — how fast you must be back up.`,
          `<strong>Region failover</strong> — DNS/client redirect to the standby cluster; verify offset translation and data consistency after.`,
        ] },

        { t: 'sub', text: 'Scaling strategies' },
        { t: 'list', items: [
          `<strong>Horizontal scaling</strong> — add brokers; reassign partitions to spread load (<code>kafka-reassign-partitions.sh</code>).`,
          `<strong>Topic growth</strong> — adding partitions increases parallelism but <em>breaks key→partition ordering</em> for existing keys; plan capacity up front.`,
          `<strong>Consumer scaling</strong> — add instances to a group up to the partition count.`,
        ] },

        { t: 'sub', text: 'Tiered storage' },
        { t: 'prose', html: `<strong>Tiered storage</strong> (KIP-405) keeps recent "hot" data on fast local disks and offloads older "cold" segments to cheap object storage (S3/GCS/Azure Blob), while still serving them transparently. This decouples storage from compute — you can retain months of data without giant broker disks.` },
        { t: 'table', head: ['Tier', 'Backed by', 'For'],
          rows: [
            ['Hot', 'Local SSD', 'Recent, latency-sensitive reads'],
            ['Cold', 'Object storage (S3)', 'Long retention, replay, cheap'],
          ] },
      ],
    },
    /* ========================================================
       PHASE 12 — Testing, Chaos & Troubleshooting
       ======================================================== */
    {
      id: 'phase-12', num: '12', accent: 'rose', part: 'Scale, Testing & Ops',
      eyebrow: 'Phase 12 · The Quality Lab',
      title: 'Testing, Chaos & Troubleshooting',
      intro: 'Distributed systems fail in distributed ways. Test the message flow, deliberately break things to find weaknesses before production does, and build a mental index of the common failure patterns and their fixes.',
      blocks: [
        { t: 'sub', text: 'The testing pyramid' },
        { t: 'list', items: [
          `<strong>Unit</strong> — producer/consumer logic with mocks (<code>MockProducer</code>, <code>MockConsumer</code>).`,
          `<strong>Integration</strong> — real flow against <code>@EmbeddedKafka</code> or TestContainers.`,
          `<strong>Contract</strong> — schema compatibility between producer &amp; consumer.`,
          `<strong>Performance</strong> — load/stress with <code>kafka-producer-perf-test.sh</code>.`,
          `<strong>Chaos</strong> — inject failures and verify recovery.`,
        ] },

        { t: 'sub', text: 'Chaos engineering' },
        { t: 'prose', html: `Deliberately inject failure and confirm the system self-heals. Each experiment validates a guarantee you <em>think</em> you have.` },
        { t: 'table', head: ['Inject', 'What it validates'],
          rows: [
            ['Kill a broker mid-write', 'Leader election &amp; no data loss (acks=all)'],
            ['Network latency / partition', 'ISR shrink, split-brain handling'],
            ['Kill a consumer', 'Rebalance &amp; at-least-once redelivery'],
            ['Fill the disk', 'Retention &amp; graceful degradation'],
            ['Clock skew', 'Event-time correctness'],
          ] },

        { t: 'sub', text: 'Troubleshooting playbook' },
        { t: 'table', head: ['Symptom', 'Likely cause / fix'],
          rows: [
            ['Lag keeps growing', 'Consumers too slow → add partitions/consumers, lighten processing'],
            ['Stuck / endless rebalances', 'Processing &gt; max.poll.interval.ms → shrink max.poll.records'],
            ['Producer blocked / timeouts', 'buffer.memory full or ISR &lt; min.insync.replicas'],
            ['Duplicates downstream', 'At-least-once without idempotent handling'],
            ['Missing messages', 'Committed before processing, or unclean leader election'],
            ['Poison pill stalls partition', 'Add a DLT + non-retryable exception handling'],
          ] },
        { t: 'callout', kind: 'tip', html: `Start every Kafka investigation with three numbers: <strong>consumer lag</strong>, <strong>under-replicated partitions</strong>, and the broker <strong>request-handler idle ratio</strong>. They point you at consumer, replication, or broker-capacity problems respectively.` },
      ],
    },

    /* ========================================================
       PHASE 13 — Production Operations
       ======================================================== */
    {
      id: 'phase-13', num: '13', accent: 'blue', part: 'Scale, Testing & Ops',
      eyebrow: 'Phase 13 · The Operations Manual',
      title: 'Production Operations & Maintenance',
      intro: 'Day-2 Kafka: keeping the cluster healthy, upgrading without downtime, managing topics and consumer groups, and the routine maintenance that prevents 3 a.m. pages.',
      blocks: [
        { t: 'sub', text: 'Cluster administration' },
        { t: 'list', items: [
          `<strong>Rolling updates</strong> — restart brokers one at a time, waiting for under-replicated partitions to return to 0 between each. Zero downtime.`,
          `<strong>Dynamic config</strong> — many settings change at runtime via <code>kafka-configs.sh</code> without a restart.`,
          `<strong>Adding/removing brokers</strong> — add a broker, then reassign partitions onto it; drain before decommissioning.`,
        ] },
        { t: 'code', title: 'Common admin commands', code:
`# describe a topic (partitions, ISR, leaders)
kafka-topics.sh --describe --topic orders --bootstrap-server localhost:9092

# check a consumer group's lag
kafka-consumer-groups.sh --describe --group orders-service \\
  --bootstrap-server localhost:9092

# change retention on a live topic (dynamic)
kafka-configs.sh --alter --entity-type topics --entity-name orders \\
  --add-config retention.ms=604800000 --bootstrap-server localhost:9092` },

        { t: 'sub', text: 'Topic management & retention' },
        { t: 'table', head: ['Retention type', 'Config', 'Use'],
          rows: [
            ['Time-based', 'retention.ms', 'Keep N days of events'],
            ['Size-based', 'retention.bytes', 'Cap partition size on disk'],
            ['Compaction', 'cleanup.policy=compact', 'Keep only the latest value per key'],
          ] },
        { t: 'prose', html: `<strong>Log compaction</strong> is special: instead of deleting by age, it keeps the <em>most recent</em> record for each key forever, garbage-collecting older versions. Perfect for changelog/state topics where you only care about the current value (and a <code>null</code> value — a <strong>tombstone</strong> — deletes the key).` },

        { t: 'sub', text: 'Consumer group management' },
        { t: 'list', items: [
          `<strong>Monitor lag</strong> per group continuously — the canary for consumer health.`,
          `<strong>Static membership</strong> minimises rebalances across restarts.`,
          `<strong>Reset offsets</strong> to replay or skip — <code>--to-earliest</code>, <code>--to-datetime</code>, <code>--shift-by</code> (do it while the group is stopped).`,
        ] },
        { t: 'code', title: 'Reset a group to replay from a time', code:
`kafka-consumer-groups.sh --bootstrap-server localhost:9092 \\
  --group orders-service --topic orders \\
  --reset-offsets --to-datetime 2026-06-01T00:00:00.000 --execute` },

        { t: 'sub', text: 'Routine maintenance' },
        { t: 'list', items: [
          `<strong>Health checks</strong> — controller count, offline/under-replicated partitions, disk headroom.`,
          `<strong>Disk management</strong> — alert well before full; a full log disk takes a broker down hard.`,
          `<strong>GC tuning</strong> — G1GC with a modest heap; watch pause times.`,
        ] },
        { t: 'callout', kind: 'danger', html: `A broker that runs <strong>out of disk</strong> doesn't degrade gracefully — it crashes and can corrupt logs. Alert at ~70% and have automated cleanup or expansion ready.` },
      ],
    },

    /* ========================================================
       PHASE 14 — Advanced Patterns
       ======================================================== */
    {
      id: 'phase-14', num: '14', accent: 'green', part: 'Patterns & Cloud',
      eyebrow: 'Phase 14 · The Architect\'s Toolkit',
      title: 'Advanced Patterns & Best Practices',
      intro: 'The architectural patterns Kafka enables — event sourcing, CQRS, sagas, outbox — and how to integrate it cleanly into a microservice landscape. This is where Kafka stops being a queue and becomes a backbone.',
      blocks: [
        { t: 'sub', text: 'Core architecture patterns' },
        { t: 'table', head: ['Pattern', 'Idea'],
          rows: [
            ['Event Sourcing', 'The log is the source of truth; state is a fold over events'],
            ['CQRS', 'Separate write model (commands) from read model (projections)'],
            ['Saga', 'Coordinate a distributed transaction as a chain of events + compensations'],
            ['Outbox', 'Atomic DB write + event publish via an outbox table + CDC'],
            ['Event Replay', 'Rebuild a service\'s state by re-reading the log from the start'],
          ] },
        { t: 'callout', kind: 'key', html: `<strong>Event sourcing's superpower:</strong> because every state change is an immutable event in Kafka, you can build a <em>new</em> read model at any time by replaying history — no migration script, just re-consume from offset 0.` },

        { t: 'sub', text: 'Saga — choreography vs orchestration' },
        { t: 'prose', html: `Distributed transactions across services can't use a single DB transaction. A <strong>saga</strong> breaks the work into local steps linked by events. <strong>Choreography</strong>: each service reacts to events and emits the next (decentralised). <strong>Orchestration</strong>: a central coordinator drives the steps (easier to reason about, single point to evolve).` },
        { t: 'analogy', html: `<b>Choreography</b> is a dance where everyone knows their cue from the music. <b>Orchestration</b> is a conductor cueing each player. Both produce the symphony; they differ in where the coordination logic lives.` },

        { t: 'sub', text: 'Integration patterns' },
        { t: 'list', items: [
          `<strong>Pub-Sub</strong> — the default: publishers and subscribers fully decoupled.`,
          `<strong>Event notification</strong> — thin events ("order placed"); consumers fetch details if needed.`,
          `<strong>Event-carried state transfer</strong> — fat events carry the data, so consumers need no callback.`,
          `<strong>Request-reply</strong> — synchronous-style over async Kafka using a correlation id + reply topic (use sparingly).`,
        ] },

        { t: 'sub', text: 'Microservices best practices' },
        { t: 'list', items: [
          `<strong>Decouple via events</strong>, not direct calls — services evolve independently.`,
          `<strong>Domain events</strong> cross bounded contexts; keep them stable, versioned contracts.`,
          `<strong>Event versioning</strong> — additive changes + schema registry; never break consumers.`,
          `<strong>Bridge HTTP↔Kafka</strong> at the edge (API gateway / REST proxy) when external clients can't speak Kafka.`,
        ] },
        { t: 'callout', kind: 'warning', html: `Don't leak internal schemas as public contracts. Publish a deliberate, versioned <strong>public event</strong> per bounded context; refactor internals freely behind it.` },
      ],
    },

    /* ========================================================
       PHASE 15 — Cloud & Managed Kafka
       ======================================================== */
    {
      id: 'phase-15', num: '15', accent: 'cyan', part: 'Patterns & Cloud',
      eyebrow: 'Phase 15 · The Cloud Era',
      title: 'Cloud & Managed Kafka',
      intro: 'Running Kafka yourself is real work — brokers, upgrades, scaling, DR. Managed services trade some control for far less operational burden. Know the options, what you gain and give up, and how to migrate.',
      blocks: [
        { t: 'sub', text: 'The managed landscape' },
        { t: 'table', head: ['Service', 'Notes'],
          rows: [
            ['Confluent Cloud', 'Fully-managed Kafka + Connect, Streams, Registry; serverless tiers'],
            ['Amazon MSK', 'AWS-managed Kafka; MSK Serverless option'],
            ['Azure Event Hubs', 'Kafka-protocol-compatible endpoint'],
            ['Aiven for Kafka', 'Managed Kafka across multiple clouds'],
            ['Google Pub/Sub', 'Not Kafka, but a comparable managed pub/sub'],
          ] },

        { t: 'sub', text: 'What the cloud gives you' },
        { t: 'list', items: [
          `<strong>Serverless / auto-scaling</strong> — pay per throughput; capacity managed for you.`,
          `<strong>Multi-region replication</strong> &amp; built-in DR.`,
          `<strong>Security integration</strong> — IAM, VPC peering/private links, managed encryption.`,
          `<strong>Native monitoring</strong> — metrics wired into CloudWatch/Datadog out of the box.`,
        ] },
        { t: 'callout', kind: 'note', html: `<strong>The trade:</strong> you give up some low-level config control and accept egress/throughput pricing; you get back the time you'd spend on broker ops, upgrades, and on-call. For most teams that's a clear win.` },

        { t: 'sub', text: 'Migrating to the cloud' },
        { t: 'list', items: [
          `<strong>Data migration</strong> — MirrorMaker 2 / Cluster Linking to mirror topics + offsets into the managed cluster.`,
          `<strong>Connectivity</strong> — VPC peering / PrivateLink, then cut clients over by config (no code change).`,
          `<strong>Phased cutover</strong> — run hybrid (on-prem + cloud) during transition; migrate consumers, then producers.`,
          `<strong>Cost optimisation</strong> — right-size tiers, lean on tiered storage, watch egress.`,
        ] },
        { t: 'callout', kind: 'key', html: `<strong>You made it — all 15 phases.</strong> From the append-only log to managed cloud Kafka. Revisit the phases you're shaky on; the diagrams and code are here to drill the model in. Next: build the hands-on projects (basic producer/consumer → DLQ → event sourcing → streams → multi-service saga).` },
      ],
    },
  ],
};
