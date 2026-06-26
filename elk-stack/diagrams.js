/* ============================================================
   Inline SVG diagrams for the ELK Stack guide.
   Keyed by name, referenced from content.js.
   Colors use CSS variables so they follow the theme.
   ============================================================ */
window.DIAGRAMS = {

  /* ---------- Phase 0: full ELK architecture ---------- */
  elkOverview: `
<svg viewBox="0 0 700 195" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ea" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">ELK — three tools with one job each: store, transform, visualize log data</text>

  <rect x="18" y="42" width="128" height="128" rx="10" fill="rgba(96,165,250,0.08)" stroke="var(--blue)"/>
  <text x="82" y="66" fill="var(--blue)" font-size="10.5" font-weight="700" text-anchor="middle">Spring Boot Apps</text>
  <text x="82" y="84" fill="var(--text-3)" font-size="8.5" text-anchor="middle">support-platform</text>
  <text x="82" y="98" fill="var(--text-3)" font-size="8.5" text-anchor="middle">auth-service</text>
  <text x="82" y="112" fill="var(--text-3)" font-size="8.5" text-anchor="middle">api-gateway</text>
  <text x="82" y="130" fill="var(--amber)" font-size="8" text-anchor="middle">Logback → TCP</text>
  <text x="82" y="144" fill="var(--amber)" font-size="8" text-anchor="middle">port 5000</text>
  <text x="82" y="158" fill="var(--text-3)" font-size="8" text-anchor="middle">JSON log events</text>

  <rect x="210" y="55" width="130" height="102" rx="10" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="275" y="78" fill="var(--amber)" font-size="11" font-weight="700" text-anchor="middle">Logstash</text>
  <text x="275" y="96" fill="var(--text-3)" font-size="8.5" text-anchor="middle">input: beats/tcp</text>
  <text x="275" y="110" fill="var(--text-3)" font-size="8.5" text-anchor="middle">filter: grok/mutate</text>
  <text x="275" y="124" fill="var(--text-3)" font-size="8.5" text-anchor="middle">output: elasticsearch</text>
  <text x="275" y="140" fill="var(--amber)" font-size="8" text-anchor="middle">transforms &amp; enriches</text>

  <rect x="400" y="42" width="130" height="128" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="465" y="66" fill="var(--green)" font-size="11" font-weight="700" text-anchor="middle">Elasticsearch</text>
  <text x="465" y="84" fill="var(--text-3)" font-size="8.5" text-anchor="middle">inverted index</text>
  <text x="465" y="98" fill="var(--text-3)" font-size="8.5" text-anchor="middle">stores log documents</text>
  <text x="465" y="112" fill="var(--text-3)" font-size="8.5" text-anchor="middle">REST API port 9200</text>
  <text x="465" y="128" fill="var(--text-3)" font-size="8.5" text-anchor="middle">full-text search</text>
  <text x="465" y="144" fill="var(--green)" font-size="8" text-anchor="middle">the source of truth</text>
  <text x="465" y="158" fill="var(--text-3)" font-size="8" text-anchor="middle">for all log history</text>

  <rect x="592" y="62" width="92" height="76" rx="10" fill="rgba(167,139,250,0.08)" stroke="var(--purple)"/>
  <text x="638" y="86" fill="var(--purple)" font-size="11" font-weight="700" text-anchor="middle">Kibana</text>
  <text x="638" y="104" fill="var(--text-3)" font-size="8.5" text-anchor="middle">queries ES</text>
  <text x="638" y="118" fill="var(--text-3)" font-size="8.5" text-anchor="middle">port 5601</text>

  <line x1="146" y1="106" x2="208" y2="106" stroke="var(--amber)" stroke-width="1.5" marker-end="url(#ea)"/>
  <line x1="340" y1="106" x2="398" y2="106" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#ea)"/>
  <line x1="530" y1="106" x2="590" y2="100" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#ea)"/>
  <text x="174" y="97" fill="var(--amber)" font-size="8" text-anchor="middle">push</text>
  <text x="369" y="97" fill="var(--text-3)" font-size="8" text-anchor="middle">index</text>
  <text x="561" y="97" fill="var(--text-3)" font-size="8" text-anchor="middle">query</text>
</svg>`,

  /* ---------- Phase 0: log data flow ---------- */
  logFlow: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="lf" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">A single log event's journey from your code to a Kibana search result</text>

  <rect x="18" y="44" width="108" height="52" rx="8" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="72" y="66" fill="var(--blue)" font-size="9.5" font-weight="700" text-anchor="middle">logger.error(</text>
  <text x="72" y="82" fill="var(--blue)" font-size="9.5" font-weight="700" text-anchor="middle">"Ticket fail")</text>

  <rect x="178" y="44" width="108" height="52" rx="8" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="232" y="63" fill="var(--amber)" font-size="9.5" font-weight="700" text-anchor="middle">Logback</text>
  <text x="232" y="79" fill="var(--text-3)" font-size="8" text-anchor="middle">JSON appender</text>
  <text x="232" y="91" fill="var(--text-3)" font-size="8" text-anchor="middle">TCP → port 5000</text>

  <rect x="338" y="44" width="108" height="52" rx="8" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="392" y="63" fill="var(--amber)" font-size="9.5" font-weight="700" text-anchor="middle">Logstash</text>
  <text x="392" y="79" fill="var(--text-3)" font-size="8" text-anchor="middle">parse + enrich</text>
  <text x="392" y="91" fill="var(--text-3)" font-size="8" text-anchor="middle">add @timestamp</text>

  <rect x="498" y="44" width="108" height="52" rx="8" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="552" y="63" fill="var(--green)" font-size="9.5" font-weight="700" text-anchor="middle">Elasticsearch</text>
  <text x="552" y="79" fill="var(--text-3)" font-size="8" text-anchor="middle">index document</text>
  <text x="552" y="91" fill="var(--text-3)" font-size="8" text-anchor="middle">logs-2026.06.26</text>

  <line x1="126" y1="70" x2="176" y2="70" stroke="var(--text-3)" marker-end="url(#lf)"/>
  <line x1="286" y1="70" x2="336" y2="70" stroke="var(--text-3)" marker-end="url(#lf)"/>
  <line x1="446" y1="70" x2="496" y2="70" stroke="var(--text-3)" marker-end="url(#lf)"/>

  <text x="72" y="122" fill="var(--text-3)" font-size="8" text-anchor="middle">your code</text>
  <text x="232" y="122" fill="var(--text-3)" font-size="8" text-anchor="middle">formats &amp; ships</text>
  <text x="392" y="122" fill="var(--text-3)" font-size="8" text-anchor="middle">transforms</text>
  <text x="552" y="122" fill="var(--text-3)" font-size="8" text-anchor="middle">stores &amp; indexes</text>

  <text x="350" y="150" fill="var(--text-3)" font-size="10" text-anchor="middle">Kibana queries Elasticsearch to find and visualize that document</text>
</svg>`,

  /* ---------- Phase 1: Elasticsearch index & document ---------- */
  esIndex: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">An Index holds Documents — each document is a JSON log event with typed fields</text>

  <!-- Index box -->
  <rect x="18" y="36" width="180" height="150" rx="10" fill="rgba(74,222,128,0.06)" stroke="var(--green)"/>
  <text x="108" y="58" fill="var(--green)" font-size="11" font-weight="700" text-anchor="middle">Index</text>
  <text x="108" y="74" fill="var(--amber)" font-size="9" text-anchor="middle">logs-support-platform</text>
  <text x="108" y="88" fill="var(--amber)" font-size="9" text-anchor="middle">-2026.06.26</text>
  <line x1="32" y1="96" x2="184" y2="96" stroke="var(--line-2)"/>
  <text x="108" y="112" fill="var(--text-3)" font-size="8.5" text-anchor="middle">shard 0  shard 1  shard 2</text>
  <text x="108" y="128" fill="var(--text-3)" font-size="8.5" text-anchor="middle">each shard = Lucene index</text>
  <text x="108" y="148" fill="var(--text-3)" font-size="8.5" text-anchor="middle">ILM rolls over daily</text>
  <text x="108" y="162" fill="var(--text-3)" font-size="8.5" text-anchor="middle">(or by size: 50 GB)</text>

  <!-- Document box -->
  <rect x="238" y="36" width="440" height="150" rx="10" fill="#0e1422" stroke="var(--blue)"/>
  <text x="458" y="58" fill="var(--blue)" font-size="11" font-weight="700" text-anchor="middle">Document (one log event as JSON)</text>
  <line x1="252" y1="64" x2="664" y2="64" stroke="var(--line-2)"/>
  <text x="258" y="82" fill="var(--rose)" font-size="9" font-family="monospace">"@timestamp":</text>
  <text x="400" y="82" fill="var(--green)" font-size="9" font-family="monospace">"2026-06-26T14:23:01.345Z"</text>
  <text x="258" y="98" fill="var(--rose)" font-size="9" font-family="monospace">"level":</text>
  <text x="400" y="98" fill="var(--green)" font-size="9" font-family="monospace">"ERROR"</text>
  <text x="258" y="114" fill="var(--rose)" font-size="9" font-family="monospace">"message":</text>
  <text x="400" y="114" fill="var(--green)" font-size="9" font-family="monospace">"Ticket creation failed"</text>
  <text x="258" y="130" fill="var(--rose)" font-size="9" font-family="monospace">"application":</text>
  <text x="400" y="130" fill="var(--green)" font-size="9" font-family="monospace">"support-platform"</text>
  <text x="258" y="146" fill="var(--rose)" font-size="9" font-family="monospace">"traceId":</text>
  <text x="400" y="146" fill="var(--green)" font-size="9" font-family="monospace">"abc123def456"</text>
  <text x="258" y="162" fill="var(--rose)" font-size="9" font-family="monospace">"thread":</text>
  <text x="400" y="162" fill="var(--green)" font-size="9" font-family="monospace">"http-nio-8082-exec-3"</text>
</svg>`,

  /* ---------- Phase 1: inverted index ---------- */
  invertedIndex: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ii" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Inverted index — why Elasticsearch finds "NullPointerException" in 5 ms across 10 M docs</text>

  <!-- Documents -->
  <rect x="18" y="38" width="220" height="140" rx="10" fill="rgba(96,165,250,0.06)" stroke="var(--blue)"/>
  <text x="128" y="58" fill="var(--blue)" font-size="10.5" font-weight="700" text-anchor="middle">Log Documents</text>
  <text x="32" y="78" fill="var(--text-3)" font-size="8.5">Doc 1: "Ticket creation failed NullPointerException"</text>
  <text x="32" y="96" fill="var(--text-3)" font-size="8.5">Doc 2: "User login failed invalid token"</text>
  <text x="32" y="114" fill="var(--text-3)" font-size="8.5">Doc 3: "Ticket update failed timeout"</text>
  <text x="32" y="132" fill="var(--text-3)" font-size="8.5">Doc 4: "Payment NullPointerException thrown"</text>
  <text x="32" y="150" fill="var(--text-3)" font-size="8.5">Doc 5: "Kafka consumer failed to commit"</text>

  <!-- Inverted index -->
  <rect x="290" y="38" width="240" height="140" rx="10" fill="rgba(74,222,128,0.06)" stroke="var(--green)"/>
  <text x="410" y="58" fill="var(--green)" font-size="10.5" font-weight="700" text-anchor="middle">Inverted Index (term → doc list)</text>
  <text x="306" y="78" fill="var(--amber)" font-size="9" font-family="monospace">failed</text>
  <text x="430" y="78" fill="#cdd4e1" font-size="9" font-family="monospace">→ [1, 2, 3, 5]</text>
  <text x="306" y="96" fill="var(--amber)" font-size="9" font-family="monospace">NullPointerException</text>
  <text x="430" y="96" fill="#cdd4e1" font-size="9" font-family="monospace">→ [1, 4]</text>
  <text x="306" y="114" fill="var(--amber)" font-size="9" font-family="monospace">ticket</text>
  <text x="430" y="114" fill="#cdd4e1" font-size="9" font-family="monospace">→ [1, 3]</text>
  <text x="306" y="132" fill="var(--amber)" font-size="9" font-family="monospace">login</text>
  <text x="430" y="132" fill="#cdd4e1" font-size="9" font-family="monospace">→ [2]</text>
  <text x="306" y="150" fill="var(--amber)" font-size="9" font-family="monospace">timeout</text>
  <text x="430" y="150" fill="#cdd4e1" font-size="9" font-family="monospace">→ [3]</text>

  <!-- Query result -->
  <rect x="590" y="60" width="100" height="96" rx="9" fill="rgba(251,113,133,0.08)" stroke="var(--rose)"/>
  <text x="640" y="78" fill="var(--rose)" font-size="9" font-weight="700" text-anchor="middle">Query result</text>
  <text x="640" y="92" fill="var(--text-3)" font-size="8" text-anchor="middle">search:</text>
  <text x="640" y="106" fill="var(--amber)" font-size="8" text-anchor="middle">"NullPointer"</text>
  <text x="640" y="122" fill="#cdd4e1" font-size="9" text-anchor="middle">Doc 1 ✓</text>
  <text x="640" y="138" fill="#cdd4e1" font-size="9" text-anchor="middle">Doc 4 ✓</text>

  <line x1="530" y1="106" x2="588" y2="106" stroke="var(--text-3)" marker-end="url(#ii)"/>
</svg>`,

  /* ---------- Phase 2: Logstash pipeline ---------- */
  logstashPipeline: `
<svg viewBox="0 0 700 185" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="lp" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Every Logstash pipeline has exactly three stages: input → filter → output</text>

  <rect x="18" y="42" width="185" height="120" rx="10" fill="rgba(96,165,250,0.08)" stroke="var(--blue)"/>
  <text x="110" y="64" fill="var(--blue)" font-size="12" font-weight="700" text-anchor="middle">INPUT</text>
  <text x="110" y="84" fill="var(--text-3)" font-size="8.5" text-anchor="middle">Where logs enter</text>
  <text x="32" y="104" fill="var(--text-3)" font-size="8.5">• beats { port =&gt; 5044 }</text>
  <text x="32" y="120" fill="var(--text-3)" font-size="8.5">• tcp  { port =&gt; 5000 }</text>
  <text x="32" y="136" fill="var(--text-3)" font-size="8.5">• http { port =&gt; 8080 }</text>
  <text x="32" y="152" fill="var(--text-3)" font-size="8.5">• file { path =&gt; "/var/log" }</text>

  <line x1="203" y1="102" x2="255" y2="102" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#lp)"/>

  <rect x="257" y="42" width="185" height="120" rx="10" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="349" y="64" fill="var(--amber)" font-size="12" font-weight="700" text-anchor="middle">FILTER</text>
  <text x="349" y="84" fill="var(--text-3)" font-size="8.5" text-anchor="middle">Parse, transform, enrich</text>
  <text x="271" y="104" fill="var(--text-3)" font-size="8.5">• grok    (parse plain text)</text>
  <text x="271" y="120" fill="var(--text-3)" font-size="8.5">• json    (parse JSON body)</text>
  <text x="271" y="136" fill="var(--text-3)" font-size="8.5">• mutate  (rename/add fields)</text>
  <text x="271" y="152" fill="var(--text-3)" font-size="8.5">• date    (parse timestamp)</text>

  <line x1="442" y1="102" x2="494" y2="102" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#lp)"/>

  <rect x="496" y="42" width="186" height="120" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="589" y="64" fill="var(--green)" font-size="12" font-weight="700" text-anchor="middle">OUTPUT</text>
  <text x="589" y="84" fill="var(--text-3)" font-size="8.5" text-anchor="middle">Where logs go</text>
  <text x="510" y="104" fill="var(--text-3)" font-size="8.5">• elasticsearch (primary)</text>
  <text x="510" y="120" fill="var(--text-3)" font-size="8.5">• stdout  (debug only)</text>
  <text x="510" y="136" fill="var(--text-3)" font-size="8.5">• s3      (archival)</text>
  <text x="510" y="152" fill="var(--text-3)" font-size="8.5">• kafka   (fan-out)</text>

  <text x="350" y="178" fill="var(--text-3)" font-size="9.5" text-anchor="middle">Filter is optional but almost always used — it is where the intelligence lives</text>
</svg>`,

  /* ---------- Phase 2: grok pattern ---------- */
  grokPattern: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Grok turns unstructured text into named, queryable JSON fields</text>

  <!-- Raw log line -->
  <rect x="18" y="36" width="664" height="36" rx="7" fill="#0e1422" stroke="var(--text-3)"/>
  <text x="34" y="59" fill="var(--text-3)" font-size="10" font-family="monospace">2026-06-26 14:23:01 ERROR [support-platform] TicketService - Ticket 42 creation failed</text>

  <!-- Pattern -->
  <rect x="18" y="84" width="664" height="36" rx="7" fill="rgba(251,191,36,0.06)" stroke="var(--amber)"/>
  <text x="34" y="100" fill="var(--amber)" font-size="9.5" font-family="monospace">%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level}</text>
  <text x="34" y="114" fill="var(--amber)" font-size="9.5" font-family="monospace">  [%{DATA:application}] %{DATA:class} - %{GREEDYDATA:message}</text>

  <!-- Result -->
  <rect x="18" y="132" width="664" height="36" rx="7" fill="rgba(74,222,128,0.06)" stroke="var(--green)"/>
  <text x="34" y="148" fill="var(--green)" font-size="9.5" font-family="monospace">timestamp:"2026-06-26T14:23:01"  level:"ERROR"  application:"support-platform"</text>
  <text x="34" y="164" fill="var(--green)" font-size="9.5" font-family="monospace">class:"TicketService"  message:"Ticket 42 creation failed"</text>
</svg>`,

  /* ---------- Phase 3: Kibana Discover ---------- */
  kibanaDiscover: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="18" y="22" width="664" height="168" rx="10" fill="#0e1422" stroke="var(--purple)"/>
  <rect x="18" y="22" width="664" height="30" rx="10" fill="rgba(167,139,250,0.12)"/>
  <text x="38" y="42" fill="var(--purple)" font-size="10" font-weight="700">Kibana Discover  —  logs-support-platform-*</text>
  <text x="638" y="42" fill="var(--text-3)" font-size="9" text-anchor="end">Last 15 min  ▾</text>

  <!-- Search bar -->
  <rect x="30" y="60" width="640" height="24" rx="5" fill="rgba(167,139,250,0.06)" stroke="var(--purple)" stroke-width="0.8"/>
  <text x="42" y="77" fill="var(--text-3)" font-size="9" font-family="monospace">level: "ERROR" AND application: "support-platform"</text>

  <!-- Histogram bar chart -->
  <rect x="30" y="92" width="640" height="40" rx="4" fill="rgba(167,139,250,0.04)" stroke="var(--line-2)" stroke-width="0.5"/>
  <rect x="44" y="114" width="14" height="14" rx="2" fill="var(--purple)" opacity="0.4"/>
  <rect x="64" y="120" width="14" height="8" rx="2" fill="var(--purple)" opacity="0.4"/>
  <rect x="84" y="108" width="14" height="20" rx="2" fill="var(--purple)" opacity="0.6"/>
  <rect x="104" y="96" width="14" height="32" rx="2" fill="var(--rose)" opacity="0.8"/>
  <rect x="124" y="102" width="14" height="26" rx="2" fill="var(--purple)" opacity="0.5"/>
  <rect x="144" y="118" width="14" height="10" rx="2" fill="var(--purple)" opacity="0.4"/>
  <rect x="164" y="116" width="14" height="12" rx="2" fill="var(--purple)" opacity="0.4"/>
  <text x="630" y="108" fill="var(--text-3)" font-size="8" text-anchor="end">error spike</text>

  <!-- Log rows -->
  <rect x="30" y="138" width="640" height="18" rx="3" fill="rgba(251,113,133,0.07)"/>
  <text x="42" y="151" fill="var(--rose)" font-size="8.5" font-family="monospace">14:23:01  ERROR  Ticket 42 creation failed  NullPointerException  traceId: abc123</text>
  <rect x="30" y="158" width="640" height="18" rx="3"/>
  <text x="42" y="171" fill="var(--text-3)" font-size="8.5" font-family="monospace">14:22:47  INFO   Ticket 41 created successfully in 143ms</text>
  <rect x="30" y="178" width="640" height="18" rx="3" fill="rgba(251,113,133,0.07)"/>
  <text x="42" y="191" fill="var(--rose)" font-size="8.5" font-family="monospace">14:22:31  ERROR  DB connection timeout after 30000ms  hikari pool exhausted</text>
</svg>`,

  /* ---------- Phase 3: Kibana tools overview ---------- */
  kibanaTools: `
<svg viewBox="0 0 700 195" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Kibana's four main tools — each solves a different part of the log analysis problem</text>

  <rect x="18" y="38" width="152" height="140" rx="10" fill="#0e1422" stroke="var(--purple)"/>
  <text x="94" y="62" fill="var(--purple)" font-size="11" font-weight="700" text-anchor="middle">Discover</text>
  <text x="94" y="82" fill="var(--text-3)" font-size="8.5" text-anchor="middle">raw log search</text>
  <line x1="32" y1="92" x2="156" y2="92" stroke="var(--line-2)"/>
  <text x="94" y="110" fill="#cdd4e1" font-size="8.5" text-anchor="middle">Full-text search</text>
  <text x="94" y="126" fill="#cdd4e1" font-size="8.5" text-anchor="middle">KQL filters</text>
  <text x="94" y="142" fill="#cdd4e1" font-size="8.5" text-anchor="middle">histogram timeline</text>
  <text x="94" y="162" fill="var(--purple)" font-size="8" text-anchor="middle">start investigations here</text>

  <rect x="182" y="38" width="152" height="140" rx="10" fill="#0e1422" stroke="var(--blue)"/>
  <text x="258" y="62" fill="var(--blue)" font-size="11" font-weight="700" text-anchor="middle">Visualize</text>
  <text x="258" y="82" fill="var(--text-3)" font-size="8.5" text-anchor="middle">charts &amp; graphs</text>
  <line x1="196" y1="92" x2="320" y2="92" stroke="var(--line-2)"/>
  <text x="258" y="110" fill="#cdd4e1" font-size="8.5" text-anchor="middle">Bar, line, pie</text>
  <text x="258" y="126" fill="#cdd4e1" font-size="8.5" text-anchor="middle">metric aggregations</text>
  <text x="258" y="142" fill="#cdd4e1" font-size="8.5" text-anchor="middle">data tables</text>
  <text x="258" y="162" fill="var(--blue)" font-size="8" text-anchor="middle">build charts here</text>

  <rect x="346" y="38" width="152" height="140" rx="10" fill="#0e1422" stroke="var(--green)"/>
  <text x="422" y="62" fill="var(--green)" font-size="11" font-weight="700" text-anchor="middle">Dashboard</text>
  <text x="422" y="82" fill="var(--text-3)" font-size="8.5" text-anchor="middle">combined views</text>
  <line x1="360" y1="92" x2="484" y2="92" stroke="var(--line-2)"/>
  <text x="422" y="110" fill="#cdd4e1" font-size="8.5" text-anchor="middle">Compose panels</text>
  <text x="422" y="126" fill="#cdd4e1" font-size="8.5" text-anchor="middle">time range filter</text>
  <text x="422" y="142" fill="#cdd4e1" font-size="8.5" text-anchor="middle">drill-down links</text>
  <text x="422" y="162" fill="var(--green)" font-size="8" text-anchor="middle">the NOC screen</text>

  <rect x="510" y="38" width="172" height="140" rx="10" fill="#0e1422" stroke="var(--amber)"/>
  <text x="596" y="62" fill="var(--amber)" font-size="11" font-weight="700" text-anchor="middle">Dev Tools</text>
  <text x="596" y="82" fill="var(--text-3)" font-size="8.5" text-anchor="middle">REST console</text>
  <line x1="524" y1="92" x2="668" y2="92" stroke="var(--line-2)"/>
  <text x="596" y="110" fill="#cdd4e1" font-size="8.5" text-anchor="middle">Raw ES queries</text>
  <text x="596" y="126" fill="#cdd4e1" font-size="8.5" text-anchor="middle">index management</text>
  <text x="596" y="142" fill="#cdd4e1" font-size="8.5" text-anchor="middle">mapping inspection</text>
  <text x="596" y="162" fill="var(--amber)" font-size="8" text-anchor="middle">debug + admin</text>
</svg>`,

  /* ---------- Phase 4: Spring Boot → Logstash ---------- */
  springToLogstash: `
<svg viewBox="0 0 700 175" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="sl" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Spring Boot sends structured JSON logs to Logstash via TCP — no file tailing needed</text>

  <rect x="18" y="44" width="168" height="110" rx="10" fill="rgba(96,165,250,0.08)" stroke="var(--blue)"/>
  <text x="102" y="66" fill="var(--blue)" font-size="10.5" font-weight="700" text-anchor="middle">Spring Boot</text>
  <text x="102" y="84" fill="var(--text-3)" font-size="8.5" text-anchor="middle">Logback configured</text>
  <text x="102" y="98" fill="var(--amber)" font-size="8" text-anchor="middle">LogstashEncoder</text>
  <text x="102" y="112" fill="var(--text-3)" font-size="8" text-anchor="middle">formats as JSON</text>
  <text x="102" y="128" fill="var(--text-3)" font-size="8" text-anchor="middle">LogstashTcpSocketAppender</text>
  <text x="102" y="142" fill="var(--amber)" font-size="8" text-anchor="middle">sends to logstash:5000</text>

  <rect x="266" y="55" width="168" height="88" rx="10" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="350" y="78" fill="var(--amber)" font-size="10.5" font-weight="700" text-anchor="middle">Logstash</text>
  <text x="350" y="96" fill="var(--text-3)" font-size="8.5" text-anchor="middle">input: tcp port 5000</text>
  <text x="350" y="110" fill="var(--text-3)" font-size="8.5" text-anchor="middle">filter: json codec</text>
  <text x="350" y="124" fill="var(--text-3)" font-size="8.5" text-anchor="middle">output: elasticsearch</text>

  <rect x="514" y="55" width="168" height="88" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="598" y="78" fill="var(--green)" font-size="10.5" font-weight="700" text-anchor="middle">Elasticsearch</text>
  <text x="598" y="96" fill="var(--text-3)" font-size="8.5" text-anchor="middle">index: logs-*</text>
  <text x="598" y="110" fill="var(--text-3)" font-size="8.5" text-anchor="middle">@timestamp field</text>
  <text x="598" y="124" fill="var(--text-3)" font-size="8.5" text-anchor="middle">searchable JSON docs</text>

  <line x1="186" y1="99" x2="264" y2="99" stroke="var(--amber)" stroke-width="1.5" marker-end="url(#sl)"/>
  <text x="225" y="90" fill="var(--amber)" font-size="8" text-anchor="middle">TCP JSON</text>
  <line x1="434" y1="99" x2="512" y2="99" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#sl)"/>
  <text x="473" y="90" fill="var(--text-3)" font-size="8" text-anchor="middle">HTTP bulk</text>

  <text x="350" y="165" fill="var(--text-3)" font-size="9.5" text-anchor="middle">The lognet-logstash-appender library handles connection, reconnect, and buffering</text>
</svg>`,

  /* ---------- Phase 5: Beats architecture ---------- */
  beatsArchitecture: `
<svg viewBox="0 0 700 185" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ba" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Beats are lightweight shippers — Filebeat tails log files and ships to Logstash or ES directly</text>

  <rect x="18" y="40" width="152" height="128" rx="10" fill="rgba(96,165,250,0.06)" stroke="var(--blue)"/>
  <text x="94" y="62" fill="var(--blue)" font-size="10" font-weight="700" text-anchor="middle">Hosts / Servers</text>
  <text x="94" y="82" fill="var(--text-3)" font-size="8.5" text-anchor="middle">/var/log/app.log</text>
  <text x="94" y="96" fill="var(--text-3)" font-size="8.5" text-anchor="middle">/var/log/nginx/</text>
  <text x="94" y="110" fill="var(--text-3)" font-size="8.5" text-anchor="middle">/var/log/syslog</text>
  <line x1="32" y1="122" x2="156" y2="122" stroke="var(--line-2)"/>
  <text x="94" y="140" fill="var(--amber)" font-size="8.5" text-anchor="middle">Filebeat (on each host)</text>
  <text x="94" y="154" fill="var(--text-3)" font-size="8" text-anchor="middle">tails files, buffers, ships</text>

  <rect x="230" y="52" width="140" height="104" rx="10" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="300" y="74" fill="var(--amber)" font-size="10.5" font-weight="700" text-anchor="middle">Logstash</text>
  <text x="300" y="92" fill="var(--text-3)" font-size="8.5" text-anchor="middle">input: beats :5044</text>
  <text x="300" y="106" fill="var(--text-3)" font-size="8.5" text-anchor="middle">filter: parse &amp; enrich</text>
  <text x="300" y="120" fill="var(--text-3)" font-size="8.5" text-anchor="middle">output: ES + S3</text>
  <text x="300" y="140" fill="var(--text-3)" font-size="8" text-anchor="middle">optional — can skip</text>

  <rect x="430" y="40" width="140" height="128" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="500" y="62" fill="var(--green)" font-size="10.5" font-weight="700" text-anchor="middle">Elasticsearch</text>
  <text x="500" y="82" fill="var(--text-3)" font-size="8.5" text-anchor="middle">stores + indexes</text>
  <text x="500" y="98" fill="var(--text-3)" font-size="8.5" text-anchor="middle">ILM manages</text>
  <text x="500" y="114" fill="var(--text-3)" font-size="8.5" text-anchor="middle">hot → warm → cold</text>
  <text x="500" y="130" fill="var(--text-3)" font-size="8.5" text-anchor="middle">→ delete</text>
  <text x="500" y="150" fill="var(--amber)" font-size="8" text-anchor="middle">30 day retention</text>

  <rect x="630" y="65" width="58" height="56" rx="9" fill="rgba(167,139,250,0.08)" stroke="var(--purple)"/>
  <text x="659" y="88" fill="var(--purple)" font-size="9" font-weight="700" text-anchor="middle">Kibana</text>
  <text x="659" y="104" fill="var(--text-3)" font-size="7.5" text-anchor="middle">queries</text>

  <line x1="170" y1="104" x2="228" y2="104" stroke="var(--amber)" stroke-width="1.5" marker-end="url(#ba)"/>
  <text x="199" y="95" fill="var(--amber)" font-size="8" text-anchor="middle">Beats</text>
  <line x1="370" y1="104" x2="428" y2="104" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#ba)"/>
  <line x1="570" y1="104" x2="628" y2="93" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#ba)"/>
</svg>`,

  /* ---------- Phase 5: ES cluster shards ---------- */
  esCluster: `
<svg viewBox="0 0 700 185" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Elasticsearch cluster — index splits into shards, each shard has one or more replicas</text>

  <!-- Node 1 -->
  <rect x="18" y="40" width="200" height="130" rx="10" fill="rgba(74,222,128,0.06)" stroke="var(--green)"/>
  <text x="118" y="62" fill="var(--green)" font-size="10.5" font-weight="700" text-anchor="middle">Node 1 (primary)</text>
  <rect x="30" y="74" width="82" height="36" rx="6" fill="rgba(74,222,128,0.15)" stroke="var(--green)"/>
  <text x="71" y="96" fill="var(--green)" font-size="9" text-anchor="middle">Shard 0 [P]</text>
  <rect x="122" y="74" width="82" height="36" rx="6" fill="rgba(74,222,128,0.15)" stroke="var(--green)"/>
  <text x="163" y="96" fill="var(--green)" font-size="9" text-anchor="middle">Shard 1 [P]</text>
  <rect x="30" y="118" width="82" height="36" rx="6" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="71" y="140" fill="var(--blue)" font-size="9" text-anchor="middle">Shard 2 [R]</text>
  <rect x="122" y="118" width="82" height="36" rx="6" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="163" y="140" fill="var(--blue)" font-size="9" text-anchor="middle">Shard 3 [R]</text>

  <!-- Node 2 -->
  <rect x="250" y="40" width="200" height="130" rx="10" fill="rgba(74,222,128,0.06)" stroke="var(--green)"/>
  <text x="350" y="62" fill="var(--green)" font-size="10.5" font-weight="700" text-anchor="middle">Node 2</text>
  <rect x="262" y="74" width="82" height="36" rx="6" fill="rgba(74,222,128,0.15)" stroke="var(--green)"/>
  <text x="303" y="96" fill="var(--green)" font-size="9" text-anchor="middle">Shard 2 [P]</text>
  <rect x="354" y="74" width="82" height="36" rx="6" fill="rgba(74,222,128,0.15)" stroke="var(--green)"/>
  <text x="395" y="96" fill="var(--green)" font-size="9" text-anchor="middle">Shard 3 [P]</text>
  <rect x="262" y="118" width="82" height="36" rx="6" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="303" y="140" fill="var(--blue)" font-size="9" text-anchor="middle">Shard 0 [R]</text>
  <rect x="354" y="118" width="82" height="36" rx="6" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="395" y="140" fill="var(--blue)" font-size="9" text-anchor="middle">Shard 1 [R]</text>

  <!-- Legend + note -->
  <rect x="476" y="58" width="206" height="94" rx="10" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="579" y="78" fill="#cdd4e1" font-size="9.5" text-anchor="middle">Legend</text>
  <rect x="492" y="90" width="16" height="12" rx="3" fill="rgba(74,222,128,0.3)" stroke="var(--green)"/>
  <text x="516" y="101" fill="var(--green)" font-size="8.5">[P] Primary shard</text>
  <rect x="492" y="110" width="16" height="12" rx="3" fill="rgba(96,165,250,0.2)" stroke="var(--blue)"/>
  <text x="516" y="121" fill="var(--blue)" font-size="8.5">[R] Replica shard</text>
  <text x="579" y="142" fill="var(--text-3)" font-size="8" text-anchor="middle">P and its R are never</text>
  <text x="579" y="154" fill="var(--text-3)" font-size="8" text-anchor="middle">on the same node</text>

  <text x="350" y="180" fill="var(--text-3)" font-size="9.5" text-anchor="middle">Node failure → replicas are promoted to primary — no data loss</text>
</svg>`,

};
