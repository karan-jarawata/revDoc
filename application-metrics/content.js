/* ============================================================
   Application Metrics — learning content as structured blocks.
   Rendered by app.js (shared with the other guides).
   Code is stored raw and auto-escaped on render, so < > & in
   code need no escaping. Avoid ${...} and backticks in code.
   ============================================================ */
window.CONTENT = {
  hero: {
    eyebrow: 'The Complete Guide',
    title: 'Application Metrics',
    sub: 'How Spring Boot Actuator plants sensors inside the JVM, Micrometer translates those readings into Prometheus format, Prometheus scrapes and stores them as a time-series database, and Grafana renders it all as the dashboards your team actually watches. Six phases from zero context to a fully wired monitoring stack — every dependency, config file, and gotcha included.',
    stats: [
      { num: '6', label: 'Phases' },
      { num: '4', label: 'Components' },
      { num: '30+', label: 'Code samples' },
      { num: '10', label: 'Diagrams' },
    ],
  },

  levels: [
    /* ========================================================
       PHASE 0 — Why Monitor?
       ======================================================== */
    {
      id: 'phase-0', num: '00', accent: 'rose', part: 'Context',
      eyebrow: 'Phase 0 · Real-World Context',
      title: 'Why Monitor?',
      intro: 'Before learning the tools, understand the problem they solve. A Spring Boot application running in production is a black box — without observability you cannot answer the most important questions: Is it healthy? Is it slow? Why is it slow? Metrics turn that black box into a transparent one.',
      blocks: [
        { t: 'sub', text: 'The three pillars of observability' },
        { t: 'cards', cols: 3, items: [
          { title: 'Metrics', body: 'Numerical measurements over time — JVM heap, CPU, request rate, error rate. The subject of this guide. Fast to query, cheap to store.' },
          { title: 'Logs', body: 'Timestamped event records — what happened, for which user, with what error. Rich in context, expensive to query at scale (see the ELK guide).' },
          { title: 'Traces', body: 'Request paths across services — which microservice was slow for this specific call. Needs correlation IDs and a tracing backend (Jaeger, Zipkin).' },
        ] },
        { t: 'callout', kind: 'key', html: `<strong>Metrics answer "how bad?"</strong> — is the heap at 90%? Is the DB pool full? Logs answer "what happened?" — which query timed out, for which user. You need both; this guide covers metrics.` },

        { t: 'sub', text: 'The four-component stack' },
        { t: 'prose', html: `The monitoring stack used in a standard Spring Boot project has four components, each with a single job. Understanding each component's role makes the configuration obvious rather than magical.` },
        { t: 'diagram', name: 'systemOverview', cap: 'Actuator + Micrometer live inside your app; Prometheus and Grafana are separate servers' },
        { t: 'cards', cols: 2, items: [
          { title: 'Spring Boot Actuator (The Sensors)', body: 'A library inside your app. Automatically attaches to the JVM and records internal measurements: heap memory, CPU, DB connections, thread count, HTTP request count and duration.' },
          { title: 'Micrometer (The Translator)', body: 'Also inside your app, next to Actuator. Translates the Java metric objects into the flat-text format Prometheus requires. Without Micrometer, Prometheus cannot read your metrics.' },
          { title: 'Prometheus (The Database)', body: 'A standalone server in your Docker network. It does not wait for data — it actively scrapes /actuator/prometheus from each configured target every 15 seconds and stores the numbers as a time-series.' },
          { title: 'Grafana (The Dashboard)', body: 'Another standalone server. Never talks to your app directly. It connects to Prometheus, sends PromQL queries, and renders the results as the charts and gauges your team looks at.' },
        ] },

        { t: 'sub', text: 'The pull model — why Prometheus scrapes' },
        { t: 'prose', html: `Most monitoring systems use a <strong>push model</strong>: apps send data to the monitoring server. Prometheus uses a <strong>pull model</strong>: Prometheus comes to your app. This has important consequences.` },
        { t: 'diagram', name: 'dataFlow', cap: 'Prometheus pulls; your app just serves a text page on demand' },
        { t: 'list', items: [
          `<strong>Your app is passive.</strong> It never needs to know Prometheus's address. It just serves <code>/actuator/prometheus</code> when asked.`,
          `<strong>Prometheus controls the schedule.</strong> Default interval is 15 seconds. You configure this in <code>prometheus.yml</code>, not in your Spring Boot app.`,
          `<strong>Grafana never touches your app.</strong> It talks only to Prometheus. If Prometheus is down, Grafana shows no data — but your app is unaffected.`,
          `<strong>Dead targets are obvious.</strong> If Prometheus cannot reach a target, that target shows as DOWN in the Prometheus UI at <code>localhost:9090/targets</code>.`,
        ] },

        { t: 'sub', text: 'Standard URLs at a glance' },
        { t: 'table', head: ['URL', 'Component', 'What it is'],
          rows: [
            ['http://localhost:8082/actuator/prometheus', 'Actuator + Micrometer', 'Raw flat-text metrics page — what Prometheus reads'],
            ['http://localhost:9090', 'Prometheus', 'Query UI, target health, rule evaluation'],
            ['http://localhost:9090/targets', 'Prometheus', 'Which apps are UP / DOWN and last scrape time'],
            ['http://localhost:3000', 'Grafana', 'Dashboard UI — where humans look'],
          ] },
        { t: 'callout', kind: 'note', html: `The port <code>8082</code> is specific to the <code>support-platform</code> microservice. Other services use their own ports (8080, 8081…). Each service exposes its own <code>/actuator/prometheus</code> page, and each must be listed as a separate target in <code>prometheus.yml</code>.` },
      ],
    },

    /* ========================================================
       PHASE 1 — Spring Boot Actuator
       ======================================================== */
    {
      id: 'phase-1', num: '01', accent: 'purple', part: 'Inside The App',
      eyebrow: 'Phase 1 · Inside The App',
      title: 'Spring Boot Actuator',
      intro: 'Actuator is the library that automatically instruments your application. It hooks into the JVM and Spring internals and makes those measurements available over HTTP. It requires almost no code — just a dependency and a couple of config lines.',
      blocks: [
        { t: 'sub', text: 'What Actuator does' },
        { t: 'prose', html: `Think of Actuator as a dashboard panel that is <strong>built into your car</strong>. It reads the speedometer, fuel gauge, and engine temperature from the car's own sensors — you don't build those sensors yourself. Actuator does the same for JVM internals.` },
        { t: 'diagram', name: 'actuatorEndpoints', cap: 'Actuator reads JVM internals and serves them as HTTP endpoints' },
        { t: 'list', items: [
          `<strong>Health checks</strong> — <code>/actuator/health</code> says UP or DOWN; includes sub-checks for DB, Kafka, disk space.`,
          `<strong>JVM metrics</strong> — heap used/committed/max, GC pause time, loaded classes, thread states.`,
          `<strong>HTTP metrics</strong> — count and duration of every request by URI, method, and status code.`,
          `<strong>HikariCP metrics</strong> — active, idle, and pending connections in your DB connection pool.`,
          `<strong>Kafka consumer metrics</strong> — consumer lag per topic/partition.`,
          `<strong>Custom metrics</strong> — anything you define with Micrometer in your own code.`,
        ] },

        { t: 'sub', text: 'Adding the dependency' },
        { t: 'code', title: 'pom.xml — Step 1: add both dependencies', code:
`<dependencies>
    <!-- Step 1a: Actuator — the internal sensors -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <!-- Step 1b: Micrometer Prometheus registry — the translator -->
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
    </dependency>
</dependencies>` },
        { t: 'callout', kind: 'note', html: `You need <strong>both</strong> dependencies. <code>spring-boot-starter-actuator</code> provides the metrics collection; <code>micrometer-registry-prometheus</code> provides the Prometheus text-format output. Without the second one, <code>/actuator/prometheus</code> does not exist.` },

        { t: 'sub', text: 'Exposing the endpoint' },
        { t: 'prose', html: `By default, Actuator only exposes <code>/actuator/health</code> over HTTP. You must explicitly expose the other endpoints, especially <code>prometheus</code>.` },
        { t: 'code', title: 'application.properties — Step 2: expose and name', code:
`# Name that appears as a label in every Prometheus metric
spring.application.name=support-platform

# Expose these actuator endpoints over HTTP
management.endpoints.web.exposure.include=health,info,prometheus,metrics

# Show the full health detail (DB sub-check, disk sub-check, etc.)
management.endpoint.health.show-details=always

# Optional: move all actuator endpoints to /management prefix
# management.endpoints.web.base-path=/management` },
        { t: 'callout', kind: 'tip', html: `The <code>spring.application.name</code> value becomes the <code>application</code> label in every metric scraped from this service. In Grafana you can then filter dashboards by application name. Always set it.` },

        { t: 'sub', text: 'What the /actuator/prometheus page looks like' },
        { t: 'prose', html: `Hit <code>http://localhost:8082/actuator/prometheus</code> in your browser. You will see hundreds of lines of plain text — the Prometheus exposition format that Micrometer writes. Each metric is three things: a comment describing it, a TYPE declaration, and one or more key=value data lines.` },
        { t: 'code', title: '/actuator/prometheus — raw sample output', code:
`# HELP jvm_memory_used_bytes The amount of used memory
# TYPE jvm_memory_used_bytes gauge
jvm_memory_used_bytes{area="heap",id="G1 Eden Space",} 1.57286656E8
jvm_memory_used_bytes{area="heap",id="G1 Old Gen",} 5.5574528E7

# HELP http_server_requests_seconds Duration of HTTP server request handling
# TYPE http_server_requests_seconds summary
http_server_requests_seconds_count{method="GET",status="200",uri="/api/tickets",} 1042.0
http_server_requests_seconds_sum{method="GET",status="200",uri="/api/tickets",} 8.234

# HELP hikaricp_connections_active Active connections
# TYPE hikaricp_connections_active gauge
hikaricp_connections_active{pool="HikariPool-1",} 3.0` },
        { t: 'callout', kind: 'key', html: `Every line is a data point Prometheus will store. The curly-brace labels (like <code>status="200"</code>, <code>uri="/api/tickets"</code>) let you filter in PromQL queries later — "show me only the GET /api/tickets endpoint" or "only 500 errors".` },

        { t: 'sub', text: 'Health endpoint deep dive' },
        { t: 'code', title: '/actuator/health — full response with sub-checks', code:
`{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 499963174912,
        "free":  387432448000,
        "threshold": 10485760
      }
    },
    "kafka": {
      "status": "UP"
    }
  }
}` },
        { t: 'callout', kind: 'tip', html: `Kubernetes liveness and readiness probes can point at <code>/actuator/health/liveness</code> and <code>/actuator/health/readiness</code> — Spring Boot 2.3+ registers those automatically. Set <code>management.health.probes.enabled=true</code>.` },
      ],
    },

    /* ========================================================
       PHASE 2 — Micrometer
       ======================================================== */
    {
      id: 'phase-2', num: '02', accent: 'blue', part: 'Inside The App',
      eyebrow: 'Phase 2 · Inside The App',
      title: 'Micrometer',
      intro: 'Micrometer is the metrics library that lives inside your Spring Boot application. It provides a single, vendor-neutral API for recording measurements — you write Counter.builder() once and switch backends just by swapping a dependency. Its key job here is writing the Prometheus text format that Actuator serves.',
      blocks: [
        { t: 'sub', text: 'The facade pattern' },
        { t: 'prose', html: `Micrometer is to metrics what SLF4J is to logging: a <strong>vendor-neutral facade</strong>. You write code against the Micrometer API. Behind the scenes, you choose a <em>registry</em> — Prometheus, Datadog, InfluxDB, CloudWatch. Swapping monitoring backends is just a dependency change.` },
        { t: 'diagram', name: 'micrometerFacade', cap: 'One API, swappable backends — add micrometer-registry-prometheus and you get Prometheus support' },

        { t: 'sub', text: 'The four metric types' },
        { t: 'prose', html: `Choosing the wrong type means your PromQL queries give wrong answers. Pick based on what the number represents.` },
        { t: 'diagram', name: 'micrometerTypes', cap: 'Counter = only increases · Gauge = current snapshot · Timer = duration + count · Distribution = value distribution' },
        { t: 'table', head: ['Type', 'Behaviour', 'Example', 'PromQL pattern'],
          rows: [
            ['Counter', 'Only increases', 'HTTP requests total', 'rate(metric[5m]) → per-second rate'],
            ['Gauge', 'Up and down freely', 'DB connections active', 'Read directly — it is already current'],
            ['Timer', 'Records duration + count', 'HTTP response latency', 'histogram_quantile(0.95, ...) → p95'],
            ['Distribution Summary', 'Records value distribution', 'Request payload bytes', 'histogram_quantile(0.99, ...) → p99'],
          ] },
        { t: 'callout', kind: 'warning', html: `<strong>Never use a Gauge for something that only increases.</strong> PromQL's <code>rate()</code> function requires a Counter. A Gauge that only goes up looks like data but produces wrong rates.` },

        { t: 'sub', text: 'Tags — the key to filtering' },
        { t: 'prose', html: `Tags (also called labels in Prometheus) are key-value pairs attached to each measurement. They let you split one metric into many dimensions without creating separate metrics. You can then filter in PromQL.` },
        { t: 'code', title: 'Tags in Micrometer — dimensions on a metric', code:
`@Autowired MeterRegistry registry;

// Tag by status so you can query "only failed ticket creations"
Counter ticketCounter = Counter.builder("tickets.created")
    .description("Number of support tickets created")
    .tag("status", "success")       // filter: status="success"
    .tag("team", "platform")        // filter: team="platform"
    .register(registry);

ticketCounter.increment();

// Timer with multiple dimensions
Timer httpTimer = Timer.builder("http.request.duration")
    .description("HTTP request latency")
    .tag("uri", "/api/tickets")
    .tag("method", "POST")
    .tag("status", "200")
    .register(registry);

httpTimer.record(Duration.ofMillis(145));` },
        { t: 'callout', kind: 'danger', html: `<strong>Tag cardinality explosion:</strong> never use user IDs, session tokens, or any high-cardinality value as a tag. Each unique tag combination creates a new time-series in Prometheus. 10,000 users = 10,000 time-series = out of memory. Use low-cardinality values only: status codes, endpoint groups, team names.` },

        { t: 'sub', text: 'Custom metrics in your service' },
        { t: 'code', title: 'TicketService.java — defining and recording custom metrics', code:
`@Service
public class TicketService {

    private final Counter ticketsCreated;
    private final Counter ticketsFailed;
    private final Timer   processingTimer;
    private final AtomicInteger activeTickets;

    public TicketService(MeterRegistry registry) {
        this.ticketsCreated = Counter.builder("tickets.created.total")
                .description("Total tickets successfully created")
                .register(registry);

        this.ticketsFailed = Counter.builder("tickets.failed.total")
                .description("Total ticket creation failures")
                .register(registry);

        this.processingTimer = Timer.builder("tickets.processing.duration")
                .description("Time to process a ticket creation")
                .publishPercentiles(0.5, 0.95, 0.99)  // p50, p95, p99
                .register(registry);

        // Gauge — current in-flight ticket count
        this.activeTickets = registry.gauge(
            "tickets.active", new AtomicInteger(0));
    }

    public Ticket createTicket(TicketRequest req) {
        activeTickets.incrementAndGet();
        return processingTimer.record(() -> {
            try {
                Ticket t = repo.save(new Ticket(req));
                ticketsCreated.increment();
                return t;
            } catch (Exception e) {
                ticketsFailed.increment();
                throw e;
            } finally {
                activeTickets.decrementAndGet();
            }
        });
    }
}` },

        { t: 'sub', text: 'What Actuator registers automatically' },
        { t: 'prose', html: `You do not need to register these manually. Spring Boot Actuator + Micrometer auto-bind the following metrics when the relevant libraries are on the classpath:` },
        { t: 'table', head: ['Metric prefix', 'Source', 'What it measures'],
          rows: [
            ['jvm.memory.*', 'JVM (always)', 'Heap/non-heap used, committed, max per pool'],
            ['jvm.gc.*', 'JVM (always)', 'GC pause count and total time'],
            ['jvm.threads.*', 'JVM (always)', 'Thread states: runnable, blocked, waiting'],
            ['process.cpu.usage', 'JVM (always)', 'CPU used by the JVM process (0.0–1.0)'],
            ['http.server.requests', 'Spring MVC/WebFlux', 'Count and duration per endpoint, method, status'],
            ['hikaricp.connections.*', 'HikariCP (if present)', 'Active, idle, pending, max DB connections'],
            ['kafka.consumer.*', 'Spring Kafka (if present)', 'Consumer lag, fetch rate, commit rate'],
            ['spring.data.repository.*', 'Spring Data', 'Repository method invocation counts and times'],
          ] },
        { t: 'callout', kind: 'tip', html: `Browse <code>http://localhost:8082/actuator/metrics</code> to see every metric name currently registered. Click into <code>http://localhost:8082/actuator/metrics/jvm.memory.used</code> to see its current value and available tags.` },
      ],
    },

    /* ========================================================
       PHASE 3 — Prometheus
       ======================================================== */
    {
      id: 'phase-3', num: '03', accent: 'amber', part: 'Infrastructure',
      eyebrow: 'Phase 3 · The Scraper & Database',
      title: 'Prometheus',
      intro: 'Prometheus is a standalone server that runs in your Docker network alongside your applications. Its job is simple: visit each configured target every 15 seconds, read the metrics text page, and store every number with a timestamp. That stored history is what Grafana later queries.',
      blocks: [
        { t: 'sub', text: 'How Prometheus works internally' },
        { t: 'list', items: [
          `<strong>Scraper:</strong> Prometheus reads <code>prometheus.yml</code> on startup to get the list of targets. It then sends a plain HTTP GET to each target's <code>/actuator/prometheus</code> path on a configurable interval.`,
          `<strong>Time-series database:</strong> Every number it reads is stored as a data point: <em>(metric name, labels, timestamp, value)</em>. It never modifies or deletes these points (until retention expires).`,
          `<strong>PromQL engine:</strong> It runs a query language over those stored series. Grafana sends PromQL queries to Prometheus to draw graphs.`,
          `<strong>Alertmanager integration:</strong> Prometheus can evaluate alert rules and fire them to Alertmanager (Slack, email, PagerDuty).`,
        ] },

        { t: 'sub', text: 'Configuring targets in prometheus.yml' },
        { t: 'diagram', name: 'prometheusTargets', cap: 'Prometheus scrapes each target and shows health at localhost:9090/targets' },
        { t: 'code', title: 'prometheus.yml — the complete config for a microservice project', code:
`global:
  scrape_interval: 15s       # how often to scrape every target
  evaluation_interval: 15s   # how often to evaluate alert rules

scrape_configs:

  # --- support-platform microservice ---
  - job_name: "support-platform"
    metrics_path: "/actuator/prometheus"
    static_configs:
      - targets: ["support-platform:8082"]
        labels:
          app: "support-platform"
          env: "local"

  # --- auth-service microservice ---
  - job_name: "auth-service"
    metrics_path: "/actuator/prometheus"
    static_configs:
      - targets: ["auth-service:8080"]
        labels:
          app: "auth-service"
          env: "local"

  # --- Prometheus itself (self-monitoring) ---
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]` },
        { t: 'callout', kind: 'warning', html: `<strong>Service names not localhost.</strong> Because all containers are on the same Docker bridge network, Prometheus references other services by their Docker Compose service name (e.g. <code>support-platform:8082</code>). Using <code>localhost:8082</code> inside the Prometheus container refers to <em>Prometheus itself</em>, not your Spring Boot app.` },

        { t: 'sub', text: 'Checking target health' },
        { t: 'prose', html: `Navigate to <code>http://localhost:9090/targets</code>. Every target you defined in <code>prometheus.yml</code> appears here with its current status.` },
        { t: 'table', head: ['Status', 'Meaning', 'Most likely cause'],
          rows: [
            ['UP (green)', 'Last scrape succeeded', 'All is well'],
            ['DOWN (red)', 'Scrape failed with an error', 'Spring Security 403 · wrong host/port · app not running'],
            ['UNKNOWN', 'Not yet scraped since startup', 'Wait 15 seconds'],
          ] },
        { t: 'callout', kind: 'danger', html: `<strong>Spring Security 403 is the #1 reason a target shows DOWN.</strong> Prometheus sends an unauthenticated HTTP GET. If Spring Security is protecting all endpoints, Prometheus gets a 403, records zero metrics, and shows DOWN. Fix: <code>.requestMatchers("/actuator/**").permitAll()</code> — see Phase 5.` },

        { t: 'sub', text: 'PromQL — querying your data' },
        { t: 'prose', html: `PromQL (Prometheus Query Language) is how you ask questions of the data. You run queries in the Prometheus UI at <code>localhost:9090/graph</code> or inside Grafana panels. Learn these four patterns and you can build most dashboards.` },
        { t: 'diagram', name: 'promqlAnatomy', cap: 'PromQL = function( metric_name{label_filters} [range] )' },
        { t: 'code', title: 'Essential PromQL patterns for Spring Boot', code:
`# --- HTTP request rate (requests per second) ---
rate(http_server_requests_seconds_count{application="support-platform"}[5m])

# --- Error rate (5xx only) ---
rate(http_server_requests_seconds_count{status=~"5.."}[5m])

# --- p95 response latency ---
histogram_quantile(0.95,
  rate(http_server_requests_seconds_bucket[5m])
)

# --- JVM heap used (MB) ---
jvm_memory_used_bytes{area="heap"} / 1024 / 1024

# --- JVM heap as % of max ---
jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} * 100

# --- HikariCP pool utilization ---
hikaricp_connections_active / hikaricp_connections_max * 100

# --- CPU usage (%) ---
process_cpu_usage * 100

# --- Kafka consumer lag (sum across all partitions) ---
sum(kafka_consumer_fetch_manager_records_lag) by (topic)` },

        { t: 'sub', text: 'How metric names are translated' },
        { t: 'prose', html: `Micrometer uses dots (<code>tickets.created.total</code>) but Prometheus requires underscores. Micrometer handles this automatically. Also, Timer metrics become <em>three</em> Prometheus time-series.` },
        { t: 'table', head: ['Micrometer name', 'Prometheus name(s)', 'Notes'],
          rows: [
            ['tickets.created.total', 'tickets_created_total', 'Counter — dots → underscores'],
            ['http.server.requests', 'http_server_requests_seconds_count', 'Timer creates _count'],
            ['http.server.requests', 'http_server_requests_seconds_sum', 'Timer creates _sum'],
            ['http.server.requests', 'http_server_requests_seconds_bucket', 'Timer creates _bucket (histogram)'],
            ['jvm.memory.used', 'jvm_memory_used_bytes', 'Unit appended: _bytes, _seconds, etc.'],
          ] },
        { t: 'callout', kind: 'tip', html: `Use the Prometheus UI at <code>localhost:9090</code> to explore metric names. Start typing a name in the expression box and autocomplete shows you everything available from your scraped targets.` },
      ],
    },

    /* ========================================================
       PHASE 4 — Grafana
       ======================================================== */
    {
      id: 'phase-4', num: '04', accent: 'green', part: 'Infrastructure',
      eyebrow: 'Phase 4 · The Visualizer',
      title: 'Grafana',
      intro: 'Grafana is the human-readable layer. It connects to Prometheus as a data source, sends PromQL queries, and renders the results as the charts, gauges, and heatmaps your team looks at. Your apps never know Grafana exists — it communicates with Prometheus only.',
      blocks: [
        { t: 'sub', text: 'Key concepts' },
        { t: 'cards', cols: 3, items: [
          { title: 'Data Source', body: 'A connection to a backend (Prometheus, InfluxDB, Loki, etc.). You configure it once with the URL http://prometheus:9090 — all panels in all dashboards query through it.' },
          { title: 'Dashboard', body: 'A collection of panels arranged on a grid. Dashboards are stored as JSON — you can export, import, version-control, and share them. Import ID 4701 for the JVM dashboard.' },
          { title: 'Panel', body: 'A single visualization (graph, stat, gauge, table, heatmap). Each panel has one or more PromQL queries attached to it and renders the result in your chosen chart type.' },
        ] },

        { t: 'sub', text: 'First-time Grafana setup' },
        { t: 'steps', items: [
          `Open <code>http://localhost:3000</code>. Default credentials: <strong>admin / admin</strong> (change on first login).`,
          `Go to <strong>Connections → Data Sources → Add data source</strong>. Choose Prometheus.`,
          `Set URL to <code>http://prometheus:9090</code> (the Docker service name, not localhost). Click Save &amp; Test — you should see "Data source is working".`,
          `Go to <strong>Dashboards → Import</strong>. Enter ID <code>4701</code> (Spring Boot 3.x / Micrometer). Select your Prometheus data source and click Import.`,
          `The JVM dashboard appears immediately with JVM heap, CPU, HTTP rate, HikariCP, and thread panels pre-built.`,
        ] },
        { t: 'callout', kind: 'warning', html: `The URL <code>http://localhost:9090</code> will NOT work as a Grafana data source because <code>localhost</code> inside the Grafana container points to Grafana itself, not Prometheus. Always use the Docker service name: <code>http://prometheus:9090</code>.` },

        { t: 'sub', text: 'The dashboard you get from ID 4701' },
        { t: 'diagram', name: 'grafanaDashboard', cap: 'Dashboard 4701 gives you JVM heap, HTTP rate, and HikariCP out of the box' },

        { t: 'sub', text: 'The four metrics categories you must watch' },
        { t: 'diagram', name: 'keyMetrics', cap: 'Heap (OOM risk) · CPU (compute bottleneck) · HikariCP (DB bottleneck) · Kafka lag (worker backlog)' },

        { t: 'sub', text: 'Building a custom panel' },
        { t: 'steps', items: [
          `Click the + icon on a dashboard → Add panel.`,
          `In the Query tab, type a PromQL expression. Example: <code>rate(http_server_requests_seconds_count{application="support-platform"}[5m])</code>.`,
          `Choose a visualization type: Time series for line graphs, Stat for a single large number, Gauge for a dial.`,
          `Set the panel title, unit (bytes, milliseconds, req/s), and thresholds (green/yellow/red). Click Apply.`,
        ] },

        { t: 'sub', text: 'Useful PromQL for Grafana panels' },
        { t: 'code', title: 'Panel queries for a Spring Boot service dashboard', code:
`# PANEL: Heap memory % used  (stat or gauge — alert red at 85%)
jvm_memory_used_bytes{area="heap", application="support-platform"}
  / jvm_memory_max_bytes{area="heap", application="support-platform"} * 100

# PANEL: Request rate by endpoint  (time series)
sum by (uri) (
  rate(http_server_requests_seconds_count{application="support-platform"}[5m])
)

# PANEL: Error rate  (time series — should be near zero)
rate(http_server_requests_seconds_count{
  application="support-platform", status=~"5.."}[5m])

# PANEL: p95 latency per endpoint  (time series)
histogram_quantile(0.95,
  sum by (uri, le) (
    rate(http_server_requests_seconds_bucket{application="support-platform"}[5m])
  )
)

# PANEL: HikariCP pool utilization %  (gauge — alert at 80%)
hikaricp_connections_active{application="support-platform"}
  / hikaricp_connections_max{application="support-platform"} * 100

# PANEL: Kafka consumer lag  (time series — should not grow over time)
kafka_consumer_fetch_manager_records_lag_max{application="support-platform"}` },

        { t: 'sub', text: 'Setting up alerts in Grafana' },
        { t: 'code', title: 'Alert rule configuration (Grafana UI → Alerting → Alert rules)', code:
`# High heap memory — alert before OOM
Condition: jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} > 0.85
For: 5 minutes   (sustained, not just a spike)
Severity: warning

# DB pool exhausted — all connections in use
Condition: hikaricp_connections_active / hikaricp_connections_max > 0.9
For: 2 minutes
Severity: critical

# High error rate
Condition: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) > 0.1
For: 2 minutes   (more than 0.1 errors/sec for 2 minutes)
Severity: critical` },
        { t: 'callout', kind: 'key', html: `<strong>Always set a "for" duration on alerts.</strong> A transient JVM GC pause can spike heap briefly. An alert that fires on a 1-second blip creates alert fatigue. Require the condition to be sustained for 2–5 minutes before paging anyone.` },
      ],
    },

    /* ========================================================
       PHASE 5 — Full Implementation
       ======================================================== */
    {
      id: 'phase-5', num: '05', accent: 'cyan', part: 'Production',
      eyebrow: 'Phase 5 · Wiring It Together',
      title: 'Full Implementation',
      intro: 'Every file you need to wire up the entire stack from scratch. This phase shows the exact dependencies, properties, security configuration, Prometheus config, and Docker Compose setup — in the correct order so nothing is missing.',
      blocks: [
        { t: 'sub', text: 'The five-step setup' },
        { t: 'diagram', name: 'setupSteps', cap: 'pom.xml → application.properties → SecurityConfig → prometheus.yml → docker-compose.yml' },

        { t: 'sub', text: 'Step 1 — pom.xml dependencies' },
        { t: 'code', title: 'pom.xml — actuator + micrometer-prometheus', code:
`<dependencies>
    <!-- Core Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Metrics: Actuator (sensors) + Micrometer Prometheus (translator) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
        <!-- scope defaults to compile — no version needed with Spring BOM -->
    </dependency>
</dependencies>` },

        { t: 'sub', text: 'Step 2 — application.properties' },
        { t: 'code', title: 'application.properties — expose the prometheus endpoint', code:
`# Application identity — becomes the "application" label in Prometheus
spring.application.name=support-platform

# Server port — change per microservice (8080, 8081, 8082 ...)
server.port=8082

# Expose health + prometheus over HTTP (comma-separated)
management.endpoints.web.exposure.include=health,info,prometheus,metrics

# Show DB/Kafka sub-checks in the health response
management.endpoint.health.show-details=always

# Optional: prefix all actuator paths under /management
# management.endpoints.web.base-path=/management` },

        { t: 'sub', text: 'Step 3 — Spring Security configuration' },
        { t: 'diagram', name: 'securityBypass', cap: 'Prometheus is unauthenticated — you must explicitly permit /actuator/**' },
        { t: 'code', title: 'SecurityConfig.java — the critical permitAll rule', code:
`@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // MUST come first — Prometheus hits this without a token
                .requestMatchers("/actuator/**").permitAll()
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }
}` },
        { t: 'callout', kind: 'danger', html: `<strong>Order is everything.</strong> <code>.requestMatchers("/actuator/**").permitAll()</code> must appear <em>before</em> <code>.anyRequest().authenticated()</code>. Spring Security applies the first matching rule and stops. If <code>anyRequest</code> comes first, it catches <code>/actuator/**</code> too and returns 403.` },

        { t: 'sub', text: 'Step 4 — prometheus.yml' },
        { t: 'code', title: 'prometheus.yml — scrape targets (lives next to docker-compose.yml)', code:
`global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:

  - job_name: "support-platform"
    metrics_path: "/actuator/prometheus"
    static_configs:
      # Use the Docker Compose SERVICE NAME, not localhost
      - targets: ["support-platform:8082"]
        labels:
          application: "support-platform"

  - job_name: "auth-service"
    metrics_path: "/actuator/prometheus"
    static_configs:
      - targets: ["auth-service:8080"]
        labels:
          application: "auth-service"

  # Self-monitor Prometheus
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]` },

        { t: 'sub', text: 'Step 5 — docker-compose.yml' },
        { t: 'diagram', name: 'dockerNetwork', cap: 'All services share one bridge network — service names resolve as hostnames' },
        { t: 'code', title: 'docker-compose.yml — prometheus + grafana service blocks', code:
`version: "3.9"

services:

  # Your Spring Boot app
  support-platform:
    build: .
    ports:
      - "8082:8082"
    networks:
      - monitoring
    # IMPORTANT: app must listen on 0.0.0.0, not 127.0.0.1
    # Spring Boot does this by default

  # Prometheus — time-series database
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      # Mount your prometheus.yml into the container
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      # Persist scraped data between restarts
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.retention.time=15d"
    networks:
      - monitoring

  # Grafana — dashboard server
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    networks:
      - monitoring
    depends_on:
      - prometheus

networks:
  monitoring:
    driver: bridge

volumes:
  prometheus_data:
  grafana_data:` },

        { t: 'sub', text: 'Verifying everything works — checklist' },
        { t: 'list', items: [
          `<strong>Check the raw metrics page:</strong> <code>http://localhost:8082/actuator/prometheus</code> → should show hundreds of text lines. If you see a login page or 404, check Steps 2 and 3.`,
          `<strong>Check Prometheus targets:</strong> <code>http://localhost:9090/targets</code> → all your services should show UP. If a target shows DOWN, expand it — the error message tells you exactly what failed.`,
          `<strong>Check Prometheus data:</strong> Go to <code>localhost:9090/graph</code>, type <code>jvm_memory_used_bytes</code>, click Execute. You should see data points.`,
          `<strong>Check Grafana data source:</strong> Connections → Data Sources → Prometheus → Save &amp; Test → "Data source is working".`,
          `<strong>Check the dashboard:</strong> Import dashboard ID 4701. All panels should show data within 30 seconds.`,
        ] },
        { t: 'callout', kind: 'key', html: `<strong>You wired up the full stack.</strong> Now you can answer: Is the JVM running out of heap? Is the database connection pool full? Which endpoints are slowest? Is Kafka consumer lag growing? All from a single Grafana dashboard — without touching a log file.` },
      ],
    },
  ],
};
