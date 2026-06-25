/* ============================================================
   Inline SVG diagrams for the Kafka guide. Keyed by name,
   referenced from content.js. Colors use CSS variables so
   they follow the theme.
   ============================================================ */
window.DIAGRAMS = {

  /* ---------- Phase 1: append-only partition log ---------- */
  log: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="karr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="26" fill="#cdd4e1" font-size="12" text-anchor="middle">A partition is an ordered, append-only log — each record gets the next offset</text>
  <text x="40" y="78" fill="var(--text-3)" font-size="11">old</text>
  <text x="640" y="78" fill="var(--text-3)" font-size="11">new →</text>
  ${[0,1,2,3,4,5,6].map((n,i)=>`
  <rect x="${70+i*78}" y="60" width="64" height="48" rx="8" fill="${i<5?'rgba(45,212,191,0.12)':'#0e1422'}" stroke="${i<5?'var(--teal)':'var(--line-2)'}"/>
  <text x="${102+i*78}" y="80" fill="${i<5?'var(--teal)':'var(--text-3)'}" font-size="11" text-anchor="middle">msg</text>
  <text x="${102+i*78}" y="98" fill="var(--text-3)" font-size="10" text-anchor="middle">off ${n}</text>`).join('')}
  <line x1="70" y1="130" x2="490" y2="130" stroke="var(--green)" marker-end="url(#karr)"/>
  <text x="280" y="148" fill="var(--green)" font-size="11" text-anchor="middle">consumer reads forward, tracking its offset</text>
  <line x1="540" y1="84" x2="630" y2="84" stroke="var(--text-3)" stroke-dasharray="4 3" marker-end="url(#karr)"/>
  <text x="600" y="148" fill="var(--text-3)" font-size="10.5" text-anchor="middle">producer appends here</text>
</svg>`,

  /* ---------- Phase 1: pub/sub overview ---------- */
  pubSub: `
<svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="karr2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="30" y="60" width="120" height="40" rx="9" fill="rgba(45,212,191,0.1)" stroke="var(--teal)"/>
  <text x="90" y="85" fill="var(--teal)" font-size="11.5" text-anchor="middle">Producer A</text>
  <rect x="30" y="150" width="120" height="40" rx="9" fill="rgba(45,212,191,0.1)" stroke="var(--teal)"/>
  <text x="90" y="175" fill="var(--teal)" font-size="11.5" text-anchor="middle">Producer B</text>

  <rect x="240" y="40" width="220" height="170" rx="14" fill="rgba(251,191,36,0.05)" stroke="var(--amber)" stroke-opacity="0.6"/>
  <text x="350" y="32" fill="var(--amber)" font-size="11.5" text-anchor="middle">Broker · Topic "orders"</text>
  <rect x="260" y="60" width="180" height="34" rx="7" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="350" y="82" fill="#cdd4e1" font-size="10.5" text-anchor="middle">partition 0  ▸▸▸</text>
  <rect x="260" y="104" width="180" height="34" rx="7" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="350" y="126" fill="#cdd4e1" font-size="10.5" text-anchor="middle">partition 1  ▸▸▸</text>
  <rect x="260" y="148" width="180" height="34" rx="7" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="350" y="170" fill="#cdd4e1" font-size="10.5" text-anchor="middle">partition 2  ▸▸▸</text>

  <rect x="550" y="60" width="120" height="40" rx="9" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="610" y="85" fill="var(--purple)" font-size="11.5" text-anchor="middle">Consumer X</text>
  <rect x="550" y="150" width="120" height="40" rx="9" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="610" y="175" fill="var(--purple)" font-size="11.5" text-anchor="middle">Consumer Y</text>

  <line x1="150" y1="80" x2="238" y2="90" stroke="var(--text-3)" marker-end="url(#karr2)"/>
  <line x1="150" y1="170" x2="238" y2="150" stroke="var(--text-3)" marker-end="url(#karr2)"/>
  <line x1="460" y1="90" x2="548" y2="80" stroke="var(--text-3)" marker-end="url(#karr2)"/>
  <line x1="460" y1="150" x2="548" y2="170" stroke="var(--text-3)" marker-end="url(#karr2)"/>
  <text x="350" y="232" fill="var(--text-3)" font-size="10.5" text-anchor="middle">write (push) · store (durable, replayable) · read (pull)</text>
</svg>`,

  /* ---------- Phase 1: key-based partitioning ---------- */
  partitioning: `
<svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="karr3" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">partition = hash(key) % numPartitions — same key ⇒ same partition ⇒ ordered</text>
  <rect x="40" y="50" width="120" height="30" rx="6" fill="rgba(96,165,250,0.12)" stroke="var(--blue)"/>
  <text x="100" y="70" fill="var(--blue)" font-size="10.5" text-anchor="middle">key = "user-A"</text>
  <rect x="40" y="95" width="120" height="30" rx="6" fill="rgba(167,139,250,0.12)" stroke="var(--purple)"/>
  <text x="100" y="115" fill="var(--purple)" font-size="10.5" text-anchor="middle">key = "user-B"</text>
  <rect x="40" y="140" width="120" height="30" rx="6" fill="rgba(96,165,250,0.12)" stroke="var(--blue)"/>
  <text x="100" y="160" fill="var(--blue)" font-size="10.5" text-anchor="middle">key = "user-A"</text>

  <circle cx="290" cy="110" r="34" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="290" y="106" fill="var(--amber)" font-size="11" text-anchor="middle">hash</text>
  <text x="290" y="122" fill="var(--text-3)" font-size="9" text-anchor="middle">% N</text>

  <rect x="450" y="50" width="200" height="34" rx="7" fill="#0e1422" stroke="var(--blue)"/>
  <text x="550" y="72" fill="var(--blue)" font-size="10.5" text-anchor="middle">partition 0</text>
  <rect x="450" y="98" width="200" height="34" rx="7" fill="#0e1422" stroke="var(--purple)"/>
  <text x="550" y="120" fill="var(--purple)" font-size="10.5" text-anchor="middle">partition 1</text>
  <rect x="450" y="146" width="200" height="34" rx="7" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="550" y="168" fill="var(--text-3)" font-size="10.5" text-anchor="middle">partition 2</text>

  <line x1="160" y1="65" x2="258" y2="100" stroke="var(--text-3)" marker-end="url(#karr3)"/>
  <line x1="160" y1="110" x2="256" y2="110" stroke="var(--text-3)" marker-end="url(#karr3)"/>
  <line x1="160" y1="155" x2="258" y2="120" stroke="var(--text-3)" marker-end="url(#karr3)"/>
  <line x1="324" y1="100" x2="448" y2="67" stroke="var(--blue)" marker-end="url(#karr3)"/>
  <line x1="324" y1="115" x2="448" y2="115" stroke="var(--purple)" marker-end="url(#karr3)"/>
</svg>`,

  /* ---------- Phase 2: replication & ISR ---------- */
  replication: `
<svg viewBox="0 0 700 230" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="karr4" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--green)"/>
    </marker>
  </defs>
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">Replication factor 3 — one leader, two followers; ISR = replicas caught up</text>
  <rect x="60" y="55" width="160" height="120" rx="13" fill="rgba(74,222,128,0.07)" stroke="var(--green)"/>
  <text x="140" y="80" fill="var(--green)" font-size="12" font-weight="700" text-anchor="middle">Broker 1</text>
  <rect x="80" y="95" width="120" height="60" rx="9" fill="rgba(74,222,128,0.14)" stroke="var(--green)"/>
  <text x="140" y="120" fill="var(--green)" font-size="11" text-anchor="middle">LEADER</text>
  <text x="140" y="138" fill="var(--text-3)" font-size="9.5" text-anchor="middle">P0 (reads+writes)</text>

  <rect x="270" y="55" width="160" height="120" rx="13" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="350" y="80" fill="var(--text-2)" font-size="12" font-weight="700" text-anchor="middle">Broker 2</text>
  <rect x="290" y="95" width="120" height="60" rx="9" fill="#151b27" stroke="var(--teal)" stroke-opacity="0.5"/>
  <text x="350" y="120" fill="var(--teal)" font-size="11" text-anchor="middle">follower</text>
  <text x="350" y="138" fill="var(--green)" font-size="9.5" text-anchor="middle">✓ in-sync (ISR)</text>

  <rect x="480" y="55" width="160" height="120" rx="13" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="560" y="80" fill="var(--text-2)" font-size="12" font-weight="700" text-anchor="middle">Broker 3</text>
  <rect x="500" y="95" width="120" height="60" rx="9" fill="#151b27" stroke="var(--rose)" stroke-opacity="0.5"/>
  <text x="560" y="120" fill="var(--rose)" font-size="11" text-anchor="middle">follower</text>
  <text x="560" y="138" fill="var(--rose)" font-size="9.5" text-anchor="middle">✗ lagging</text>

  <line x1="200" y1="120" x2="288" y2="120" stroke="var(--green)" marker-end="url(#karr4)"/>
  <line x1="410" y1="125" x2="498" y2="125" stroke="var(--text-3)" stroke-dasharray="4 3" marker-end="url(#karr4)"/>
  <text x="350" y="205" fill="var(--text-3)" font-size="10.5" text-anchor="middle">if the leader dies, a follower in the ISR is promoted — no data loss</text>
</svg>`,

  /* ---------- Phase 2: consumer groups ---------- */
  consumerGroups: `
<svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="karr5" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="22" fill="#cdd4e1" font-size="12" text-anchor="middle">Within a group, each partition goes to exactly one consumer (the golden rule)</text>
  <rect x="40" y="45" width="120" height="40" rx="7" fill="#0e1422" stroke="var(--amber)"/>
  <text x="100" y="69" fill="var(--amber)" font-size="11" text-anchor="middle">partition 0</text>
  <rect x="40" y="105" width="120" height="40" rx="7" fill="#0e1422" stroke="var(--amber)"/>
  <text x="100" y="129" fill="var(--amber)" font-size="11" text-anchor="middle">partition 1</text>
  <rect x="40" y="165" width="120" height="40" rx="7" fill="#0e1422" stroke="var(--amber)"/>
  <text x="100" y="189" fill="var(--amber)" font-size="11" text-anchor="middle">partition 2</text>

  <rect x="300" y="45" width="160" height="160" rx="13" fill="rgba(167,139,250,0.05)" stroke="var(--purple)" stroke-opacity="0.6"/>
  <text x="380" y="38" fill="var(--purple)" font-size="11" text-anchor="middle">Group "billing"</text>
  <rect x="320" y="58" width="120" height="38" rx="8" fill="rgba(167,139,250,0.12)" stroke="var(--purple)"/>
  <text x="380" y="82" fill="var(--purple)" font-size="10.5" text-anchor="middle">Consumer 1</text>
  <rect x="320" y="106" width="120" height="38" rx="8" fill="rgba(167,139,250,0.12)" stroke="var(--purple)"/>
  <text x="380" y="130" fill="var(--purple)" font-size="10.5" text-anchor="middle">Consumer 2</text>
  <rect x="320" y="154" width="120" height="38" rx="8" fill="rgba(167,139,250,0.12)" stroke="var(--purple)"/>
  <text x="380" y="178" fill="var(--purple)" font-size="10.5" text-anchor="middle">Consumer 3</text>

  <line x1="160" y1="65" x2="318" y2="77" stroke="var(--text-3)" marker-end="url(#karr5)"/>
  <line x1="160" y1="125" x2="318" y2="125" stroke="var(--text-3)" marker-end="url(#karr5)"/>
  <line x1="160" y1="185" x2="318" y2="173" stroke="var(--text-3)" marker-end="url(#karr5)"/>

  <rect x="520" y="95" width="160" height="60" rx="13" fill="rgba(45,212,191,0.05)" stroke="var(--teal)" stroke-opacity="0.6"/>
  <text x="600" y="120" fill="var(--teal)" font-size="10.5" text-anchor="middle">Group "analytics"</text>
  <text x="600" y="140" fill="var(--text-3)" font-size="9.5" text-anchor="middle">reads ALL partitions too</text>
  <line x1="160" y1="125" x2="518" y2="125" stroke="var(--teal)" stroke-opacity="0.4" stroke-dasharray="4 3"/>
  <text x="350" y="240" fill="var(--text-3)" font-size="10" text-anchor="middle">extra consumers beyond partition count sit idle · different groups each get a full copy</text>
</svg>`,

  /* ---------- Phase 3: delivery guarantees ---------- */
  deliveryGuarantees: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="40" width="210" height="130" rx="13" fill="#0e1422" stroke="var(--rose)" stroke-opacity="0.6"/>
  <text x="125" y="66" fill="var(--rose)" font-size="12.5" font-weight="700" text-anchor="middle">At-most-once</text>
  <text x="125" y="92" fill="#cdd4e1" font-size="10.5" text-anchor="middle">commit BEFORE processing</text>
  <text x="125" y="112" fill="#8b93a7" font-size="10" text-anchor="middle">crash ⇒ message lost</text>
  <text x="125" y="146" fill="var(--rose)" font-size="10.5" text-anchor="middle">fast · may drop</text>

  <rect x="245" y="40" width="210" height="130" rx="13" fill="#0e1422" stroke="var(--amber)" stroke-opacity="0.6"/>
  <text x="350" y="66" fill="var(--amber)" font-size="12.5" font-weight="700" text-anchor="middle">At-least-once</text>
  <text x="350" y="92" fill="#cdd4e1" font-size="10.5" text-anchor="middle">commit AFTER processing</text>
  <text x="350" y="112" fill="#8b93a7" font-size="10" text-anchor="middle">crash ⇒ reprocess</text>
  <text x="350" y="146" fill="var(--amber)" font-size="10.5" text-anchor="middle">safe · may duplicate</text>

  <rect x="470" y="40" width="210" height="130" rx="13" fill="#0e1422" stroke="var(--green)" stroke-opacity="0.6"/>
  <text x="575" y="66" fill="var(--green)" font-size="12.5" font-weight="700" text-anchor="middle">Exactly-once</text>
  <text x="575" y="92" fill="#cdd4e1" font-size="10.5" text-anchor="middle">transactions + idempotence</text>
  <text x="575" y="112" fill="#8b93a7" font-size="10" text-anchor="middle">atomic read-process-write</text>
  <text x="575" y="146" fill="var(--green)" font-size="10.5" text-anchor="middle">perfect · more overhead</text>
</svg>`,

  /* ---------- Phase 3: producer acks ---------- */
  acks: `
<svg viewBox="0 0 700 210" xmlns="http://www.w3.org/2000/svg">
  <text x="116" y="30" fill="var(--rose)" font-size="12" font-weight="700" text-anchor="middle">acks=0</text>
  <rect x="30" y="45" width="80" height="34" rx="7" fill="rgba(45,212,191,0.12)" stroke="var(--teal)"/>
  <text x="70" y="67" fill="var(--teal)" font-size="10" text-anchor="middle">producer</text>
  <line x1="110" y1="62" x2="160" y2="62" stroke="var(--text-3)"/>
  <rect x="160" y="45" width="60" height="34" rx="7" fill="#0e1422" stroke="var(--green)"/>
  <text x="190" y="67" fill="var(--green)" font-size="10" text-anchor="middle">leader</text>
  <text x="116" y="98" fill="#8b93a7" font-size="9.5" text-anchor="middle">no wait · may lose</text>

  <text x="350" y="30" fill="var(--amber)" font-size="12" font-weight="700" text-anchor="middle">acks=1</text>
  <rect x="264" y="45" width="80" height="34" rx="7" fill="rgba(45,212,191,0.12)" stroke="var(--teal)"/>
  <text x="304" y="67" fill="var(--teal)" font-size="10" text-anchor="middle">producer</text>
  <line x1="344" y1="62" x2="394" y2="62" stroke="var(--text-3)"/>
  <rect x="394" y="45" width="60" height="34" rx="7" fill="#0e1422" stroke="var(--green)"/>
  <text x="424" y="67" fill="var(--green)" font-size="10" text-anchor="middle">leader</text>
  <text x="350" y="98" fill="#8b93a7" font-size="9.5" text-anchor="middle">leader ack only</text>

  <text x="588" y="30" fill="var(--green)" font-size="12" font-weight="700" text-anchor="middle">acks=all</text>
  <rect x="498" y="45" width="76" height="34" rx="7" fill="rgba(45,212,191,0.12)" stroke="var(--teal)"/>
  <text x="536" y="67" fill="var(--teal)" font-size="10" text-anchor="middle">producer</text>
  <line x1="574" y1="62" x2="610" y2="62" stroke="var(--text-3)"/>
  <rect x="610" y="45" width="56" height="34" rx="7" fill="#0e1422" stroke="var(--green)"/>
  <text x="638" y="67" fill="var(--green)" font-size="9.5" text-anchor="middle">leader</text>
  <rect x="586" y="92" width="50" height="26" rx="6" fill="#151b27" stroke="var(--teal)" stroke-opacity="0.6"/>
  <text x="611" y="109" fill="var(--teal)" font-size="9" text-anchor="middle">follower</text>
  <rect x="642" y="92" width="50" height="26" rx="6" fill="#151b27" stroke="var(--teal)" stroke-opacity="0.6"/>
  <text x="667" y="109" fill="var(--teal)" font-size="9" text-anchor="middle">follower</text>
  <text x="588" y="138" fill="#8b93a7" font-size="9.5" text-anchor="middle">all ISR ack · safest</text>

  <line x1="350" y1="165" x2="350" y2="165" stroke="none"/>
  <text x="350" y="185" fill="var(--text-3)" font-size="10.5" text-anchor="middle">left → right: faster but riskier  ···  safer but slower</text>
</svg>`,

  /* ---------- Phase 3: offsets & lag ---------- */
  consumerLag: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">Consumer lag = log-end offset − committed offset</text>
  ${[0,1,2,3,4,5,6,7,8].map((n,i)=>`<rect x="${60+i*64}" y="60" width="54" height="40" rx="7" fill="${i<5?'rgba(74,222,128,0.12)':i<8?'rgba(251,191,36,0.1)':'#0e1422'}" stroke="${i<5?'var(--green)':i<8?'var(--amber)':'var(--line-2)'}"/><text x="${87+i*64}" y="85" fill="var(--text-3)" font-size="9.5" text-anchor="middle">${n}</text>`).join('')}
  <text x="200" y="125" fill="var(--green)" font-size="10.5" text-anchor="middle">↑ committed (read)</text>
  <line x1="380" y1="105" x2="380" y2="118" stroke="var(--amber)"/>
  <text x="455" y="138" fill="var(--amber)" font-size="10.5" text-anchor="middle">← lag = 3 (unread) →</text>
  <text x="575" y="125" fill="var(--text-2)" font-size="10.5" text-anchor="middle">↑ log-end (latest)</text>
</svg>`,

  /* ---------- Phase 2: KRaft vs ZooKeeper ---------- */
  kraft: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <text x="175" y="24" fill="#cdd4e1" font-size="11.5" text-anchor="middle">Legacy: external ZooKeeper</text>
  <rect x="60" y="40" width="120" height="40" rx="9" fill="#0e1422" stroke="var(--rose)" stroke-opacity="0.6"/>
  <text x="120" y="64" fill="var(--rose)" font-size="11" text-anchor="middle">ZooKeeper</text>
  <rect x="40" y="110" width="80" height="34" rx="7" fill="#151b27" stroke="var(--line-2)"/>
  <text x="80" y="132" fill="var(--text-2)" font-size="9.5" text-anchor="middle">broker</text>
  <rect x="130" y="110" width="80" height="34" rx="7" fill="#151b27" stroke="var(--line-2)"/>
  <text x="170" y="132" fill="var(--text-2)" font-size="9.5" text-anchor="middle">broker</text>
  <line x1="100" y1="80" x2="80" y2="108" stroke="var(--text-3)" stroke-dasharray="3 3"/>
  <line x1="140" y1="80" x2="170" y2="108" stroke="var(--text-3)" stroke-dasharray="3 3"/>

  <line x1="350" y1="30" x2="350" y2="170" stroke="var(--line-2)" stroke-dasharray="4 4"/>

  <text x="525" y="24" fill="#cdd4e1" font-size="11.5" text-anchor="middle">KRaft: built-in Raft quorum</text>
  <rect x="430" y="40" width="80" height="34" rx="7" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="470" y="62" fill="var(--green)" font-size="9.5" text-anchor="middle">controller</text>
  <rect x="525" y="40" width="80" height="34" rx="7" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="565" y="62" fill="var(--green)" font-size="9.5" text-anchor="middle">controller</text>
  <rect x="620" y="40" width="60" height="34" rx="7" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="650" y="62" fill="var(--green)" font-size="9" text-anchor="middle">ctrl</text>
  <text x="555" y="92" fill="var(--text-3)" font-size="9" text-anchor="middle">metadata as a Kafka log</text>
  <rect x="450" y="110" width="80" height="34" rx="7" fill="#151b27" stroke="var(--line-2)"/>
  <text x="490" y="132" fill="var(--text-2)" font-size="9.5" text-anchor="middle">broker</text>
  <rect x="560" y="110" width="80" height="34" rx="7" fill="#151b27" stroke="var(--line-2)"/>
  <text x="600" y="132" fill="var(--text-2)" font-size="9.5" text-anchor="middle">broker</text>
  <text x="555" y="172" fill="var(--green)" font-size="9.5" text-anchor="middle">simpler ops · faster failover · scales to millions of partitions</text>
</svg>`,

  /* ---------- Phase 9: streams topology ---------- */
  streamsTopology: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="karr6" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="20" y="65" width="110" height="50" rx="11" fill="rgba(45,212,191,0.1)" stroke="var(--teal)"/>
  <text x="75" y="88" fill="var(--teal)" font-size="11" text-anchor="middle">source</text>
  <text x="75" y="104" fill="var(--text-3)" font-size="9" text-anchor="middle">topic in</text>

  <rect x="170" y="65" width="100" height="50" rx="11" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="220" y="88" fill="var(--blue)" font-size="11" text-anchor="middle">filter</text>
  <text x="220" y="104" fill="var(--text-3)" font-size="9" text-anchor="middle">stateless</text>

  <rect x="310" y="65" width="100" height="50" rx="11" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="360" y="88" fill="var(--blue)" font-size="11" text-anchor="middle">mapValues</text>

  <rect x="450" y="55" width="120" height="70" rx="11" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="510" y="80" fill="var(--purple)" font-size="11" text-anchor="middle">aggregate</text>
  <text x="510" y="96" fill="var(--text-3)" font-size="9" text-anchor="middle">stateful</text>
  <text x="510" y="110" fill="var(--text-3)" font-size="8.5" text-anchor="middle">(state store)</text>

  <rect x="600" y="65" width="90" height="50" rx="11" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="645" y="88" fill="var(--green)" font-size="11" text-anchor="middle">sink</text>
  <text x="645" y="104" fill="var(--text-3)" font-size="9" text-anchor="middle">topic out</text>

  <line x1="130" y1="90" x2="168" y2="90" stroke="var(--text-3)" marker-end="url(#karr6)"/>
  <line x1="270" y1="90" x2="308" y2="90" stroke="var(--text-3)" marker-end="url(#karr6)"/>
  <line x1="410" y1="90" x2="448" y2="90" stroke="var(--text-3)" marker-end="url(#karr6)"/>
  <line x1="570" y1="90" x2="598" y2="90" stroke="var(--text-3)" marker-end="url(#karr6)"/>
  <text x="350" y="160" fill="var(--text-3)" font-size="10.5" text-anchor="middle">a topology is a DAG of processors — KStream (events) vs KTable (latest-per-key)</text>
</svg>`,

  /* ---------- Phase 9: windowing ---------- */
  windowing: `
<svg viewBox="0 0 700 230" xmlns="http://www.w3.org/2000/svg">
  <text x="40" y="40" fill="var(--teal)" font-size="11" font-weight="700">Tumbling</text>
  <rect x="130" y="26" width="80" height="22" rx="4" fill="rgba(45,212,191,0.15)" stroke="var(--teal)"/>
  <rect x="214" y="26" width="80" height="22" rx="4" fill="rgba(45,212,191,0.15)" stroke="var(--teal)"/>
  <rect x="298" y="26" width="80" height="22" rx="4" fill="rgba(45,212,191,0.15)" stroke="var(--teal)"/>
  <text x="430" y="42" fill="var(--text-3)" font-size="9.5">fixed, no overlap</text>

  <text x="40" y="95" fill="var(--blue)" font-size="11" font-weight="700">Hopping</text>
  <rect x="130" y="78" width="90" height="20" rx="4" fill="rgba(96,165,250,0.15)" stroke="var(--blue)"/>
  <rect x="175" y="102" width="90" height="20" rx="4" fill="rgba(96,165,250,0.15)" stroke="var(--blue)"/>
  <rect x="220" y="78" width="90" height="20" rx="4" fill="rgba(96,165,250,0.15)" stroke="var(--blue)"/>
  <text x="430" y="100" fill="var(--text-3)" font-size="9.5">fixed, overlapping</text>

  <text x="40" y="160" fill="var(--amber)" font-size="11" font-weight="700">Session</text>
  <rect x="130" y="146" width="60" height="22" rx="4" fill="rgba(251,191,36,0.15)" stroke="var(--amber)"/>
  <rect x="240" y="146" width="110" height="22" rx="4" fill="rgba(251,191,36,0.15)" stroke="var(--amber)"/>
  <text x="215" y="161" fill="var(--text-3)" font-size="9">gap</text>
  <text x="430" y="162" fill="var(--text-3)" font-size="9.5">activity-gap based</text>

  <line x1="40" y1="200" x2="660" y2="200" stroke="var(--line-2)"/>
  <text x="350" y="220" fill="var(--text-3)" font-size="10.5" text-anchor="middle">time → · windows group records for aggregation; grace period admits late events</text>
</svg>`,

  /* ---------- Phase 10: Kafka Connect ---------- */
  connect: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="karr7" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="20" y="50" width="120" height="44" rx="9" fill="#0e1422" stroke="var(--blue)"/>
  <text x="80" y="70" fill="var(--blue)" font-size="10.5" text-anchor="middle">PostgreSQL</text>
  <text x="80" y="86" fill="var(--text-3)" font-size="9" text-anchor="middle">DB</text>
  <rect x="20" y="108" width="120" height="44" rx="9" fill="#0e1422" stroke="var(--blue)"/>
  <text x="80" y="128" fill="var(--blue)" font-size="10.5" text-anchor="middle">REST API</text>

  <rect x="190" y="55" width="130" height="90" rx="11" fill="rgba(45,212,191,0.07)" stroke="var(--teal)"/>
  <text x="255" y="48" fill="var(--teal)" font-size="10" text-anchor="middle">Source connectors</text>
  <text x="255" y="95" fill="var(--teal)" font-size="10.5" text-anchor="middle">JDBC · Debezium</text>
  <text x="255" y="113" fill="var(--text-3)" font-size="9" text-anchor="middle">pull → Kafka</text>

  <rect x="360" y="55" width="90" height="90" rx="11" fill="rgba(251,191,36,0.07)" stroke="var(--amber)"/>
  <text x="405" y="100" fill="var(--amber)" font-size="11" text-anchor="middle">Kafka</text>

  <rect x="490" y="55" width="130" height="90" rx="11" fill="rgba(167,139,250,0.07)" stroke="var(--purple)"/>
  <text x="555" y="48" fill="var(--purple)" font-size="10" text-anchor="middle">Sink connectors</text>
  <text x="555" y="95" fill="var(--purple)" font-size="10.5" text-anchor="middle">ES · S3 · JDBC</text>
  <text x="555" y="113" fill="var(--text-3)" font-size="9" text-anchor="middle">Kafka → out</text>

  <rect x="650" y="80" width="40" height="40" rx="8" fill="#0e1422" stroke="var(--purple)"/>
  <text x="670" y="104" fill="var(--purple)" font-size="9" text-anchor="middle">ES</text>

  <line x1="140" y1="72" x2="188" y2="85" stroke="var(--text-3)" marker-end="url(#karr7)"/>
  <line x1="140" y1="130" x2="188" y2="115" stroke="var(--text-3)" marker-end="url(#karr7)"/>
  <line x1="320" y1="100" x2="358" y2="100" stroke="var(--text-3)" marker-end="url(#karr7)"/>
  <line x1="450" y1="100" x2="488" y2="100" stroke="var(--text-3)" marker-end="url(#karr7)"/>
  <line x1="620" y1="100" x2="648" y2="100" stroke="var(--text-3)" marker-end="url(#karr7)"/>
  <text x="350" y="185" fill="var(--text-3)" font-size="10.5" text-anchor="middle">no code — connectors move data in/out of Kafka via configuration</text>
</svg>`,

  /* ---------- Phase 8: schema registry ---------- */
  schemaRegistry: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="karr8" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="30" y="80" width="120" height="44" rx="9" fill="rgba(45,212,191,0.1)" stroke="var(--teal)"/>
  <text x="90" y="105" fill="var(--teal)" font-size="11" text-anchor="middle">Producer</text>
  <rect x="290" y="80" width="120" height="44" rx="9" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="350" y="105" fill="var(--amber)" font-size="11" text-anchor="middle">Kafka (bytes + id)</text>
  <rect x="550" y="80" width="120" height="44" rx="9" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="610" y="105" fill="var(--purple)" font-size="11" text-anchor="middle">Consumer</text>

  <rect x="270" y="15" width="160" height="40" rx="10" fill="#0e1422" stroke="var(--green)"/>
  <text x="350" y="33" fill="var(--green)" font-size="10.5" text-anchor="middle">Schema Registry</text>
  <text x="350" y="48" fill="var(--text-3)" font-size="9" text-anchor="middle">Avro · versioned</text>

  <line x1="150" y1="102" x2="288" y2="102" stroke="var(--text-3)" marker-end="url(#karr8)"/>
  <line x1="410" y1="102" x2="548" y2="102" stroke="var(--text-3)" marker-end="url(#karr8)"/>
  <line x1="150" y1="90" x2="270" y2="42" stroke="var(--green)" stroke-dasharray="3 3" marker-end="url(#karr8)"/>
  <text x="195" y="62" fill="var(--green)" font-size="9" text-anchor="middle">register</text>
  <line x1="550" y1="90" x2="430" y2="42" stroke="var(--green)" stroke-dasharray="3 3" marker-end="url(#karr8)"/>
  <text x="510" y="62" fill="var(--green)" font-size="9" text-anchor="middle">fetch by id</text>
  <text x="350" y="165" fill="var(--text-3)" font-size="10.5" text-anchor="middle">payload carries a schema id, not the schema — small messages, enforced contracts</text>
</svg>`,

  /* ---------- Phase 5: DLQ / retry topics ---------- */
  dlq: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="karr9" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="20" y="70" width="120" height="44" rx="10" fill="rgba(45,212,191,0.1)" stroke="var(--teal)"/>
  <text x="80" y="90" fill="var(--teal)" font-size="10.5" text-anchor="middle">orders</text>
  <text x="80" y="106" fill="var(--text-3)" font-size="9" text-anchor="middle">main topic</text>

  <rect x="200" y="70" width="120" height="44" rx="10" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="260" y="90" fill="var(--amber)" font-size="10.5" text-anchor="middle">orders-retry-1</text>
  <text x="260" y="106" fill="var(--text-3)" font-size="8.5" text-anchor="middle">backoff 5s</text>

  <rect x="380" y="70" width="120" height="44" rx="10" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="440" y="90" fill="var(--amber)" font-size="10.5" text-anchor="middle">orders-retry-2</text>
  <text x="440" y="106" fill="var(--text-3)" font-size="8.5" text-anchor="middle">backoff 30s</text>

  <rect x="560" y="70" width="120" height="44" rx="10" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="620" y="90" fill="var(--rose)" font-size="10.5" text-anchor="middle">orders.DLT</text>
  <text x="620" y="106" fill="var(--text-3)" font-size="8.5" text-anchor="middle">dead letter</text>

  <line x1="140" y1="92" x2="198" y2="92" stroke="var(--text-3)" marker-end="url(#karr9)"/>
  <line x1="320" y1="92" x2="378" y2="92" stroke="var(--text-3)" marker-end="url(#karr9)"/>
  <line x1="500" y1="92" x2="558" y2="92" stroke="var(--text-3)" marker-end="url(#karr9)"/>
  <text x="350" y="150" fill="var(--text-3)" font-size="10.5" text-anchor="middle">non-blocking retries: failures hop to delay topics, then to the DLT for inspection</text>
</svg>`,

  /* ---------- Phase 11: MirrorMaker ---------- */
  mirrorMaker: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="karr10" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--green)"/>
    </marker>
  </defs>
  <rect x="40" y="50" width="180" height="90" rx="13" fill="rgba(45,212,191,0.06)" stroke="var(--teal)"/>
  <text x="130" y="76" fill="var(--teal)" font-size="12" font-weight="700" text-anchor="middle">Cluster A (us-east)</text>
  <text x="130" y="100" fill="#cdd4e1" font-size="10" text-anchor="middle">topic: orders</text>
  <text x="130" y="118" fill="var(--text-3)" font-size="9" text-anchor="middle">active / primary</text>

  <rect x="290" y="70" width="120" height="48" rx="11" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="350" y="90" fill="var(--amber)" font-size="11" text-anchor="middle">MirrorMaker 2</text>
  <text x="350" y="106" fill="var(--text-3)" font-size="9" text-anchor="middle">replicates async</text>

  <rect x="480" y="50" width="180" height="90" rx="13" fill="rgba(167,139,250,0.06)" stroke="var(--purple)"/>
  <text x="570" y="76" fill="var(--purple)" font-size="12" font-weight="700" text-anchor="middle">Cluster B (us-west)</text>
  <text x="570" y="100" fill="#cdd4e1" font-size="10" text-anchor="middle">topic: A.orders</text>
  <text x="570" y="118" fill="var(--text-3)" font-size="9" text-anchor="middle">standby / DR</text>

  <line x1="220" y1="94" x2="288" y2="94" stroke="var(--green)" marker-end="url(#karr10)"/>
  <line x1="410" y1="94" x2="478" y2="94" stroke="var(--green)" marker-end="url(#karr10)"/>
  <text x="350" y="165" fill="var(--text-3)" font-size="10.5" text-anchor="middle">cross-cluster replication for DR, geo-locality, and migration</text>
</svg>`,

};
