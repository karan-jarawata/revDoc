/* ============================================================
   Inline SVG diagrams for the Redis guide. Keyed by name,
   referenced from content.js. Colors use CSS variables so
   they follow the theme.
   ============================================================ */
window.DIAGRAMS = {

  /* ---------- Phase 0: where Redis sits ---------- */
  whereRedis: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="30" y="60" width="140" height="60" rx="12" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="100" y="86" fill="var(--blue)" font-size="12" font-weight="700" text-anchor="middle">Application</text>
  <text x="100" y="104" fill="var(--text-3)" font-size="9.5" text-anchor="middle">read / write</text>

  <rect x="280" y="55" width="160" height="70" rx="13" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="360" y="84" fill="var(--rose)" font-size="12.5" font-weight="700" text-anchor="middle">Redis (cache)</text>
  <text x="360" y="104" fill="var(--text-3)" font-size="9.5" text-anchor="middle">in-memory · microsecond reads</text>

  <rect x="540" y="60" width="130" height="60" rx="12" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="605" y="86" fill="var(--green)" font-size="12" font-weight="700" text-anchor="middle">Database</text>
  <text x="605" y="104" fill="var(--text-3)" font-size="9.5" text-anchor="middle">disk · source of truth</text>

  <line x1="170" y1="90" x2="278" y2="90" stroke="var(--text-3)" marker-end="url(#rarr)"/>
  <line x1="440" y1="90" x2="538" y2="90" stroke="var(--text-3)" stroke-dasharray="4 3" marker-end="url(#rarr)"/>
  <text x="225" y="80" fill="var(--text-3)" font-size="9.5" text-anchor="middle">hit?</text>
  <text x="490" y="80" fill="var(--text-3)" font-size="9.5" text-anchor="middle">miss</text>
  <text x="360" y="160" fill="var(--text-3)" font-size="10.5" text-anchor="middle">absorbs reads so the database stays cool</text>
</svg>`,

  /* ---------- Phase 1: RAM vs disk ---------- */
  inMemory: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="26" fill="#cdd4e1" font-size="12" text-anchor="middle">RAM is ~1000× faster than disk — that's why Redis is fast</text>
  <text x="40" y="72" fill="var(--green)" font-size="12" font-weight="700">RAM</text>
  <rect x="110" y="58" width="60" height="22" rx="5" fill="rgba(74,222,128,0.2)" stroke="var(--green)"/>
  <text x="200" y="74" fill="var(--green)" font-size="11">~1–10 microseconds</text>

  <text x="40" y="120" fill="var(--rose)" font-size="12" font-weight="700">Disk</text>
  <rect x="110" y="106" width="540" height="22" rx="5" fill="rgba(251,113,133,0.12)" stroke="var(--rose)"/>
  <text x="380" y="122" fill="var(--rose)" font-size="11" text-anchor="middle">~1–10 milliseconds  (1000× slower)</text>
  <text x="350" y="158" fill="var(--text-3)" font-size="10" text-anchor="middle">trade-off: data must fit in RAM, and is volatile without persistence</text>
</svg>`,

  /* ---------- Phase 1: single-threaded event loop ---------- */
  eventLoop: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">One thread, processed serially → atomic by design, no locks, no races</text>
  <rect x="40" y="50" width="90" height="32" rx="6" fill="rgba(96,165,250,0.12)" stroke="var(--blue)"/>
  <text x="85" y="71" fill="var(--blue)" font-size="10" text-anchor="middle">client A</text>
  <rect x="40" y="92" width="90" height="32" rx="6" fill="rgba(167,139,250,0.12)" stroke="var(--purple)"/>
  <text x="85" y="113" fill="var(--purple)" font-size="10" text-anchor="middle">client B</text>
  <rect x="40" y="134" width="90" height="32" rx="6" fill="rgba(45,212,191,0.12)" stroke="var(--teal)"/>
  <text x="85" y="155" fill="var(--teal)" font-size="10" text-anchor="middle">client C</text>

  <rect x="220" y="85" width="120" height="46" rx="10" fill="#0e1422" stroke="var(--amber)"/>
  <text x="280" y="105" fill="var(--amber)" font-size="10.5" text-anchor="middle">command</text>
  <text x="280" y="121" fill="var(--text-3)" font-size="9" text-anchor="middle">queue</text>

  <circle cx="470" cy="108" r="42" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="470" y="104" fill="var(--amber)" font-size="11" text-anchor="middle">single</text>
  <text x="470" y="120" fill="var(--amber)" font-size="11" text-anchor="middle">thread</text>

  <rect x="580" y="85" width="90" height="46" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="625" y="113" fill="var(--green)" font-size="10.5" text-anchor="middle">reply</text>

  <line x1="130" y1="66" x2="218" y2="100" stroke="var(--text-3)" marker-end="url(#rarr2)"/>
  <line x1="130" y1="108" x2="218" y2="108" stroke="var(--text-3)" marker-end="url(#rarr2)"/>
  <line x1="130" y1="150" x2="218" y2="116" stroke="var(--text-3)" marker-end="url(#rarr2)"/>
  <line x1="340" y1="108" x2="426" y2="108" stroke="var(--text-3)" marker-end="url(#rarr2)"/>
  <line x1="512" y1="108" x2="578" y2="108" stroke="var(--text-3)" marker-end="url(#rarr2)"/>
</svg>`,

  /* ---------- Phase 1: data types overview ---------- */
  dataTypes: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="40" width="125" height="130" rx="12" fill="#0e1422" stroke="var(--purple)"/>
  <text x="82" y="64" fill="var(--purple)" font-size="12" font-weight="700" text-anchor="middle">String</text>
  <text x="82" y="92" fill="#cdd4e1" font-size="9.5" text-anchor="middle">"hello"</text>
  <text x="82" y="110" fill="#cdd4e1" font-size="9.5" text-anchor="middle">counters, JSON</text>
  <text x="82" y="150" fill="var(--text-3)" font-size="9" text-anchor="middle">key → value</text>

  <rect x="155" y="40" width="125" height="130" rx="12" fill="#0e1422" stroke="var(--blue)"/>
  <text x="217" y="64" fill="var(--blue)" font-size="12" font-weight="700" text-anchor="middle">Hash</text>
  <text x="217" y="92" fill="#cdd4e1" font-size="9" text-anchor="middle">name → John</text>
  <text x="217" y="108" fill="#cdd4e1" font-size="9" text-anchor="middle">age → 30</text>
  <text x="217" y="150" fill="var(--text-3)" font-size="9" text-anchor="middle">objects / maps</text>

  <rect x="290" y="40" width="125" height="130" rx="12" fill="#0e1422" stroke="var(--teal)"/>
  <text x="352" y="64" fill="var(--teal)" font-size="12" font-weight="700" text-anchor="middle">List</text>
  <text x="352" y="92" fill="#cdd4e1" font-size="9.5" text-anchor="middle">[a, b, c, d]</text>
  <text x="352" y="110" fill="#cdd4e1" font-size="9" text-anchor="middle">ordered, dupes</text>
  <text x="352" y="150" fill="var(--text-3)" font-size="9" text-anchor="middle">queues, stacks</text>

  <rect x="425" y="40" width="125" height="130" rx="12" fill="#0e1422" stroke="var(--green)"/>
  <text x="487" y="64" fill="var(--green)" font-size="12" font-weight="700" text-anchor="middle">Set</text>
  <text x="487" y="92" fill="#cdd4e1" font-size="9.5" text-anchor="middle">{a, b, c}</text>
  <text x="487" y="110" fill="#cdd4e1" font-size="9" text-anchor="middle">unique, unordered</text>
  <text x="487" y="150" fill="var(--text-3)" font-size="9" text-anchor="middle">tags, members</text>

  <rect x="560" y="40" width="120" height="130" rx="12" fill="#0e1422" stroke="var(--amber)"/>
  <text x="620" y="64" fill="var(--amber)" font-size="11.5" font-weight="700" text-anchor="middle">Sorted Set</text>
  <text x="620" y="92" fill="#cdd4e1" font-size="9" text-anchor="middle">a:100 b:200</text>
  <text x="620" y="110" fill="#cdd4e1" font-size="9" text-anchor="middle">scored, ordered</text>
  <text x="620" y="150" fill="var(--text-3)" font-size="9" text-anchor="middle">leaderboards</text>
</svg>`,

  /* ---------- Phase 1: sorted set leaderboard ---------- */
  sortedSet: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="26" fill="#cdd4e1" font-size="12" text-anchor="middle">Sorted Set — members kept ordered by score (O(log n) rank queries)</text>
  ${[['alice',980,1],['bob',870,2],['carol',760,3],['dave',640,4]].map((r,i)=>`
  <rect x="160" y="${48+i*34}" width="380" height="28" rx="6" fill="${i===0?'rgba(251,191,36,0.15)':'#0e1422'}" stroke="${i===0?'var(--amber)':'var(--line-2)'}"/>
  <text x="180" y="${67+i*34}" fill="var(--text-3)" font-size="10">#${r[2]}</text>
  <text x="230" y="${67+i*34}" fill="#cdd4e1" font-size="11">${r[0]}</text>
  <text x="500" y="${67+i*34}" fill="${i===0?'var(--amber)':'var(--text-2)'}" font-size="11" text-anchor="end">${r[1]}</text>`).join('')}
  <text x="350" y="195" fill="var(--text-3)" font-size="10" text-anchor="middle">ZADD adds · ZINCRBY bumps a score · ZREVRANGE reads top N</text>
</svg>`,

  /* ---------- Phase 2: TTL & lazy expiry ---------- */
  ttl: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">Keys with a TTL self-destruct — removed lazily on access + actively in the background</text>
  <rect x="60" y="55" width="120" height="44" rx="9" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <text x="120" y="75" fill="var(--green)" font-size="11" text-anchor="middle">session:42</text>
  <text x="120" y="91" fill="var(--text-3)" font-size="9">TTL 3600s</text>
  <rect x="230" y="55" width="120" height="44" rx="9" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="290" y="75" fill="var(--amber)" font-size="11" text-anchor="middle">cart:7</text>
  <text x="290" y="91" fill="var(--text-3)" font-size="9">TTL 12s</text>
  <rect x="400" y="55" width="120" height="44" rx="9" fill="#0e1422" stroke="var(--rose)" stroke-dasharray="4 3"/>
  <text x="460" y="75" fill="var(--rose)" font-size="11" text-anchor="middle">otp:9</text>
  <text x="460" y="91" fill="var(--rose)" font-size="9">expired → gone</text>
  <text x="350" y="135" fill="var(--text-3)" font-size="10.5" text-anchor="middle">TTL -1 = no expiry · TTL -2 = key doesn't exist</text>
</svg>`,

  /* ---------- Phase 2: eviction when full ---------- */
  eviction: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr3" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--rose)"/>
    </marker>
  </defs>
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">Memory full + new write ⇒ the eviction policy decides what to drop</text>
  <rect x="220" y="45" width="260" height="100" rx="12" fill="#0e1422" stroke="var(--amber)"/>
  <text x="350" y="40" fill="var(--amber)" font-size="10" text-anchor="middle">maxmemory reached</text>
  <rect x="240" y="60" width="70" height="26" rx="5" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <text x="275" y="77" fill="var(--green)" font-size="9" text-anchor="middle">hot key</text>
  <rect x="320" y="60" width="70" height="26" rx="5" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <text x="355" y="77" fill="var(--green)" font-size="9" text-anchor="middle">hot key</text>
  <rect x="240" y="96" width="70" height="26" rx="5" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="275" y="113" fill="var(--rose)" font-size="9" text-anchor="middle">cold key</text>
  <rect x="320" y="96" width="70" height="26" rx="5" fill="#151b27" stroke="var(--line-2)"/>
  <text x="355" y="113" fill="var(--text-3)" font-size="9" text-anchor="middle">key</text>

  <rect x="40" y="80" width="120" height="40" rx="9" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="100" y="105" fill="var(--blue)" font-size="10" text-anchor="middle">new SET →</text>
  <line x1="160" y1="100" x2="218" y2="100" stroke="var(--text-3)"/>

  <line x1="275" y1="96" x2="180" y2="160" stroke="var(--rose)" marker-end="url(#rarr3)"/>
  <text x="540" y="95" fill="var(--text-3)" font-size="10" text-anchor="middle">LRU/LFU evicts</text>
  <text x="540" y="112" fill="var(--text-3)" font-size="10" text-anchor="middle">the cold key</text>
  <text x="350" y="180" fill="var(--rose)" font-size="10" text-anchor="middle">noeviction instead returns "OOM command not allowed"</text>
</svg>`,

  /* ---------- Phase 3: cache-aside ---------- */
  cacheAside: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr4" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="40" y="80" width="110" height="44" rx="10" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="95" y="106" fill="var(--blue)" font-size="11" text-anchor="middle">App</text>
  <rect x="295" y="80" width="110" height="44" rx="10" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="350" y="106" fill="var(--rose)" font-size="11" text-anchor="middle">Cache</text>
  <rect x="550" y="80" width="110" height="44" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="605" y="106" fill="var(--green)" font-size="11" text-anchor="middle">Database</text>

  <line x1="150" y1="95" x2="293" y2="95" stroke="var(--text-3)" marker-end="url(#rarr4)"/>
  <text x="222" y="86" fill="var(--text-3)" font-size="9.5" text-anchor="middle">1. GET key</text>
  <line x1="293" y1="112" x2="152" y2="112" stroke="var(--green)" stroke-dasharray="3 2" marker-end="url(#rarr4)"/>
  <text x="222" y="128" fill="var(--green)" font-size="9.5" text-anchor="middle">2. hit → return</text>

  <line x1="405" y1="95" x2="548" y2="95" stroke="var(--text-3)" stroke-dasharray="4 3" marker-end="url(#rarr4)"/>
  <text x="477" y="86" fill="var(--text-3)" font-size="9.5" text-anchor="middle">3. miss → query</text>
  <line x1="548" y1="112" x2="407" y2="112" stroke="var(--text-3)" marker-end="url(#rarr4)"/>
  <text x="477" y="128" fill="var(--text-3)" font-size="9.5" text-anchor="middle">4. SET key (TTL)</text>
  <text x="350" y="170" fill="var(--text-3)" font-size="10.5" text-anchor="middle">app owns the cache; simple &amp; robust, but first read is a miss</text>
</svg>`,

  /* ---------- Phase 3: write-through ---------- */
  writeThrough: `
<svg viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr5" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="40" y="60" width="110" height="44" rx="10" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="95" y="86" fill="var(--blue)" font-size="11" text-anchor="middle">App</text>
  <rect x="295" y="60" width="110" height="44" rx="10" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="350" y="86" fill="var(--rose)" font-size="11" text-anchor="middle">Cache</text>
  <rect x="550" y="60" width="110" height="44" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="605" y="86" fill="var(--green)" font-size="11" text-anchor="middle">Database</text>
  <line x1="150" y1="82" x2="293" y2="82" stroke="var(--text-3)" marker-end="url(#rarr5)"/>
  <text x="222" y="73" fill="var(--text-3)" font-size="9.5" text-anchor="middle">1. write cache</text>
  <line x1="405" y1="82" x2="548" y2="82" stroke="var(--text-3)" marker-end="url(#rarr5)"/>
  <text x="477" y="73" fill="var(--text-3)" font-size="9.5" text-anchor="middle">2. write DB (sync)</text>
  <text x="350" y="135" fill="var(--green)" font-size="10.5" text-anchor="middle">cache always fresh &amp; consistent · slower writes (waits for DB)</text>
</svg>`,

  /* ---------- Phase 3: write-behind ---------- */
  writeBehind: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr6" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="40" y="60" width="110" height="44" rx="10" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="95" y="86" fill="var(--blue)" font-size="11" text-anchor="middle">App</text>
  <rect x="295" y="60" width="110" height="44" rx="10" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="350" y="86" fill="var(--rose)" font-size="11" text-anchor="middle">Cache</text>
  <rect x="550" y="60" width="110" height="44" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="605" y="86" fill="var(--green)" font-size="11" text-anchor="middle">Database</text>
  <line x1="150" y1="82" x2="293" y2="82" stroke="var(--text-3)" marker-end="url(#rarr6)"/>
  <text x="222" y="73" fill="var(--text-3)" font-size="9.5" text-anchor="middle">1. write cache</text>
  <line x1="150" y1="100" x2="120" y2="100" stroke="none"/>
  <line x1="295" y1="100" x2="155" y2="100" stroke="var(--green)" stroke-dasharray="3 2" marker-end="url(#rarr6)"/>
  <text x="222" y="116" fill="var(--green)" font-size="9.5" text-anchor="middle">2. return now</text>
  <line x1="350" y1="104" x2="555" y2="125" stroke="var(--amber)" stroke-dasharray="4 3" marker-end="url(#rarr6)"/>
  <text x="470" y="130" fill="var(--amber)" font-size="9.5" text-anchor="middle">3. async batch → DB later</text>
  <text x="350" y="160" fill="var(--rose)" font-size="10" text-anchor="middle">fastest writes · risk of loss if cache dies before sync</text>
</svg>`,

  /* ---------- Phase 3: cache penetration ---------- */
  penetration: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr7" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--rose)"/>
    </marker>
  </defs>
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">Penetration — queries for keys that don't exist anywhere</text>
  <rect x="40" y="60" width="110" height="44" rx="10" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="95" y="86" fill="var(--blue)" font-size="11" text-anchor="middle">requests</text>
  <rect x="295" y="60" width="110" height="44" rx="10" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="350" y="80" fill="var(--text-3)" font-size="10.5" text-anchor="middle">Cache</text>
  <text x="350" y="96" fill="var(--rose)" font-size="9" text-anchor="middle">always miss</text>
  <rect x="550" y="60" width="110" height="44" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="605" y="80" fill="var(--green)" font-size="11" text-anchor="middle">Database</text>
  <text x="605" y="96" fill="var(--rose)" font-size="9" text-anchor="middle">hammered</text>
  <line x1="150" y1="82" x2="293" y2="82" stroke="var(--rose)" marker-end="url(#rarr7)"/>
  <line x1="405" y1="82" x2="548" y2="82" stroke="var(--rose)" marker-end="url(#rarr7)"/>
  <text x="350" y="145" fill="var(--text-3)" font-size="10.5" text-anchor="middle">fix: cache the null result · Bloom filter to reject invalid ids</text>
</svg>`,

  /* ---------- Phase 3: cache avalanche ---------- */
  avalanche: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr8" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--rose)"/>
    </marker>
  </defs>
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">Avalanche — many keys expire at the same instant → thundering herd to DB</text>
  ${[0,1,2,3,4].map((n,i)=>`<rect x="${60+i*46}" y="50" width="38" height="28" rx="5" fill="#0e1422" stroke="var(--rose)" stroke-dasharray="3 2"/><text x="${79+i*46}" y="69" fill="var(--rose)" font-size="8.5" text-anchor="middle">exp</text>`).join('')}
  <rect x="500" y="48" width="160" height="80" rx="12" fill="rgba(74,222,128,0.06)" stroke="var(--green)"/>
  <text x="580" y="84" fill="var(--green)" font-size="11" text-anchor="middle">Database</text>
  <text x="580" y="104" fill="var(--rose)" font-size="9.5" text-anchor="middle">overwhelmed</text>
  ${[0,1,2,3,4].map((n,i)=>`<line x1="${79+i*46}" y1="78" x2="510" y2="${60+i*12}" stroke="var(--rose)" stroke-opacity="0.5" marker-end="url(#rarr8)"/>`).join('')}
  <text x="350" y="160" fill="var(--text-3)" font-size="10.5" text-anchor="middle">fix: randomise (jitter) TTLs so expirations spread out over time</text>
</svg>`,

  /* ---------- Phase 3: thundering herd ---------- */
  thunderingHerd: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr9" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--rose)"/>
    </marker>
  </defs>
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">Thundering herd — ONE hot key expires; 1000s rebuild it at once</text>
  ${[0,1,2,3,4,5].map((n,i)=>`<rect x="40" y="${44+i*20}" width="80" height="16" rx="3" fill="rgba(96,165,250,0.12)" stroke="var(--blue)"/>`).join('')}
  <text x="80" y="172" fill="var(--blue)" font-size="9" text-anchor="middle">many threads</text>
  <rect x="300" y="70" width="110" height="44" rx="10" fill="#0e1422" stroke="var(--rose)" stroke-dasharray="4 3"/>
  <text x="355" y="90" fill="var(--rose)" font-size="10" text-anchor="middle">hot key</text>
  <text x="355" y="106" fill="var(--rose)" font-size="9" text-anchor="middle">expired</text>
  <rect x="560" y="70" width="110" height="44" rx="10" fill="rgba(74,222,128,0.06)" stroke="var(--green)"/>
  <text x="615" y="96" fill="var(--green)" font-size="10.5" text-anchor="middle">Database</text>
  ${[0,1,2,3,4,5].map((n,i)=>`<line x1="120" y1="${52+i*20}" x2="298" y2="92" stroke="var(--rose)" stroke-opacity="0.4" marker-end="url(#rarr9)"/>`).join('')}
  <line x1="410" y1="92" x2="558" y2="92" stroke="var(--rose)" marker-end="url(#rarr9)"/>
  <text x="350" y="155" fill="var(--text-3)" font-size="10.5" text-anchor="middle">fix: a distributed lock — one rebuilds, the rest wait for the result</text>
</svg>`,

  /* ---------- Phase 5: RDB vs AOF ---------- */
  persistence: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <text x="180" y="26" fill="var(--blue)" font-size="12" font-weight="700" text-anchor="middle">RDB — snapshot</text>
  <circle cx="100" cy="100" r="30" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="100" y="104" fill="var(--blue)" font-size="10" text-anchor="middle">RAM</text>
  <rect x="200" y="80" width="120" height="40" rx="8" fill="#0e1422" stroke="var(--blue)"/>
  <text x="260" y="100" fill="var(--blue)" font-size="10" text-anchor="middle">dump.rdb</text>
  <text x="260" y="114" fill="var(--text-3)" font-size="8.5" text-anchor="middle">point-in-time</text>
  <line x1="130" y1="100" x2="198" y2="100" stroke="var(--text-3)"/>
  <text x="180" y="155" fill="var(--text-3)" font-size="9.5" text-anchor="middle">compact, fast restart</text>
  <text x="180" y="171" fill="var(--rose)" font-size="9.5" text-anchor="middle">loses data since last snapshot</text>

  <line x1="360" y1="20" x2="360" y2="185" stroke="var(--line-2)" stroke-dasharray="4 4"/>

  <text x="540" y="26" fill="var(--green)" font-size="12" font-weight="700" text-anchor="middle">AOF — write log</text>
  <circle cx="440" cy="100" r="30" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="440" y="104" fill="var(--green)" font-size="10" text-anchor="middle">RAM</text>
  <rect x="540" y="68" width="140" height="64" rx="8" fill="#0e1422" stroke="var(--green)"/>
  <text x="610" y="86" fill="#cdd4e1" font-size="8.5" text-anchor="middle">SET a 1</text>
  <text x="610" y="100" fill="#cdd4e1" font-size="8.5" text-anchor="middle">INCR a</text>
  <text x="610" y="114" fill="#cdd4e1" font-size="8.5" text-anchor="middle">DEL b</text>
  <text x="610" y="128" fill="var(--text-3)" font-size="8" text-anchor="middle">every write appended</text>
  <line x1="470" y1="100" x2="538" y2="100" stroke="var(--text-3)"/>
  <text x="540" y="155" fill="var(--text-3)" font-size="9.5" text-anchor="middle">near-zero loss (fsync)</text>
  <text x="540" y="171" fill="var(--rose)" font-size="9.5" text-anchor="middle">bigger file, slower restart</text>
</svg>`,

  /* ---------- Phase 5: replication ---------- */
  replication: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr10" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--green)"/>
    </marker>
  </defs>
  <rect x="280" y="35" width="140" height="50" rx="12" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="350" y="58" fill="var(--rose)" font-size="12" font-weight="700" text-anchor="middle">Master</text>
  <text x="350" y="75" fill="var(--text-3)" font-size="9" text-anchor="middle">reads + writes</text>

  <rect x="80" y="125" width="140" height="48" rx="12" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="150" y="146" fill="var(--green)" font-size="11" text-anchor="middle">Replica 1</text>
  <text x="150" y="162" fill="var(--text-3)" font-size="9" text-anchor="middle">read-only</text>
  <rect x="280" y="125" width="140" height="48" rx="12" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="350" y="146" fill="var(--green)" font-size="11" text-anchor="middle">Replica 2</text>
  <text x="350" y="162" fill="var(--text-3)" font-size="9" text-anchor="middle">read-only</text>
  <rect x="480" y="125" width="140" height="48" rx="12" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="550" y="146" fill="var(--green)" font-size="11" text-anchor="middle">Replica 3</text>
  <text x="550" y="162" fill="var(--text-3)" font-size="9" text-anchor="middle">read-only</text>

  <line x1="320" y1="85" x2="160" y2="123" stroke="var(--green)" marker-end="url(#rarr10)"/>
  <line x1="350" y1="85" x2="350" y2="123" stroke="var(--green)" marker-end="url(#rarr10)"/>
  <line x1="380" y1="85" x2="540" y2="123" stroke="var(--green)" marker-end="url(#rarr10)"/>
  <text x="350" y="110" fill="var(--text-3)" font-size="9" text-anchor="middle">async PSYNC — replicas lag slightly (eventual consistency)</text>
</svg>`,

  /* ---------- Phase 5: sentinel ---------- */
  sentinel: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr11" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--amber)"/>
    </marker>
  </defs>
  <circle cx="130" cy="55" r="26" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="130" y="59" fill="var(--amber)" font-size="9" text-anchor="middle">Sentinel</text>
  <circle cx="350" cy="45" r="26" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="350" y="49" fill="var(--amber)" font-size="9" text-anchor="middle">Sentinel</text>
  <circle cx="570" cy="55" r="26" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="570" y="59" fill="var(--amber)" font-size="9" text-anchor="middle">Sentinel</text>
  <text x="350" y="90" fill="var(--text-3)" font-size="9.5" text-anchor="middle">quorum agrees the master is down</text>

  <rect x="120" y="120" width="130" height="44" rx="11" fill="#0e1422" stroke="var(--rose)" stroke-dasharray="4 3"/>
  <text x="185" y="140" fill="var(--rose)" font-size="10.5" text-anchor="middle">Master ✗ down</text>
  <rect x="440" y="120" width="150" height="44" rx="11" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="515" y="140" fill="var(--green)" font-size="10.5" text-anchor="middle">Replica → promoted</text>
  <line x1="250" y1="142" x2="438" y2="142" stroke="var(--amber)" marker-end="url(#rarr11)"/>
  <text x="344" y="134" fill="var(--amber)" font-size="9.5" text-anchor="middle">automatic failover</text>
  <line x1="130" y1="81" x2="175" y2="118" stroke="var(--text-3)" stroke-dasharray="2 2"/>
  <line x1="350" y1="71" x2="200" y2="118" stroke="var(--text-3)" stroke-dasharray="2 2"/>
</svg>`,

  /* ---------- Phase 5: cluster hash slots ---------- */
  cluster: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">Cluster — 16,384 hash slots sharded across nodes · slot = CRC16(key) mod 16384</text>
  <rect x="40" y="55" width="190" height="100" rx="13" fill="rgba(167,139,250,0.06)" stroke="var(--purple)"/>
  <text x="135" y="78" fill="var(--purple)" font-size="11.5" font-weight="700" text-anchor="middle">Node A</text>
  <text x="135" y="98" fill="#cdd4e1" font-size="9.5" text-anchor="middle">slots 0–5460</text>
  <text x="135" y="128" fill="var(--text-3)" font-size="9" text-anchor="middle">+ replica</text>

  <rect x="255" y="55" width="190" height="100" rx="13" fill="rgba(45,212,191,0.06)" stroke="var(--teal)"/>
  <text x="350" y="78" fill="var(--teal)" font-size="11.5" font-weight="700" text-anchor="middle">Node B</text>
  <text x="350" y="98" fill="#cdd4e1" font-size="9.5" text-anchor="middle">slots 5461–10922</text>
  <text x="350" y="128" fill="var(--text-3)" font-size="9" text-anchor="middle">+ replica</text>

  <rect x="470" y="55" width="190" height="100" rx="13" fill="rgba(96,165,250,0.06)" stroke="var(--blue)"/>
  <text x="565" y="78" fill="var(--blue)" font-size="11.5" font-weight="700" text-anchor="middle">Node C</text>
  <text x="565" y="98" fill="#cdd4e1" font-size="9.5" text-anchor="middle">slots 10923–16383</text>
  <text x="565" y="128" fill="var(--text-3)" font-size="9" text-anchor="middle">+ replica</text>
  <text x="350" y="178" fill="var(--text-3)" font-size="10" text-anchor="middle">horizontal write scaling · no multi-key ops across slots</text>
</svg>`,

  /* ---------- Phase 6: pub/sub ---------- */
  pubsub: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr12" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="40" y="75" width="120" height="44" rx="10" fill="rgba(45,212,191,0.1)" stroke="var(--teal)"/>
  <text x="100" y="101" fill="var(--teal)" font-size="11" text-anchor="middle">Publisher</text>
  <rect x="280" y="70" width="140" height="54" rx="11" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="350" y="93" fill="var(--amber)" font-size="11" text-anchor="middle">channel: news</text>
  <text x="350" y="110" fill="var(--text-3)" font-size="9" text-anchor="middle">no persistence</text>

  <rect x="540" y="35" width="130" height="38" rx="9" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="605" y="58" fill="var(--purple)" font-size="10" text-anchor="middle">Subscriber 1</text>
  <rect x="540" y="83" width="130" height="38" rx="9" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="605" y="106" fill="var(--purple)" font-size="10" text-anchor="middle">Subscriber 2</text>
  <rect x="540" y="131" width="130" height="38" rx="9" fill="#0e1422" stroke="var(--line-2)" stroke-dasharray="3 2"/>
  <text x="605" y="154" fill="var(--text-3)" font-size="9.5" text-anchor="middle">offline → misses it</text>

  <line x1="160" y1="97" x2="278" y2="97" stroke="var(--text-3)" marker-end="url(#rarr12)"/>
  <line x1="420" y1="92" x2="538" y2="56" stroke="var(--text-3)" marker-end="url(#rarr12)"/>
  <line x1="420" y1="100" x2="538" y2="102" stroke="var(--text-3)" marker-end="url(#rarr12)"/>
  <text x="350" y="180" fill="var(--text-3)" font-size="10" text-anchor="middle">fire-and-forget — only currently-connected subscribers receive the message</text>
</svg>`,

  /* ---------- Phase 6: streams ---------- */
  streams: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr13" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">Streams — persistent append-only log with consumer groups (Kafka-like)</text>
  ${[0,1,2,3,4].map((n,i)=>`<rect x="${120+i*80}" y="50" width="64" height="34" rx="6" fill="rgba(45,212,191,0.12)" stroke="var(--teal)"/><text x="${152+i*80}" y="71" fill="var(--teal)" font-size="9" text-anchor="middle">entry</text>`).join('')}
  <text x="60" y="71" fill="var(--text-3)" font-size="9">XADD →</text>
  <rect x="180" y="120" width="150" height="44" rx="10" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="255" y="140" fill="var(--purple)" font-size="10" text-anchor="middle">consumer 1</text>
  <text x="255" y="155" fill="var(--text-3)" font-size="8.5" text-anchor="middle">XREADGROUP / XACK</text>
  <rect x="370" y="120" width="150" height="44" rx="10" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="445" y="140" fill="var(--blue)" font-size="10" text-anchor="middle">consumer 2</text>
  <text x="445" y="155" fill="var(--text-3)" font-size="8.5" text-anchor="middle">same group</text>
  <line x1="240" y1="84" x2="255" y2="118" stroke="var(--text-3)" marker-end="url(#rarr13)"/>
  <line x1="440" y1="84" x2="445" y2="118" stroke="var(--text-3)" marker-end="url(#rarr13)"/>
  <text x="350" y="183" fill="var(--text-3)" font-size="9.5" text-anchor="middle">persisted, replayable, acknowledged — unlike fire-and-forget Pub/Sub</text>
</svg>`,

  /* ---------- Phase 6: distributed lock ---------- */
  distLock: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="rarr14" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">SET lock value NX EX 10 — only one winner holds the lock</text>
  <rect x="50" y="55" width="130" height="40" rx="9" fill="rgba(45,212,191,0.1)" stroke="var(--teal)"/>
  <text x="115" y="80" fill="var(--teal)" font-size="10.5" text-anchor="middle">Service A</text>
  <rect x="50" y="110" width="130" height="40" rx="9" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="115" y="135" fill="var(--purple)" font-size="10.5" text-anchor="middle">Service B</text>

  <rect x="300" y="80" width="120" height="46" rx="11" fill="#0e1422" stroke="var(--amber)"/>
  <text x="360" y="100" fill="var(--amber)" font-size="11" text-anchor="middle">🔒 lock:123</text>
  <text x="360" y="116" fill="var(--text-3)" font-size="8.5" text-anchor="middle">held by A (uuid)</text>

  <rect x="540" y="80" width="120" height="46" rx="11" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="600" y="106" fill="var(--green)" font-size="10.5" text-anchor="middle">critical section</text>

  <line x1="180" y1="75" x2="298" y2="98" stroke="var(--green)" marker-end="url(#rarr14)"/>
  <text x="240" y="78" fill="var(--green)" font-size="9">NX ✓</text>
  <line x1="180" y1="130" x2="298" y2="108" stroke="var(--rose)" stroke-dasharray="3 2" marker-end="url(#rarr14)"/>
  <text x="240" y="135" fill="var(--rose)" font-size="9">NX ✗ wait</text>
  <line x1="420" y1="103" x2="538" y2="103" stroke="var(--text-3)" marker-end="url(#rarr14)"/>
  <text x="350" y="168" fill="var(--text-3)" font-size="10" text-anchor="middle">EX auto-expires (no deadlock) · UUID + Lua release prevents stealing</text>
</svg>`,

};
