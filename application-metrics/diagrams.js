/* ============================================================
   Inline SVG diagrams for the Application Metrics guide.
   Keyed by name, referenced from content.js.
   Colors use CSS variables so they follow the theme.
   ============================================================ */
window.DIAGRAMS = {

  /* ---------- Phase 0: full observability stack ---------- */
  systemOverview: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
    <marker id="arramber" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--amber)"/>
    </marker>
  </defs>
  <rect x="18" y="55" width="128" height="90" rx="10" fill="rgba(96,165,250,0.08)" stroke="var(--blue)"/>
  <text x="82" y="78" fill="var(--blue)" font-size="10.5" font-weight="700" text-anchor="middle">Spring Boot App</text>
  <text x="82" y="96" fill="var(--text-3)" font-size="8.5" text-anchor="middle">Actuator (sensors)</text>
  <text x="82" y="110" fill="var(--text-3)" font-size="8.5" text-anchor="middle">Micrometer (format)</text>
  <text x="82" y="128" fill="var(--amber)" font-size="8" text-anchor="middle">/actuator/prometheus</text>

  <rect x="208" y="62" width="134" height="76" rx="10" fill="rgba(251,113,133,0.08)" stroke="var(--rose)"/>
  <text x="275" y="86" fill="var(--rose)" font-size="11" font-weight="700" text-anchor="middle">Prometheus</text>
  <text x="275" y="104" fill="var(--text-3)" font-size="8.5" text-anchor="middle">scrapes every 15 s</text>
  <text x="275" y="120" fill="var(--text-3)" font-size="8.5" text-anchor="middle">time-series database</text>

  <rect x="404" y="62" width="134" height="76" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="471" y="86" fill="var(--green)" font-size="11" font-weight="700" text-anchor="middle">Grafana</text>
  <text x="471" y="104" fill="var(--text-3)" font-size="8.5" text-anchor="middle">queries Prometheus</text>
  <text x="471" y="120" fill="var(--text-3)" font-size="8.5" text-anchor="middle">renders dashboards</text>

  <rect x="596" y="70" width="88" height="60" rx="10" fill="rgba(167,139,250,0.08)" stroke="var(--purple)"/>
  <text x="640" y="96" fill="var(--purple)" font-size="10" font-weight="700" text-anchor="middle">Browser</text>
  <text x="640" y="112" fill="var(--text-3)" font-size="8" text-anchor="middle">:3000</text>

  <line x1="146" y1="100" x2="206" y2="100" stroke="var(--amber)" stroke-width="1.5" marker-end="url(#arramber)"/>
  <text x="176" y="91" fill="var(--amber)" font-size="8" text-anchor="middle">PULL</text>
  <line x1="342" y1="100" x2="402" y2="100" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="372" y="91" fill="var(--text-3)" font-size="8" text-anchor="middle">PromQL</text>
  <line x1="538" y1="100" x2="594" y2="100" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr)"/>

  <text x="350" y="170" fill="var(--text-3)" font-size="10" text-anchor="middle">Prometheus actively pulls from your app — your app never pushes to Prometheus</text>
</svg>`,

  /* ---------- Phase 0: data flow step-by-step ---------- */
  dataFlow: `
<svg viewBox="0 0 700 175" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="df" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Pull-based: Prometheus knocks every 15 s, reads a text page, saves the numbers</text>

  <rect x="20" y="44" width="118" height="44" rx="8" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="79" y="66" fill="var(--blue)" font-size="9.5" font-weight="700" text-anchor="middle">Your App</text>
  <text x="79" y="80" fill="var(--text-3)" font-size="8" text-anchor="middle">generates traffic</text>

  <rect x="192" y="44" width="118" height="44" rx="8" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="251" y="66" fill="var(--amber)" font-size="9.5" font-weight="700" text-anchor="middle">Actuator</text>
  <text x="251" y="80" fill="var(--text-3)" font-size="8" text-anchor="middle">records changes</text>

  <rect x="364" y="44" width="118" height="44" rx="8" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="423" y="62" fill="var(--rose)" font-size="9.5" font-weight="700" text-anchor="middle">Micrometer</text>
  <text x="423" y="76" fill="var(--text-3)" font-size="8" text-anchor="middle">formats as flat text</text>
  <text x="423" y="88" fill="var(--text-3)" font-size="7.5" text-anchor="middle">Prometheus exposition fmt</text>

  <rect x="536" y="44" width="140" height="44" rx="8" fill="rgba(251,113,133,0.08)" stroke="var(--rose)"/>
  <text x="606" y="66" fill="var(--rose)" font-size="9.5" font-weight="700" text-anchor="middle">Prometheus</text>
  <text x="606" y="80" fill="var(--text-3)" font-size="8" text-anchor="middle">scrapes + stores</text>

  <line x1="138" y1="66" x2="190" y2="66" stroke="var(--text-3)" marker-end="url(#df)"/>
  <line x1="310" y1="66" x2="362" y2="66" stroke="var(--text-3)" marker-end="url(#df)"/>
  <line x1="482" y1="66" x2="534" y2="66" stroke="var(--amber)" stroke-dasharray="3 2" marker-end="url(#df)"/>
  <text x="508" y="57" fill="var(--amber)" font-size="8" text-anchor="middle">GET every 15s</text>

  <text x="79" y="120" fill="var(--text-3)" font-size="8.5" text-anchor="middle">step 1</text>
  <text x="251" y="120" fill="var(--text-3)" font-size="8.5" text-anchor="middle">step 2</text>
  <text x="423" y="120" fill="var(--text-3)" font-size="8.5" text-anchor="middle">step 3</text>
  <text x="606" y="120" fill="var(--text-3)" font-size="8.5" text-anchor="middle">step 4</text>

  <text x="350" y="155" fill="var(--text-3)" font-size="10" text-anchor="middle">Grafana then asks Prometheus for those stored numbers to draw line graphs</text>
</svg>`,

  /* ---------- Phase 1: Actuator endpoints ---------- */
  actuatorEndpoints: `
<svg viewBox="0 0 700 215" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ae" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Actuator plugs sensors into the JVM and exposes them as HTTP endpoints</text>

  <rect x="20" y="40" width="120" height="155" rx="10" fill="rgba(96,165,250,0.06)" stroke="var(--blue)"/>
  <text x="80" y="62" fill="var(--blue)" font-size="10" font-weight="700" text-anchor="middle">JVM</text>
  <text x="80" y="80" fill="var(--text-3)" font-size="8" text-anchor="middle">heap memory</text>
  <text x="80" y="94" fill="var(--text-3)" font-size="8" text-anchor="middle">CPU usage</text>
  <text x="80" y="108" fill="var(--text-3)" font-size="8" text-anchor="middle">thread count</text>
  <text x="80" y="122" fill="var(--text-3)" font-size="8" text-anchor="middle">GC pause time</text>
  <text x="80" y="136" fill="var(--text-3)" font-size="8" text-anchor="middle">DB connections</text>
  <text x="80" y="150" fill="var(--text-3)" font-size="8" text-anchor="middle">HTTP requests</text>
  <text x="80" y="164" fill="var(--text-3)" font-size="8" text-anchor="middle">Kafka consumer lag</text>

  <rect x="220" y="40" width="160" height="26" rx="6" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <text x="300" y="58" fill="var(--green)" font-size="9.5" text-anchor="middle">/actuator/health</text>

  <rect x="220" y="74" width="160" height="26" rx="6" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="300" y="92" fill="var(--purple)" font-size="9.5" text-anchor="middle">/actuator/metrics</text>

  <rect x="220" y="108" width="160" height="26" rx="6" fill="rgba(251,113,133,0.12)" stroke="var(--rose)"/>
  <text x="300" y="126" fill="var(--rose)" font-size="9.5" text-anchor="middle">/actuator/prometheus ★</text>

  <rect x="220" y="142" width="160" height="26" rx="6" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="300" y="160" fill="var(--amber)" font-size="9.5" text-anchor="middle">/actuator/info</text>

  <rect x="220" y="176" width="160" height="26" rx="6" fill="rgba(45,212,191,0.1)" stroke="var(--teal)"/>
  <text x="300" y="194" fill="var(--teal)" font-size="9.5" text-anchor="middle">/actuator/env</text>

  <line x1="140" y1="120" x2="218" y2="120" stroke="var(--text-3)" marker-end="url(#ae)"/>

  <text x="430" y="58" fill="var(--text-3)" font-size="8.5">UP / DOWN, liveness probe</text>
  <text x="430" y="92" fill="var(--text-3)" font-size="8.5">list &amp; query individual meters</text>
  <text x="430" y="126" fill="var(--rose)" font-size="8.5">Prometheus text format — the key one</text>
  <text x="430" y="160" fill="var(--text-3)" font-size="8.5">app name, version, git SHA</text>
  <text x="430" y="194" fill="var(--text-3)" font-size="8.5">config properties (careful in prod)</text>

  <text x="350" y="210" fill="var(--rose)" font-size="9" text-anchor="middle">★ Prometheus scrapes only this endpoint — Micrometer writes to it</text>
</svg>`,

  /* ---------- Phase 2: Micrometer metric types ---------- */
  micrometerTypes: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Four core primitives — Counter, Gauge, Timer, Distribution Summary</text>

  <rect x="20" y="38" width="152" height="140" rx="11" fill="#0e1422" stroke="var(--rose)"/>
  <text x="96" y="64" fill="var(--rose)" font-size="13" font-weight="700" text-anchor="middle">Counter</text>
  <text x="96" y="86" fill="#cdd4e1" font-size="9" text-anchor="middle">only goes up</text>
  <line x1="36" y1="98" x2="156" y2="98" stroke="var(--line-2)"/>
  <text x="96" y="116" fill="var(--text-3)" font-size="8.5" text-anchor="middle">HTTP total requests</text>
  <text x="96" y="132" fill="var(--text-3)" font-size="8.5" text-anchor="middle">errors, events</text>
  <text x="96" y="158" fill="var(--rose)" font-size="9" text-anchor="middle">rate(counter[5m])</text>
  <text x="96" y="172" fill="var(--text-3)" font-size="8" text-anchor="middle">per-second rate</text>

  <rect x="183" y="38" width="152" height="140" rx="11" fill="#0e1422" stroke="var(--blue)"/>
  <text x="259" y="64" fill="var(--blue)" font-size="13" font-weight="700" text-anchor="middle">Gauge</text>
  <text x="259" y="86" fill="#cdd4e1" font-size="9" text-anchor="middle">goes up &amp; down</text>
  <line x1="199" y1="98" x2="319" y2="98" stroke="var(--line-2)"/>
  <text x="259" y="116" fill="var(--text-3)" font-size="8.5" text-anchor="middle">active DB connections</text>
  <text x="259" y="132" fill="var(--text-3)" font-size="8.5" text-anchor="middle">heap used, threads</text>
  <text x="259" y="158" fill="var(--blue)" font-size="9" text-anchor="middle">read directly</text>
  <text x="259" y="172" fill="var(--text-3)" font-size="8" text-anchor="middle">point-in-time</text>

  <rect x="346" y="38" width="152" height="140" rx="11" fill="#0e1422" stroke="var(--green)"/>
  <text x="422" y="64" fill="var(--green)" font-size="13" font-weight="700" text-anchor="middle">Timer</text>
  <text x="422" y="86" fill="#cdd4e1" font-size="9" text-anchor="middle">duration + count</text>
  <line x1="362" y1="98" x2="482" y2="98" stroke="var(--line-2)"/>
  <text x="422" y="116" fill="var(--text-3)" font-size="8.5" text-anchor="middle">HTTP response time</text>
  <text x="422" y="132" fill="var(--text-3)" font-size="8.5" text-anchor="middle">method execution</text>
  <text x="422" y="158" fill="var(--green)" font-size="9" text-anchor="middle">avg, p95, p99</text>
  <text x="422" y="172" fill="var(--text-3)" font-size="8" text-anchor="middle">histogram_quantile</text>

  <rect x="509" y="38" width="172" height="140" rx="11" fill="#0e1422" stroke="var(--amber)"/>
  <text x="595" y="57" fill="var(--amber)" font-size="11.5" font-weight="700" text-anchor="middle">Distribution</text>
  <text x="595" y="73" fill="var(--amber)" font-size="11.5" font-weight="700" text-anchor="middle">Summary</text>
  <text x="595" y="92" fill="#cdd4e1" font-size="9" text-anchor="middle">non-time values</text>
  <line x1="525" y1="102" x2="665" y2="102" stroke="var(--line-2)"/>
  <text x="595" y="120" fill="var(--text-3)" font-size="8.5" text-anchor="middle">payload byte sizes</text>
  <text x="595" y="136" fill="var(--text-3)" font-size="8.5" text-anchor="middle">queue depths</text>
  <text x="595" y="158" fill="var(--amber)" font-size="9" text-anchor="middle">percentile buckets</text>
  <text x="595" y="172" fill="var(--text-3)" font-size="8" text-anchor="middle">distribution histogram</text>
</svg>`,

  /* ---------- Phase 2: Micrometer as a facade ---------- */
  micrometerFacade: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="mf" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Micrometer is a vendor-neutral facade — write once, swap the backend without changing your code</text>

  <rect x="20" y="45" width="140" height="95" rx="10" fill="rgba(96,165,250,0.08)" stroke="var(--blue)"/>
  <text x="90" y="68" fill="var(--blue)" font-size="10.5" font-weight="700" text-anchor="middle">Your Java Code</text>
  <text x="90" y="90" fill="#cdd4e1" font-size="8.5" text-anchor="middle">Counter.builder()</text>
  <text x="90" y="106" fill="#cdd4e1" font-size="8.5" text-anchor="middle">Timer.builder()</text>
  <text x="90" y="122" fill="#cdd4e1" font-size="8.5" text-anchor="middle">Gauge.builder()</text>

  <rect x="246" y="52" width="140" height="80" rx="10" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="316" y="76" fill="var(--amber)" font-size="10.5" font-weight="700" text-anchor="middle">Micrometer</text>
  <text x="316" y="96" fill="var(--text-3)" font-size="8.5" text-anchor="middle">MeterRegistry</text>
  <text x="316" y="112" fill="var(--text-3)" font-size="8.5" text-anchor="middle">tags / dimensions</text>

  <rect x="472" y="38" width="210" height="116" rx="10" fill="rgba(74,222,128,0.06)" stroke="var(--green)"/>
  <text x="577" y="60" fill="var(--green)" font-size="9.5" font-weight="700" text-anchor="middle">Registry Backends</text>
  <text x="577" y="80" fill="var(--rose)" font-size="9" text-anchor="middle">PrometheusMeterRegistry</text>
  <text x="577" y="98" fill="var(--text-3)" font-size="9" text-anchor="middle">DatadogMeterRegistry</text>
  <text x="577" y="116" fill="var(--text-3)" font-size="9" text-anchor="middle">InfluxMeterRegistry</text>
  <text x="577" y="134" fill="var(--text-3)" font-size="9" text-anchor="middle">CloudWatchMeterRegistry</text>

  <line x1="160" y1="92" x2="244" y2="92" stroke="var(--text-3)" marker-end="url(#mf)"/>
  <line x1="386" y1="92" x2="470" y2="92" stroke="var(--text-3)" marker-end="url(#mf)"/>
</svg>`,

  /* ---------- Phase 3: Prometheus scrape targets ---------- */
  prometheusTargets: `
<svg viewBox="0 0 700 195" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="pt" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--amber)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">prometheus.yml lists targets — Prometheus scrapes each one every 15 seconds</text>

  <rect x="18" y="40" width="170" height="140" rx="10" fill="rgba(251,113,133,0.06)" stroke="var(--rose)"/>
  <text x="103" y="62" fill="var(--rose)" font-size="11" font-weight="700" text-anchor="middle">Prometheus</text>
  <text x="103" y="80" fill="var(--text-3)" font-size="8.5" text-anchor="middle">scrape_interval: 15s</text>
  <rect x="32" y="92" width="140" height="20" rx="4" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="102" y="106" fill="var(--amber)" font-size="8.5" text-anchor="middle">support-platform:8082</text>
  <rect x="32" y="118" width="140" height="20" rx="4" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="102" y="132" fill="var(--amber)" font-size="8.5" text-anchor="middle">auth-service:8080</text>
  <rect x="32" y="144" width="140" height="20" rx="4" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="102" y="158" fill="var(--amber)" font-size="8.5" text-anchor="middle">api-gateway:8081</text>

  <line x1="188" y1="102" x2="270" y2="72" stroke="var(--amber)" stroke-dasharray="3 2" marker-end="url(#pt)"/>
  <line x1="188" y1="128" x2="270" y2="128" stroke="var(--amber)" stroke-dasharray="3 2" marker-end="url(#pt)"/>
  <line x1="188" y1="154" x2="270" y2="170" stroke="var(--amber)" stroke-dasharray="3 2" marker-end="url(#pt)"/>

  <rect x="272" y="48" width="148" height="52" rx="8" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="346" y="70" fill="var(--blue)" font-size="9.5" font-weight="700" text-anchor="middle">support-platform</text>
  <text x="346" y="86" fill="var(--text-3)" font-size="8" text-anchor="middle">/actuator/prometheus</text>
  <text x="346" y="98" fill="var(--green)" font-size="8" text-anchor="middle">✓ UP</text>

  <rect x="272" y="112" width="148" height="32" rx="8" fill="rgba(96,165,250,0.08)" stroke="var(--blue)"/>
  <text x="346" y="132" fill="var(--blue)" font-size="9.5" text-anchor="middle">auth-service  ✓ UP</text>

  <rect x="272" y="158" width="148" height="32" rx="8" fill="rgba(251,113,133,0.08)" stroke="var(--rose)"/>
  <text x="346" y="178" fill="var(--rose)" font-size="9.5" text-anchor="middle">api-gateway  ✗ DOWN</text>

  <text x="548" y="65" fill="var(--text-3)" font-size="8.5">Check all targets at:</text>
  <text x="548" y="80" fill="var(--amber)" font-size="8.5">localhost:9090/targets</text>
  <text x="548" y="105" fill="var(--rose)" font-size="8.5">Most common DOWN reason:</text>
  <text x="548" y="120" fill="var(--rose)" font-size="8.5">Spring Security 403</text>
  <text x="548" y="148" fill="var(--text-3)" font-size="8.5">Fix: permitAll on</text>
  <text x="548" y="163" fill="var(--text-3)" font-size="8.5">/actuator/**</text>
</svg>`,

  /* ---------- Phase 3: PromQL anatomy ---------- */
  promqlAnatomy: `
<svg viewBox="0 0 700 175" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">PromQL anatomy — function( metric_name{label="filter"} [range] )</text>

  <rect x="18" y="38" width="664" height="44" rx="8" fill="#0e1422" stroke="var(--amber)"/>
  <text x="38" y="66" fill="var(--rose)" font-size="14" font-family="monospace">rate(</text>
  <text x="100" y="66" fill="var(--green)" font-size="14" font-family="monospace">http_server_requests_seconds_count</text>
  <text x="456" y="66" fill="var(--blue)" font-size="14" font-family="monospace">{status="200"}</text>
  <text x="592" y="66" fill="var(--amber)" font-size="14" font-family="monospace">[5m])</text>

  <line x1="67" y1="82" x2="67" y2="108" stroke="var(--rose)" stroke-dasharray="2 2"/>
  <text x="67" y="122" fill="var(--rose)" font-size="9" text-anchor="middle">function</text>
  <text x="67" y="136" fill="var(--text-3)" font-size="8" text-anchor="middle">per-sec rate</text>

  <line x1="285" y1="82" x2="285" y2="108" stroke="var(--green)" stroke-dasharray="2 2"/>
  <text x="285" y="122" fill="var(--green)" font-size="9" text-anchor="middle">metric name</text>
  <text x="285" y="136" fill="var(--text-3)" font-size="8" text-anchor="middle">auto-named by Micrometer</text>

  <line x1="515" y1="82" x2="515" y2="108" stroke="var(--blue)" stroke-dasharray="2 2"/>
  <text x="515" y="122" fill="var(--blue)" font-size="9" text-anchor="middle">label filter</text>
  <text x="515" y="136" fill="var(--text-3)" font-size="8" text-anchor="middle">only 200 OK responses</text>

  <line x1="618" y1="82" x2="618" y2="108" stroke="var(--amber)" stroke-dasharray="2 2"/>
  <text x="618" y="122" fill="var(--amber)" font-size="9" text-anchor="middle">range</text>
  <text x="618" y="136" fill="var(--text-3)" font-size="8" text-anchor="middle">5-minute window</text>

  <text x="350" y="165" fill="var(--text-3)" font-size="9.5" text-anchor="middle">rate() converts a monotonic counter into a per-second rate — the most useful pattern</text>
</svg>`,

  /* ---------- Phase 4: Grafana dashboard mockup ---------- */
  grafanaDashboard: `
<svg viewBox="0 0 700 195" xmlns="http://www.w3.org/2000/svg">
  <rect x="18" y="28" width="664" height="158" rx="10" fill="#0e1422" stroke="var(--green)"/>
  <rect x="18" y="28" width="664" height="28" rx="10" fill="rgba(74,222,128,0.1)"/>
  <text x="38" y="47" fill="var(--green)" font-size="10" font-weight="700">JVM / Spring Boot Overview  —  id: 4701</text>
  <text x="640" y="47" fill="var(--text-3)" font-size="9" text-anchor="end">Last 1h  ▾</text>

  <rect x="30" y="66" width="195" height="105" rx="7" fill="rgba(96,165,250,0.07)" stroke="var(--blue)" stroke-width="0.8"/>
  <text x="127" y="84" fill="var(--blue)" font-size="9" text-anchor="middle">JVM Heap Used</text>
  <text x="127" y="116" fill="var(--blue)" font-size="24" font-weight="700" text-anchor="middle">342 MB</text>
  <text x="127" y="136" fill="var(--text-3)" font-size="8.5" text-anchor="middle">of 512 MB max</text>
  <rect x="42" y="148" width="170" height="10" rx="4" fill="rgba(96,165,250,0.12)"/>
  <rect x="42" y="148" width="113" height="10" rx="4" fill="var(--blue)"/>

  <rect x="240" y="66" width="200" height="105" rx="7" fill="rgba(251,113,133,0.07)" stroke="var(--rose)" stroke-width="0.8"/>
  <text x="340" y="84" fill="var(--rose)" font-size="9" text-anchor="middle">HTTP Request Rate  (req/s)</text>
  <polyline points="252,155 272,130 292,142 312,112 332,125 352,105 372,118 388,108 428,122" fill="none" stroke="var(--rose)" stroke-width="1.5"/>

  <rect x="456" y="66" width="214" height="105" rx="7" fill="rgba(251,191,36,0.07)" stroke="var(--amber)" stroke-width="0.8"/>
  <text x="563" y="84" fill="var(--amber)" font-size="9" text-anchor="middle">HikariCP Active Connections</text>
  <text x="563" y="118" fill="var(--amber)" font-size="24" font-weight="700" text-anchor="middle">7 / 10</text>
  <text x="563" y="138" fill="var(--text-3)" font-size="8.5" text-anchor="middle">pool max = 10  (warning at 8)</text>
  <rect x="468" y="150" width="190" height="10" rx="4" fill="rgba(251,191,36,0.12)"/>
  <rect x="468" y="150" width="133" height="10" rx="4" fill="var(--amber)"/>
</svg>`,

  /* ---------- Phase 4: key metrics to watch ---------- */
  keyMetrics: `
<svg viewBox="0 0 700 195" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Four metric categories every Spring Boot dashboard must have</text>

  <rect x="18" y="38" width="152" height="140" rx="10" fill="#0e1422" stroke="var(--blue)"/>
  <text x="94" y="62" fill="var(--blue)" font-size="11" font-weight="700" text-anchor="middle">JVM Heap</text>
  <text x="94" y="82" fill="var(--text-3)" font-size="8.5" text-anchor="middle">jvm_memory_used_bytes</text>
  <line x1="32" y1="94" x2="156" y2="94" stroke="var(--line-2)"/>
  <text x="94" y="114" fill="#cdd4e1" font-size="8.5" text-anchor="middle">Is your app about to</text>
  <text x="94" y="130" fill="#cdd4e1" font-size="8.5" text-anchor="middle">run out of RAM</text>
  <text x="94" y="146" fill="#cdd4e1" font-size="8.5" text-anchor="middle">and crash?</text>
  <text x="94" y="168" fill="var(--blue)" font-size="8" text-anchor="middle">alert if &gt; 85% max</text>

  <rect x="182" y="38" width="152" height="140" rx="10" fill="#0e1422" stroke="var(--rose)"/>
  <text x="258" y="62" fill="var(--rose)" font-size="11" font-weight="700" text-anchor="middle">CPU Usage</text>
  <text x="258" y="82" fill="var(--text-3)" font-size="8.5" text-anchor="middle">process_cpu_usage</text>
  <line x1="196" y1="94" x2="320" y2="94" stroke="var(--line-2)"/>
  <text x="258" y="114" fill="#cdd4e1" font-size="8.5" text-anchor="middle">Is a bad database</text>
  <text x="258" y="130" fill="#cdd4e1" font-size="8.5" text-anchor="middle">query maxing out</text>
  <text x="258" y="146" fill="#cdd4e1" font-size="8.5" text-anchor="middle">a processor core?</text>
  <text x="258" y="168" fill="var(--rose)" font-size="8" text-anchor="middle">alert if &gt; 80% sustained</text>

  <rect x="346" y="38" width="152" height="140" rx="10" fill="#0e1422" stroke="var(--amber)"/>
  <text x="422" y="62" fill="var(--amber)" font-size="11" font-weight="700" text-anchor="middle">HikariCP Pool</text>
  <text x="422" y="82" fill="var(--text-3)" font-size="8" text-anchor="middle">hikaricp_connections_active</text>
  <line x1="360" y1="94" x2="484" y2="94" stroke="var(--line-2)"/>
  <text x="422" y="114" fill="#cdd4e1" font-size="8.5" text-anchor="middle">Are all DB connections</text>
  <text x="422" y="130" fill="#cdd4e1" font-size="8.5" text-anchor="middle">in use, leaving new</text>
  <text x="422" y="146" fill="#cdd4e1" font-size="8.5" text-anchor="middle">users waiting?</text>
  <text x="422" y="168" fill="var(--amber)" font-size="8" text-anchor="middle">alert if active = max</text>

  <rect x="510" y="38" width="172" height="140" rx="10" fill="#0e1422" stroke="var(--green)"/>
  <text x="596" y="62" fill="var(--green)" font-size="11" font-weight="700" text-anchor="middle">Kafka Lag</text>
  <text x="596" y="82" fill="var(--text-3)" font-size="8" text-anchor="middle">kafka_consumer_lag</text>
  <line x1="524" y1="94" x2="668" y2="94" stroke="var(--line-2)"/>
  <text x="596" y="114" fill="#cdd4e1" font-size="8.5" text-anchor="middle">Are background workers</text>
  <text x="596" y="130" fill="#cdd4e1" font-size="8.5" text-anchor="middle">falling behind the</text>
  <text x="596" y="146" fill="#cdd4e1" font-size="8.5" text-anchor="middle">incoming event queue?</text>
  <text x="596" y="168" fill="var(--green)" font-size="8" text-anchor="middle">alert if growing over time</text>
</svg>`,

  /* ---------- Phase 5: Spring Security bypass ---------- */
  securityBypass: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="sb" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
    <marker id="sbr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--rose)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Prometheus scrapes unauthenticated — whitelist /actuator/** in Spring Security or get 403</text>

  <rect x="18" y="52" width="120" height="44" rx="8" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="78" y="79" fill="var(--rose)" font-size="10.5" text-anchor="middle">Prometheus</text>

  <rect x="222" y="36" width="210" height="76" rx="8" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="327" y="58" fill="var(--amber)" font-size="10" font-weight="700" text-anchor="middle">Spring Security Filter</text>
  <text x="327" y="76" fill="var(--rose)" font-size="8.5" text-anchor="middle">without config → 403 Forbidden</text>
  <text x="327" y="92" fill="var(--green)" font-size="8.5" text-anchor="middle">with permitAll → 200 OK ✓</text>
  <text x="327" y="106" fill="var(--text-3)" font-size="7.5" text-anchor="middle">target shows DOWN in Prometheus UI</text>

  <rect x="528" y="52" width="154" height="44" rx="8" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="605" y="72" fill="var(--green)" font-size="9" font-weight="700" text-anchor="middle">/actuator/prometheus</text>
  <text x="605" y="88" fill="var(--text-3)" font-size="8" text-anchor="middle">flat-text metrics page</text>

  <line x1="138" y1="74" x2="220" y2="74" stroke="var(--text-3)" marker-end="url(#sb)"/>
  <line x1="432" y1="74" x2="526" y2="74" stroke="var(--green)" marker-end="url(#sb)"/>

  <text x="350" y="140" fill="var(--text-3)" font-size="9" text-anchor="middle">.requestMatchers("/actuator/**").permitAll()  must come BEFORE .anyRequest().authenticated()</text>
  <text x="350" y="158" fill="var(--rose)" font-size="9" text-anchor="middle">Order matters — first matching rule wins in Spring Security</text>
</svg>`,

  /* ---------- Phase 5: Docker network ---------- */
  dockerNetwork: `
<svg viewBox="0 0 700 195" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="dn" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--amber)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">All containers share one Docker bridge network — reference by service name, not IP</text>

  <rect x="18" y="35" width="664" height="142" rx="12" fill="rgba(96,165,250,0.04)" stroke="var(--blue)" stroke-dasharray="5 3"/>
  <text x="38" y="53" fill="var(--blue)" font-size="9">Docker bridge network: monitoring</text>

  <rect x="34" y="62" width="148" height="102" rx="9" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="108" y="82" fill="var(--blue)" font-size="9.5" font-weight="700" text-anchor="middle">support-platform</text>
  <text x="108" y="98" fill="var(--text-3)" font-size="8" text-anchor="middle">port 8082 (host)</text>
  <text x="108" y="116" fill="var(--text-3)" font-size="7.5" text-anchor="middle">MUST bind to 0.0.0.0</text>
  <text x="108" y="130" fill="var(--text-3)" font-size="7.5" text-anchor="middle">(not 127.0.0.1)</text>
  <text x="108" y="148" fill="var(--amber)" font-size="7.5" text-anchor="middle">or be in same network</text>

  <rect x="204" y="62" width="148" height="102" rx="9" fill="rgba(251,113,133,0.08)" stroke="var(--rose)"/>
  <text x="278" y="82" fill="var(--rose)" font-size="9.5" font-weight="700" text-anchor="middle">prometheus</text>
  <text x="278" y="98" fill="var(--text-3)" font-size="8" text-anchor="middle">port 9090</text>
  <text x="278" y="116" fill="var(--text-3)" font-size="7.5" text-anchor="middle">targets:</text>
  <text x="278" y="130" fill="var(--amber)" font-size="7.5" text-anchor="middle">support-platform:8082</text>
  <text x="278" y="144" fill="var(--rose)" font-size="7.5" text-anchor="middle">not localhost:8082!</text>

  <rect x="374" y="62" width="148" height="102" rx="9" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="448" y="82" fill="var(--green)" font-size="9.5" font-weight="700" text-anchor="middle">grafana</text>
  <text x="448" y="98" fill="var(--text-3)" font-size="8" text-anchor="middle">port 3000</text>
  <text x="448" y="116" fill="var(--text-3)" font-size="7.5" text-anchor="middle">data source URL:</text>
  <text x="448" y="130" fill="var(--amber)" font-size="7.5" text-anchor="middle">http://prometheus:9090</text>
  <text x="448" y="144" fill="var(--text-3)" font-size="7.5" text-anchor="middle">(service name, not IP)</text>

  <rect x="544" y="78" width="120" height="70" rx="9" fill="rgba(167,139,250,0.08)" stroke="var(--purple)"/>
  <text x="604" y="98" fill="var(--purple)" font-size="9.5" font-weight="700" text-anchor="middle">postgres</text>
  <text x="604" y="114" fill="var(--purple)" font-size="9.5" font-weight="700" text-anchor="middle">+ kafka</text>
  <text x="604" y="132" fill="var(--text-3)" font-size="7.5" text-anchor="middle">also on network</text>

  <line x1="182" y1="113" x2="202" y2="113" stroke="var(--amber)" stroke-dasharray="3 2" marker-end="url(#dn)"/>
  <line x1="352" y1="113" x2="372" y2="113" stroke="var(--text-3)" stroke-dasharray="3 2" marker-end="url(#dn)"/>
</svg>`,

  /* ---------- Phase 5: setup steps ---------- */
  setupSteps: `
<svg viewBox="0 0 700 165" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ss" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--green)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">5 steps to wire up the complete metrics stack from scratch</text>

  <rect x="18" y="38" width="120" height="112" rx="9" fill="rgba(167,139,250,0.08)" stroke="var(--purple)"/>
  <text x="78" y="60" fill="var(--purple)" font-size="18" font-weight="700" text-anchor="middle">01</text>
  <text x="78" y="80" fill="#cdd4e1" font-size="8.5" text-anchor="middle">pom.xml</text>
  <line x1="30" y1="90" x2="126" y2="90" stroke="var(--line-2)"/>
  <text x="78" y="108" fill="var(--text-3)" font-size="8" text-anchor="middle">Add Actuator +</text>
  <text x="78" y="122" fill="var(--text-3)" font-size="8" text-anchor="middle">Micrometer deps</text>

  <rect x="158" y="38" width="120" height="112" rx="9" fill="rgba(96,165,250,0.08)" stroke="var(--blue)"/>
  <text x="218" y="60" fill="var(--blue)" font-size="18" font-weight="700" text-anchor="middle">02</text>
  <text x="218" y="80" fill="#cdd4e1" font-size="8.5" text-anchor="middle">application.properties</text>
  <line x1="170" y1="90" x2="266" y2="90" stroke="var(--line-2)"/>
  <text x="218" y="108" fill="var(--text-3)" font-size="8" text-anchor="middle">Expose /actuator</text>
  <text x="218" y="122" fill="var(--text-3)" font-size="8" text-anchor="middle">/prometheus</text>

  <rect x="298" y="38" width="120" height="112" rx="9" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="358" y="60" fill="var(--amber)" font-size="18" font-weight="700" text-anchor="middle">03</text>
  <text x="358" y="80" fill="#cdd4e1" font-size="8.5" text-anchor="middle">SecurityConfig.java</text>
  <line x1="310" y1="90" x2="406" y2="90" stroke="var(--line-2)"/>
  <text x="358" y="108" fill="var(--text-3)" font-size="8" text-anchor="middle">permitAll for</text>
  <text x="358" y="122" fill="var(--text-3)" font-size="8" text-anchor="middle">/actuator/**</text>

  <rect x="438" y="38" width="120" height="112" rx="9" fill="rgba(251,113,133,0.08)" stroke="var(--rose)"/>
  <text x="498" y="60" fill="var(--rose)" font-size="18" font-weight="700" text-anchor="middle">04</text>
  <text x="498" y="80" fill="#cdd4e1" font-size="8.5" text-anchor="middle">prometheus.yml</text>
  <line x1="450" y1="90" x2="546" y2="90" stroke="var(--line-2)"/>
  <text x="498" y="108" fill="var(--text-3)" font-size="8" text-anchor="middle">List your app</text>
  <text x="498" y="122" fill="var(--text-3)" font-size="8" text-anchor="middle">targets</text>

  <rect x="578" y="38" width="104" height="112" rx="9" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="630" y="60" fill="var(--green)" font-size="18" font-weight="700" text-anchor="middle">05</text>
  <text x="630" y="80" fill="#cdd4e1" font-size="8.5" text-anchor="middle">docker-compose</text>
  <line x1="590" y1="90" x2="670" y2="90" stroke="var(--line-2)"/>
  <text x="630" y="108" fill="var(--text-3)" font-size="8" text-anchor="middle">Prometheus +</text>
  <text x="630" y="122" fill="var(--text-3)" font-size="8" text-anchor="middle">Grafana up</text>

  <line x1="138" y1="94" x2="156" y2="94" stroke="var(--green)" marker-end="url(#ss)"/>
  <line x1="278" y1="94" x2="296" y2="94" stroke="var(--green)" marker-end="url(#ss)"/>
  <line x1="418" y1="94" x2="436" y2="94" stroke="var(--green)" marker-end="url(#ss)"/>
  <line x1="558" y1="94" x2="576" y2="94" stroke="var(--green)" marker-end="url(#ss)"/>
</svg>`,

};
