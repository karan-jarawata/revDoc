/* ============================================================
   ELK Stack — learning content as structured blocks.
   Rendered by app.js (shared with the other guides).
   Code is stored raw and auto-escaped on render, so < > & in
   code need no escaping. Avoid ${...} and backticks in code.
   ============================================================ */
window.CONTENT = {
  hero: {
    eyebrow: 'The Complete Guide',
    title: 'ELK Stack',
    sub: 'Elasticsearch stores and indexes every log event from every service. Logstash parses, transforms, and routes that data. Kibana puts a search interface and dashboard on top. Six phases covering the inverted index that makes search instant, the Logstash pipeline that turns raw text into structured JSON, the Kibana tools you use daily, Spring Boot integration, and production patterns for retention and scaling.',
    stats: [
      { num: '6', label: 'Phases' },
      { num: '3', label: 'Components' },
      { num: '30+', label: 'Code samples' },
      { num: '9', label: 'Diagrams' },
    ],
  },

  levels: [
    /* ========================================================
       PHASE 0 — Why ELK?
       ======================================================== */
    {
      id: 'phase-0', num: '00', accent: 'rose', part: 'Context',
      eyebrow: 'Phase 0 · Real-World Context',
      title: 'Why ELK?',
      intro: 'In a microservices environment, logs are scattered across dozens of services, each writing to its own file or stdout. When a user reports "the app crashed at 3pm", you need to find the relevant log lines across every service involved in that request — ideally in seconds. That is the problem ELK solves.',
      blocks: [
        { t: 'sub', text: 'The log aggregation problem' },
        { t: 'prose', html: `Without a log aggregation system, debugging a distributed system means <strong>SSH-ing into each server</strong>, running <code>grep</code> on multiple log files, and manually correlating timestamps across services. With ten services, this takes 20 minutes. With fifty, it becomes impossible.` },
        { t: 'cards', cols: 2, items: [
          { title: 'Without ELK', body: 'SSH into server → grep /var/log/app.log → SSH into next server → repeat for 10+ services → manually join timestamps → 30 minutes per incident.' },
          { title: 'With ELK', body: 'Open Kibana → type traceId:"abc123" → see all log lines across all services for that request, sorted by time → 30 seconds per incident.' },
          { title: 'Centralized search', body: 'Every log line from every service in one place. Full-text search across all of them. Filter by level, service, timestamp, user ID, trace ID, or any field.' },
          { title: 'Structured data', body: 'Logs become JSON documents with typed fields. Instead of grep-ing text, you run aggregations: "count errors by service in the last hour" returns a bar chart.' },
        ] },

        { t: 'sub', text: 'The three components and their jobs' },
        { t: 'diagram', name: 'elkOverview', cap: 'Logs flow from your apps through Logstash into Elasticsearch — Kibana queries ES' },
        { t: 'table', head: ['Component', 'Job', 'What you configure'],
          rows: [
            ['Elasticsearch', 'Store every log event as a searchable JSON document. Inverted index makes full-text search instant even on billions of documents.', 'Index templates, shard count, retention via ILM'],
            ['Logstash', 'Receive logs, parse unstructured text into structured fields, enrich with metadata, forward to Elasticsearch.', 'Pipeline: input → filter → output in logstash.conf'],
            ['Kibana', 'UI for searching logs (Discover), building charts (Visualize), assembling dashboards, and running raw ES queries (Dev Tools).', 'Data views (index patterns), dashboards, saved searches'],
          ] },

        { t: 'sub', text: 'The log data journey' },
        { t: 'diagram', name: 'logFlow', cap: 'A single log event from logger.error() to a Kibana search result' },
        { t: 'list', items: [
          `<strong>Your code:</strong> <code>logger.error("Ticket creation failed", exception)</code> — this goes to SLF4J.`,
          `<strong>Logback:</strong> The <code>LogstashEncoder</code> formats the event as JSON and the <code>LogstashTcpSocketAppender</code> ships it over TCP to Logstash port 5000.`,
          `<strong>Logstash:</strong> Receives the JSON, applies filters (parse stack traces, add environment tags), and writes to Elasticsearch via the bulk API.`,
          `<strong>Elasticsearch:</strong> Indexes the document into the <code>logs-support-platform-2026.06.26</code> index. The document is now searchable in milliseconds.`,
          `<strong>Kibana:</strong> You search <code>level:ERROR AND application:"support-platform"</code> and see the event with its full stack trace.`,
        ] },

        { t: 'sub', text: 'Standard ports at a glance' },
        { t: 'table', head: ['URL / Port', 'Component', 'What it is'],
          rows: [
            ['http://localhost:9200', 'Elasticsearch', 'REST API — for Logstash output and direct queries'],
            ['http://localhost:9200/_cat/indices?v', 'Elasticsearch', 'List all indices and their document counts'],
            ['5000 (TCP)', 'Logstash', 'Port that receives logs from Spring Boot apps'],
            ['5044 (TCP)', 'Logstash', 'Port that receives logs from Filebeat / other Beats'],
            ['http://localhost:5601', 'Kibana', 'Web UI — Discover, Visualize, Dashboard, Dev Tools'],
          ] },
      ],
    },

    /* ========================================================
       PHASE 1 — Elasticsearch
       ======================================================== */
    {
      id: 'phase-1', num: '01', accent: 'purple', part: 'The Database',
      eyebrow: 'Phase 1 · The Search Engine',
      title: 'Elasticsearch',
      intro: 'Elasticsearch is a distributed search engine built on Apache Lucene. It stores documents as JSON, indexes every field automatically, and answers full-text search queries in milliseconds — even on terabytes of log data. Understanding its data model and the inverted index makes every other ELK concept obvious.',
      blocks: [
        { t: 'sub', text: 'Core data model: Index → Shard → Document' },
        { t: 'prose', html: `Everything in Elasticsearch is a <strong>document</strong> — a JSON object. Documents live inside an <strong>index</strong> (analogous to a database table). For log data, you typically create one index per day per service: <code>logs-support-platform-2026.06.26</code>.` },
        { t: 'diagram', name: 'esIndex', cap: 'Index = named collection of documents · Document = one JSON log event' },
        { t: 'callout', kind: 'key', html: `<strong>The log document model:</strong> every log line becomes a JSON document with fields like <code>@timestamp</code>, <code>level</code>, <code>message</code>, <code>application</code>, <code>traceId</code>, and <code>thread</code>. These become filterable, sortable, aggregatable fields in Kibana — not just text to grep.` },

        { t: 'sub', text: 'The inverted index — why search is instant' },
        { t: 'prose', html: `A traditional database searches rows sequentially — O(n) for a full-text scan. Elasticsearch builds an <strong>inverted index</strong>: a mapping from every unique word (term) to the list of documents that contain it. Searching for "NullPointerException" becomes an O(1) lookup.` },
        { t: 'diagram', name: 'invertedIndex', cap: 'Word → document list: a single lookup finds all docs containing that term across millions of records' },
        { t: 'list', items: [
          `<strong>Tokenization:</strong> "Ticket creation failed" → ["ticket", "creation", "failed"]. Each token is an entry in the inverted index.`,
          `<strong>Analyzers:</strong> Elasticsearch applies analyzers (lowercase, stem, remove stop words) so "Failing" and "failed" both match the term "fail".`,
          `<strong>Why it is fast:</strong> looking up a term in the inverted index is a hash map lookup — O(1) regardless of document count.`,
          `<strong>Relevance scoring:</strong> when multiple docs match, TF-IDF/BM25 scoring ranks them by relevance. For log search, you usually sort by <code>@timestamp</code> instead.`,
        ] },

        { t: 'sub', text: 'Talking to Elasticsearch directly' },
        { t: 'prose', html: `Elasticsearch exposes a REST API at port 9200. Kibana's Dev Tools is the easiest way to run these commands, but they work in curl too.` },
        { t: 'code', title: 'Elasticsearch REST API — essential operations', code:
`# --- Cluster health ---
GET /_cluster/health

# --- List all indices ---
GET /_cat/indices?v&s=index

# --- Count documents in an index ---
GET /logs-support-platform-2026.06.26/_count

# --- Search: all ERROR logs in the last hour ---
GET /logs-support-platform-*/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "level": "ERROR" } }
      ],
      "filter": [
        { "range": { "@timestamp": { "gte": "now-1h" } } }
      ]
    }
  },
  "sort": [{ "@timestamp": { "order": "desc" } }],
  "size": 20
}

# --- Aggregation: error count by application ---
GET /logs-*/_search
{
  "size": 0,
  "aggs": {
    "errors_by_app": {
      "terms": { "field": "application.keyword" }
    }
  },
  "query": { "match": { "level": "ERROR" } }
}` },

        { t: 'sub', text: 'Index templates — define the schema upfront' },
        { t: 'prose', html: `Elasticsearch can auto-detect field types, but for logs you want explicit control. An <strong>index template</strong> applies mapping rules to every new index matching a pattern — so <code>logs-*-2026*</code> always gets the right field types.` },
        { t: 'code', title: 'Index template for log indices (Kibana Dev Tools)', code:
`PUT /_index_template/logs-template
{
  "index_patterns": ["logs-*"],
  "template": {
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 1,
      "refresh_interval": "5s"
    },
    "mappings": {
      "properties": {
        "@timestamp":  { "type": "date" },
        "level":       { "type": "keyword" },
        "application": { "type": "keyword" },
        "message":     { "type": "text", "analyzer": "standard" },
        "traceId":     { "type": "keyword" },
        "spanId":      { "type": "keyword" },
        "thread":      { "type": "keyword" },
        "logger":      { "type": "keyword" }
      }
    }
  }
}` },
        { t: 'callout', kind: 'tip', html: `<strong>keyword vs text:</strong> use <code>keyword</code> for exact-match fields you filter or aggregate on (level, application, traceId). Use <code>text</code> for free-text fields you full-text search (message, stack trace). Using <code>text</code> on a field you aggregate prevents aggregations from working correctly.` },

        { t: 'sub', text: 'Shards and replicas — scaling and durability' },
        { t: 'prose', html: `An index is split into <strong>shards</strong> (Lucene instances) distributed across nodes. Each shard can have <strong>replicas</strong> on different nodes for fault tolerance.` },
        { t: 'table', head: ['Setting', 'What it controls', 'Typical value for logs'],
          rows: [
            ['number_of_shards', 'How many pieces the index is split into. More shards = better write parallelism. Cannot change after creation.', '1–3 for small setups'],
            ['number_of_replicas', 'Copies of each shard on other nodes. Replicas serve reads and survive node failure.', '1 (production), 0 (single node dev)'],
            ['refresh_interval', 'How often in-memory writes are committed and made searchable.', '5s (logs), 1s (real-time), -1 (bulk ingest)'],
          ] },
        { t: 'callout', kind: 'note', html: `For a single-node development environment, set <code>number_of_replicas: 0</code>. Elasticsearch marks an index as <strong>yellow</strong> (degraded) when replicas cannot be placed — on a single node there is nowhere to put them. This is cosmetic, not a real problem in dev.` },
      ],
    },

    /* ========================================================
       PHASE 2 — Logstash
       ======================================================== */
    {
      id: 'phase-2', num: '02', accent: 'amber', part: 'The Pipeline',
      eyebrow: 'Phase 2 · The Data Pipeline',
      title: 'Logstash',
      intro: 'Logstash is a data pipeline: receive log events from one or more sources, transform them, and send them to one or more destinations. Its three-stage architecture — input, filter, output — handles everything from parsing unstructured text with grok to enriching documents with GeoIP data.',
      blocks: [
        { t: 'sub', text: 'The three-stage pipeline' },
        { t: 'diagram', name: 'logstashPipeline', cap: 'Every pipeline has input → filter → output — filter is optional but almost always used' },

        { t: 'sub', text: 'Input plugins — where logs enter' },
        { t: 'prose', html: `Logstash can receive data from many sources simultaneously. For Spring Boot microservices, the two most common inputs are TCP (apps push directly) and Beats (Filebeat tails log files).` },
        { t: 'code', title: 'logstash.conf — common input configurations', code:
`input {
  # Spring Boot apps push JSON directly via TCP
  tcp {
    port => 5000
    codec => json_lines    # each line is one JSON log event
  }

  # Filebeat ships log files from each host
  beats {
    port => 5044
  }

  # Useful for testing the pipeline
  stdin {
    codec => json_lines
  }
}` },

        { t: 'sub', text: 'Filter plugins — the intelligence' },
        { t: 'prose', html: `Filters run on every event. The most important are <code>json</code> (parse a JSON payload), <code>grok</code> (parse unstructured text with patterns), <code>mutate</code> (rename/add/remove fields), and <code>date</code> (parse timestamp strings).` },
        { t: 'diagram', name: 'grokPattern', cap: 'Grok extracts named fields from a plain-text log line using named regex patterns' },
        { t: 'code', title: 'logstash.conf — filter section for Spring Boot JSON logs', code:
`filter {
  # If the message field contains JSON (from LogstashEncoder), parse it
  if [message] =~ /^\{/ {
    json {
      source  => "message"
      target  => "parsed"
      remove_field => ["message"]
    }
  }

  # Add environment metadata
  mutate {
    add_field => {
      "environment" => "local"
      "stack"       => "support-platform"
    }
    # Rename fields to match ES mapping
    rename => { "[parsed][@timestamp]" => "@timestamp" }
    rename => { "[parsed][level]"      => "level"      }
    rename => { "[parsed][message]"    => "message"    }
    rename => { "[parsed][logger]"     => "logger"     }
    rename => { "[parsed][thread]"     => "thread"     }
    rename => { "[parsed][traceId]"    => "traceId"    }
  }

  # Parse the timestamp string into an actual date type
  date {
    match => ["@timestamp", "ISO8601"]
    target => "@timestamp"
  }

  # Drop health-check noise
  if [message] =~ /actuator\/health/ {
    drop {}
  }
}` },

        { t: 'sub', text: 'Grok for plain-text logs' },
        { t: 'prose', html: `If your app writes plain-text logs (not JSON), grok parses them into fields using named patterns. Grok ships with hundreds of built-in patterns for common formats.` },
        { t: 'code', title: 'grok filter for plain Spring Boot log format', code:
`filter {
  grok {
    match => {
      "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level}
                   %{NUMBER:pid} --- \[%{DATA:thread}\]
                   %{DATA:logger} : %{GREEDYDATA:log_message}"
    }
    remove_field => ["message"]
    add_field    => { "message" => "%{log_message}" }
  }

  # Useful patterns built-in to grok:
  # %{TIMESTAMP_ISO8601}  — 2026-06-26T14:23:01.345Z
  # %{LOGLEVEL}           — DEBUG, INFO, WARN, ERROR
  # %{NUMBER}             — any integer or decimal
  # %{IP}                 — IPv4 address
  # %{URI}                — http://host/path?query
  # %{GREEDYDATA}         — everything to the end of line
  # %{DATA}               — anything (non-greedy)
}` },
        { t: 'callout', kind: 'tip', html: `Use <strong>Kibana → Dev Tools → Grok Debugger</strong> to test your grok patterns against real log lines before deploying. You can also set Logstash output to <code>stdout { codec =&gt; rubydebug }</code> temporarily to see how each event looks after filtering.` },

        { t: 'sub', text: 'Output plugins — where logs go' },
        { t: 'code', title: 'logstash.conf — output to Elasticsearch with daily indices', code:
`output {
  elasticsearch {
    hosts    => ["elasticsearch:9200"]

    # Daily rolling index: logs-support-platform-2026.06.26
    index    => "logs-%{[application]}-%{+YYYY.MM.dd}"

    # Use data streams instead (ES 7.9+, recommended)
    # data_stream => true
    # data_stream_type => "logs"
    # data_stream_dataset => "support-platform"
  }

  # Keep stdout for pipeline debugging — remove in production
  # stdout { codec => rubydebug }
}` },

        { t: 'sub', text: 'Complete logstash.conf for Spring Boot' },
        { t: 'code', title: 'logstash.conf — full pipeline', code:
`input {
  tcp {
    port  => 5000
    codec => json_lines
  }
}

filter {
  mutate {
    add_field => { "environment" => "local" }
  }

  date {
    match  => ["@timestamp", "ISO8601"]
    target => "@timestamp"
  }

  if [level] == "DEBUG" {
    drop {}    # drop DEBUG logs to save storage
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{[application]}-%{+YYYY.MM.dd}"
  }
}` },
      ],
    },

    /* ========================================================
       PHASE 3 — Kibana
       ======================================================== */
    {
      id: 'phase-3', num: '03', accent: 'green', part: 'The Interface',
      eyebrow: 'Phase 3 · The Search Interface',
      title: 'Kibana',
      intro: 'Kibana is the human interface for all the data stored in Elasticsearch. Discover lets you search logs in real time. Visualize lets you build charts and aggregations. Dashboard combines them into a single view. Dev Tools gives you a REST console for raw ES queries. You will spend most of your time in Discover and Dashboard.',
      blocks: [
        { t: 'sub', text: 'The four main tools' },
        { t: 'diagram', name: 'kibanaTools', cap: 'Discover for search · Visualize for charts · Dashboard for the overview · Dev Tools for admin' },

        { t: 'sub', text: 'First-time setup: create a data view' },
        { t: 'steps', items: [
          `Open Kibana at <code>http://localhost:5601</code>. Default credentials: <strong>elastic / changeme</strong> (or no auth in dev mode).`,
          `Go to <strong>Stack Management → Kibana → Data Views → Create data view</strong>.`,
          `Name: <code>logs-*</code>. Index pattern: <code>logs-*</code>. Timestamp field: <code>@timestamp</code>. Click Create.`,
          `Go to <strong>Discover</strong>. Select the <code>logs-*</code> data view. You should see your log documents in the timeline.`,
          `In the left panel, add fields to the document table: click the + next to <code>level</code>, <code>application</code>, <code>message</code>.`,
        ] },
        { t: 'callout', kind: 'note', html: `A <strong>data view</strong> (formerly called an index pattern) tells Kibana which ES indices to include and which field to use as the time axis. The pattern <code>logs-*</code> matches every index starting with "logs-" — so it covers all your services and all dates in one view.` },

        { t: 'sub', text: 'Discover — searching logs' },
        { t: 'diagram', name: 'kibanaDiscover', cap: 'Discover: search bar + histogram timeline + document table — the primary log investigation tool' },
        { t: 'prose', html: `Kibana Query Language (KQL) is simpler than Elasticsearch DSL and covers 90% of daily use. Learn these patterns:` },
        { t: 'code', title: 'KQL — common search patterns in Kibana Discover', code:
`# Find all ERROR logs from one service
level: "ERROR" AND application: "support-platform"

# Find by trace ID (follow a request across services)
traceId: "abc123def456"

# Wildcard in message text
message: *NullPointer*

# Find logs NOT from health checks
NOT message: *actuator/health*

# Find slow requests (if duration field exists)
duration_ms > 1000 AND level: "INFO"

# Range query on a field
responseTime >= 500 AND responseTime <= 2000

# Combine: errors OR warnings in last 15min (use time picker)
level: "ERROR" OR level: "WARN"

# Find a specific user's activity
userId: "user-12345"` },

        { t: 'sub', text: 'Visualize — building charts from log data' },
        { t: 'prose', html: `Kibana Lens (the default chart builder) lets you build aggregation charts by dragging fields. Common charts for log analysis:` },
        { t: 'table', head: ['Chart type', 'Good for', 'Typical setup'],
          rows: [
            ['Bar / vertical bar', 'Error counts by service per hour', 'X axis: @timestamp (per hour), Y axis: count, split by application'],
            ['Pie / donut', 'Error distribution by level', 'Slice by: level field, metric: count'],
            ['Line', 'Error rate trend over time', 'X axis: @timestamp, Y axis: count where level=ERROR'],
            ['Data table', 'Top 10 error messages', 'Rows: top values of message.keyword, metric: count'],
            ['Metric / stat', 'Total error count', 'Single metric: count where level=ERROR'],
          ] },

        { t: 'sub', text: 'Dev Tools — raw ES queries' },
        { t: 'code', title: 'Dev Tools — useful day-to-day queries', code:
`# Check cluster health
GET /_cluster/health?pretty

# List indices sorted by size
GET /_cat/indices?v&s=store.size:desc

# Check index mapping (what fields exist)
GET /logs-support-platform-2026.06.26/_mapping

# Top 10 error messages today
GET /logs-*/_search
{
  "size": 0,
  "query": {
    "bool": {
      "must": { "match": { "level": "ERROR" } },
      "filter": { "range": { "@timestamp": { "gte": "now/d" } } }
    }
  },
  "aggs": {
    "top_errors": {
      "terms": { "field": "message.keyword", "size": 10 }
    }
  }
}

# Delete an index (be careful!)
DELETE /logs-support-platform-2026.01.01` },

        { t: 'sub', text: 'Useful Kibana dashboards to build' },
        { t: 'cards', cols: 2, items: [
          { title: 'Error Overview', body: 'Error count by service (bar chart) + error rate trend (line) + top 10 error messages (table) + filter by time range and environment.' },
          { title: 'Request Trace View', body: 'Saved search on traceId field. One click shows all log lines across all services for a single user request in chronological order.' },
          { title: 'Service Health', body: 'Per-service panels showing log volume, error %, and recent ERROR messages. Use as a NOC screen for on-call engineers.' },
          { title: 'Slow Query Log', body: 'Filter on log lines containing "slow" or "timeout". Chart query duration distribution. Table of slowest queries with full stack traces.' },
        ] },
      ],
    },

    /* ========================================================
       PHASE 4 — Spring Boot Integration
       ======================================================== */
    {
      id: 'phase-4', num: '04', accent: 'blue', part: 'Integration',
      eyebrow: 'Phase 4 · Wiring Spring Boot',
      title: 'Spring Boot Integration',
      intro: 'Connecting a Spring Boot service to the ELK stack requires three things: the right Logback dependencies, a logback-spring.xml file that configures the JSON appender, and a Logstash pipeline that can receive and parse the output. This phase shows every file you need.',
      blocks: [
        { t: 'sub', text: 'The connection architecture' },
        { t: 'diagram', name: 'springToLogstash', cap: 'Spring Boot → Logback → TCP JSON → Logstash → Elasticsearch' },

        { t: 'sub', text: 'Step 1 — Maven dependencies' },
        { t: 'code', title: 'pom.xml — logstash logback encoder', code:
`<dependencies>
    <!-- Spring Boot logging (Logback is already included) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Logstash encoder: formats logs as JSON and ships via TCP -->
    <dependency>
        <groupId>net.logstash.logback</groupId>
        <artifactId>logstash-logback-encoder</artifactId>
        <version>7.4</version>
    </dependency>
</dependencies>` },

        { t: 'sub', text: 'Step 2 — logback-spring.xml' },
        { t: 'prose', html: `Spring Boot picks up <code>logback-spring.xml</code> automatically from the classpath (src/main/resources). This replaces the default console output with both a console appender (for Docker logs) and a Logstash TCP appender.` },
        { t: 'code', title: 'src/main/resources/logback-spring.xml', code:
`<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <!-- Console output for Docker logs (plain text) -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Logstash TCP appender — sends JSON to Logstash -->
    <appender name="LOGSTASH"
        class="net.logstash.logback.appender.LogstashTcpSocketAppender">

        <!-- Use Docker service name, not localhost -->
        <destination>logstash:5000</destination>

        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <!-- Include the spring.application.name as a field -->
            <includeMdcKeyName>traceId</includeMdcKeyName>
            <includeMdcKeyName>spanId</includeMdcKeyName>
            <customFields>{"application":"support-platform","env":"local"}</customFields>
        </encoder>

        <!-- Reconnect if Logstash goes down -->
        <reconnectionDelay>10 seconds</reconnectionDelay>
        <keepAliveDuration>5 minutes</keepAliveDuration>
    </appender>

    <!-- Root logger: send to both console and Logstash -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="LOGSTASH"/>
    </root>

    <!-- Suppress noisy frameworks -->
    <logger name="org.hibernate.SQL"               level="DEBUG"/>
    <logger name="org.springframework.web"         level="WARN"/>
    <logger name="com.netflix.discovery"           level="WARN"/>

</configuration>` },

        { t: 'sub', text: 'Step 3 — What the JSON log event looks like' },
        { t: 'prose', html: `The <code>LogstashEncoder</code> formats every log event as a single-line JSON object. This is what Logstash receives on port 5000:` },
        { t: 'code', title: 'JSON log event sent to Logstash (one line)', code:
`{
  "@timestamp": "2026-06-26T14:23:01.345+00:00",
  "@version": "1",
  "message": "Ticket creation failed for ticketId=42",
  "logger_name": "com.support.service.TicketService",
  "thread_name": "http-nio-8082-exec-3",
  "level": "ERROR",
  "level_value": 40000,
  "stack_trace": "java.lang.NullPointerException: Cannot invoke...\n\tat com.support...",
  "traceId": "abc123def456789",
  "spanId": "def456",
  "application": "support-platform",
  "env": "local"
}` },

        { t: 'sub', text: 'Adding MDC fields for request context' },
        { t: 'prose', html: `MDC (Mapped Diagnostic Context) lets you attach key-value pairs to the current thread — they appear in every log line emitted by that thread. Use it for user ID, request ID, and correlation IDs.` },
        { t: 'code', title: 'MDC filter — add userId and requestId to every log line', code:
`@Component
public class MdcLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpReq = (HttpServletRequest) req;

        // These appear in every log line from this request thread
        MDC.put("requestId", UUID.randomUUID().toString());
        MDC.put("userId",    httpReq.getHeader("X-User-Id"));
        MDC.put("path",      httpReq.getRequestURI());

        try {
            chain.doFilter(req, res);
        } finally {
            MDC.clear();   // always clean up — thread pools reuse threads
        }
    }
}` },
        { t: 'callout', kind: 'tip', html: `With <code>userId</code> in MDC, every log line — INFO, WARN, or ERROR — automatically includes which user triggered it. In Kibana you can search <code>userId:"user-12345"</code> and see every action that user took, across all services, sorted by time.` },

        { t: 'sub', text: 'Structured logging — log objects, not strings' },
        { t: 'code', title: 'StructuredArguments vs string interpolation', code:
`import static net.logstash.logback.argument.StructuredArguments.kv;
import static net.logstash.logback.argument.StructuredArguments.value;

// BAD: string concatenation — message field becomes a blob, unsearchable
logger.error("Ticket " + ticketId + " failed for user " + userId);

// GOOD: structured arguments — each becomes its own searchable JSON field
logger.error("Ticket creation failed",
    kv("ticketId", ticketId),    // "ticketId": 42
    kv("userId",   userId),      // "userId":   "user-99"
    kv("reason",   "DB timeout") // "reason":   "DB timeout"
);

// In Kibana you can now filter: ticketId:42 AND reason:"DB timeout"
// instead of parsing free text

// value() adds unnamed extra field
logger.info("Request processed", value("durationMs", 143));` },

        { t: 'sub', text: 'docker-compose.yml — ELK service blocks' },
        { t: 'code', title: 'docker-compose.yml — elasticsearch, logstash, kibana', code:
`version: "3.9"

services:

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.13.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false     # disable auth in dev
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    networks:
      - elk

  logstash:
    image: docker.elastic.co/logstash/logstash:8.13.0
    ports:
      - "5000:5000/tcp"    # Spring Boot apps send logs here
      - "5044:5044"        # Filebeat sends here
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    environment:
      - LS_JAVA_OPTS=-Xmx256m -Xms256m
    depends_on:
      - elasticsearch
    networks:
      - elk

  kibana:
    image: docker.elastic.co/kibana/kibana:8.13.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch
    networks:
      - elk

  # Your Spring Boot app must also be on this network
  support-platform:
    build: .
    ports:
      - "8082:8082"
    networks:
      - elk       # so "logstash:5000" resolves from inside the container

networks:
  elk:
    driver: bridge

volumes:
  es_data:` },
      ],
    },

    /* ========================================================
       PHASE 5 — Production & Scaling
       ======================================================== */
    {
      id: 'phase-5', num: '05', accent: 'cyan', part: 'Production',
      eyebrow: 'Phase 5 · Production Patterns',
      title: 'Production & Scaling',
      intro: 'A single-node ELK setup works for development but breaks under production log volumes and availability requirements. This phase covers Index Lifecycle Management for automatic retention, the Beats architecture for log shipping without modifying apps, Elasticsearch cluster design for fault tolerance, and the settings that matter most in production.',
      blocks: [
        { t: 'sub', text: 'Beats — shipping logs without touching application code' },
        { t: 'prose', html: `<strong>Filebeat</strong> is a lightweight agent that tails log files on a host and ships them to Logstash or Elasticsearch. It is the preferred approach when you cannot or do not want to modify application code to add a Logstash appender.` },
        { t: 'diagram', name: 'beatsArchitecture', cap: 'Filebeat tails files on each host and ships to Logstash — no code changes to the app needed' },
        { t: 'code', title: 'filebeat.yml — tail Spring Boot log files', code:
`filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/support-platform/*.log
      - /var/log/auth-service/*.log
    fields:
      environment: production
    multiline:
      pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
      negate: true
      match: after    # attach stack trace lines to the preceding log line

output.logstash:
  hosts: ["logstash:5044"]` },
        { t: 'callout', kind: 'key', html: `The <code>multiline</code> config is critical. Java stack traces span many lines, but they belong to one log event. Without multiline config, each stack trace line becomes a separate document in Elasticsearch — making it impossible to search for the root exception.` },

        { t: 'sub', text: 'Index Lifecycle Management (ILM) — automatic retention' },
        { t: 'prose', html: `Log data grows without bound. ILM automatically moves indices through <strong>phases</strong> based on age or size, and eventually deletes them. This keeps storage under control without manual cron jobs.` },
        { t: 'table', head: ['Phase', 'Trigger', 'Actions', 'Storage'],
          rows: [
            ['Hot', 'Current index being written to', 'None — keep as-is for fast writes', 'Fast SSD / NVMe'],
            ['Warm', 'After 2 days (or 50 GB)', 'Force merge, shrink shards, read-only', 'Standard SSD'],
            ['Cold', 'After 14 days', 'Freeze index (searchable, slow)', 'HDD or object store'],
            ['Delete', 'After 30 days', 'Delete index permanently', '—'],
          ] },
        { t: 'code', title: 'ILM policy — 30-day log retention (Kibana Dev Tools)', code:
`PUT /_ilm/policy/logs-policy
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_primary_shard_size": "50gb",
            "max_age": "1d"
          }
        }
      },
      "warm": {
        "min_age": "2d",
        "actions": {
          "forcemerge": { "max_num_segments": 1 },
          "readonly":   {}
        }
      },
      "delete": {
        "min_age": "30d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}` },

        { t: 'sub', text: 'Elasticsearch cluster for production' },
        { t: 'diagram', name: 'esCluster', cap: 'Primary shards spread across nodes — replicas on different nodes from their primary' },
        { t: 'list', items: [
          `<strong>Minimum 3 nodes</strong> for a production cluster. Elasticsearch needs a quorum (majority) of master-eligible nodes to be alive to elect a master. 3 nodes can survive 1 failure.`,
          `<strong>Dedicated roles</strong> at scale: separate master nodes (orchestration), data nodes (storage), coordinating nodes (routing queries). In small clusters, all nodes do all roles.`,
          `<strong>Heap: no more than 50% of RAM, never more than 32 GB.</strong> Elasticsearch uses heap for the JVM and relies on the OS file cache for the rest. 32 GB is the JVM compressed oops boundary.`,
          `<strong>Shard count matters.</strong> Too many small shards waste overhead; too few large shards limit parallelism. Rule of thumb: shard size between 10 GB and 50 GB. For time-series logs, 1 shard per day per major service is usually fine.`,
        ] },

        { t: 'sub', text: 'Performance tuning for log ingest' },
        { t: 'code', title: 'Logstash tuning for high-volume log ingest', code:
`# logstash.yml — performance settings
pipeline.workers: 4              # CPU cores available
pipeline.batch.size: 1000        # events per batch sent to ES
pipeline.batch.delay: 50         # ms to wait for a full batch

# logstash.conf output — bulk ingest tuning
output {
  elasticsearch {
    hosts    => ["elasticsearch:9200"]
    index    => "logs-%{[application]}-%{+YYYY.MM.dd}"
    # Increase flush batch for higher throughput
    flush_size => 1000
    idle_flush_time => 5        # flush after 5s even if not full
  }
}` },
        { t: 'code', title: 'Elasticsearch index settings for high-volume write', code:
`PUT /logs-template/_settings
{
  "index": {
    "refresh_interval": "30s",      # less frequent refresh = faster writes
    "number_of_replicas": 0,        # disable replicas during bulk ingest
    "translog": {
      "durability": "async",         # async fsync — OK for logs, risky for data
      "flush_threshold_size": "1gb"
    }
  }
}
# After bulk ingest: restore replicas and refresh_interval` },

        { t: 'sub', text: 'Security in production' },
        { t: 'list', items: [
          `<strong>Enable xpack.security.</strong> The dev docker-compose sets <code>xpack.security.enabled=false</code>. In production, enable it and create role-based users: one for Logstash output (write-only), one for Kibana (read-only), one for ops (admin).`,
          `<strong>TLS everywhere.</strong> Encrypt node-to-node transport and HTTP traffic. Elasticsearch 8.x enables this by default.`,
          `<strong>Index-level security.</strong> Restrict Kibana roles to only the <code>logs-*</code> indices. Do not give application users access to <code>_all</code>.`,
          `<strong>Audit logging.</strong> Enable ES audit logs to record who searched what. Required for compliance in regulated environments.`,
        ] },

        { t: 'sub', text: 'Troubleshooting checklist' },
        { t: 'table', head: ['Symptom', 'Cause', 'Fix'],
          rows: [
            ['No data in Kibana', 'Wrong data view pattern or wrong timestamp field', 'Check data view matches index names; verify @timestamp is mapped as date'],
            ['Logstash not receiving', 'App connects to wrong host or port', 'Use Docker service name "logstash:5000", not localhost'],
            ['Yellow cluster status', 'Replicas unassigned (single node)', 'Set number_of_replicas: 0 in dev; add nodes in prod'],
            ['ES disk full', 'No ILM policy, indices growing forever', 'Create ILM policy with delete phase; set disk watermarks'],
            ['Logstash OOM', 'Batch size too large, heap too small', 'Reduce pipeline.batch.size; increase LS_JAVA_OPTS heap'],
            ['Stack traces split across docs', 'Multiline not configured in Filebeat', 'Add multiline config matching your log format'],
          ] },
        { t: 'callout', kind: 'key', html: `<strong>You now have the complete ELK picture.</strong> Elasticsearch stores and searches via inverted index. Logstash transforms raw text into structured JSON via input → filter → output. Kibana makes it human-readable. Spring Boot connects via Logback TCP appender. In production: add ILM for retention, Beats for file tailing, and enable xpack.security.` },
      ],
    },
  ],
};
