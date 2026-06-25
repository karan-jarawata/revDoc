/* ============================================================
   Inline SVG diagrams. Keyed by name, referenced from content.js.
   All colors use CSS variables so they follow the theme.
   ============================================================ */
window.DIAGRAMS = {

  /* ---------- Level 1: Process vs Thread ---------- */
  processVsThread: `
<svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg">
  <!-- Process A -->
  <rect x="20" y="30" width="300" height="200" rx="14" fill="#0e1422" stroke="var(--blue)" stroke-opacity="0.5"/>
  <text x="170" y="55" fill="var(--blue)" font-size="13" font-weight="700" text-anchor="middle">PROCESS A (own memory)</text>
  <rect x="45" y="75" width="250" height="40" rx="8" fill="rgba(96,165,250,0.1)" stroke="var(--blue)" stroke-opacity="0.4"/>
  <text x="170" y="100" fill="#cdd4e1" font-size="12" text-anchor="middle">Shared Heap (objects)</text>
  <rect x="45" y="130" width="115" height="80" rx="8" fill="rgba(45,212,191,0.08)" stroke="var(--teal)" stroke-opacity="0.4"/>
  <text x="102" y="155" fill="var(--teal)" font-size="11" font-weight="700" text-anchor="middle">Thread 1</text>
  <text x="102" y="185" fill="#8b93a7" font-size="10" text-anchor="middle">own stack</text>
  <rect x="180" y="130" width="115" height="80" rx="8" fill="rgba(45,212,191,0.08)" stroke="var(--teal)" stroke-opacity="0.4"/>
  <text x="237" y="155" fill="var(--teal)" font-size="11" font-weight="700" text-anchor="middle">Thread 2</text>
  <text x="237" y="185" fill="#8b93a7" font-size="10" text-anchor="middle">own stack</text>

  <!-- Wall -->
  <line x1="350" y1="30" x2="350" y2="230" stroke="var(--line-2)" stroke-width="2" stroke-dasharray="6 5"/>
  <text x="350" y="20" fill="var(--text-3)" font-size="10" text-anchor="middle">isolated</text>

  <!-- Process B -->
  <rect x="380" y="30" width="300" height="200" rx="14" fill="#0e1422" stroke="var(--purple)" stroke-opacity="0.5"/>
  <text x="530" y="55" fill="var(--purple)" font-size="13" font-weight="700" text-anchor="middle">PROCESS B (own memory)</text>
  <rect x="405" y="75" width="250" height="40" rx="8" fill="rgba(167,139,250,0.1)" stroke="var(--purple)" stroke-opacity="0.4"/>
  <text x="530" y="100" fill="#cdd4e1" font-size="12" text-anchor="middle">Shared Heap (objects)</text>
  <rect x="405" y="130" width="115" height="80" rx="8" fill="rgba(45,212,191,0.08)" stroke="var(--teal)" stroke-opacity="0.4"/>
  <text x="462" y="155" fill="var(--teal)" font-size="11" font-weight="700" text-anchor="middle">Thread 1</text>
  <text x="462" y="185" fill="#8b93a7" font-size="10" text-anchor="middle">own stack</text>
  <rect x="540" y="130" width="115" height="80" rx="8" fill="rgba(45,212,191,0.08)" stroke="var(--teal)" stroke-opacity="0.4"/>
  <text x="597" y="155" fill="var(--teal)" font-size="11" font-weight="700" text-anchor="middle">Thread 2</text>
  <text x="597" y="185" fill="#8b93a7" font-size="10" text-anchor="middle">own stack</text>
</svg>`,

  /* ---------- Level 1: Heap vs Stack ---------- */
  heapStack: `
<svg viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="30" width="300" height="190" rx="14" fill="rgba(251,113,133,0.06)" stroke="var(--rose)" stroke-opacity="0.5"/>
  <text x="170" y="56" fill="var(--rose)" font-size="14" font-weight="700" text-anchor="middle">HEAP — shared</text>
  <text x="170" y="76" fill="#8b93a7" font-size="10.5" text-anchor="middle">objects &amp; instance fields live here</text>
  <rect x="45" y="92" width="115" height="50" rx="7" fill="#151b27" stroke="var(--line-2)"/>
  <text x="102" y="121" fill="#cdd4e1" font-size="11" text-anchor="middle">new User()</text>
  <rect x="180" y="92" width="115" height="50" rx="7" fill="#151b27" stroke="var(--line-2)"/>
  <text x="237" y="121" fill="#cdd4e1" font-size="11" text-anchor="middle">new int[]</text>
  <text x="170" y="172" fill="var(--rose)" font-size="11" font-weight="600" text-anchor="middle">⚠ danger zone — needs synchronization</text>
  <text x="170" y="195" fill="#8b93a7" font-size="10" text-anchor="middle">all threads can touch it at once</text>

  <rect x="380" y="30" width="300" height="190" rx="14" fill="rgba(74,222,128,0.05)" stroke="var(--green)" stroke-opacity="0.5"/>
  <text x="530" y="56" fill="var(--green)" font-size="14" font-weight="700" text-anchor="middle">STACK — private per thread</text>
  <text x="530" y="76" fill="#8b93a7" font-size="10.5" text-anchor="middle">local variables &amp; call frames</text>
  <rect x="430" y="92" width="200" height="26" rx="5" fill="#151b27" stroke="var(--line-2)"/>
  <text x="530" y="109" fill="#cdd4e1" font-size="10.5" text-anchor="middle">frame: compute()</text>
  <rect x="430" y="122" width="200" height="26" rx="5" fill="#151b27" stroke="var(--line-2)"/>
  <text x="530" y="139" fill="#cdd4e1" font-size="10.5" text-anchor="middle">frame: helper()</text>
  <text x="530" y="178" fill="var(--green)" font-size="11" font-weight="600" text-anchor="middle">✓ inherently thread-safe</text>
  <text x="530" y="198" fill="#8b93a7" font-size="10" text-anchor="middle">no other thread can reach it</text>
</svg>`,

  /* ---------- Level 1: Thread lifecycle ---------- */
  threadLifecycle: `
<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <!-- NEW -->
  <rect x="40" y="30" width="120" height="46" rx="10" fill="rgba(167,139,250,0.12)" stroke="var(--purple)"/>
  <text x="100" y="58" fill="var(--purple)" font-size="13" font-weight="700" text-anchor="middle">NEW</text>
  <!-- RUNNABLE -->
  <rect x="290" y="30" width="120" height="46" rx="10" fill="rgba(96,165,250,0.12)" stroke="var(--blue)"/>
  <text x="350" y="58" fill="var(--blue)" font-size="13" font-weight="700" text-anchor="middle">RUNNABLE</text>
  <!-- TERMINATED -->
  <rect x="540" y="30" width="120" height="46" rx="10" fill="rgba(91,103,126,0.18)" stroke="var(--text-3)"/>
  <text x="600" y="58" fill="var(--text-2)" font-size="12.5" font-weight="700" text-anchor="middle">TERMINATED</text>
  <!-- BLOCKED -->
  <rect x="40" y="150" width="150" height="46" rx="10" fill="rgba(251,113,133,0.12)" stroke="var(--rose)"/>
  <text x="115" y="172" fill="var(--rose)" font-size="12.5" font-weight="700" text-anchor="middle">BLOCKED</text>
  <text x="115" y="188" fill="#8b93a7" font-size="9.5" text-anchor="middle">waiting for lock</text>
  <!-- WAITING -->
  <rect x="275" y="150" width="150" height="46" rx="10" fill="rgba(251,191,36,0.12)" stroke="var(--amber)"/>
  <text x="350" y="172" fill="var(--amber)" font-size="12.5" font-weight="700" text-anchor="middle">WAITING</text>
  <text x="350" y="188" fill="#8b93a7" font-size="9.5" text-anchor="middle">wait() / join()</text>
  <!-- TIMED_WAITING -->
  <rect x="500" y="150" width="160" height="46" rx="10" fill="rgba(34,211,238,0.12)" stroke="var(--cyan)"/>
  <text x="580" y="172" fill="var(--cyan)" font-size="12" font-weight="700" text-anchor="middle">TIMED_WAITING</text>
  <text x="580" y="188" fill="#8b93a7" font-size="9.5" text-anchor="middle">sleep(t) / wait(t)</text>

  <!-- arrows -->
  <line x1="160" y1="53" x2="285" y2="53" stroke="var(--text-3)" marker-end="url(#arr)"/>
  <text x="222" y="44" fill="var(--text-3)" font-size="10" text-anchor="middle">start()</text>
  <line x1="410" y1="53" x2="535" y2="53" stroke="var(--text-3)" marker-end="url(#arr)"/>
  <text x="472" y="44" fill="var(--text-3)" font-size="10" text-anchor="middle">run() ends</text>

  <line x1="330" y1="76" x2="160" y2="150" stroke="var(--text-3)" marker-end="url(#arr)"/>
  <line x1="350" y1="76" x2="350" y2="148" stroke="var(--text-3)" marker-end="url(#arr)"/>
  <line x1="370" y1="76" x2="560" y2="148" stroke="var(--text-3)" marker-end="url(#arr)"/>

  <line x1="160" y1="173" x2="270" y2="100" stroke="var(--line-2)" stroke-dasharray="4 3" marker-end="url(#arr)"/>
  <line x1="350" y1="150" x2="350" y2="80" stroke="var(--line-2)" stroke-dasharray="4 3" marker-end="url(#arr)"/>
  <text x="245" y="255" fill="#8b93a7" font-size="10.5" text-anchor="middle">dashed = returns to RUNNABLE once unblocked / notified / timeout</text>
</svg>`,

  /* ---------- Level 2: Race condition ---------- */
  raceCondition: `
<svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">count = 5 — two threads run count++ at the same time</text>
  <!-- Thread A lane -->
  <text x="40" y="64" fill="var(--teal)" font-size="12" font-weight="700">Thread A</text>
  <text x="40" y="160" fill="var(--purple)" font-size="12" font-weight="700">Thread B</text>
  <line x1="120" y1="55" x2="660" y2="55" stroke="var(--line-2)"/>
  <line x1="120" y1="150" x2="660" y2="150" stroke="var(--line-2)"/>

  <rect x="140" y="38" width="110" height="34" rx="7" fill="rgba(45,212,191,0.12)" stroke="var(--teal)"/>
  <text x="195" y="60" fill="var(--teal)" font-size="11" text-anchor="middle">read → 5</text>
  <rect x="300" y="38" width="110" height="34" rx="7" fill="rgba(45,212,191,0.12)" stroke="var(--teal)"/>
  <text x="355" y="60" fill="var(--teal)" font-size="11" text-anchor="middle">add → 6</text>
  <rect x="460" y="38" width="120" height="34" rx="7" fill="rgba(45,212,191,0.12)" stroke="var(--teal)"/>
  <text x="520" y="60" fill="var(--teal)" font-size="11" text-anchor="middle">write 6</text>

  <rect x="200" y="133" width="110" height="34" rx="7" fill="rgba(167,139,250,0.12)" stroke="var(--purple)"/>
  <text x="255" y="155" fill="var(--purple)" font-size="11" text-anchor="middle">read → 5</text>
  <rect x="360" y="133" width="110" height="34" rx="7" fill="rgba(167,139,250,0.12)" stroke="var(--purple)"/>
  <text x="415" y="155" fill="var(--purple)" font-size="11" text-anchor="middle">add → 6</text>
  <rect x="520" y="133" width="120" height="34" rx="7" fill="rgba(167,139,250,0.12)" stroke="var(--purple)"/>
  <text x="580" y="155" fill="var(--purple)" font-size="11" text-anchor="middle">write 6</text>

  <rect x="230" y="200" width="240" height="38" rx="9" fill="rgba(251,113,133,0.12)" stroke="var(--rose)"/>
  <text x="350" y="224" fill="var(--rose)" font-size="12.5" font-weight="700" text-anchor="middle">Result: 6 (lost update — should be 7)</text>
</svg>`,

  /* ---------- Level 2: Deadlock ---------- */
  deadlock: `
<svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="var(--rose)"/>
    </marker>
  </defs>
  <rect x="60" y="90" width="150" height="70" rx="12" fill="rgba(45,212,191,0.1)" stroke="var(--teal)"/>
  <text x="135" y="120" fill="var(--teal)" font-size="13" font-weight="700" text-anchor="middle">Thread A</text>
  <text x="135" y="140" fill="#8b93a7" font-size="10" text-anchor="middle">holds Lock 1</text>

  <rect x="490" y="90" width="150" height="70" rx="12" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="565" y="120" fill="var(--purple)" font-size="13" font-weight="700" text-anchor="middle">Thread B</text>
  <text x="565" y="140" fill="#8b93a7" font-size="10" text-anchor="middle">holds Lock 2</text>

  <rect x="300" y="30" width="100" height="44" rx="10" fill="#151b27" stroke="var(--amber)"/>
  <text x="350" y="57" fill="var(--amber)" font-size="12" font-weight="700" text-anchor="middle">Lock 2</text>
  <rect x="300" y="178" width="100" height="44" rx="10" fill="#151b27" stroke="var(--amber)"/>
  <text x="350" y="205" fill="var(--amber)" font-size="12" font-weight="700" text-anchor="middle">Lock 1</text>

  <path d="M210 120 Q280 120 300 90" fill="none" stroke="var(--rose)" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="250" y="95" fill="var(--rose)" font-size="10" text-anchor="middle">wants L2</text>
  <path d="M490 130 Q420 130 400 200" fill="none" stroke="var(--rose)" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="455" y="190" fill="var(--rose)" font-size="10" text-anchor="middle">wants L1</text>

  <text x="350" y="130" fill="var(--rose)" font-size="13" font-weight="700" text-anchor="middle">∞</text>
  <text x="350" y="245" fill="#8b93a7" font-size="10.5" text-anchor="middle">circular wait — neither releases — frozen forever</text>
</svg>`,

  /* ---------- Level 3: synchronized monitor ---------- */
  monitor: `
<svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="270" y="40" width="160" height="140" rx="14" fill="rgba(96,165,250,0.07)" stroke="var(--blue)"/>
  <text x="350" y="66" fill="var(--blue)" font-size="12" font-weight="700" text-anchor="middle">synchronized</text>
  <text x="350" y="82" fill="#8b93a7" font-size="9.5" text-anchor="middle">(one lock)</text>
  <circle cx="350" cy="120" r="26" fill="rgba(251,191,36,0.15)" stroke="var(--amber)"/>
  <text x="350" y="126" fill="var(--amber)" font-size="18" text-anchor="middle">🔒</text>
  <text x="350" y="166" fill="#cdd4e1" font-size="10" text-anchor="middle">critical section</text>

  <rect x="40" y="95" width="120" height="50" rx="10" fill="rgba(45,212,191,0.12)" stroke="var(--teal)"/>
  <text x="100" y="118" fill="var(--teal)" font-size="11.5" font-weight="700" text-anchor="middle">Thread A</text>
  <text x="100" y="135" fill="#8b93a7" font-size="9.5" text-anchor="middle">holds lock — inside</text>
  <line x1="160" y1="120" x2="268" y2="120" stroke="var(--teal)" stroke-width="2"/>

  <rect x="540" y="60" width="120" height="40" rx="10" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="600" y="79" fill="var(--rose)" font-size="11" font-weight="700" text-anchor="middle">Thread B</text>
  <text x="600" y="93" fill="#8b93a7" font-size="9" text-anchor="middle">BLOCKED</text>
  <rect x="540" y="130" width="120" height="40" rx="10" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="600" y="149" fill="var(--rose)" font-size="11" font-weight="700" text-anchor="middle">Thread C</text>
  <text x="600" y="163" fill="#8b93a7" font-size="9" text-anchor="middle">BLOCKED</text>
  <line x1="430" y1="100" x2="540" y2="80" stroke="var(--line-2)" stroke-dasharray="4 3"/>
  <line x1="430" y1="140" x2="540" y2="150" stroke="var(--line-2)" stroke-dasharray="4 3"/>
</svg>`,

  /* ---------- Level 3: wait / notify ---------- */
  waitNotify: `
<svg viewBox="0 0 700 230" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr3" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--green)"/>
    </marker>
  </defs>
  <rect x="40" y="40" width="180" height="150" rx="12" fill="rgba(45,212,191,0.07)" stroke="var(--teal)"/>
  <text x="130" y="64" fill="var(--teal)" font-size="12" font-weight="700" text-anchor="middle">Consumer</text>
  <text x="130" y="92" fill="#cdd4e1" font-size="10.5" text-anchor="middle">has lock, data not ready</text>
  <rect x="60" y="105" width="140" height="34" rx="7" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="130" y="127" fill="var(--amber)" font-size="10.5" text-anchor="middle">wait() → sleeps</text>
  <text x="130" y="160" fill="#8b93a7" font-size="9.5" text-anchor="middle">releases lock &amp; parks</text>

  <rect x="480" y="40" width="180" height="150" rx="12" fill="rgba(167,139,250,0.07)" stroke="var(--purple)"/>
  <text x="570" y="64" fill="var(--purple)" font-size="12" font-weight="700" text-anchor="middle">Producer</text>
  <text x="570" y="92" fill="#cdd4e1" font-size="10.5" text-anchor="middle">prepares data, takes lock</text>
  <rect x="500" y="105" width="140" height="34" rx="7" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="570" y="127" fill="var(--green)" font-size="10.5" text-anchor="middle">notify() → wakes</text>
  <text x="570" y="160" fill="#8b93a7" font-size="9.5" text-anchor="middle">consumer re-checks &amp; runs</text>

  <path d="M480 122 L222 122" fill="none" stroke="var(--green)" stroke-width="2" marker-end="url(#arr3)"/>
  <text x="350" y="113" fill="var(--green)" font-size="10.5" text-anchor="middle" font-weight="600">"data is ready!"</text>
</svg>`,

  /* ---------- Level 4: Cache visibility ---------- */
  cacheVisibility: `
<svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="30" width="180" height="120" rx="12" fill="rgba(45,212,191,0.06)" stroke="var(--teal)"/>
  <text x="130" y="54" fill="var(--teal)" font-size="12" font-weight="700" text-anchor="middle">Core 1 — Thread A</text>
  <rect x="62" y="70" width="136" height="56" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="130" y="94" fill="#cdd4e1" font-size="10.5" text-anchor="middle">L1 cache</text>
  <text x="130" y="113" fill="var(--green)" font-size="12" font-weight="700" text-anchor="middle">flag = true</text>

  <rect x="480" y="30" width="180" height="120" rx="12" fill="rgba(167,139,250,0.06)" stroke="var(--purple)"/>
  <text x="570" y="54" fill="var(--purple)" font-size="12" font-weight="700" text-anchor="middle">Core 2 — Thread B</text>
  <rect x="502" y="70" width="136" height="56" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="570" y="94" fill="#cdd4e1" font-size="10.5" text-anchor="middle">L1 cache</text>
  <text x="570" y="113" fill="var(--rose)" font-size="12" font-weight="700" text-anchor="middle">flag = false</text>

  <rect x="220" y="185" width="260" height="44" rx="10" fill="rgba(251,191,36,0.07)" stroke="var(--amber)"/>
  <text x="350" y="205" fill="var(--amber)" font-size="12" font-weight="700" text-anchor="middle">Main Memory (RAM)</text>
  <text x="350" y="221" fill="#8b93a7" font-size="9.5" text-anchor="middle">flag = false (stale)</text>

  <line x1="130" y1="150" x2="260" y2="185" stroke="var(--line-2)" stroke-dasharray="4 3"/>
  <line x1="570" y1="150" x2="440" y2="185" stroke="var(--line-2)" stroke-dasharray="4 3"/>
  <text x="350" y="100" fill="var(--rose)" font-size="11" font-weight="700" text-anchor="middle">✗ B never sees A's write</text>
  <text x="350" y="140" fill="#8b93a7" font-size="10" text-anchor="middle">each core reads its own cache → visibility bug</text>
</svg>`,

  /* ---------- Level 4: ThreadLocal ---------- */
  threadLocal: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="26" fill="#cdd4e1" font-size="12" text-anchor="middle">ThreadLocal&lt;User&gt; — one variable, a private copy per thread</text>
  <rect x="40" y="50" width="190" height="100" rx="12" fill="rgba(45,212,191,0.07)" stroke="var(--teal)"/>
  <text x="135" y="76" fill="var(--teal)" font-size="12" font-weight="700" text-anchor="middle">Thread A</text>
  <rect x="62" y="92" width="146" height="40" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="135" y="117" fill="#cdd4e1" font-size="11" text-anchor="middle">get() → "Alice"</text>

  <rect x="255" y="50" width="190" height="100" rx="12" fill="rgba(167,139,250,0.07)" stroke="var(--purple)"/>
  <text x="350" y="76" fill="var(--purple)" font-size="12" font-weight="700" text-anchor="middle">Thread B</text>
  <rect x="277" y="92" width="146" height="40" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="350" y="117" fill="#cdd4e1" font-size="11" text-anchor="middle">get() → "Bob"</text>

  <rect x="470" y="50" width="190" height="100" rx="12" fill="rgba(96,165,250,0.07)" stroke="var(--blue)"/>
  <text x="565" y="76" fill="var(--blue)" font-size="12" font-weight="700" text-anchor="middle">Thread C</text>
  <rect x="492" y="92" width="146" height="40" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="565" y="117" fill="#8b93a7" font-size="11" text-anchor="middle">get() → null</text>
</svg>`,

  /* ---------- Level 5: ReadWriteLock ---------- */
  readWriteLock: `
<svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="30" width="300" height="170" rx="14" fill="rgba(74,222,128,0.05)" stroke="var(--green)" stroke-opacity="0.5"/>
  <text x="190" y="56" fill="var(--green)" font-size="13" font-weight="700" text-anchor="middle">Read Lock — shared</text>
  <rect x="60" y="78" width="80" height="46" rx="9" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <text x="100" y="105" fill="var(--green)" font-size="10.5" text-anchor="middle">Reader 1</text>
  <rect x="150" y="78" width="80" height="46" rx="9" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <text x="190" y="105" fill="var(--green)" font-size="10.5" text-anchor="middle">Reader 2</text>
  <rect x="240" y="78" width="80" height="46" rx="9" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <text x="280" y="105" fill="var(--green)" font-size="10.5" text-anchor="middle">Reader 3</text>
  <text x="190" y="160" fill="#cdd4e1" font-size="11" text-anchor="middle">many readers at once ✓</text>
  <text x="190" y="180" fill="#8b93a7" font-size="9.5" text-anchor="middle">no waiting, full parallel reads</text>

  <rect x="360" y="30" width="300" height="170" rx="14" fill="rgba(251,113,133,0.05)" stroke="var(--rose)" stroke-opacity="0.5"/>
  <text x="510" y="56" fill="var(--rose)" font-size="13" font-weight="700" text-anchor="middle">Write Lock — exclusive</text>
  <rect x="450" y="82" width="120" height="46" rx="9" fill="rgba(251,113,133,0.12)" stroke="var(--rose)"/>
  <text x="510" y="110" fill="var(--rose)" font-size="11" text-anchor="middle">Writer (alone)</text>
  <text x="510" y="160" fill="#cdd4e1" font-size="11" text-anchor="middle">blocks all readers &amp; writers ✗</text>
  <text x="510" y="180" fill="#8b93a7" font-size="9.5" text-anchor="middle">nobody reads while writing</text>
</svg>`,

  /* ---------- Level 6: Synchronizers ---------- */
  synchronizers: `
<svg viewBox="0 0 700 230" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="30" width="210" height="180" rx="12" fill="#0e1422" stroke="var(--blue)" stroke-opacity="0.5"/>
  <text x="125" y="54" fill="var(--blue)" font-size="12" font-weight="700" text-anchor="middle">CountDownLatch</text>
  <text x="125" y="74" fill="#8b93a7" font-size="9.5" text-anchor="middle">one-way gate (3→0)</text>
  <circle cx="70" cy="110" r="11" fill="rgba(96,165,250,0.2)" stroke="var(--blue)"/>
  <circle cx="105" cy="110" r="11" fill="rgba(96,165,250,0.2)" stroke="var(--blue)"/>
  <circle cx="140" cy="110" r="11" fill="rgba(96,165,250,0.2)" stroke="var(--blue)"/>
  <text x="125" y="150" fill="#cdd4e1" font-size="9.5" text-anchor="middle">countDown() ×3</text>
  <text x="125" y="172" fill="var(--green)" font-size="10.5" font-weight="700" text-anchor="middle">→ gate opens</text>
  <text x="125" y="192" fill="#8b93a7" font-size="9" text-anchor="middle">single use</text>

  <rect x="245" y="30" width="210" height="180" rx="12" fill="#0e1422" stroke="var(--teal)" stroke-opacity="0.5"/>
  <text x="350" y="54" fill="var(--teal)" font-size="12" font-weight="700" text-anchor="middle">CyclicBarrier</text>
  <text x="350" y="74" fill="#8b93a7" font-size="9.5" text-anchor="middle">rally point (reusable)</text>
  <line x1="350" y1="88" x2="350" y2="150" stroke="var(--teal)" stroke-width="2" stroke-dasharray="3 3"/>
  <circle cx="320" cy="105" r="9" fill="rgba(45,212,191,0.2)" stroke="var(--teal)"/>
  <circle cx="320" cy="130" r="9" fill="rgba(45,212,191,0.2)" stroke="var(--teal)"/>
  <circle cx="380" cy="105" r="9" fill="rgba(45,212,191,0.2)" stroke="var(--teal)"/>
  <circle cx="380" cy="130" r="9" fill="rgba(45,212,191,0.2)" stroke="var(--teal)"/>
  <text x="350" y="172" fill="var(--green)" font-size="10" font-weight="700" text-anchor="middle">all arrive → release</text>
  <text x="350" y="192" fill="#8b93a7" font-size="9" text-anchor="middle">resets for next round</text>

  <rect x="470" y="30" width="210" height="180" rx="12" fill="#0e1422" stroke="var(--amber)" stroke-opacity="0.5"/>
  <text x="575" y="54" fill="var(--amber)" font-size="12" font-weight="700" text-anchor="middle">Semaphore</text>
  <text x="575" y="74" fill="#8b93a7" font-size="9.5" text-anchor="middle">N permits (e.g. 2)</text>
  <rect x="520" y="92" width="50" height="30" rx="6" fill="rgba(251,191,36,0.18)" stroke="var(--amber)"/>
  <text x="545" y="112" fill="var(--amber)" font-size="9" text-anchor="middle">permit</text>
  <rect x="580" y="92" width="50" height="30" rx="6" fill="rgba(251,191,36,0.18)" stroke="var(--amber)"/>
  <text x="605" y="112" fill="var(--amber)" font-size="9" text-anchor="middle">permit</text>
  <text x="575" y="150" fill="#cdd4e1" font-size="9.5" text-anchor="middle">acquire() / release()</text>
  <text x="575" y="172" fill="var(--rose)" font-size="10" font-weight="700" text-anchor="middle">others block at 0</text>
  <text x="575" y="192" fill="#8b93a7" font-size="9" text-anchor="middle">throttles concurrency</text>
</svg>`,

  /* ---------- Level 7: CAS loop ---------- */
  casLoop: `
<svg viewBox="0 0 700 210" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr4" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="40" y="80" width="120" height="50" rx="10" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="100" y="102" fill="var(--blue)" font-size="11" text-anchor="middle">read value</text>
  <text x="100" y="118" fill="#8b93a7" font-size="9.5" text-anchor="middle">expected = 5</text>

  <rect x="220" y="80" width="140" height="50" rx="10" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="290" y="100" fill="var(--purple)" font-size="11" text-anchor="middle">compute new</text>
  <text x="290" y="116" fill="#8b93a7" font-size="9.5" text-anchor="middle">new = 6</text>

  <rect x="420" y="72" width="160" height="66" rx="10" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="500" y="96" fill="var(--amber)" font-size="11" font-weight="700" text-anchor="middle">CAS(5 → 6)</text>
  <text x="500" y="113" fill="#8b93a7" font-size="9" text-anchor="middle">still 5? swap : fail</text>
  <text x="500" y="128" fill="#8b93a7" font-size="9" text-anchor="middle">hardware instruction</text>

  <line x1="160" y1="105" x2="216" y2="105" stroke="var(--text-3)" marker-end="url(#arr4)"/>
  <line x1="360" y1="105" x2="416" y2="105" stroke="var(--text-3)" marker-end="url(#arr4)"/>

  <line x1="600" y1="105" x2="630" y2="105" stroke="var(--green)" marker-end="url(#arr4)"/>
  <text x="648" y="100" fill="var(--green)" font-size="10" text-anchor="middle">✓ done</text>

  <path d="M500 138 Q500 180 100 180 L100 132" fill="none" stroke="var(--rose)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arr4)"/>
  <text x="300" y="197" fill="var(--rose)" font-size="10.5" text-anchor="middle">✗ failed (someone changed it) → retry the whole loop (spin)</text>
</svg>`,

  /* ---------- Level 7: LongAdder ---------- */
  longAdder: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <text x="175" y="26" fill="#cdd4e1" font-size="11.5" text-anchor="middle">AtomicLong — everyone fights 1 cell</text>
  <rect x="120" y="40" width="110" height="44" rx="9" fill="rgba(251,113,133,0.1)" stroke="var(--rose)"/>
  <text x="175" y="67" fill="var(--rose)" font-size="12" font-weight="700" text-anchor="middle">counter</text>
  <circle cx="60" cy="120" r="10" fill="rgba(45,212,191,0.18)" stroke="var(--teal)"/>
  <circle cx="120" cy="135" r="10" fill="rgba(45,212,191,0.18)" stroke="var(--teal)"/>
  <circle cx="175" cy="140" r="10" fill="rgba(45,212,191,0.18)" stroke="var(--teal)"/>
  <circle cx="230" cy="135" r="10" fill="rgba(45,212,191,0.18)" stroke="var(--teal)"/>
  <circle cx="290" cy="120" r="10" fill="rgba(45,212,191,0.18)" stroke="var(--teal)"/>
  <line x1="60" y1="110" x2="160" y2="84" stroke="var(--rose)" stroke-opacity="0.5"/>
  <line x1="120" y1="125" x2="170" y2="84" stroke="var(--rose)" stroke-opacity="0.5"/>
  <line x1="175" y1="130" x2="175" y2="84" stroke="var(--rose)" stroke-opacity="0.5"/>
  <line x1="230" y1="125" x2="180" y2="84" stroke="var(--rose)" stroke-opacity="0.5"/>
  <line x1="290" y1="110" x2="190" y2="84" stroke="var(--rose)" stroke-opacity="0.5"/>
  <text x="175" y="180" fill="var(--rose)" font-size="10" text-anchor="middle">contention → wasted CPU</text>

  <line x1="365" y1="30" x2="365" y2="185" stroke="var(--line-2)" stroke-dasharray="4 4"/>

  <text x="535" y="26" fill="#cdd4e1" font-size="11.5" text-anchor="middle">LongAdder — split into cells</text>
  <rect x="420" y="100" width="55" height="38" rx="7" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <rect x="485" y="100" width="55" height="38" rx="7" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <rect x="550" y="100" width="55" height="38" rx="7" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <rect x="615" y="100" width="55" height="38" rx="7" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <text x="447" y="124" fill="var(--green)" font-size="10" text-anchor="middle">cell</text>
  <text x="512" y="124" fill="var(--green)" font-size="10" text-anchor="middle">cell</text>
  <text x="577" y="124" fill="var(--green)" font-size="10" text-anchor="middle">cell</text>
  <text x="642" y="124" fill="var(--green)" font-size="10" text-anchor="middle">cell</text>
  <circle cx="447" cy="65" r="9" fill="rgba(45,212,191,0.18)" stroke="var(--teal)"/>
  <circle cx="512" cy="65" r="9" fill="rgba(45,212,191,0.18)" stroke="var(--teal)"/>
  <circle cx="577" cy="65" r="9" fill="rgba(45,212,191,0.18)" stroke="var(--teal)"/>
  <circle cx="642" cy="65" r="9" fill="rgba(45,212,191,0.18)" stroke="var(--teal)"/>
  <line x1="447" y1="74" x2="447" y2="100" stroke="var(--green)" stroke-opacity="0.6"/>
  <line x1="512" y1="74" x2="512" y2="100" stroke="var(--green)" stroke-opacity="0.6"/>
  <line x1="577" y1="74" x2="577" y2="100" stroke="var(--green)" stroke-opacity="0.6"/>
  <line x1="642" y1="74" x2="642" y2="100" stroke="var(--green)" stroke-opacity="0.6"/>
  <text x="545" y="165" fill="var(--green)" font-size="10" text-anchor="middle">sum() adds cells → no contention</text>
</svg>`,

  /* ---------- Level 8: Thread pool ---------- */
  threadPool: `
<svg viewBox="0 0 700 210" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr5" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <text x="90" y="30" fill="#8b93a7" font-size="11" text-anchor="middle">Task queue</text>
  <rect x="30" y="42" width="120" height="130" rx="10" fill="#0e1422" stroke="var(--line-2)"/>
  <rect x="45" y="55" width="90" height="24" rx="5" fill="#151b27" stroke="var(--line-2)"/>
  <text x="90" y="71" fill="#cdd4e1" font-size="10" text-anchor="middle">task</text>
  <rect x="45" y="83" width="90" height="24" rx="5" fill="#151b27" stroke="var(--line-2)"/>
  <text x="90" y="99" fill="#cdd4e1" font-size="10" text-anchor="middle">task</text>
  <rect x="45" y="111" width="90" height="24" rx="5" fill="#151b27" stroke="var(--line-2)"/>
  <text x="90" y="127" fill="#cdd4e1" font-size="10" text-anchor="middle">task</text>
  <rect x="45" y="139" width="90" height="24" rx="5" fill="#151b27" stroke="var(--line-2)"/>
  <text x="90" y="155" fill="#8b93a7" font-size="10" text-anchor="middle">task #51…</text>

  <line x1="155" y1="105" x2="225" y2="105" stroke="var(--text-3)" marker-end="url(#arr5)"/>

  <rect x="235" y="42" width="220" height="130" rx="12" fill="rgba(251,191,36,0.06)" stroke="var(--amber)"/>
  <text x="345" y="30" fill="var(--amber)" font-size="11" text-anchor="middle">Fixed pool (reused threads)</text>
  <circle cx="290" cy="85" r="20" fill="rgba(251,191,36,0.15)" stroke="var(--amber)"/>
  <text x="290" y="90" fill="var(--amber)" font-size="9.5" text-anchor="middle">T1</text>
  <circle cx="345" cy="85" r="20" fill="rgba(251,191,36,0.15)" stroke="var(--amber)"/>
  <text x="345" y="90" fill="var(--amber)" font-size="9.5" text-anchor="middle">T2</text>
  <circle cx="400" cy="85" r="20" fill="rgba(251,191,36,0.15)" stroke="var(--amber)"/>
  <text x="400" y="90" fill="var(--amber)" font-size="9.5" text-anchor="middle">T3</text>
  <text x="345" y="145" fill="#8b93a7" font-size="10" text-anchor="middle">stay alive, grab next task</text>

  <line x1="460" y1="105" x2="530" y2="105" stroke="var(--text-3)" marker-end="url(#arr5)"/>
  <rect x="540" y="65" width="140" height="80" rx="12" fill="rgba(74,222,128,0.06)" stroke="var(--green)"/>
  <text x="610" y="100" fill="var(--green)" font-size="12" font-weight="700" text-anchor="middle">Results</text>
  <text x="610" y="120" fill="#8b93a7" font-size="10" text-anchor="middle">Future&lt;T&gt;</text>
</svg>`,

  /* ---------- Level 8: ForkJoin work stealing ---------- */
  forkJoin: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr6" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="var(--green)"/>
    </marker>
  </defs>
  <rect x="40" y="50" width="150" height="120" rx="12" fill="rgba(96,165,250,0.06)" stroke="var(--blue)"/>
  <text x="115" y="74" fill="var(--blue)" font-size="12" font-weight="700" text-anchor="middle">Worker A</text>
  <rect x="60" y="86" width="110" height="22" rx="5" fill="#151b27" stroke="var(--line-2)"/>
  <text x="115" y="101" fill="#cdd4e1" font-size="9.5" text-anchor="middle">subtask</text>
  <rect x="60" y="112" width="110" height="22" rx="5" fill="#151b27" stroke="var(--line-2)"/>
  <text x="115" y="127" fill="#cdd4e1" font-size="9.5" text-anchor="middle">subtask</text>
  <rect x="60" y="138" width="110" height="22" rx="5" fill="#151b27" stroke="var(--line-2)"/>
  <text x="115" y="153" fill="#cdd4e1" font-size="9.5" text-anchor="middle">subtask</text>

  <rect x="510" y="50" width="150" height="120" rx="12" fill="rgba(74,222,128,0.06)" stroke="var(--green)"/>
  <text x="585" y="74" fill="var(--green)" font-size="12" font-weight="700" text-anchor="middle">Worker B</text>
  <text x="585" y="120" fill="#8b93a7" font-size="10" text-anchor="middle">queue empty</text>
  <text x="585" y="138" fill="#8b93a7" font-size="10" text-anchor="middle">(finished early)</text>

  <path d="M510 110 Q350 70 175 138" fill="none" stroke="var(--green)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arr6)"/>
  <text x="345" y="60" fill="var(--green)" font-size="11" font-weight="700" text-anchor="middle">steals work from bottom of A's queue</text>
  <text x="350" y="190" fill="#8b93a7" font-size="10" text-anchor="middle">all cores stay busy → 100% utilization</text>
</svg>`,

  /* ---------- Level 9: ConcurrentHashMap ---------- */
  concurrentMap: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="26" fill="#cdd4e1" font-size="12" text-anchor="middle">Lock striping — lock only the bucket, not the whole map</text>
  <g>
    <rect x="40" y="60" width="90" height="90" rx="10" fill="#0e1422" stroke="var(--teal)"/>
    <text x="85" y="82" fill="var(--teal)" font-size="10" text-anchor="middle">bucket 0</text>
    <text x="85" y="105" fill="#cdd4e1" font-size="9.5" text-anchor="middle">User1</text>
    <text x="85" y="135" fill="var(--green)" font-size="9" text-anchor="middle">🔒 Thread A</text>
  </g>
  <g>
    <rect x="145" y="60" width="90" height="90" rx="10" fill="#0e1422" stroke="var(--purple)"/>
    <text x="190" y="82" fill="var(--purple)" font-size="10" text-anchor="middle">bucket 1</text>
    <text x="190" y="105" fill="#cdd4e1" font-size="9.5" text-anchor="middle">User2</text>
    <text x="190" y="135" fill="var(--green)" font-size="9" text-anchor="middle">🔒 Thread B</text>
  </g>
  <rect x="250" y="60" width="90" height="90" rx="10" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="295" y="82" fill="#8b93a7" font-size="10" text-anchor="middle">bucket 2</text>
  <rect x="355" y="60" width="90" height="90" rx="10" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="400" y="82" fill="#8b93a7" font-size="10" text-anchor="middle">bucket 3</text>
  <rect x="460" y="60" width="90" height="90" rx="10" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="505" y="82" fill="#8b93a7" font-size="10" text-anchor="middle">bucket 4</text>
  <rect x="565" y="60" width="90" height="90" rx="10" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="610" y="82" fill="#8b93a7" font-size="10" text-anchor="middle">bucket …</text>
  <text x="350" y="180" fill="var(--green)" font-size="10.5" text-anchor="middle">A updates User1 while B updates User2 — no collision ✓</text>
</svg>`,

  /* ---------- Level 9: Producer / Consumer ---------- */
  producerConsumer: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr7" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="30" y="55" width="130" height="70" rx="12" fill="rgba(45,212,191,0.08)" stroke="var(--teal)"/>
  <text x="95" y="85" fill="var(--teal)" font-size="12" font-weight="700" text-anchor="middle">Producer</text>
  <text x="95" y="104" fill="#8b93a7" font-size="9.5" text-anchor="middle">put() → blocks if full</text>

  <rect x="225" y="60" width="250" height="60" rx="10" fill="#0e1422" stroke="var(--amber)"/>
  <text x="350" y="48" fill="var(--amber)" font-size="11" text-anchor="middle">BlockingQueue (cap 10)</text>
  <rect x="240" y="78" width="34" height="24" rx="5" fill="rgba(251,191,36,0.15)" stroke="var(--amber)"/>
  <rect x="280" y="78" width="34" height="24" rx="5" fill="rgba(251,191,36,0.15)" stroke="var(--amber)"/>
  <rect x="320" y="78" width="34" height="24" rx="5" fill="rgba(251,191,36,0.15)" stroke="var(--amber)"/>
  <rect x="360" y="78" width="34" height="24" rx="5" fill="#151b27" stroke="var(--line-2)"/>
  <rect x="400" y="78" width="34" height="24" rx="5" fill="#151b27" stroke="var(--line-2)"/>

  <rect x="540" y="55" width="130" height="70" rx="12" fill="rgba(167,139,250,0.08)" stroke="var(--purple)"/>
  <text x="605" y="85" fill="var(--purple)" font-size="12" font-weight="700" text-anchor="middle">Consumer</text>
  <text x="605" y="104" fill="#8b93a7" font-size="9.5" text-anchor="middle">take() → blocks if empty</text>

  <line x1="160" y1="90" x2="222" y2="90" stroke="var(--text-3)" marker-end="url(#arr7)"/>
  <line x1="478" y1="90" x2="538" y2="90" stroke="var(--text-3)" marker-end="url(#arr7)"/>
</svg>`,

  /* ---------- Level 10: Virtual threads ---------- */
  virtualThreads: `
<svg viewBox="0 0 700 210" xmlns="http://www.w3.org/2000/svg">
  <text x="350" y="24" fill="#cdd4e1" font-size="12" text-anchor="middle">Millions of virtual threads ride a few OS (carrier) threads</text>
  <rect x="40" y="45" width="620" height="55" rx="10" fill="rgba(167,139,250,0.05)" stroke="var(--purple)" stroke-opacity="0.5"/>
  <text x="350" y="38" fill="var(--purple)" font-size="10.5" text-anchor="middle">Virtual threads (JVM-managed, cheap)</text>
  ${Array.from({length: 14}).map((_,i)=>`<circle cx="${75+i*40}" cy="72" r="9" fill="rgba(167,139,250,0.2)" stroke="var(--purple)"/>`).join('')}

  <line x1="180" y1="100" x2="180" y2="140" stroke="var(--green)" stroke-width="2"/>
  <line x1="420" y1="100" x2="420" y2="140" stroke="var(--green)" stroke-width="2"/>
  <text x="300" y="124" fill="var(--green)" font-size="10" text-anchor="middle">mount / unmount on block</text>

  <rect x="40" y="145" width="620" height="50" rx="10" fill="rgba(74,222,128,0.05)" stroke="var(--green)" stroke-opacity="0.5"/>
  <text x="350" y="195" fill="var(--green)" font-size="10.5" text-anchor="middle">few OS threads — freed for other work while a vthread waits on I/O</text>
  <rect x="130" y="158" width="90" height="24" rx="6" fill="rgba(74,222,128,0.15)" stroke="var(--green)"/>
  <text x="175" y="174" fill="var(--green)" font-size="9.5" text-anchor="middle">carrier 1</text>
  <rect x="370" y="158" width="90" height="24" rx="6" fill="rgba(74,222,128,0.15)" stroke="var(--green)"/>
  <text x="415" y="174" fill="var(--green)" font-size="9.5" text-anchor="middle">carrier 2</text>
</svg>`,

  /* ---------- Level 10: CompletableFuture pipeline ---------- */
  completableFuture: `
<svg viewBox="0 0 700 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr8" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <rect x="20" y="45" width="160" height="50" rx="11" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="100" y="68" fill="var(--blue)" font-size="11" text-anchor="middle">fetch user</text>
  <text x="100" y="84" fill="#8b93a7" font-size="9" text-anchor="middle">supplyAsync</text>

  <rect x="270" y="45" width="160" height="50" rx="11" fill="rgba(45,212,191,0.1)" stroke="var(--teal)"/>
  <text x="350" y="68" fill="var(--teal)" font-size="11" text-anchor="middle">get orders</text>
  <text x="350" y="84" fill="#8b93a7" font-size="9" text-anchor="middle">thenApply</text>

  <rect x="520" y="45" width="160" height="50" rx="11" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="600" y="68" fill="var(--green)" font-size="11" text-anchor="middle">send email</text>
  <text x="600" y="84" fill="#8b93a7" font-size="9" text-anchor="middle">thenAccept</text>

  <line x1="180" y1="70" x2="266" y2="70" stroke="var(--text-3)" marker-end="url(#arr8)"/>
  <line x1="430" y1="70" x2="516" y2="70" stroke="var(--text-3)" marker-end="url(#arr8)"/>
  <text x="350" y="118" fill="#8b93a7" font-size="10" text-anchor="middle">non-blocking — each step fires when the previous finishes</text>
</svg>`,

};
