/* ============================================================
   Inline SVG diagrams for the Spring Boot guide.
   Colors use CSS variables so they follow the theme.
   ============================================================ */

window.DIAGRAMS = {

/* ── 1. Spring Boot Layered Architecture ─────────────────── */
layeredArch: `<svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <!-- Client -->
  <rect x="20" y="130" width="90" height="60" rx="8" fill="none" stroke="var(--purple)" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="65" y="156" text-anchor="middle" fill="var(--purple)" font-size="11" font-weight="600">Client</text>
  <text x="65" y="172" text-anchor="middle" fill="var(--text-3)" font-size="9">HTTP Request</text>

  <!-- Arrow -->
  <line x1="110" y1="160" x2="148" y2="160" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- Controller Layer -->
  <rect x="150" y="80" width="120" height="160" rx="10" fill="color-mix(in srgb,var(--blue) 10%,transparent)" stroke="var(--blue)" stroke-width="1.5"/>
  <text x="210" y="105" text-anchor="middle" fill="var(--blue)" font-size="10" font-weight="700" letter-spacing="0.05em">WEB LAYER</text>
  <rect x="166" y="115" width="88" height="26" rx="5" fill="color-mix(in srgb,var(--blue) 18%,transparent)"/>
  <text x="210" y="132" text-anchor="middle" fill="var(--blue)" font-size="10" font-weight="600">@RestController</text>
  <rect x="166" y="148" width="88" height="22" rx="5" fill="color-mix(in srgb,var(--blue) 10%,transparent)"/>
  <text x="210" y="163" text-anchor="middle" fill="var(--text-3)" font-size="9">@RequestMapping</text>
  <rect x="166" y="177" width="88" height="22" rx="5" fill="color-mix(in srgb,var(--blue) 10%,transparent)"/>
  <text x="210" y="192" text-anchor="middle" fill="var(--text-3)" font-size="9">@Valid · DTOs</text>
  <rect x="166" y="206" width="88" height="22" rx="5" fill="color-mix(in srgb,var(--blue) 10%,transparent)"/>
  <text x="210" y="221" text-anchor="middle" fill="var(--text-3)" font-size="9">@ExceptionHandler</text>

  <!-- Arrow -->
  <line x1="270" y1="160" x2="308" y2="160" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- Service Layer -->
  <rect x="310" y="80" width="120" height="160" rx="10" fill="color-mix(in srgb,var(--green) 10%,transparent)" stroke="var(--green)" stroke-width="1.5"/>
  <text x="370" y="105" text-anchor="middle" fill="var(--green)" font-size="10" font-weight="700" letter-spacing="0.05em">SERVICE LAYER</text>
  <rect x="326" y="115" width="88" height="26" rx="5" fill="color-mix(in srgb,var(--green) 18%,transparent)"/>
  <text x="370" y="132" text-anchor="middle" fill="var(--green)" font-size="10" font-weight="600">@Service</text>
  <rect x="326" y="148" width="88" height="22" rx="5" fill="color-mix(in srgb,var(--green) 10%,transparent)"/>
  <text x="370" y="163" text-anchor="middle" fill="var(--text-3)" font-size="9">Business Logic</text>
  <rect x="326" y="177" width="88" height="22" rx="5" fill="color-mix(in srgb,var(--green) 10%,transparent)"/>
  <text x="370" y="192" text-anchor="middle" fill="var(--text-3)" font-size="9">@Transactional</text>
  <rect x="326" y="206" width="88" height="22" rx="5" fill="color-mix(in srgb,var(--green) 10%,transparent)"/>
  <text x="370" y="221" text-anchor="middle" fill="var(--text-3)" font-size="9">Validation · Mapping</text>

  <!-- Arrow -->
  <line x1="430" y1="160" x2="468" y2="160" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- Repository Layer -->
  <rect x="470" y="80" width="120" height="160" rx="10" fill="color-mix(in srgb,var(--amber) 10%,transparent)" stroke="var(--amber)" stroke-width="1.5"/>
  <text x="530" y="105" text-anchor="middle" fill="var(--amber)" font-size="10" font-weight="700" letter-spacing="0.05em">DATA LAYER</text>
  <rect x="486" y="115" width="88" height="26" rx="5" fill="color-mix(in srgb,var(--amber) 18%,transparent)"/>
  <text x="530" y="132" text-anchor="middle" fill="var(--amber)" font-size="10" font-weight="600">@Repository</text>
  <rect x="486" y="148" width="88" height="22" rx="5" fill="color-mix(in srgb,var(--amber) 10%,transparent)"/>
  <text x="530" y="163" text-anchor="middle" fill="var(--text-3)" font-size="9">JpaRepository</text>
  <rect x="486" y="177" width="88" height="22" rx="5" fill="color-mix(in srgb,var(--amber) 10%,transparent)"/>
  <text x="530" y="192" text-anchor="middle" fill="var(--text-3)" font-size="9">@Query · JPQL</text>
  <rect x="486" y="206" width="88" height="22" rx="5" fill="color-mix(in srgb,var(--amber) 10%,transparent)"/>
  <text x="530" y="221" text-anchor="middle" fill="var(--text-3)" font-size="9">Pagination · Specs</text>

  <!-- Arrow to DB -->
  <line x1="590" y1="160" x2="628" y2="160" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- DB -->
  <ellipse cx="650" cy="148" rx="22" ry="10" fill="color-mix(in srgb,var(--rose) 20%,transparent)" stroke="var(--rose)" stroke-width="1.5"/>
  <rect x="628" y="148" width="44" height="24" fill="color-mix(in srgb,var(--rose) 10%,transparent)" stroke="var(--rose)" stroke-width="1.5" stroke-top="none"/>
  <ellipse cx="650" cy="172" rx="22" ry="10" fill="color-mix(in srgb,var(--rose) 20%,transparent)" stroke="var(--rose)" stroke-width="1.5"/>
  <text x="650" y="193" text-anchor="middle" fill="var(--rose)" font-size="9" font-weight="600">DB</text>

  <!-- Cross-cutting concerns bar -->
  <rect x="150" y="260" width="440" height="28" rx="6" fill="color-mix(in srgb,var(--purple) 12%,transparent)" stroke="var(--purple)" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="370" y="279" text-anchor="middle" fill="var(--purple)" font-size="10" font-weight="600">Cross-Cutting: @Aspect (AOP) · Spring Security · Actuator · @Async</text>
</svg>`,

/* ── 2. Bean Lifecycle ────────────────────────────────────── */
beanLifecycle: `<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs>
    <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <!-- Steps -->
  <!-- 1 -->
  <rect x="10" y="70" width="88" height="60" rx="8" fill="color-mix(in srgb,var(--blue) 14%,transparent)" stroke="var(--blue)" stroke-width="1.5"/>
  <text x="54" y="96" text-anchor="middle" fill="var(--blue)" font-size="9" font-weight="700">1. INSTANTIATE</text>
  <text x="54" y="112" text-anchor="middle" fill="var(--text-3)" font-size="8">new Bean()</text>
  <text x="54" y="124" text-anchor="middle" fill="var(--text-3)" font-size="8">constructor runs</text>
  <!-- arrow -->
  <line x1="98" y1="100" x2="110" y2="100" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr2)"/>
  <!-- 2 -->
  <rect x="112" y="70" width="88" height="60" rx="8" fill="color-mix(in srgb,var(--green) 14%,transparent)" stroke="var(--green)" stroke-width="1.5"/>
  <text x="156" y="96" text-anchor="middle" fill="var(--green)" font-size="9" font-weight="700">2. POPULATE</text>
  <text x="156" y="112" text-anchor="middle" fill="var(--text-3)" font-size="8">@Autowired fields</text>
  <text x="156" y="124" text-anchor="middle" fill="var(--text-3)" font-size="8">setter injection</text>
  <line x1="200" y1="100" x2="212" y2="100" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr2)"/>
  <!-- 3 -->
  <rect x="214" y="70" width="88" height="60" rx="8" fill="color-mix(in srgb,var(--amber) 14%,transparent)" stroke="var(--amber)" stroke-width="1.5"/>
  <text x="258" y="93" text-anchor="middle" fill="var(--amber)" font-size="9" font-weight="700">3. AWARE</text>
  <text x="258" y="109" text-anchor="middle" fill="var(--text-3)" font-size="8">BeanNameAware</text>
  <text x="258" y="121" text-anchor="middle" fill="var(--text-3)" font-size="8">BeanFactoryAware</text>
  <text x="258" y="133" text-anchor="middle" fill="var(--text-3)" font-size="8">AppContextAware</text>
  <line x1="302" y1="100" x2="314" y2="100" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr2)"/>
  <!-- 4 -->
  <rect x="316" y="70" width="88" height="60" rx="8" fill="color-mix(in srgb,var(--purple) 14%,transparent)" stroke="var(--purple)" stroke-width="1.5"/>
  <text x="360" y="96" text-anchor="middle" fill="var(--purple)" font-size="9" font-weight="700">4. @PostConstruct</text>
  <text x="360" y="112" text-anchor="middle" fill="var(--text-3)" font-size="8">init method runs</text>
  <text x="360" y="124" text-anchor="middle" fill="var(--text-3)" font-size="8">custom setup</text>
  <line x1="404" y1="100" x2="416" y2="100" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr2)"/>
  <!-- 5 -->
  <rect x="418" y="55" width="88" height="90" rx="8" fill="color-mix(in srgb,var(--teal) 18%,transparent)" stroke="var(--teal)" stroke-width="2"/>
  <text x="462" y="82" text-anchor="middle" fill="var(--teal)" font-size="9" font-weight="700">5. IN USE</text>
  <text x="462" y="98" text-anchor="middle" fill="var(--text-3)" font-size="8">Bean is ready</text>
  <text x="462" y="112" text-anchor="middle" fill="var(--text-3)" font-size="8">Application runs</text>
  <text x="462" y="126" text-anchor="middle" fill="var(--text-3)" font-size="8">Serving requests</text>
  <line x1="506" y1="100" x2="518" y2="100" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr2)"/>
  <!-- 6 -->
  <rect x="520" y="70" width="88" height="60" rx="8" fill="color-mix(in srgb,var(--rose) 14%,transparent)" stroke="var(--rose)" stroke-width="1.5"/>
  <text x="564" y="96" text-anchor="middle" fill="var(--rose)" font-size="9" font-weight="700">6. @PreDestroy</text>
  <text x="564" y="112" text-anchor="middle" fill="var(--text-3)" font-size="8">cleanup runs</text>
  <text x="564" y="124" text-anchor="middle" fill="var(--text-3)" font-size="8">close connections</text>
  <line x1="608" y1="100" x2="620" y2="100" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr2)"/>
  <!-- 7 -->
  <rect x="622" y="70" width="68" height="60" rx="8" fill="color-mix(in srgb,var(--text-3) 10%,transparent)" stroke="var(--line-2)" stroke-width="1.5"/>
  <text x="656" y="96" text-anchor="middle" fill="var(--text-3)" font-size="9" font-weight="700">7. DESTROY</text>
  <text x="656" y="112" text-anchor="middle" fill="var(--text-3)" font-size="8">GC eligible</text>
  <text x="656" y="124" text-anchor="middle" fill="var(--text-3)" font-size="8">context closes</text>
</svg>`,

/* ── 3. Auto-Configuration Flow ───────────────────────────── */
autoConfig: `<svg viewBox="0 0 660 260" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs>
    <marker id="arr3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <!-- @SpringBootApplication box -->
  <rect x="20" y="90" width="160" height="80" rx="10" fill="color-mix(in srgb,var(--green) 12%,transparent)" stroke="var(--green)" stroke-width="2"/>
  <text x="100" y="118" text-anchor="middle" fill="var(--green)" font-size="11" font-weight="700">@SpringBootApplication</text>
  <text x="100" y="136" text-anchor="middle" fill="var(--text-3)" font-size="9">= @Configuration</text>
  <text x="100" y="150" text-anchor="middle" fill="var(--text-3)" font-size="9">+ @EnableAutoConfiguration</text>
  <text x="100" y="164" text-anchor="middle" fill="var(--text-3)" font-size="9">+ @ComponentScan</text>
  <line x1="180" y1="130" x2="218" y2="130" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr3)"/>

  <!-- Triggers -->
  <rect x="220" y="60" width="140" height="140" rx="10" fill="color-mix(in srgb,var(--blue) 10%,transparent)" stroke="var(--blue)" stroke-width="1.5"/>
  <text x="290" y="86" text-anchor="middle" fill="var(--blue)" font-size="10" font-weight="700">SCANS CLASSPATH</text>
  <rect x="234" y="94" width="112" height="20" rx="4" fill="color-mix(in srgb,var(--blue) 14%,transparent)"/>
  <text x="290" y="108" text-anchor="middle" fill="var(--text-3)" font-size="9">spring.factories /</text>
  <rect x="234" y="120" width="112" height="20" rx="4" fill="color-mix(in srgb,var(--blue) 14%,transparent)"/>
  <text x="290" y="134" text-anchor="middle" fill="var(--text-3)" font-size="9">AutoConfiguration.imports</text>
  <rect x="234" y="146" width="112" height="20" rx="4" fill="color-mix(in srgb,var(--blue) 14%,transparent)"/>
  <text x="290" y="160" text-anchor="middle" fill="var(--text-3)" font-size="9">@ConditionalOnClass</text>
  <rect x="234" y="172" width="112" height="20" rx="4" fill="color-mix(in srgb,var(--blue) 14%,transparent)"/>
  <text x="290" y="186" text-anchor="middle" fill="var(--text-3)" font-size="9">@ConditionalOnProperty</text>
  <line x1="360" y1="130" x2="398" y2="130" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr3)"/>

  <!-- Auto-configured beans -->
  <rect x="400" y="40" width="240" height="180" rx="10" fill="color-mix(in srgb,var(--amber) 8%,transparent)" stroke="var(--amber)" stroke-width="1.5"/>
  <text x="520" y="66" text-anchor="middle" fill="var(--amber)" font-size="10" font-weight="700">AUTO-CONFIGURED BEANS</text>
  <rect x="416" y="76" width="100" height="22" rx="4" fill="color-mix(in srgb,var(--amber) 16%,transparent)"/>
  <text x="466" y="91" text-anchor="middle" fill="var(--text-3)" font-size="9">DataSource (HikariCP)</text>
  <rect x="524" y="76" width="100" height="22" rx="4" fill="color-mix(in srgb,var(--amber) 16%,transparent)"/>
  <text x="574" y="91" text-anchor="middle" fill="var(--text-3)" font-size="9">DispatcherServlet</text>
  <rect x="416" y="106" width="100" height="22" rx="4" fill="color-mix(in srgb,var(--amber) 16%,transparent)"/>
  <text x="466" y="121" text-anchor="middle" fill="var(--text-3)" font-size="9">JPA EntityManager</text>
  <rect x="524" y="106" width="100" height="22" rx="4" fill="color-mix(in srgb,var(--amber) 16%,transparent)"/>
  <text x="574" y="121" text-anchor="middle" fill="var(--text-3)" font-size="9">Jackson ObjectMapper</text>
  <rect x="416" y="136" width="100" height="22" rx="4" fill="color-mix(in srgb,var(--amber) 16%,transparent)"/>
  <text x="466" y="151" text-anchor="middle" fill="var(--text-3)" font-size="9">TransactionManager</text>
  <rect x="524" y="136" width="100" height="22" rx="4" fill="color-mix(in srgb,var(--amber) 16%,transparent)"/>
  <text x="574" y="151" text-anchor="middle" fill="var(--text-3)" font-size="9">Embedded Tomcat</text>
  <rect x="416" y="166" width="208" height="22" rx="4" fill="color-mix(in srgb,var(--amber) 10%,transparent)"/>
  <text x="520" y="181" text-anchor="middle" fill="var(--text-3)" font-size="9">Your @Bean definitions override any of the above</text>
</svg>`,

/* ── 4. HTTP Request Flow ─────────────────────────────────── */
requestFlow: `<svg viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs>
    <marker id="arr4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="var(--text-3)"/>
    </marker>
    <marker id="arr4b" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto">
      <path d="M8,0 L8,6 L0,3 z" fill="var(--text-3)"/>
    </marker>
  </defs>

  <!-- Client -->
  <rect x="10" y="100" width="60" height="40" rx="7" fill="none" stroke="var(--purple)" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="40" y="125" text-anchor="middle" fill="var(--purple)" font-size="10" font-weight="600">Client</text>

  <line x1="70" y1="112" x2="88" y2="112" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4)"/>
  <text x="79" y="108" text-anchor="middle" fill="var(--text-3)" font-size="8">req</text>
  <line x1="88" y1="128" x2="70" y2="128" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4b)"/>
  <text x="79" y="142" text-anchor="middle" fill="var(--text-3)" font-size="8">res</text>

  <!-- Security Filter -->
  <rect x="90" y="70" width="100" height="100" rx="8" fill="color-mix(in srgb,var(--rose) 12%,transparent)" stroke="var(--rose)" stroke-width="1.5"/>
  <text x="140" y="92" text-anchor="middle" fill="var(--rose)" font-size="9" font-weight="700">SECURITY</text>
  <text x="140" y="106" text-anchor="middle" fill="var(--rose)" font-size="9" font-weight="700">FILTER CHAIN</text>
  <text x="140" y="122" text-anchor="middle" fill="var(--text-3)" font-size="8">AuthN check</text>
  <text x="140" y="135" text-anchor="middle" fill="var(--text-3)" font-size="8">JWT validation</text>
  <text x="140" y="148" text-anchor="middle" fill="var(--text-3)" font-size="8">CORS handling</text>
  <text x="140" y="161" text-anchor="middle" fill="var(--text-3)" font-size="8">403 if denied</text>

  <line x1="190" y1="112" x2="208" y2="112" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4)"/>
  <line x1="208" y1="128" x2="190" y2="128" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4b)"/>

  <!-- DispatcherServlet -->
  <rect x="210" y="85" width="100" height="70" rx="8" fill="color-mix(in srgb,var(--blue) 12%,transparent)" stroke="var(--blue)" stroke-width="1.5"/>
  <text x="260" y="107" text-anchor="middle" fill="var(--blue)" font-size="9" font-weight="700">DISPATCHER</text>
  <text x="260" y="120" text-anchor="middle" fill="var(--blue)" font-size="9" font-weight="700">SERVLET</text>
  <text x="260" y="136" text-anchor="middle" fill="var(--text-3)" font-size="8">Route to handler</text>
  <text x="260" y="149" text-anchor="middle" fill="var(--text-3)" font-size="8">HandlerMapping</text>

  <line x1="310" y1="112" x2="328" y2="112" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4)"/>
  <line x1="328" y1="128" x2="310" y2="128" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4b)"/>

  <!-- Controller -->
  <rect x="330" y="70" width="95" height="100" rx="8" fill="color-mix(in srgb,var(--blue) 14%,transparent)" stroke="var(--blue)" stroke-width="2"/>
  <text x="377" y="92" text-anchor="middle" fill="var(--blue)" font-size="9" font-weight="700">@REST</text>
  <text x="377" y="105" text-anchor="middle" fill="var(--blue)" font-size="9" font-weight="700">CONTROLLER</text>
  <text x="377" y="121" text-anchor="middle" fill="var(--text-3)" font-size="8">@GetMapping</text>
  <text x="377" y="134" text-anchor="middle" fill="var(--text-3)" font-size="8">@RequestBody</text>
  <text x="377" y="147" text-anchor="middle" fill="var(--text-3)" font-size="8">@Valid</text>
  <text x="377" y="160" text-anchor="middle" fill="var(--text-3)" font-size="8">ResponseEntity</text>

  <line x1="425" y1="112" x2="443" y2="112" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4)"/>
  <line x1="443" y1="128" x2="425" y2="128" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4b)"/>

  <!-- Service -->
  <rect x="445" y="80" width="90" height="80" rx="8" fill="color-mix(in srgb,var(--green) 14%,transparent)" stroke="var(--green)" stroke-width="2"/>
  <text x="490" y="102" text-anchor="middle" fill="var(--green)" font-size="9" font-weight="700">@SERVICE</text>
  <text x="490" y="118" text-anchor="middle" fill="var(--text-3)" font-size="8">Business Logic</text>
  <text x="490" y="131" text-anchor="middle" fill="var(--text-3)" font-size="8">@Transactional</text>
  <text x="490" y="144" text-anchor="middle" fill="var(--text-3)" font-size="8">MapStruct DTOs</text>

  <line x1="535" y1="112" x2="553" y2="112" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4)"/>
  <line x1="553" y1="128" x2="535" y2="128" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4b)"/>

  <!-- Repository -->
  <rect x="555" y="80" width="90" height="80" rx="8" fill="color-mix(in srgb,var(--amber) 14%,transparent)" stroke="var(--amber)" stroke-width="2"/>
  <text x="600" y="102" text-anchor="middle" fill="var(--amber)" font-size="9" font-weight="700">@REPOSITORY</text>
  <text x="600" y="118" text-anchor="middle" fill="var(--text-3)" font-size="8">JpaRepository</text>
  <text x="600" y="131" text-anchor="middle" fill="var(--text-3)" font-size="8">@Query JPQL</text>
  <text x="600" y="144" text-anchor="middle" fill="var(--text-3)" font-size="8">HikariCP pool</text>

  <line x1="645" y1="112" x2="663" y2="112" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4)"/>
  <line x1="663" y1="128" x2="645" y2="128" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr4b)"/>

  <!-- DB -->
  <ellipse cx="678" cy="108" rx="16" ry="8" fill="color-mix(in srgb,var(--rose) 20%,transparent)" stroke="var(--rose)" stroke-width="1.5"/>
  <rect x="662" y="108" width="32" height="16" fill="color-mix(in srgb,var(--rose) 10%,transparent)" stroke="var(--rose)" stroke-width="1.5"/>
  <ellipse cx="678" cy="124" rx="16" ry="8" fill="color-mix(in srgb,var(--rose) 20%,transparent)" stroke="var(--rose)" stroke-width="1.5"/>
  <text x="678" y="142" text-anchor="middle" fill="var(--rose)" font-size="8" font-weight="600">DB</text>

  <!-- AOP label -->
  <rect x="90" y="190" width="555" height="22" rx="5" fill="color-mix(in srgb,var(--purple) 10%,transparent)" stroke="var(--purple)" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="367" y="205" text-anchor="middle" fill="var(--purple)" font-size="9" font-weight="600">AOP intercepts here: @Before / @Around / @AfterReturning at any joinpoint above</text>
</svg>`,

/* ── 5. JPA Entity Relationships ─────────────────────────── */
jpaRelationships: `<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs>
    <marker id="arr5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <!-- User entity -->
  <rect x="20" y="60" width="140" height="130" rx="8" fill="color-mix(in srgb,var(--blue) 12%,transparent)" stroke="var(--blue)" stroke-width="1.5"/>
  <rect x="20" y="60" width="140" height="28" rx="8" fill="color-mix(in srgb,var(--blue) 25%,transparent)"/>
  <rect x="20" y="82" width="140" height="6" fill="color-mix(in srgb,var(--blue) 25%,transparent)"/>
  <text x="90" y="80" text-anchor="middle" fill="var(--blue)" font-size="11" font-weight="700">User</text>
  <text x="90" y="106" text-anchor="middle" fill="var(--text-3)" font-size="9">@Id Long id</text>
  <text x="90" y="122" text-anchor="middle" fill="var(--text-3)" font-size="9">String name</text>
  <text x="90" y="138" text-anchor="middle" fill="var(--text-3)" font-size="9">String email</text>
  <text x="90" y="158" text-anchor="middle" fill="var(--amber)" font-size="9" font-weight="600">@OneToOne Profile</text>
  <text x="90" y="176" text-anchor="middle" fill="var(--amber)" font-size="9" font-weight="600">@OneToMany Orders</text>

  <!-- Profile entity -->
  <rect x="220" y="20" width="140" height="110" rx="8" fill="color-mix(in srgb,var(--teal) 12%,transparent)" stroke="var(--teal)" stroke-width="1.5"/>
  <rect x="220" y="20" width="140" height="28" rx="8" fill="color-mix(in srgb,var(--teal) 25%,transparent)"/>
  <rect x="220" y="42" width="140" height="6" fill="color-mix(in srgb,var(--teal) 25%,transparent)"/>
  <text x="290" y="40" text-anchor="middle" fill="var(--teal)" font-size="11" font-weight="700">Profile</text>
  <text x="290" y="66" text-anchor="middle" fill="var(--text-3)" font-size="9">@Id Long id</text>
  <text x="290" y="82" text-anchor="middle" fill="var(--text-3)" font-size="9">String bio</text>
  <text x="290" y="98" text-anchor="middle" fill="var(--text-3)" font-size="9">String avatarUrl</text>
  <text x="290" y="118" text-anchor="middle" fill="var(--amber)" font-size="9" font-weight="600">@OneToOne(mappedBy) User</text>
  <!-- 1-1 arrow -->
  <line x1="160" y1="90" x2="220" y2="70" stroke="var(--teal)" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arr5)"/>
  <text x="188" y="73" fill="var(--teal)" font-size="8">1 : 1</text>

  <!-- Order entity -->
  <rect x="220" y="160" width="140" height="120" rx="8" fill="color-mix(in srgb,var(--green) 12%,transparent)" stroke="var(--green)" stroke-width="1.5"/>
  <rect x="220" y="160" width="140" height="28" rx="8" fill="color-mix(in srgb,var(--green) 25%,transparent)"/>
  <rect x="220" y="182" width="140" height="6" fill="color-mix(in srgb,var(--green) 25%,transparent)"/>
  <text x="290" y="180" text-anchor="middle" fill="var(--green)" font-size="11" font-weight="700">Order</text>
  <text x="290" y="204" text-anchor="middle" fill="var(--text-3)" font-size="9">@Id Long id</text>
  <text x="290" y="220" text-anchor="middle" fill="var(--text-3)" font-size="9">LocalDate date</text>
  <text x="290" y="236" text-anchor="middle" fill="var(--text-3)" font-size="9">BigDecimal total</text>
  <text x="290" y="256" text-anchor="middle" fill="var(--amber)" font-size="9" font-weight="600">@ManyToOne User</text>
  <text x="290" y="272" text-anchor="middle" fill="var(--amber)" font-size="9" font-weight="600">@ManyToMany Products</text>
  <!-- 1-N arrow -->
  <line x1="160" y1="150" x2="220" y2="200" stroke="var(--green)" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arr5)"/>
  <text x="175" y="190" fill="var(--green)" font-size="8">1 : N</text>

  <!-- Product entity -->
  <rect x="460" y="160" width="140" height="120" rx="8" fill="color-mix(in srgb,var(--rose) 12%,transparent)" stroke="var(--rose)" stroke-width="1.5"/>
  <rect x="460" y="160" width="140" height="28" rx="8" fill="color-mix(in srgb,var(--rose) 25%,transparent)"/>
  <rect x="460" y="182" width="140" height="6" fill="color-mix(in srgb,var(--rose) 25%,transparent)"/>
  <text x="530" y="180" text-anchor="middle" fill="var(--rose)" font-size="11" font-weight="700">Product</text>
  <text x="530" y="204" text-anchor="middle" fill="var(--text-3)" font-size="9">@Id Long id</text>
  <text x="530" y="220" text-anchor="middle" fill="var(--text-3)" font-size="9">String name</text>
  <text x="530" y="236" text-anchor="middle" fill="var(--text-3)" font-size="9">BigDecimal price</text>
  <text x="530" y="256" text-anchor="middle" fill="var(--amber)" font-size="9" font-weight="600">@ManyToMany Orders</text>
  <!-- M-N arrow -->
  <line x1="360" y1="230" x2="460" y2="230" stroke="var(--rose)" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arr5)"/>
  <text x="405" y="222" fill="var(--rose)" font-size="8">M : N</text>
  <!-- Join table note -->
  <rect x="380" y="245" width="100" height="30" rx="5" fill="color-mix(in srgb,var(--rose) 10%,transparent)" stroke="var(--rose)" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="430" y="258" text-anchor="middle" fill="var(--text-3)" font-size="8">order_products</text>
  <text x="430" y="270" text-anchor="middle" fill="var(--text-3)" font-size="8">@JoinTable</text>

  <!-- fetch type legend -->
  <rect x="460" y="20" width="200" height="120" rx="8" fill="color-mix(in srgb,var(--amber) 8%,transparent)" stroke="var(--amber)" stroke-width="1"/>
  <text x="560" y="42" text-anchor="middle" fill="var(--amber)" font-size="10" font-weight="700">FETCH TYPES</text>
  <text x="560" y="62" text-anchor="middle" fill="var(--text-3)" font-size="9" font-weight="600">LAZY (default)</text>
  <text x="560" y="78" text-anchor="middle" fill="var(--text-3)" font-size="8">Load on first access</text>
  <text x="560" y="93" text-anchor="middle" fill="var(--text-3)" font-size="8">Causes N+1 if not careful</text>
  <text x="560" y="110" text-anchor="middle" fill="var(--text-3)" font-size="9" font-weight="600">EAGER</text>
  <text x="560" y="126" text-anchor="middle" fill="var(--text-3)" font-size="8">Always load with parent</text>
</svg>`,

/* ── 6. Spring Security Filter Chain ─────────────────────── */
securityChain: `<svg viewBox="0 0 660 260" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs>
    <marker id="arr6" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <!-- Chain container -->
  <rect x="10" y="10" width="640" height="230" rx="10" fill="color-mix(in srgb,var(--rose) 6%,transparent)" stroke="var(--rose)" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="330" y="30" text-anchor="middle" fill="var(--rose)" font-size="10" font-weight="700" letter-spacing="0.05em">SECURITY FILTER CHAIN (HttpSecurity)</text>

  <!-- Filters left to right -->
  <!-- CORS -->
  <rect x="24" y="44" width="82" height="68" rx="7" fill="color-mix(in srgb,var(--blue) 14%,transparent)" stroke="var(--blue)" stroke-width="1.5"/>
  <text x="65" y="66" text-anchor="middle" fill="var(--blue)" font-size="9" font-weight="700">CORS</text>
  <text x="65" y="80" text-anchor="middle" fill="var(--text-3)" font-size="8">Origin check</text>
  <text x="65" y="92" text-anchor="middle" fill="var(--text-3)" font-size="8">Preflight</text>
  <text x="65" y="104" text-anchor="middle" fill="var(--text-3)" font-size="8">Headers</text>
  <line x1="106" y1="78" x2="118" y2="78" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr6)"/>

  <!-- CSRF -->
  <rect x="120" y="44" width="82" height="68" rx="7" fill="color-mix(in srgb,var(--blue) 14%,transparent)" stroke="var(--blue)" stroke-width="1.5"/>
  <text x="161" y="66" text-anchor="middle" fill="var(--blue)" font-size="9" font-weight="700">CSRF</text>
  <text x="161" y="80" text-anchor="middle" fill="var(--text-3)" font-size="8">Token verify</text>
  <text x="161" y="92" text-anchor="middle" fill="var(--text-3)" font-size="8">disable() for</text>
  <text x="161" y="104" text-anchor="middle" fill="var(--text-3)" font-size="8">REST APIs</text>
  <line x1="202" y1="78" x2="214" y2="78" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr6)"/>

  <!-- JWT Filter -->
  <rect x="216" y="44" width="100" height="68" rx="7" fill="color-mix(in srgb,var(--amber) 14%,transparent)" stroke="var(--amber)" stroke-width="2"/>
  <text x="266" y="64" text-anchor="middle" fill="var(--amber)" font-size="9" font-weight="700">JWT FILTER</text>
  <text x="266" y="78" text-anchor="middle" fill="var(--amber)" font-size="9" font-weight="700">(custom)</text>
  <text x="266" y="93" text-anchor="middle" fill="var(--text-3)" font-size="8">Extract Bearer</text>
  <text x="266" y="105" text-anchor="middle" fill="var(--text-3)" font-size="8">Validate token</text>
  <text x="266" y="117" text-anchor="middle" fill="var(--text-3)" font-size="8">Set SecurityContext</text>
  <line x1="316" y1="78" x2="328" y2="78" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr6)"/>

  <!-- AuthN -->
  <rect x="330" y="44" width="100" height="68" rx="7" fill="color-mix(in srgb,var(--purple) 14%,transparent)" stroke="var(--purple)" stroke-width="1.5"/>
  <text x="380" y="64" text-anchor="middle" fill="var(--purple)" font-size="9" font-weight="700">AUTHN</text>
  <text x="380" y="78" text-anchor="middle" fill="var(--text-3)" font-size="8">UserDetails</text>
  <text x="380" y="90" text-anchor="middle" fill="var(--text-3)" font-size="8">Service</text>
  <text x="380" y="104" text-anchor="middle" fill="var(--text-3)" font-size="8">Password check</text>
  <text x="380" y="116" text-anchor="middle" fill="var(--text-3)" font-size="8">BCrypt verify</text>
  <line x1="430" y1="78" x2="442" y2="78" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr6)"/>

  <!-- AuthZ -->
  <rect x="444" y="44" width="100" height="68" rx="7" fill="color-mix(in srgb,var(--rose) 14%,transparent)" stroke="var(--rose)" stroke-width="1.5"/>
  <text x="494" y="64" text-anchor="middle" fill="var(--rose)" font-size="9" font-weight="700">AUTHZ</text>
  <text x="494" y="80" text-anchor="middle" fill="var(--text-3)" font-size="8">@PreAuthorize</text>
  <text x="494" y="93" text-anchor="middle" fill="var(--text-3)" font-size="8">hasRole()</text>
  <text x="494" y="106" text-anchor="middle" fill="var(--text-3)" font-size="8">hasAuthority()</text>
  <text x="494" y="119" text-anchor="middle" fill="var(--text-3)" font-size="8">403 if denied</text>
  <line x1="544" y1="78" x2="556" y2="78" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr6)"/>

  <!-- Handler -->
  <rect x="558" y="44" width="82" height="68" rx="7" fill="color-mix(in srgb,var(--green) 14%,transparent)" stroke="var(--green)" stroke-width="1.5"/>
  <text x="599" y="64" text-anchor="middle" fill="var(--green)" font-size="9" font-weight="700">HANDLER</text>
  <text x="599" y="80" text-anchor="middle" fill="var(--text-3)" font-size="8">Controller</text>
  <text x="599" y="92" text-anchor="middle" fill="var(--text-3)" font-size="8">method runs</text>
  <text x="599" y="104" text-anchor="middle" fill="var(--text-3)" font-size="8">200 OK</text>

  <!-- SecurityContext note -->
  <rect x="24" y="135" width="310" height="90" rx="8" fill="color-mix(in srgb,var(--purple) 10%,transparent)" stroke="var(--purple)" stroke-width="1"/>
  <text x="179" y="157" text-anchor="middle" fill="var(--purple)" font-size="10" font-weight="700">SecurityContextHolder (ThreadLocal)</text>
  <text x="179" y="175" text-anchor="middle" fill="var(--text-3)" font-size="9">SecurityContextHolder.getContext().getAuthentication()</text>
  <text x="179" y="192" text-anchor="middle" fill="var(--text-3)" font-size="9">  .getPrincipal()  →  UserDetails object</text>
  <text x="179" y="208" text-anchor="middle" fill="var(--text-3)" font-size="9">  .getAuthorities() →  [ROLE_USER, ROLE_ADMIN]</text>

  <!-- JWT Note -->
  <rect x="350" y="135" width="290" height="90" rx="8" fill="color-mix(in srgb,var(--amber) 10%,transparent)" stroke="var(--amber)" stroke-width="1"/>
  <text x="495" y="157" text-anchor="middle" fill="var(--amber)" font-size="10" font-weight="700">JWT Token Structure</text>
  <text x="495" y="175" text-anchor="middle" fill="var(--text-3)" font-size="9">Header: alg=HS256, typ=JWT</text>
  <text x="495" y="191" text-anchor="middle" fill="var(--text-3)" font-size="9">Payload: sub, iat, exp, roles</text>
  <text x="495" y="207" text-anchor="middle" fill="var(--text-3)" font-size="9">Signature: HMAC-SHA256(secret)</text>
</svg>`,

/* ── 7. Microservices Architecture ────────────────────────── */
microservicesArch: `<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs>
    <marker id="arr7" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <!-- Client -->
  <rect x="10" y="130" width="70" height="50" rx="7" fill="none" stroke="var(--purple)" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="45" y="152" text-anchor="middle" fill="var(--purple)" font-size="10" font-weight="600">Client</text>
  <text x="45" y="167" text-anchor="middle" fill="var(--text-3)" font-size="8">Browser/App</text>
  <line x1="80" y1="155" x2="100" y2="155" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr7)"/>

  <!-- API Gateway -->
  <rect x="102" y="100" width="110" height="110" rx="10" fill="color-mix(in srgb,var(--blue) 14%,transparent)" stroke="var(--blue)" stroke-width="2"/>
  <text x="157" y="124" text-anchor="middle" fill="var(--blue)" font-size="10" font-weight="700">API GATEWAY</text>
  <text x="157" y="140" text-anchor="middle" fill="var(--text-3)" font-size="8">Spring Cloud</text>
  <text x="157" y="153" text-anchor="middle" fill="var(--text-3)" font-size="8">Routing</text>
  <text x="157" y="166" text-anchor="middle" fill="var(--text-3)" font-size="8">Rate limiting</text>
  <text x="157" y="179" text-anchor="middle" fill="var(--text-3)" font-size="8">Auth check</text>
  <text x="157" y="193" text-anchor="middle" fill="var(--text-3)" font-size="8">Load balance</text>

  <!-- Eureka -->
  <rect x="102" y="238" width="110" height="60" rx="8" fill="color-mix(in srgb,var(--teal) 12%,transparent)" stroke="var(--teal)" stroke-width="1.5"/>
  <text x="157" y="260" text-anchor="middle" fill="var(--teal)" font-size="9" font-weight="700">EUREKA SERVER</text>
  <text x="157" y="276" text-anchor="middle" fill="var(--text-3)" font-size="8">Service Registry</text>
  <text x="157" y="290" text-anchor="middle" fill="var(--text-3)" font-size="8">Heartbeat every 30s</text>
  <!-- gateway to eureka -->
  <line x1="157" y1="210" x2="157" y2="238" stroke="var(--teal)" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arr7)"/>

  <!-- Services -->
  <!-- User Service -->
  <rect x="290" y="40" width="110" height="80" rx="8" fill="color-mix(in srgb,var(--green) 12%,transparent)" stroke="var(--green)" stroke-width="1.5"/>
  <text x="345" y="62" text-anchor="middle" fill="var(--green)" font-size="9" font-weight="700">USER SERVICE</text>
  <text x="345" y="78" text-anchor="middle" fill="var(--text-3)" font-size="8">:8081</text>
  <text x="345" y="93" text-anchor="middle" fill="var(--text-3)" font-size="8">@EurekaClient</text>
  <text x="345" y="108" text-anchor="middle" fill="var(--text-3)" font-size="8">Own DB (users)</text>

  <!-- Order Service -->
  <rect x="290" y="155" width="110" height="80" rx="8" fill="color-mix(in srgb,var(--amber) 12%,transparent)" stroke="var(--amber)" stroke-width="1.5"/>
  <text x="345" y="177" text-anchor="middle" fill="var(--amber)" font-size="9" font-weight="700">ORDER SERVICE</text>
  <text x="345" y="193" text-anchor="middle" fill="var(--text-3)" font-size="8">:8082</text>
  <text x="345" y="208" text-anchor="middle" fill="var(--text-3)" font-size="8">@EurekaClient</text>
  <text x="345" y="223" text-anchor="middle" fill="var(--text-3)" font-size="8">Own DB (orders)</text>

  <!-- Product Service -->
  <rect x="290" y="268" width="110" height="40" rx="8" fill="color-mix(in srgb,var(--rose) 12%,transparent)" stroke="var(--rose)" stroke-width="1.5"/>
  <text x="345" y="286" text-anchor="middle" fill="var(--rose)" font-size="9" font-weight="700">PRODUCT SVC</text>
  <text x="345" y="300" text-anchor="middle" fill="var(--text-3)" font-size="8">:8083</text>

  <!-- Gateway to services -->
  <line x1="212" y1="130" x2="290" y2="80" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr7)"/>
  <line x1="212" y1="155" x2="290" y2="195" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr7)"/>
  <line x1="212" y1="170" x2="290" y2="280" stroke="var(--text-3)" stroke-width="1.5" marker-end="url(#arr7)"/>

  <!-- Eureka to services (dashed register) -->
  <line x1="280" y1="268" x2="212" y2="258" stroke="var(--teal)" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arr7)"/>

  <!-- Resilience4j -->
  <rect x="460" y="110" width="130" height="100" rx="8" fill="color-mix(in srgb,var(--purple) 12%,transparent)" stroke="var(--purple)" stroke-width="1.5"/>
  <text x="525" y="132" text-anchor="middle" fill="var(--purple)" font-size="9" font-weight="700">RESILIENCE4J</text>
  <text x="525" y="150" text-anchor="middle" fill="var(--text-3)" font-size="8">@CircuitBreaker</text>
  <text x="525" y="165" text-anchor="middle" fill="var(--text-3)" font-size="8">CLOSED → normal</text>
  <text x="525" y="178" text-anchor="middle" fill="var(--text-3)" font-size="8">OPEN → fallback</text>
  <text x="525" y="191" text-anchor="middle" fill="var(--text-3)" font-size="8">HALF_OPEN → probe</text>
  <text x="525" y="204" text-anchor="middle" fill="var(--text-3)" font-size="8">@Retry · @Timeout</text>

  <!-- Kafka -->
  <rect x="460" y="230" width="130" height="60" rx="8" fill="color-mix(in srgb,var(--green) 10%,transparent)" stroke="var(--green)" stroke-width="1.5"/>
  <text x="525" y="253" text-anchor="middle" fill="var(--green)" font-size="9" font-weight="700">KAFKA</text>
  <text x="525" y="269" text-anchor="middle" fill="var(--text-3)" font-size="8">Async events</text>
  <text x="525" y="283" text-anchor="middle" fill="var(--text-3)" font-size="8">order.created topic</text>

  <!-- Services to resilience -->
  <line x1="400" y1="90" x2="460" y2="145" stroke="var(--purple)" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arr7)"/>
  <line x1="400" y1="200" x2="460" y2="200" stroke="var(--purple)" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arr7)"/>

  <!-- Order to Kafka -->
  <line x1="400" y1="220" x2="460" y2="255" stroke="var(--green)" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arr7)"/>
</svg>`,

/* ── 8. Circuit Breaker States ────────────────────────────── */
circuitBreaker: `<svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs>
    <marker id="arr8" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="var(--text-3)"/>
    </marker>
  </defs>
  <!-- CLOSED -->
  <circle cx="100" cy="110" r="75" fill="color-mix(in srgb,var(--green) 14%,transparent)" stroke="var(--green)" stroke-width="2"/>
  <text x="100" y="96" text-anchor="middle" fill="var(--green)" font-size="14" font-weight="800">CLOSED</text>
  <text x="100" y="116" text-anchor="middle" fill="var(--text-3)" font-size="10">Normal operation</text>
  <text x="100" y="132" text-anchor="middle" fill="var(--text-3)" font-size="10">Requests flow through</text>
  <text x="100" y="150" text-anchor="middle" fill="var(--text-3)" font-size="9">Counts failures</text>

  <!-- OPEN -->
  <circle cx="460" cy="110" r="75" fill="color-mix(in srgb,var(--rose) 14%,transparent)" stroke="var(--rose)" stroke-width="2"/>
  <text x="460" y="96" text-anchor="middle" fill="var(--rose)" font-size="14" font-weight="800">OPEN</text>
  <text x="460" y="116" text-anchor="middle" fill="var(--text-3)" font-size="10">Failures exceeded</text>
  <text x="460" y="132" text-anchor="middle" fill="var(--text-3)" font-size="10">threshold (e.g. 50%)</text>
  <text x="460" y="150" text-anchor="middle" fill="var(--text-3)" font-size="9">Fallback method called</text>

  <!-- HALF_OPEN -->
  <circle cx="280" cy="110" r="75" fill="color-mix(in srgb,var(--amber) 14%,transparent)" stroke="var(--amber)" stroke-width="2"/>
  <text x="280" y="93" text-anchor="middle" fill="var(--amber)" font-size="12" font-weight="800">HALF</text>
  <text x="280" y="109" text-anchor="middle" fill="var(--amber)" font-size="12" font-weight="800">OPEN</text>
  <text x="280" y="128" text-anchor="middle" fill="var(--text-3)" font-size="10">Wait period expired</text>
  <text x="280" y="144" text-anchor="middle" fill="var(--text-3)" font-size="9">Trial requests sent</text>

  <!-- Arrows -->
  <!-- CLOSED → OPEN -->
  <path d="M 172 88 Q 220 50 360 88" fill="none" stroke="var(--rose)" stroke-width="1.5" marker-end="url(#arr8)"/>
  <text x="266" y="52" text-anchor="middle" fill="var(--rose)" font-size="9">failure threshold exceeded</text>

  <!-- OPEN → HALF_OPEN -->
  <path d="M 388 132 Q 340 175 354 132" fill="none" stroke="var(--amber)" stroke-width="1.5" marker-end="url(#arr8)"/>
  <text x="370" y="182" text-anchor="middle" fill="var(--amber)" font-size="9">wait duration expires</text>

  <!-- HALF_OPEN → CLOSED -->
  <path d="M 207 132 Q 160 175 172 132" fill="none" stroke="var(--green)" stroke-width="1.5" marker-end="url(#arr8)"/>
  <text x="160" y="182" text-anchor="middle" fill="var(--green)" font-size="9">probes succeed</text>

  <!-- HALF_OPEN → OPEN -->
  <path d="M 354 88 Q 340 50 388 88" fill="none" stroke="var(--rose)" stroke-width="1.5" marker-end="url(#arr8)" stroke-dasharray="3,3"/>
  <text x="375" y="58" text-anchor="middle" fill="var(--rose)" font-size="9">probes fail</text>
</svg>`,

/* ── 9. AOP Concepts ─────────────────────────────────────── */
aopConcepts: `<svg viewBox="0 0 660 280" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <defs>
    <marker id="arr9" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="var(--text-3)"/>
    </marker>
  </defs>

  <!-- Main method call timeline -->
  <rect x="140" y="40" width="380" height="50" rx="8" fill="color-mix(in srgb,var(--blue) 12%,transparent)" stroke="var(--blue)" stroke-width="1.5"/>
  <text x="330" y="60" text-anchor="middle" fill="var(--blue)" font-size="10" font-weight="700">METHOD EXECUTION (Join Point)</text>
  <text x="330" y="78" text-anchor="middle" fill="var(--text-3)" font-size="9">e.g. UserService.createUser(dto) — any method Spring proxies</text>

  <!-- @Before -->
  <rect x="20" y="120" width="120" height="70" rx="7" fill="color-mix(in srgb,var(--green) 14%,transparent)" stroke="var(--green)" stroke-width="1.5"/>
  <text x="80" y="142" text-anchor="middle" fill="var(--green)" font-size="10" font-weight="700">@Before</text>
  <text x="80" y="158" text-anchor="middle" fill="var(--text-3)" font-size="8">Runs before</text>
  <text x="80" y="171" text-anchor="middle" fill="var(--text-3)" font-size="8">Cannot stop call</text>
  <text x="80" y="184" text-anchor="middle" fill="var(--text-3)" font-size="8">Logging / auth</text>
  <line x1="140" y1="155" x2="176" y2="95" stroke="var(--green)" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arr9)"/>

  <!-- @AfterReturning -->
  <rect x="20" y="210" width="120" height="60" rx="7" fill="color-mix(in srgb,var(--teal) 14%,transparent)" stroke="var(--teal)" stroke-width="1.5"/>
  <text x="80" y="232" text-anchor="middle" fill="var(--teal)" font-size="9" font-weight="700">@AfterReturning</text>
  <text x="80" y="248" text-anchor="middle" fill="var(--text-3)" font-size="8">After success only</text>
  <text x="80" y="261" text-anchor="middle" fill="var(--text-3)" font-size="8">Access return value</text>
  <line x1="140" y1="240" x2="176" y2="110" stroke="var(--teal)" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arr9)"/>

  <!-- @AfterThrowing -->
  <rect x="520" y="120" width="120" height="60" rx="7" fill="color-mix(in srgb,var(--rose) 14%,transparent)" stroke="var(--rose)" stroke-width="1.5"/>
  <text x="580" y="142" text-anchor="middle" fill="var(--rose)" font-size="9" font-weight="700">@AfterThrowing</text>
  <text x="580" y="158" text-anchor="middle" fill="var(--text-3)" font-size="8">On exception only</text>
  <text x="580" y="171" text-anchor="middle" fill="var(--text-3)" font-size="8">Error logging</text>
  <line x1="520" y1="150" x2="484" y2="95" stroke="var(--rose)" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arr9)"/>

  <!-- @Around (wraps everything) -->
  <rect x="160" y="120" width="340" height="130" rx="8" fill="color-mix(in srgb,var(--amber) 10%,transparent)" stroke="var(--amber)" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="330" y="145" text-anchor="middle" fill="var(--amber)" font-size="10" font-weight="700">@Around (wraps entire execution)</text>
  <text x="330" y="163" text-anchor="middle" fill="var(--text-3)" font-size="9">ProceedingJoinPoint.proceed() — you decide whether to call the method</text>
  <text x="330" y="180" text-anchor="middle" fill="var(--text-3)" font-size="9">Use for: performance timing, caching, transaction management</text>

  <!-- Pointcut note -->
  <rect x="160" y="218" width="340" height="28" rx="6" fill="color-mix(in srgb,var(--purple) 12%,transparent)"/>
  <text x="330" y="231" text-anchor="middle" fill="var(--purple)" font-size="9" font-weight="700">@Pointcut</text>
  <text x="330" y="243" text-anchor="middle" fill="var(--text-3)" font-size="8">execution(* com.example.service.*.*(..)) — selects which joinpoints to intercept</text>
</svg>`,

/* ── 10. Testing Pyramid ─────────────────────────────────── */
testingPyramid: `<svg viewBox="0 0 560 280" xmlns="http://www.w3.org/2000/svg" font-family="Inter,sans-serif">
  <!-- Unit Tests - base -->
  <polygon points="60,250 500,250 450,160 110,160" fill="color-mix(in srgb,var(--green) 18%,transparent)" stroke="var(--green)" stroke-width="2"/>
  <text x="280" y="212" text-anchor="middle" fill="var(--green)" font-size="13" font-weight="700">Unit Tests</text>
  <text x="280" y="232" text-anchor="middle" fill="var(--text-3)" font-size="10">JUnit 5 · Mockito · @Mock · @InjectMocks</text>
  <text x="280" y="248" text-anchor="middle" fill="var(--text-3)" font-size="9">Fast · Isolated · Test single class · No Spring context</text>

  <!-- Integration Tests - middle -->
  <polygon points="110,158 450,158 400,80 160,80" fill="color-mix(in srgb,var(--amber) 16%,transparent)" stroke="var(--amber)" stroke-width="2"/>
  <text x="280" y="122" text-anchor="middle" fill="var(--amber)" font-size="12" font-weight="700">Integration Tests</text>
  <text x="280" y="140" text-anchor="middle" fill="var(--text-3)" font-size="9">@DataJpaTest · @WebMvcTest · TestContainers</text>
  <text x="280" y="156" text-anchor="middle" fill="var(--text-3)" font-size="9">Partial context · Real DB or MockMvc</text>

  <!-- E2E / Full - top -->
  <polygon points="160,78 400,78 280,18" fill="color-mix(in srgb,var(--rose) 16%,transparent)" stroke="var(--rose)" stroke-width="2"/>
  <text x="280" y="56" text-anchor="middle" fill="var(--rose)" font-size="10" font-weight="700">E2E / @SpringBootTest</text>
  <text x="280" y="72" text-anchor="middle" fill="var(--text-3)" font-size="8">Full context · Slow · Few</text>

  <!-- Labels right -->
  <text x="514" y="40" fill="var(--rose)" font-size="9" font-weight="600">Slow / Few</text>
  <text x="514" y="128" fill="var(--amber)" font-size="9" font-weight="600">Medium</text>
  <text x="514" y="215" fill="var(--green)" font-size="9" font-weight="600">Fast / Many</text>
  <line x1="508" y1="18" x2="508" y2="250" stroke="var(--line-2)" stroke-width="1"/>
  <line x1="505" y1="18" x2="511" y2="18" stroke="var(--line-2)" stroke-width="1"/>
  <line x1="505" y1="250" x2="511" y2="250" stroke="var(--line-2)" stroke-width="1"/>
</svg>`

}; // end window.DIAGRAMS
