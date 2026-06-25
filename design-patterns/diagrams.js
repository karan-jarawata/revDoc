/* ============================================================
   Inline SVG diagrams for the Design Patterns guide. Keyed by
   name, referenced from content.js. Colors use CSS variables
   so they follow the theme.
   ============================================================ */
window.DIAGRAMS = {

  /* ---------- Overview: the three categories ---------- */
  categories: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="40" width="210" height="100" rx="13" fill="rgba(74,222,128,0.06)" stroke="var(--green)"/>
  <text x="125" y="66" fill="var(--green)" font-size="13" font-weight="700" text-anchor="middle">Creational</text>
  <text x="125" y="92" fill="#cdd4e1" font-size="10.5" text-anchor="middle">how objects are made</text>
  <text x="125" y="112" fill="var(--text-3)" font-size="9.5" text-anchor="middle">Singleton · Factory · Builder</text>

  <rect x="245" y="40" width="210" height="100" rx="13" fill="rgba(251,191,36,0.06)" stroke="var(--amber)"/>
  <text x="350" y="66" fill="var(--amber)" font-size="13" font-weight="700" text-anchor="middle">Structural</text>
  <text x="350" y="92" fill="#cdd4e1" font-size="10.5" text-anchor="middle">how objects compose</text>
  <text x="350" y="112" fill="var(--text-3)" font-size="9.5" text-anchor="middle">Adapter · Facade · Proxy</text>

  <rect x="470" y="40" width="210" height="100" rx="13" fill="rgba(34,211,238,0.06)" stroke="var(--cyan)"/>
  <text x="575" y="66" fill="var(--cyan)" font-size="13" font-weight="700" text-anchor="middle">Behavioral</text>
  <text x="575" y="92" fill="#cdd4e1" font-size="10.5" text-anchor="middle">how objects interact</text>
  <text x="575" y="112" fill="var(--text-3)" font-size="9.5" text-anchor="middle">Strategy · Observer · State</text>
</svg>`,

  /* ---------- Singleton ---------- */
  singleton: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp1" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="280" y="60" width="140" height="64" rx="12" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="350" y="84" fill="var(--green)" font-size="12.5" font-weight="700" text-anchor="middle">Singleton</text>
  <text x="350" y="104" fill="var(--text-3)" font-size="9.5" text-anchor="middle">- instance (static)</text>
  <text x="350" y="118" fill="var(--text-3)" font-size="9" text-anchor="middle">+ getInstance()</text>

  <rect x="40" y="40" width="110" height="36" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="95" y="63" fill="#cdd4e1" font-size="10" text-anchor="middle">Client A</text>
  <rect x="40" y="108" width="110" height="36" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="95" y="131" fill="#cdd4e1" font-size="10" text-anchor="middle">Client B</text>
  <rect x="550" y="74" width="110" height="36" rx="8" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="605" y="97" fill="#cdd4e1" font-size="10" text-anchor="middle">Client C</text>

  <line x1="150" y1="62" x2="278" y2="82" stroke="var(--text-3)" marker-end="url(#dp1)"/>
  <line x1="150" y1="124" x2="278" y2="100" stroke="var(--text-3)" marker-end="url(#dp1)"/>
  <line x1="550" y1="92" x2="422" y2="92" stroke="var(--text-3)" marker-end="url(#dp1)"/>
  <text x="350" y="156" fill="var(--text-3)" font-size="10" text-anchor="middle">one shared instance · private constructor · global access point</text>
</svg>`,

  /* ---------- Factory Method ---------- */
  factoryMethod: `
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp2" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="none" stroke="var(--text-3)"/></marker></defs>
  <rect x="40" y="75" width="150" height="56" rx="11" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="115" y="98" fill="var(--green)" font-size="11.5" font-weight="700" text-anchor="middle">Creator</text>
  <text x="115" y="116" fill="var(--text-3)" font-size="9" text-anchor="middle">+ create() : Product</text>

  <rect x="280" y="20" width="150" height="46" rx="11" fill="#0e1422" stroke="var(--blue)" stroke-dasharray="4 3"/>
  <text x="355" y="42" fill="var(--blue)" font-size="11" font-weight="700" text-anchor="middle">«interface»</text>
  <text x="355" y="58" fill="var(--blue)" font-size="10.5" text-anchor="middle">Product</text>

  <rect x="280" y="100" width="150" height="40" rx="9" fill="rgba(96,165,250,0.08)" stroke="var(--blue)"/>
  <text x="355" y="124" fill="var(--blue)" font-size="10" text-anchor="middle">ConcreteProductA</text>
  <rect x="280" y="150" width="150" height="40" rx="9" fill="rgba(96,165,250,0.08)" stroke="var(--blue)"/>
  <text x="355" y="174" fill="var(--blue)" font-size="10" text-anchor="middle">ConcreteProductB</text>

  <rect x="520" y="85" width="150" height="40" rx="9" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="595" y="109" fill="#cdd4e1" font-size="10" text-anchor="middle">Client</text>

  <line x1="190" y1="100" x2="278" y2="55" stroke="var(--text-3)" stroke-dasharray="4 3" marker-end="url(#dp2)"/>
  <text x="245" y="78" fill="var(--text-3)" font-size="8.5" text-anchor="middle">returns</text>
  <line x1="355" y1="100" x2="355" y2="68" stroke="var(--text-3)" stroke-dasharray="2 2"/>
  <line x1="355" y1="150" x2="355" y2="68" stroke="var(--text-3)" stroke-dasharray="2 2"/>
  <line x1="520" y1="105" x2="192" y2="105" stroke="var(--text-3)" marker-end="url(#dp2)"/>
  <text x="350" y="195" fill="none">.</text>
</svg>`,

  /* ---------- Builder ---------- */
  builder: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp3" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="40" y="70" width="120" height="44" rx="10" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="100" y="96" fill="#cdd4e1" font-size="10.5" text-anchor="middle">Client</text>

  <rect x="230" y="40" width="170" height="100" rx="12" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="315" y="64" fill="var(--green)" font-size="11.5" font-weight="700" text-anchor="middle">Builder</text>
  <text x="315" y="86" fill="var(--text-3)" font-size="9.5" text-anchor="middle">.setName(..)</text>
  <text x="315" y="102" fill="var(--text-3)" font-size="9.5" text-anchor="middle">.setAge(..)</text>
  <text x="315" y="124" fill="var(--green)" font-size="9.5" text-anchor="middle">.build()  ↴</text>

  <rect x="480" y="70" width="170" height="44" rx="10" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="565" y="90" fill="var(--blue)" font-size="11" font-weight="700" text-anchor="middle">Product</text>
  <text x="565" y="106" fill="var(--text-3)" font-size="9" text-anchor="middle">immutable, fully built</text>

  <line x1="160" y1="92" x2="228" y2="92" stroke="var(--text-3)" marker-end="url(#dp3)"/>
  <line x1="400" y1="100" x2="478" y2="95" stroke="var(--text-3)" marker-end="url(#dp3)"/>
  <text x="350" y="166" fill="var(--text-3)" font-size="10" text-anchor="middle">fluent step-by-step construction → one final immutable object</text>
</svg>`,

  /* ---------- Adapter ---------- */
  adapter: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp4" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="30" y="65" width="110" height="44" rx="10" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="85" y="84" fill="#cdd4e1" font-size="10.5" text-anchor="middle">Client</text>
  <text x="85" y="100" fill="var(--text-3)" font-size="8.5" text-anchor="middle">wants Target</text>

  <rect x="210" y="65" width="130" height="44" rx="10" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="275" y="84" fill="var(--amber)" font-size="11" font-weight="700" text-anchor="middle">Adapter</text>
  <text x="275" y="100" fill="var(--text-3)" font-size="8.5" text-anchor="middle">implements Target</text>

  <rect x="420" y="65" width="140" height="44" rx="10" fill="rgba(251,113,133,0.08)" stroke="var(--rose)"/>
  <text x="490" y="84" fill="var(--rose)" font-size="11" font-weight="700" text-anchor="middle">Adaptee</text>
  <text x="490" y="100" fill="var(--text-3)" font-size="8.5" text-anchor="middle">legacy, wrong API</text>

  <line x1="140" y1="87" x2="208" y2="87" stroke="var(--text-3)" marker-end="url(#dp4)"/>
  <text x="174" y="78" fill="var(--text-3)" font-size="8.5" text-anchor="middle">calls</text>
  <line x1="340" y1="87" x2="418" y2="87" stroke="var(--text-3)" marker-end="url(#dp4)"/>
  <text x="379" y="78" fill="var(--text-3)" font-size="8.5" text-anchor="middle">translates</text>
  <text x="350" y="150" fill="var(--text-3)" font-size="10" text-anchor="middle">wraps an incompatible class to fit the interface the client expects</text>
</svg>`,

  /* ---------- Facade ---------- */
  facade: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp5" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="40" y="78" width="110" height="44" rx="10" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="95" y="104" fill="#cdd4e1" font-size="10.5" text-anchor="middle">Client</text>

  <rect x="240" y="70" width="140" height="56" rx="12" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="310" y="94" fill="var(--amber)" font-size="11.5" font-weight="700" text-anchor="middle">Facade</text>
  <text x="310" y="112" fill="var(--text-3)" font-size="9" text-anchor="middle">+ doEverything()</text>

  <rect x="470" y="25" width="180" height="36" rx="8" fill="#0e1422" stroke="var(--blue)" stroke-opacity="0.5"/>
  <text x="560" y="48" fill="var(--blue)" font-size="9.5" text-anchor="middle">SubsystemA</text>
  <rect x="470" y="80" width="180" height="36" rx="8" fill="#0e1422" stroke="var(--blue)" stroke-opacity="0.5"/>
  <text x="560" y="103" fill="var(--blue)" font-size="9.5" text-anchor="middle">SubsystemB</text>
  <rect x="470" y="135" width="180" height="36" rx="8" fill="#0e1422" stroke="var(--blue)" stroke-opacity="0.5"/>
  <text x="560" y="158" fill="var(--blue)" font-size="9.5" text-anchor="middle">SubsystemC</text>

  <line x1="150" y1="100" x2="238" y2="98" stroke="var(--text-3)" marker-end="url(#dp5)"/>
  <line x1="380" y1="92" x2="468" y2="45" stroke="var(--text-3)" marker-end="url(#dp5)"/>
  <line x1="380" y1="98" x2="468" y2="98" stroke="var(--text-3)" marker-end="url(#dp5)"/>
  <line x1="380" y1="106" x2="468" y2="152" stroke="var(--text-3)" marker-end="url(#dp5)"/>
  <text x="300" y="182" fill="var(--text-3)" font-size="10" text-anchor="middle">one simple door in front of a complex subsystem</text>
</svg>`,

  /* ---------- Decorator ---------- */
  decorator: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <rect x="60" y="40" width="560" height="90" rx="14" fill="none" stroke="var(--amber)" stroke-opacity="0.5"/>
  <text x="130" y="34" fill="var(--amber)" font-size="9.5">+ Sugar</text>
  <rect x="110" y="55" width="460" height="62" rx="12" fill="rgba(251,191,36,0.05)" stroke="var(--amber)" stroke-opacity="0.6"/>
  <text x="190" y="50" fill="var(--amber)" font-size="9.5">+ Milk</text>
  <rect x="170" y="68" width="340" height="38" rx="10" fill="rgba(251,191,36,0.08)" stroke="var(--amber)"/>
  <text x="250" y="64" fill="var(--amber)" font-size="9.5">+ Foam</text>
  <rect x="240" y="76" width="200" height="24" rx="7" fill="rgba(74,222,128,0.12)" stroke="var(--green)"/>
  <text x="340" y="92" fill="var(--green)" font-size="10" text-anchor="middle">Coffee (base)</text>
  <text x="350" y="152" fill="var(--text-3)" font-size="10" text-anchor="middle">wrap an object in layers, each adding behaviour — same interface throughout</text>
</svg>`,

  /* ---------- Composite ---------- */
  composite: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp7" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="280" y="20" width="140" height="38" rx="9" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="350" y="44" fill="var(--amber)" font-size="11" text-anchor="middle">Folder (composite)</text>

  <rect x="100" y="90" width="130" height="36" rx="9" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="165" y="113" fill="var(--green)" font-size="10" text-anchor="middle">File (leaf)</text>
  <rect x="285" y="90" width="130" height="36" rx="9" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="350" y="113" fill="var(--amber)" font-size="10" text-anchor="middle">Folder</text>
  <rect x="470" y="90" width="130" height="36" rx="9" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="535" y="113" fill="var(--green)" font-size="10" text-anchor="middle">File (leaf)</text>

  <rect x="285" y="150" width="130" height="34" rx="9" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="350" y="172" fill="var(--green)" font-size="10" text-anchor="middle">File (leaf)</text>

  <line x1="330" y1="58" x2="180" y2="88" stroke="var(--text-3)" marker-end="url(#dp7)"/>
  <line x1="350" y1="58" x2="350" y2="88" stroke="var(--text-3)" marker-end="url(#dp7)"/>
  <line x1="370" y1="58" x2="520" y2="88" stroke="var(--text-3)" marker-end="url(#dp7)"/>
  <line x1="350" y1="126" x2="350" y2="148" stroke="var(--text-3)" marker-end="url(#dp7)"/>
  <text x="350" y="186" fill="none">.</text>
</svg>`,

  /* ---------- Proxy ---------- */
  proxy: `
<svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp8" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="40" y="65" width="110" height="44" rx="10" fill="#0e1422" stroke="var(--line-2)"/>
  <text x="95" y="91" fill="#cdd4e1" font-size="10.5" text-anchor="middle">Client</text>

  <rect x="240" y="60" width="140" height="54" rx="11" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="310" y="82" fill="var(--amber)" font-size="11.5" font-weight="700" text-anchor="middle">Proxy</text>
  <text x="310" y="100" fill="var(--text-3)" font-size="8.5" text-anchor="middle">access / lazy / cache</text>

  <rect x="480" y="60" width="160" height="54" rx="11" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="560" y="82" fill="var(--blue)" font-size="11.5" font-weight="700" text-anchor="middle">RealSubject</text>
  <text x="560" y="100" fill="var(--text-3)" font-size="8.5" text-anchor="middle">heavy / sensitive</text>

  <line x1="150" y1="87" x2="238" y2="87" stroke="var(--text-3)" marker-end="url(#dp8)"/>
  <line x1="380" y1="87" x2="478" y2="87" stroke="var(--text-3)" stroke-dasharray="4 3" marker-end="url(#dp8)"/>
  <text x="430" y="78" fill="var(--text-3)" font-size="8.5" text-anchor="middle">when needed</text>
  <text x="350" y="148" fill="var(--text-3)" font-size="10" text-anchor="middle">same interface, but the proxy controls access to the real object</text>
</svg>`,

  /* ---------- Strategy ---------- */
  strategy: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp9" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="60" y="75" width="160" height="50" rx="11" fill="rgba(34,211,238,0.08)" stroke="var(--cyan)"/>
  <text x="140" y="97" fill="var(--cyan)" font-size="11.5" font-weight="700" text-anchor="middle">Context</text>
  <text x="140" y="115" fill="var(--text-3)" font-size="9" text-anchor="middle">has a Strategy</text>

  <rect x="320" y="20" width="200" height="40" rx="10" fill="#0e1422" stroke="var(--cyan)" stroke-dasharray="4 3"/>
  <text x="420" y="45" fill="var(--cyan)" font-size="10.5" text-anchor="middle">«interface» Strategy.execute()</text>

  <rect x="320" y="78" width="200" height="32" rx="8" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="420" y="99" fill="var(--green)" font-size="9.5" text-anchor="middle">CreditCardPayment</text>
  <rect x="320" y="118" width="200" height="32" rx="8" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="420" y="139" fill="var(--green)" font-size="9.5" text-anchor="middle">PayPalPayment</text>
  <rect x="320" y="158" width="200" height="32" rx="8" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="420" y="179" fill="var(--green)" font-size="9.5" text-anchor="middle">CryptoPayment</text>

  <line x1="220" y1="95" x2="318" y2="48" stroke="var(--text-3)" marker-end="url(#dp9)"/>
  <text x="270" y="64" fill="var(--text-3)" font-size="8.5">delegates</text>
  <line x1="420" y1="78" x2="420" y2="62" stroke="var(--text-3)" stroke-dasharray="2 2"/>
  <line x1="420" y1="118" x2="420" y2="62" stroke="var(--text-3)" stroke-dasharray="2 2"/>
  <line x1="420" y1="158" x2="420" y2="62" stroke="var(--text-3)" stroke-dasharray="2 2"/>
  <text x="580" y="100" fill="var(--text-3)" font-size="9.5" text-anchor="middle">swap at</text>
  <text x="580" y="114" fill="var(--text-3)" font-size="9.5" text-anchor="middle">runtime</text>
</svg>`,

  /* ---------- Observer ---------- */
  observer: `
<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp10" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--cyan)"/></marker></defs>
  <rect x="60" y="75" width="160" height="56" rx="12" fill="rgba(34,211,238,0.1)" stroke="var(--cyan)"/>
  <text x="140" y="99" fill="var(--cyan)" font-size="12" font-weight="700" text-anchor="middle">Subject</text>
  <text x="140" y="117" fill="var(--text-3)" font-size="9" text-anchor="middle">state changed → notify</text>

  <rect x="480" y="25" width="180" height="38" rx="9" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="570" y="48" fill="var(--purple)" font-size="10" text-anchor="middle">Observer 1</text>
  <rect x="480" y="80" width="180" height="38" rx="9" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="570" y="103" fill="var(--purple)" font-size="10" text-anchor="middle">Observer 2</text>
  <rect x="480" y="135" width="180" height="38" rx="9" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="570" y="158" fill="var(--purple)" font-size="10" text-anchor="middle">Observer 3</text>

  <line x1="220" y1="95" x2="478" y2="46" stroke="var(--cyan)" marker-end="url(#dp10)"/>
  <line x1="220" y1="103" x2="478" y2="99" stroke="var(--cyan)" marker-end="url(#dp10)"/>
  <line x1="220" y1="111" x2="478" y2="152" stroke="var(--cyan)" marker-end="url(#dp10)"/>
  <text x="350" y="92" fill="var(--cyan)" font-size="9.5" text-anchor="middle">update()</text>
  <text x="350" y="186" fill="var(--text-3)" font-size="10" text-anchor="middle">one-to-many: subscribers auto-notified when the subject changes</text>
</svg>`,

  /* ---------- Command ---------- */
  command: `
<svg viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp11" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="30" y="55" width="130" height="46" rx="10" fill="rgba(34,211,238,0.08)" stroke="var(--cyan)"/>
  <text x="95" y="75" fill="var(--cyan)" font-size="11" font-weight="700" text-anchor="middle">Invoker</text>
  <text x="95" y="92" fill="var(--text-3)" font-size="8.5" text-anchor="middle">button / queue</text>

  <rect x="230" y="55" width="150" height="46" rx="10" fill="rgba(74,222,128,0.08)" stroke="var(--green)"/>
  <text x="305" y="75" fill="var(--green)" font-size="11" font-weight="700" text-anchor="middle">Command</text>
  <text x="305" y="92" fill="var(--text-3)" font-size="8.5" text-anchor="middle">+ execute() / undo()</text>

  <rect x="460" y="55" width="160" height="46" rx="10" fill="rgba(251,113,133,0.08)" stroke="var(--rose)"/>
  <text x="540" y="75" fill="var(--rose)" font-size="11" font-weight="700" text-anchor="middle">Receiver</text>
  <text x="540" y="92" fill="var(--text-3)" font-size="8.5" text-anchor="middle">does the real work</text>

  <line x1="160" y1="78" x2="228" y2="78" stroke="var(--text-3)" marker-end="url(#dp11)"/>
  <line x1="380" y1="78" x2="458" y2="78" stroke="var(--text-3)" marker-end="url(#dp11)"/>
  <text x="350" y="135" fill="var(--text-3)" font-size="10" text-anchor="middle">requests become objects → queueable, loggable, undoable</text>
</svg>`,

  /* ---------- State ---------- */
  state: `
<svg viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp12" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--cyan)"/></marker></defs>
  <rect x="50" y="60" width="120" height="44" rx="22" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="110" y="86" fill="var(--green)" font-size="10.5" text-anchor="middle">New</text>
  <rect x="240" y="60" width="120" height="44" rx="22" fill="rgba(251,191,36,0.1)" stroke="var(--amber)"/>
  <text x="300" y="86" fill="var(--amber)" font-size="10.5" text-anchor="middle">Paid</text>
  <rect x="430" y="60" width="120" height="44" rx="22" fill="rgba(96,165,250,0.1)" stroke="var(--blue)"/>
  <text x="490" y="86" fill="var(--blue)" font-size="10.5" text-anchor="middle">Shipped</text>
  <rect x="600" y="60" width="80" height="44" rx="22" fill="rgba(167,139,250,0.1)" stroke="var(--purple)"/>
  <text x="640" y="86" fill="var(--purple)" font-size="10" text-anchor="middle">Done</text>

  <line x1="170" y1="82" x2="238" y2="82" stroke="var(--cyan)" marker-end="url(#dp12)"/>
  <line x1="360" y1="82" x2="428" y2="82" stroke="var(--cyan)" marker-end="url(#dp12)"/>
  <line x1="550" y1="82" x2="598" y2="82" stroke="var(--cyan)" marker-end="url(#dp12)"/>
  <text x="350" y="135" fill="var(--text-3)" font-size="10" text-anchor="middle">behaviour changes with internal state — each state is its own class</text>
</svg>`,

  /* ---------- Template Method ---------- */
  templateMethod: `
<svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <rect x="200" y="30" width="300" height="120" rx="13" fill="rgba(34,211,238,0.06)" stroke="var(--cyan)"/>
  <text x="350" y="54" fill="var(--cyan)" font-size="11.5" font-weight="700" text-anchor="middle">build()  «final template»</text>
  <rect x="230" y="68" width="240" height="24" rx="6" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="350" y="84" fill="var(--green)" font-size="9.5" text-anchor="middle">1. boilStep()  — fixed</text>
  <rect x="230" y="98" width="240" height="24" rx="6" fill="rgba(251,191,36,0.12)" stroke="var(--amber)"/>
  <text x="350" y="114" fill="var(--amber)" font-size="9.5" text-anchor="middle">2. brewStep()  — hook (override)</text>
  <rect x="230" y="128" width="240" height="24" rx="6" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="350" y="144" fill="var(--green)" font-size="9.5" text-anchor="middle">3. pourStep()  — fixed</text>
  <text x="350" y="172" fill="var(--text-3)" font-size="10" text-anchor="middle">parent fixes the skeleton; subclasses fill in the hook steps</text>
</svg>`,

  /* ---------- Chain of Responsibility ---------- */
  chain: `
<svg viewBox="0 0 700 150" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp14" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="20" y="55" width="120" height="44" rx="10" fill="rgba(34,211,238,0.08)" stroke="var(--cyan)"/>
  <text x="80" y="74" fill="var(--cyan)" font-size="10" text-anchor="middle">Auth</text>
  <text x="80" y="90" fill="var(--text-3)" font-size="8" text-anchor="middle">handle or pass</text>
  <rect x="190" y="55" width="120" height="44" rx="10" fill="rgba(34,211,238,0.08)" stroke="var(--cyan)"/>
  <text x="250" y="74" fill="var(--cyan)" font-size="10" text-anchor="middle">RateLimit</text>
  <text x="250" y="90" fill="var(--text-3)" font-size="8" text-anchor="middle">handle or pass</text>
  <rect x="360" y="55" width="120" height="44" rx="10" fill="rgba(34,211,238,0.08)" stroke="var(--cyan)"/>
  <text x="420" y="74" fill="var(--cyan)" font-size="10" text-anchor="middle">Logging</text>
  <text x="420" y="90" fill="var(--text-3)" font-size="8" text-anchor="middle">handle or pass</text>
  <rect x="530" y="55" width="140" height="44" rx="10" fill="rgba(74,222,128,0.1)" stroke="var(--green)"/>
  <text x="600" y="80" fill="var(--green)" font-size="10" text-anchor="middle">Controller</text>

  <line x1="140" y1="77" x2="188" y2="77" stroke="var(--text-3)" marker-end="url(#dp14)"/>
  <line x1="310" y1="77" x2="358" y2="77" stroke="var(--text-3)" marker-end="url(#dp14)"/>
  <line x1="480" y1="77" x2="528" y2="77" stroke="var(--text-3)" marker-end="url(#dp14)"/>
  <text x="350" y="128" fill="var(--text-3)" font-size="10" text-anchor="middle">each handler either handles the request or passes it down the chain</text>
</svg>`,

  /* ---------- Iterator ---------- */
  iterator: `
<svg viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dp15" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--text-3)"/></marker></defs>
  <rect x="40" y="55" width="150" height="50" rx="11" fill="rgba(96,165,250,0.08)" stroke="var(--blue)"/>
  <text x="115" y="76" fill="var(--blue)" font-size="11" font-weight="700" text-anchor="middle">Iterator</text>
  <text x="115" y="93" fill="var(--text-3)" font-size="8.5" text-anchor="middle">hasNext() · next()</text>

  ${[0,1,2,3,4].map((n,i)=>`<rect x="${280+i*78}" y="60" width="60" height="40" rx="8" fill="${i<2?'rgba(74,222,128,0.12)':'#0e1422'}" stroke="${i<2?'var(--green)':'var(--line-2)'}"/><text x="${310+i*78}" y="84" fill="${i<2?'var(--green)':'var(--text-3)'}" font-size="10" text-anchor="middle">item</text>`).join('')}
  <line x1="190" y1="80" x2="276" y2="80" stroke="var(--text-3)" marker-end="url(#dp15)"/>
  <text x="350" y="138" fill="var(--text-3)" font-size="10" text-anchor="middle">traverse a collection one element at a time — internals stay hidden</text>
</svg>`,

};
