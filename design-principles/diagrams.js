/* ============================================================
   Inline SVG diagrams for the Design Principles guide. Keyed by
   name, referenced from content.js. Colors use CSS variables
   so they follow the theme.
   ============================================================ */
window.DIAGRAMS = {

  /* ---------- Foundations: cohesion & coupling ---------- */
  cohesionCoupling: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <text x="175" y="26" fill="var(--rose)" font-size="12" font-weight="700" text-anchor="middle">Low cohesion · high coupling</text>
  <rect x="40" y="45" width="80" height="46" rx="9" fill="#0e1422" stroke="var(--rose)"/>
  <rect x="230" y="45" width="80" height="46" rx="9" fill="#0e1422" stroke="var(--rose)"/>
  <rect x="40" y="120" width="80" height="46" rx="9" fill="#0e1422" stroke="var(--rose)"/>
  <rect x="230" y="120" width="80" height="46" rx="9" fill="#0e1422" stroke="var(--rose)"/>
  <line x1="120" y1="68" x2="230" y2="68" stroke="var(--rose)" stroke-opacity="0.6"/>
  <line x1="120" y1="143" x2="230" y2="143" stroke="var(--rose)" stroke-opacity="0.6"/>
  <line x1="80" y1="91" x2="270" y2="120" stroke="var(--rose)" stroke-opacity="0.6"/>
  <line x1="270" y1="91" x2="80" y2="120" stroke="var(--rose)" stroke-opacity="0.6"/>
  <line x1="80" y1="91" x2="80" y2="120" stroke="var(--rose)" stroke-opacity="0.6"/>
  <line x1="270" y1="91" x2="270" y2="120" stroke="var(--rose)" stroke-opacity="0.6"/>
  <text x="175" y="190" fill="var(--text-3)" font-size="9.5" text-anchor="middle">everything tangled — change one, break many</text>

  <line x1="350" y1="30" x2="350" y2="180" stroke="var(--line-2)" stroke-dasharray="4 4"/>

  <text x="525" y="26" fill="var(--green)" font-size="12" font-weight="700" text-anchor="middle">High cohesion · low coupling</text>
  <rect x="400" y="55" width="110" height="90" rx="11" fill="rgba(74,222,128,0.05)" stroke="var(--green)"/>
  <rect x="418" y="72" width="34" height="24" rx="5" fill="rgba(74,222,128,0.15)" stroke="var(--green)"/>
  <rect x="458" y="72" width="34" height="24" rx="5" fill="rgba(74,222,128,0.15)" stroke="var(--green)"/>
  <rect x="438" y="104" width="34" height="24" rx="5" fill="rgba(74,222,128,0.15)" stroke="var(--green)"/>
  <rect x="560" y="55" width="110" height="90" rx="11" fill="rgba(96,165,250,0.05)" stroke="var(--blue)"/>
  <rect x="578" y="72" width="34" height="24" rx="5" fill="rgba(96,165,250,0.15)" stroke="var(--blue)"/>
  <rect x="618" y="72" width="34" height="24" rx="5" fill="rgba(96,165,250,0.15)" stroke="var(--blue)"/>
  <rect x="598" y="104" width="34" height="24" rx="5" fill="rgba(96,165,250,0.15)" stroke="var(--blue)"/>
  <line x1="510" y1="100" x2="560" y2="100" stroke="var(--text-3)"/>
  <text x="535" y="190" fill="var(--text-3)" font-size="9.5" text-anchor="middle">tight modules, thin connections</text>
</svg>`,

  /* ---------- SOLID overview ---------- */
  solid: `
<svg viewBox="0 0 700 150" xmlns="http://www.w3.org/2000/svg">
  ${[['S','Single Responsibility','var(--rose)'],['O','Open/Closed','var(--amber)'],['L','Liskov Substitution','var(--green)'],['I','Interface Segregation','var(--cyan)'],['D','Dependency Inversion','var(--purple)']].map((p,i)=>`
  <rect x="${20+i*135}" y="40" width="120" height="80" rx="12" fill="#0e1422" stroke="${p[2]}"/>
  <text x="${80+i*135}" y="78" fill="${p[2]}" font-size="26" font-weight="800" text-anchor="middle">${p[0]}</text>
  <text x="${80+i*135}" y="102" fill="var(--text-3)" font-size="8" text-anchor="middle">${p[1]}</text>`).join('')}
  <text x="350" y="142" fill="var(--text-3)" font-size="10" text-anchor="middle">five principles for classes that are easy to change and extend</text>
</svg>`,

  /* ---------- SRP ---------- */
  srp: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="pp1" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="40" y="60" width="150" height="80" rx="12" fill="rgba(251,113,133,0.08)" stroke="var(--rose)"/>
  <text x="115" y="84" fill="var(--rose)" font-size="12" font-weight="700" text-anchor="middle">User</text>
  <text x="115" y="104" fill="var(--text-3)" font-size="8.5" text-anchor="middle">save() · email()</text>
  <text x="115" y="118" fill="var(--text-3)" font-size="8.5" text-anchor="middle">validate()</text>
  <text x="115" y="156" fill="var(--rose)" font-size="9" text-anchor="middle">3 reasons to change</text>

  <rect x="430" y="20" width="230" height="36" rx="9" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="545" y="43" fill="var(--green)" font-size="10" text-anchor="middle">UserRepository — persistence</text>
  <rect x="430" y="72" width="230" height="36" rx="9" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="545" y="95" fill="var(--green)" font-size="10" text-anchor="middle">EmailService — messaging</text>
  <rect x="430" y="124" width="230" height="36" rx="9" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="545" y="147" fill="var(--green)" font-size="10" text-anchor="middle">UserValidator — rules</text>

  <line x1="190" y1="90" x2="428" y2="40" stroke="var(--text-3)" marker-end="url(#pp1)"/>
  <line x1="190" y1="100" x2="428" y2="90" stroke="var(--text-3)" marker-end="url(#pp1)"/>
  <line x1="190" y1="110" x2="428" y2="140" stroke="var(--text-3)" marker-end="url(#pp1)"/>
  <text x="300" y="178" fill="var(--text-3)" font-size="9.5" text-anchor="middle">split by responsibility — one reason to change each</text>
</svg>`,

  /* ---------- OCP ---------- */
  ocp: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="pp2" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="none" stroke="var(--text-3)"/></marker></defs>
  <rect x="270" y="20" width="160" height="40" rx="10" fill="#0e1422" stroke="var(--blue)" stroke-dasharray="4 3"/>
  <text x="350" y="38" fill="var(--blue)" font-size="11" font-weight="700" text-anchor="middle">«interface» Shape</text>
  <text x="350" y="52" fill="var(--text-3)" font-size="8.5" text-anchor="middle">area()</text>

  <rect x="60" y="110" width="140" height="40" rx="9" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="130" y="134" fill="var(--green)" font-size="10" text-anchor="middle">Circle  (existing)</text>
  <rect x="280" y="110" width="140" height="40" rx="9" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="350" y="134" fill="var(--green)" font-size="10" text-anchor="middle">Square  (existing)</text>
  <rect x="500" y="110" width="160" height="40" rx="9" fill="rgba(251,191,36,0.12)" stroke="var(--amber)"/>
  <text x="580" y="129" fill="var(--amber)" font-size="10" text-anchor="middle">Triangle  (NEW)</text>
  <text x="580" y="143" fill="var(--text-3)" font-size="8" text-anchor="middle">add, don't edit</text>

  <line x1="130" y1="110" x2="300" y2="62" stroke="var(--text-3)" stroke-dasharray="3 3" marker-end="url(#pp2)"/>
  <line x1="350" y1="110" x2="350" y2="62" stroke="var(--text-3)" stroke-dasharray="3 3" marker-end="url(#pp2)"/>
  <line x1="580" y1="110" x2="400" y2="62" stroke="var(--amber)" stroke-dasharray="3 3" marker-end="url(#pp2)"/>
  <text x="350" y="180" fill="var(--text-3)" font-size="9.5" text-anchor="middle">extend behaviour with new classes — existing code stays closed</text>
</svg>`,

  /* ---------- LSP ---------- */
  lsp: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <rect x="260" y="25" width="180" height="40" rx="10" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="350" y="49" fill="var(--blue)" font-size="11" font-weight="700" text-anchor="middle">Rectangle (base)</text>

  <rect x="80" y="110" width="200" height="46" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="180" y="131" fill="var(--green)" font-size="10.5" text-anchor="middle">TallRectangle ✓</text>
  <text x="180" y="146" fill="var(--text-3)" font-size="8.5" text-anchor="middle">behaves like the base</text>

  <rect x="420" y="110" width="200" height="46" rx="10" fill="rgba(251,113,133,0.08)" stroke="var(--rose)"/>
  <text x="520" y="131" fill="var(--rose)" font-size="10.5" text-anchor="middle">Square ✗</text>
  <text x="520" y="146" fill="var(--text-3)" font-size="8.5" text-anchor="middle">setW also changes H — surprise!</text>

  <line x1="280" y1="110" x2="330" y2="65" stroke="var(--green)" stroke-dasharray="3 3"/>
  <line x1="460" y1="110" x2="380" y2="65" stroke="var(--rose)" stroke-dasharray="3 3"/>
  <text x="350" y="176" fill="var(--text-3)" font-size="9.5" text-anchor="middle">a subtype must be substitutable without breaking callers' expectations</text>
</svg>`,

  /* ---------- ISP ---------- */
  isp: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <text x="160" y="26" fill="var(--rose)" font-size="11.5" font-weight="700" text-anchor="middle">Fat interface</text>
  <rect x="60" y="40" width="200" height="64" rx="11" fill="#0e1422" stroke="var(--rose)"/>
  <text x="160" y="62" fill="var(--rose)" font-size="11" text-anchor="middle">Machine</text>
  <text x="160" y="80" fill="var(--text-3)" font-size="8.5" text-anchor="middle">print() scan() fax()</text>
  <text x="160" y="96" fill="var(--text-3)" font-size="8" text-anchor="middle">printer must stub scan/fax</text>

  <text x="500" y="26" fill="var(--green)" font-size="11.5" font-weight="700" text-anchor="middle">Segregated</text>
  <rect x="420" y="40" width="110" height="34" rx="8" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="475" y="61" fill="var(--green)" font-size="9.5" text-anchor="middle">Printer</text>
  <rect x="545" y="40" width="110" height="34" rx="8" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="600" y="61" fill="var(--green)" font-size="9.5" text-anchor="middle">Scanner</text>
  <rect x="480" y="84" width="110" height="34" rx="8" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="535" y="105" fill="var(--green)" font-size="9.5" text-anchor="middle">Fax</text>
  <rect x="450" y="135" width="160" height="34" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="530" y="156" fill="#cdd4e1" font-size="9.5" text-anchor="middle">SimplePrinter → Printer only</text>
  <text x="160" y="150" fill="var(--text-3)" font-size="9.5" text-anchor="middle">clients shouldn't depend</text>
  <text x="160" y="164" fill="var(--text-3)" font-size="9.5" text-anchor="middle">on methods they don't use</text>
</svg>`,

  /* ---------- DIP ---------- */
  dip: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="pp6" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="none" stroke="var(--text-3)"/></marker></defs>
  <rect x="40" y="65" width="160" height="50" rx="11" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="120" y="86" fill="var(--purple)" font-size="11" font-weight="700" text-anchor="middle">OrderService</text>
  <text x="120" y="102" fill="var(--text-3)" font-size="8.5" text-anchor="middle">high-level policy</text>

  <rect x="270" y="60" width="160" height="60" rx="11" fill="#0e1422" stroke="var(--cyan)" stroke-dasharray="4 3"/>
  <text x="350" y="84" fill="var(--cyan)" font-size="10.5" font-weight="700" text-anchor="middle">«interface»</text>
  <text x="350" y="100" fill="var(--cyan)" font-size="10" text-anchor="middle">OrderRepository</text>

  <rect x="500" y="65" width="170" height="50" rx="11" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="585" y="86" fill="var(--green)" font-size="10.5" font-weight="700" text-anchor="middle">MySqlOrderRepo</text>
  <text x="585" y="102" fill="var(--text-3)" font-size="8.5" text-anchor="middle">low-level detail</text>

  <line x1="200" y1="90" x2="268" y2="90" stroke="var(--text-3)" marker-end="url(#pp6)"/>
  <line x1="500" y1="90" x2="432" y2="90" stroke="var(--text-3)" marker-end="url(#pp6)"/>
  <text x="350" y="150" fill="var(--text-3)" font-size="9.5" text-anchor="middle">both depend on the abstraction — the dependency is "inverted"</text>
</svg>`,

  /* ---------- DRY ---------- */
  dry: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="pp7" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="40" y="35" width="150" height="30" rx="7" fill="#0e1422" stroke="var(--rose)"/>
  <text x="115" y="55" fill="var(--rose)" font-size="9.5" text-anchor="middle">tax calc (copy 1)</text>
  <rect x="40" y="72" width="150" height="30" rx="7" fill="#0e1422" stroke="var(--rose)"/>
  <text x="115" y="92" fill="var(--rose)" font-size="9.5" text-anchor="middle">tax calc (copy 2)</text>
  <rect x="40" y="109" width="150" height="30" rx="7" fill="#0e1422" stroke="var(--rose)"/>
  <text x="115" y="129" fill="var(--rose)" font-size="9.5" text-anchor="middle">tax calc (copy 3)</text>

  <rect x="450" y="68" width="200" height="40" rx="10" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="550" y="86" fill="var(--green)" font-size="11" text-anchor="middle">withTax(amount)</text>
  <text x="550" y="100" fill="var(--text-3)" font-size="8.5" text-anchor="middle">single source of truth</text>

  <line x1="190" y1="50" x2="448" y2="82" stroke="var(--text-3)" marker-end="url(#pp7)"/>
  <line x1="190" y1="87" x2="448" y2="88" stroke="var(--text-3)" marker-end="url(#pp7)"/>
  <line x1="190" y1="124" x2="448" y2="94" stroke="var(--text-3)" marker-end="url(#pp7)"/>
  <text x="320" y="155" fill="var(--text-3)" font-size="9.5" text-anchor="middle">one definition, called everywhere — fix bugs in one place</text>
</svg>`,

  /* ---------- Law of Demeter ---------- */
  demeter: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="pp8" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--rose)"/></marker></defs>
  <text x="350" y="24" fill="var(--rose)" font-size="11" text-anchor="middle">order.getCustomer().getAddress().getCity()  — a train wreck</text>
  <rect x="30" y="45" width="90" height="34" rx="8" fill="rgba(34,211,238,0.1)" stroke="var(--cyan)"/>
  <text x="75" y="66" fill="var(--cyan)" font-size="10" text-anchor="middle">order</text>
  <rect x="180" y="45" width="90" height="34" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="225" y="66" fill="var(--text-3)" font-size="10" text-anchor="middle">Customer</text>
  <rect x="330" y="45" width="90" height="34" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="375" y="66" fill="var(--text-3)" font-size="10" text-anchor="middle">Address</text>
  <rect x="480" y="45" width="90" height="34" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="525" y="66" fill="var(--text-3)" font-size="10" text-anchor="middle">City</text>
  <line x1="120" y1="62" x2="178" y2="62" stroke="var(--rose)" marker-end="url(#pp8)"/>
  <line x1="270" y1="62" x2="328" y2="62" stroke="var(--rose)" marker-end="url(#pp8)"/>
  <line x1="420" y1="62" x2="478" y2="62" stroke="var(--rose)" marker-end="url(#pp8)"/>

  <rect x="30" y="110" width="90" height="34" rx="8" fill="rgba(34,211,238,0.1)" stroke="var(--cyan)"/>
  <text x="75" y="131" fill="var(--cyan)" font-size="10" text-anchor="middle">order</text>
  <rect x="180" y="110" width="180" height="34" rx="8" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="270" y="131" fill="var(--green)" font-size="10" text-anchor="middle">order.shippingCity()</text>
  <line x1="120" y1="127" x2="178" y2="127" stroke="var(--green)" marker-end="url(#pp8)"/>
  <text x="500" y="131" fill="var(--text-3)" font-size="9.5" text-anchor="middle">talk to friends, not strangers</text>
</svg>`,

  /* ---------- Fail-Fast ---------- */
  failFast: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="pp9" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <text x="170" y="24" fill="var(--rose)" font-size="11" font-weight="700" text-anchor="middle">Fail late</text>
  <rect x="40" y="40" width="70" height="28" rx="6" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="75" y="58" fill="var(--text-3)" font-size="9" text-anchor="middle">input</text>
  <rect x="130" y="40" width="70" height="28" rx="6" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="165" y="58" fill="var(--text-3)" font-size="9" text-anchor="middle">layer</text>
  <rect x="220" y="40" width="70" height="28" rx="6" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="255" y="58" fill="var(--text-3)" font-size="9" text-anchor="middle">layer</text>
  <rect x="310" y="40" width="80" height="28" rx="6" fill="rgba(251,113,133,0.12)" stroke="var(--rose)"/>
  <text x="350" y="58" fill="var(--rose)" font-size="9" text-anchor="middle">💥 deep</text>
  <line x1="110" y1="54" x2="128" y2="54" stroke="var(--text-3)" marker-end="url(#pp9)"/>
  <line x1="200" y1="54" x2="218" y2="54" stroke="var(--text-3)" marker-end="url(#pp9)"/>
  <line x1="290" y1="54" x2="308" y2="54" stroke="var(--text-3)" marker-end="url(#pp9)"/>
  <text x="215" y="92" fill="var(--text-3)" font-size="9" text-anchor="middle">corrupt state, confusing stack trace</text>

  <text x="170" y="128" fill="var(--green)" font-size="11" font-weight="700" text-anchor="middle">Fail fast</text>
  <rect x="40" y="142" width="70" height="28" rx="6" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="75" y="160" fill="var(--text-3)" font-size="9" text-anchor="middle">input</text>
  <rect x="130" y="142" width="110" height="28" rx="6" fill="rgba(251,191,36,0.12)" stroke="var(--amber)"/>
  <text x="185" y="160" fill="var(--amber)" font-size="9" text-anchor="middle">validate → throw</text>
  <line x1="110" y1="156" x2="128" y2="156" stroke="var(--text-3)" marker-end="url(#pp9)"/>
  <text x="470" y="156" fill="var(--text-3)" font-size="9.5" text-anchor="middle">reject bad input at the boundary, immediately</text>
</svg>`,

  /* ---------- Method contracts ---------- */
  contracts: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <rect x="250" y="65" width="200" height="44" rx="11" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="350" y="91" fill="var(--blue)" font-size="12" font-weight="700" text-anchor="middle">get(index)</text>

  <rect x="180" y="20" width="340" height="30" rx="8" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="350" y="40" fill="var(--amber)" font-size="10" text-anchor="middle">Precondition: 0 ≤ index &lt; size   (caller must ensure)</text>
  <rect x="180" y="122" width="340" height="30" rx="8" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="350" y="142" fill="var(--green)" font-size="10" text-anchor="middle">Postcondition: returns element; list unchanged   (method guarantees)</text>
  <line x1="350" y1="50" x2="350" y2="63" stroke="var(--amber)"/>
  <line x1="350" y1="109" x2="350" y2="120" stroke="var(--green)"/>
</svg>`,

  /* ---------- Composition over inheritance ---------- */
  composition: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="pp11" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <text x="175" y="24" fill="var(--rose)" font-size="11" font-weight="700" text-anchor="middle">Inheritance (rigid)</text>
  <rect x="100" y="40" width="150" height="34" rx="8" fill="#0e1422" stroke="var(--rose)"/>
  <text x="175" y="61" fill="var(--rose)" font-size="9.5" text-anchor="middle">Bird</text>
  <rect x="40" y="100" width="120" height="34" rx="8" fill="#0e1422" stroke="var(--rose)"/>
  <text x="100" y="121" fill="var(--rose)" font-size="9" text-anchor="middle">Duck</text>
  <rect x="190" y="100" width="120" height="34" rx="8" fill="#0e1422" stroke="var(--rose)"/>
  <text x="250" y="116" fill="var(--rose)" font-size="9" text-anchor="middle">Penguin</text>
  <text x="250" y="128" fill="var(--text-3)" font-size="7.5" text-anchor="middle">can't fly() !</text>
  <line x1="140" y1="100" x2="160" y2="74" stroke="var(--rose)" stroke-dasharray="3 3"/>
  <line x1="240" y1="100" x2="200" y2="74" stroke="var(--rose)" stroke-dasharray="3 3"/>

  <line x1="350" y1="20" x2="350" y2="160" stroke="var(--line-2)" stroke-dasharray="4 4"/>

  <text x="525" y="24" fill="var(--green)" font-size="11" font-weight="700" text-anchor="middle">Composition (flexible)</text>
  <rect x="450" y="55" width="150" height="34" rx="8" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="525" y="76" fill="var(--green)" font-size="9.5" text-anchor="middle">Bird</text>
  <rect x="440" y="115" width="100" height="32" rx="8" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="490" y="135" fill="var(--blue)" font-size="9" text-anchor="middle">FlyBehavior</text>
  <rect x="560" y="115" width="110" height="32" rx="8" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="615" y="135" fill="var(--blue)" font-size="9" text-anchor="middle">WalkBehavior</text>
  <line x1="500" y1="89" x2="490" y2="113" stroke="var(--text-3)" marker-end="url(#pp11)"/>
  <line x1="560" y1="89" x2="615" y2="113" stroke="var(--text-3)" marker-end="url(#pp11)"/>
  <text x="525" y="168" fill="var(--text-3)" font-size="8.5" text-anchor="middle">has-a behaviours, swap at runtime</text>
</svg>`,

};
