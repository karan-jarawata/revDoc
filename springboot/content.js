/* ============================================================
   Spring Boot — learning content as structured blocks.
   Rendered by app.js (shared with the other guides).
   Avoid ${...} and backticks in code strings.
   ============================================================ */

window.CONTENT = {

  hero: {
    eyebrow: 'THE COMPLETE GUIDE',
    title: 'Spring Boot',
    sub: 'From first @SpringBootApplication to production microservices — how IoC works, how beans live and die, how requests flow through the layers, how JPA maps your domain, how Spring Security guards every route, and how to wire multiple services together with resilience patterns. Seven phases. Every annotation explained. Real code throughout.',
    stats: [
      { num: '16',  label: 'PHASES' },
      { num: '20',  label: 'TOPICS' },
      { num: '40+', label: 'ANNOTATIONS' },
      { num: '10',  label: 'DIAGRAMS' }
    ]
  },

  levels: [

    /* ══════════════════════════════════════════════════════════
       PHASE 0 — HOW SPRING BOOT WORKS
    ══════════════════════════════════════════════════════════ */
    {
      id: 'how-it-works', num: '00', accent: 'green',
      part: 'PHASE 0 · FOUNDATIONS',
      eyebrow: 'THE MENTAL MODEL',
      title: 'How Spring Boot Works',
      intro: 'Before memorising annotations, understand what Spring is actually doing. Every annotation makes sense once you understand IoC, the ApplicationContext, and auto-configuration.',
      blocks: [
        {
          t: 'sub',
          text: 'Inversion of Control (IoC) — the core idea'
        },
        {
          t: 'prose',
          html: 'In normal code, <em>you</em> create objects: <code>UserService svc = new UserService(repo);</code>. In Spring, you declare your objects and their dependencies — Spring creates them, injects the dependencies, and manages their lifetime. You invert control to the framework. This is why you can test services by swapping real dependencies for mocks without touching the service code.'
        },
        {
          t: 'cards',
          items: [
            { title: 'Bean', body: 'Any object managed by the Spring container. Annotated with @Component, @Service, @Repository, @Controller, or defined with @Bean in a @Configuration class.' },
            { title: 'ApplicationContext', body: 'The IoC container itself. Reads your config, instantiates beans, injects dependencies, and exposes the full application. @SpringBootApplication triggers it on startup.' },
            { title: 'BeanFactory', body: 'The lower-level parent of ApplicationContext. Provides basic bean management. ApplicationContext adds AOP, events, internationalisation, and environment abstractions on top.' },
            { title: 'Dependency Injection', body: 'The mechanism IoC uses. Constructor injection (preferred — makes dependencies explicit and testable), setter injection, or field injection (avoid — hides dependencies).' }
          ]
        },
        {
          t: 'sub',
          text: '@SpringBootApplication — one annotation, three jobs'
        },
        {
          t: 'diagram',
          name: 'autoConfig',
          cap: '@SpringBootApplication combines three annotations; auto-config reads the classpath and creates matching beans only when conditions are met'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Main class — that is all you need to start',
          code:
`@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`
        },
        {
          t: 'callout',
          kind: 'tip',
          title: 'Auto-configuration is conditional',
          html: 'Spring Boot uses @ConditionalOnClass, @ConditionalOnMissingBean, and @ConditionalOnProperty. If jackson-databind is on the classpath, ObjectMapper is configured automatically. If you define your own ObjectMapper @Bean, the auto-configured one backs off. You never fight auto-config — you override specific parts.'
        },
        {
          t: 'sub',
          text: 'The Layered Architecture'
        },
        {
          t: 'diagram',
          name: 'layeredArch',
          cap: 'Web Layer → Service Layer → Data Layer → DB; AOP cross-cuts all layers'
        },
        {
          t: 'table',
          head: ['Layer', 'Annotation', 'Responsibility'],
          rows: [
            ['Web / Controller', '@RestController', 'Accept HTTP, validate input, call service, return response'],
            ['Service / Business', '@Service', 'Business logic, orchestration, @Transactional boundaries'],
            ['Data / Repository', '@Repository', 'Database access, query execution, exception translation'],
            ['Cross-cutting', '@Aspect', 'Logging, security, timing — applied via AOP without touching each layer']
          ]
        },
        {
          t: 'sub',
          text: 'Bean Lifecycle'
        },
        {
          t: 'diagram',
          name: 'beanLifecycle',
          cap: 'Seven stages from construction to destruction — @PostConstruct and @PreDestroy are your hooks'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Hooking into the lifecycle',
          code:
`@Component
public class CacheWarmup {

    @PostConstruct          // runs after all @Autowired fields are set
    public void init() {
        // load reference data, open connections, etc.
    }

    @PreDestroy             // runs before Spring shuts the bean down
    public void cleanup() {
        // flush queues, close resources, etc.
    }
}`
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 1 — CORE ANNOTATIONS
    ══════════════════════════════════════════════════════════ */
    {
      id: 'annotations', num: '01', accent: 'blue',
      part: 'PHASE 1 · ANNOTATIONS',
      eyebrow: 'THE VOCABULARY',
      title: 'Core Annotations',
      intro: 'Spring Boot is annotation-driven. Knowing which annotation does what — and which layer it belongs to — is the single fastest way to read any Spring codebase.',
      blocks: [
        {
          t: 'sub',
          text: 'Stereotype Annotations — register beans by role'
        },
        {
          t: 'table',
          head: ['Annotation', 'Layer', 'Extra behaviour'],
          rows: [
            ['@Component', 'Any', 'Generic bean — base of all stereotypes'],
            ['@Service', 'Service', 'Semantic alias for @Component. No extra magic yet.'],
            ['@Repository', 'Data', 'Translates SQL exceptions → DataAccessException hierarchy'],
            ['@Controller', 'Web', 'Returns view names (Thymeleaf etc.)'],
            ['@RestController', 'Web', '@Controller + @ResponseBody on every method → JSON by default']
          ]
        },
        {
          t: 'sub',
          text: 'Dependency Injection Annotations'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Constructor injection — always prefer this',
          code:
`@Service
public class OrderService {

    private final OrderRepository repo;
    private final PaymentService payment;

    // Spring sees one constructor — no @Autowired needed (Spring 4.3+)
    public OrderService(OrderRepository repo, PaymentService payment) {
        this.repo = repo;
        this.payment = payment;
    }
}`
        },
        {
          t: 'cards',
          items: [
            { title: '@Autowired', body: 'Inject by type. On constructor: optional from Spring 4.3 if only one constructor. On field: works but hides dependencies — avoid in production code.' },
            { title: '@Qualifier("name")', body: 'When two beans implement the same interface, tell Spring which one to use: @Qualifier("redisCache"). Pair with @Autowired.' },
            { title: '@Primary', body: 'Mark one bean as the default when multiple candidates exist. Lower priority than @Qualifier.' },
            { title: '@Lazy', body: 'Delay bean creation until first use. Main use: break circular dependencies. Also saves startup time for rarely-used heavy beans.' }
          ]
        },
        {
          t: 'sub',
          text: 'Method Parameter Annotations'
        },
        {
          t: 'table',
          head: ['Annotation', 'Source', 'Example'],
          rows: [
            ['@PathVariable', 'URL path segment', 'GET /users/{id} → @PathVariable Long id'],
            ['@RequestParam', 'Query string / form', 'GET /search?name=x → @RequestParam String name'],
            ['@RequestBody', 'HTTP request body', 'POST with JSON → @RequestBody CreateUserRequest req'],
            ['@ResponseBody', 'Return value → response body', 'Implicit on all @RestController methods'],
            ['@RequestHeader', 'HTTP header', '@RequestHeader("Authorization") String token'],
            ['@CookieValue', 'HTTP cookie', '@CookieValue("sessionId") String sid'],
            ['@ModelAttribute', 'Form fields / model data', 'Binds form POSTs to an object; also pre-populates model'],
            ['@MatrixVariable', 'Matrix variables in path', 'GET /cars/color=red;year=2020 → @MatrixVariable int year']
          ]
        },
        {
          t: 'code',
          lang: 'java',
          title: 'The six most-used parameter annotations together',
          code:
`@RestController
@RequestMapping("/api/orders")
public class OrderController {

    // @PathVariable: GET /api/orders/42
    @GetMapping("/{id}")
    public OrderDto getById(@PathVariable Long id) { ... }

    // @RequestParam with defaults: GET /api/orders?status=PENDING&page=0
    @GetMapping
    public Page<OrderDto> list(
            @RequestParam(defaultValue = "PENDING") String status,
            @RequestParam(defaultValue = "0")       int page) { ... }

    // @RequestBody: POST body deserialized to DTO
    @PostMapping
    public OrderDto create(@Valid @RequestBody CreateOrderRequest req) { ... }

    // @RequestHeader: pull header value
    @GetMapping("/export")
    public ResponseEntity<byte[]> export(
            @RequestHeader("Accept-Language") String lang) { ... }

    // @CookieValue: read cookie
    @GetMapping("/track")
    public String track(@CookieValue(value = "trackId", required = false) String id) { ... }
}`
        },
        {
          t: 'sub',
          text: 'Configuration Annotations'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Manual bean definition with @Configuration + @Bean',
          code:
`@Configuration
public class AppConfig {

    @Bean                           // method name becomes the bean name
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @ConditionalOnProperty(name = "feature.cache", havingValue = "true")
    public CacheManager cacheManager(RedisConnectionFactory cf) {
        return RedisCacheManager.create(cf);
    }
}`
        },
        {
          t: 'sub',
          text: 'Scheduling and Async'
        },
        {
          t: 'code',
          lang: 'java',
          title: '@Scheduled and @Async — background work',
          code:
`@Configuration
@EnableScheduling
@EnableAsync
public class AsyncConfig { }

@Service
public class ReportService {

    // fixed rate in ms — runs every 30 seconds regardless of previous run
    @Scheduled(fixedRate = 30000)
    public void generateDailyReport() { ... }

    // cron: second minute hour day month weekday
    @Scheduled(cron = "0 0 6 * * MON-FRI")
    public void morningSync() { ... }

    // returns immediately; task runs on Spring's async executor
    @Async
    public CompletableFuture<List<Order>> fetchOrdersAsync(Long userId) {
        return CompletableFuture.completedFuture(repo.findByUserId(userId));
    }
}`
        },
        {
          t: 'sub',
          text: 'Cache Annotations'
        },
        {
          t: 'table',
          head: ['Annotation', 'What it does'],
          rows: [
            ['@EnableCaching', 'Activates cache proxy infrastructure (put on @Configuration class)'],
            ['@Cacheable("users")', 'Returns cached result on cache hit; calls method and caches on miss'],
            ['@CachePut("users")', 'Always calls method AND updates cache — use for writes'],
            ['@CacheEvict("users")', 'Removes entry (or all entries with allEntries=true) — use on delete'],
            ['@Caching', 'Combine multiple cache operations on one method']
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 2 — WEB LAYER
    ══════════════════════════════════════════════════════════ */
    {
      id: 'web-layer', num: '02', accent: 'blue',
      part: 'PHASE 2 · WEB LAYER',
      eyebrow: 'REST APIs',
      title: 'Controller, Validation & Exception Handling',
      intro: 'The web layer translates HTTP into Java calls and Java results back into HTTP responses. Get this layer right and the rest of the codebase stays clean.',
      blocks: [
        {
          t: 'sub',
          text: 'HTTP Request Flow'
        },
        {
          t: 'diagram',
          name: 'requestFlow',
          cap: 'Every request passes through the Security Filter Chain before reaching your @RestController'
        },
        {
          t: 'sub',
          text: 'REST Controller Basics'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'A complete REST controller with all mapping annotations',
          code:
`@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping                          // GET /api/v1/users
    public List<UserDto> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")                 // GET /api/v1/users/42
    public ResponseEntity<UserDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping                         // POST /api/v1/users
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto create(@Valid @RequestBody CreateUserRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public UserDto update(@PathVariable Long id,
                          @Valid @RequestBody UpdateUserRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/search")               // GET /api/v1/users/search?name=john
    public Page<UserDto> search(@RequestParam String name,
                                @RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "20") int size) {
        return service.search(name, PageRequest.of(page, size));
    }
}`
        },
        {
          t: 'sub',
          text: 'Validation Annotations'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Request DTO with bean validation — use @Valid on @RequestBody to trigger',
          code:
`public class CreateUserRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank
    @Email(message = "Must be a valid email")
    private String email;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = ".*[A-Z].*", message = "Must contain an uppercase letter")
    private String password;

    @NotNull
    @Min(18) @Max(120)
    private Integer age;

    @NotEmpty                          // collection must not be null and must have at least one element
    private List<Long> productIds;

    @Positive                          // must be > 0
    private BigDecimal price;

    // getters/setters or use Lombok @Data
}`
        },
        {
          t: 'table',
          head: ['Annotation', 'Applies to', 'Rule'],
          rows: [
            ['@NotNull', 'Any', 'Must not be null (allows empty string/collection)'],
            ['@NotBlank', 'String', 'Must not be null, empty, or whitespace-only'],
            ['@NotEmpty', 'String / Collection / Array', 'Must not be null and size > 0'],
            ['@Size(min,max)', 'String / Collection', 'Length/size within range'],
            ['@Min(n) / @Max(n)', 'Number', 'Numeric value >= min or <= max'],
            ['@Positive / @Negative', 'Number', 'Must be > 0 or < 0 respectively'],
            ['@Email', 'String', 'Must be a valid email format'],
            ['@Pattern(regexp)', 'String', 'Must match the given regex'],
            ['@Valid', 'Object param', 'Triggers recursive validation on the annotated object'],
            ['@Validated', 'Class / method', 'Enables method-level validation (e.g. @NotNull on @PathVariable)']
          ]
        },
        {
          t: 'sub',
          text: 'Global Exception Handling'
        },
        {
          t: 'code',
          lang: 'java',
          title: '@ControllerAdvice — one place handles all errors for all controllers',
          code:
`@RestControllerAdvice
public class GlobalExceptionHandler {

    // handles @Valid failures — MethodArgumentNotValidException
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err ->
            errors.put(err.getField(), err.getDefaultMessage())
        );
        return errors;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(ResourceNotFoundException ex) {
        return new ErrorResponse(404, ex.getMessage(), Instant.now());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleAll(Exception ex) {
        return new ErrorResponse(500, "Internal server error", Instant.now());
    }
}`
        },
        {
          t: 'callout',
          kind: 'warning',
          title: 'Return consistent error shapes',
          html: 'Define one ErrorResponse record with fields like status, message, timestamp, path. Every endpoint failure should return this shape. Frontend developers and API consumers will thank you, and your Swagger docs will be clean.'
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 3 — DATA ACCESS (JPA)
    ══════════════════════════════════════════════════════════ */
    {
      id: 'data-access', num: '03', accent: 'amber',
      part: 'PHASE 3 · DATA ACCESS',
      eyebrow: 'JPA & HIBERNATE',
      title: 'Entities, Repositories & Queries',
      intro: 'JPA is the specification; Hibernate is the default implementation. Spring Data JPA wraps both with repositories that eliminate 90% of boilerplate. Master entity mapping, relationships, and the N+1 trap.',
      blocks: [
        {
          t: 'sub',
          text: 'Entity Relationships'
        },
        {
          t: 'diagram',
          name: 'jpaRelationships',
          cap: 'User → Profile (1:1), User → Orders (1:N), Order ↔ Product (M:N via join table)'
        },
        {
          t: 'sub',
          text: 'Entity Mapping'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Complete entity with auditing, relationships, and enum column',
          code:
`@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)          // store "PENDING" not "0"
    @Column(nullable = false)
    private OrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY)    // LAZY = load user only when accessed
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
        name = "order_products",
        joinColumns = @JoinColumn(name = "order_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Set<Product> products = new HashSet<>();

    @Transient                            // excluded from persistence — exists only in memory
    private String displayLabel;

    @CreatedDate                          // auto-set on persist
    private Instant createdAt;

    @LastModifiedDate                     // auto-set on every update
    private Instant updatedAt;
}`
        },
        {
          t: 'sub',
          text: 'Repository Pattern'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'JpaRepository gives you 18 methods free; extend as needed',
          code:
`public interface OrderRepository extends JpaRepository<Order, Long> {

    // Spring derives query from method name:
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);

    // Custom JPQL — entity names, not table names
    @Query("SELECT o FROM Order o JOIN FETCH o.products WHERE o.user.id = :userId")
    List<Order> findWithProductsByUserId(@Param("userId") Long userId);

    // Native SQL when JPQL cannot express the query
    @Query(value = "SELECT * FROM orders WHERE total > :min ORDER BY created_at DESC LIMIT 10",
           nativeQuery = true)
    List<Order> findTopExpensive(@Param("min") BigDecimal min);

    // Pagination built-in — return Page<T> or Slice<T>
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    // Bulk update — needs @Modifying + @Transactional
    @Modifying
    @Transactional
    @Query("UPDATE Order o SET o.status = :status WHERE o.user.id = :uid")
    int cancelAllByUser(@Param("uid") Long uid, @Param("status") OrderStatus status);
}`
        },
        {
          t: 'callout',
          kind: 'warning',
          title: 'The N+1 Problem — the most common JPA performance bug',
          html: 'You fetch 100 Orders (1 query). Accessing order.getUser() on each one fires 100 individual SELECT queries = 101 total. Fix with JOIN FETCH in JPQL, @EntityGraph, or FetchType.EAGER (use carefully). Always check query count in tests with Hibernate show_sql=true.'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Fix N+1 with @EntityGraph — no JPQL needed',
          code:
`public interface OrderRepository extends JpaRepository<Order, Long> {

    // loads Order + User + Products in ONE join query
    @EntityGraph(attributePaths = {"user", "products"})
    List<Order> findByStatus(OrderStatus status);
}`
        },
        {
          t: 'sub',
          text: 'Transaction Management'
        },
        {
          t: 'code',
          lang: 'java',
          title: '@Transactional on the service layer — always, not the repository',
          code:
`@Service
@Transactional(readOnly = true)      // default for all methods: read-only tx
public class OrderService {

    @Transactional                   // overrides class-level: full read-write tx
    public Order createOrder(CreateOrderRequest req) {
        Order order = mapper.toEntity(req);
        Order saved = repo.save(order);
        eventPublisher.publishEvent(new OrderCreatedEvent(saved.getId()));
        return saved;
        // tx commits here — if any exception was thrown, it rolls back
    }

    // readOnly = true: Hibernate skips dirty-checking, DB can use read replica
    public List<Order> findByUser(Long userId) {
        return repo.findByUserId(userId);
    }
}`
        },
        {
          t: 'table',
          head: ['Propagation', 'Behaviour'],
          rows: [
            ['REQUIRED (default)', 'Join existing tx; create new if none exists'],
            ['REQUIRES_NEW', 'Always create new tx; suspend the current one'],
            ['NESTED', 'Create savepoint inside existing tx — partial rollback possible'],
            ['SUPPORTS', 'Join tx if exists; run without tx if not'],
            ['NOT_SUPPORTED', 'Suspend existing tx; run without tx'],
            ['NEVER', 'Throw exception if called within an active tx']
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 4 — SPRING SECURITY + JWT
    ══════════════════════════════════════════════════════════ */
    {
      id: 'security', num: '04', accent: 'rose',
      part: 'PHASE 4 · SECURITY',
      eyebrow: 'SPRING SECURITY + JWT',
      title: 'Authentication & Authorization',
      intro: 'Spring Security intercepts every request before it reaches your controllers. Understand the filter chain, configure which endpoints are public, and implement stateless JWT authentication.',
      blocks: [
        {
          t: 'sub',
          text: 'The Security Filter Chain'
        },
        {
          t: 'diagram',
          name: 'securityChain',
          cap: 'Every HTTP request flows through the filter chain; the JWT filter sets the SecurityContext before Spring checks @PreAuthorize'
        },
        {
          t: 'sub',
          text: 'SecurityFilterChain Configuration'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Modern Spring Security 6 config — SecurityFilterChain bean',
          code:
`@Configuration
@EnableWebSecurity
@EnableMethodSecurity                  // enables @PreAuthorize on methods
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())              // REST APIs are stateless
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}`
        },
        {
          t: 'sub',
          text: 'JWT Authentication Filter'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Custom JWT filter — extract token, validate, set SecurityContext',
          code:
`@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {

        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);   // no token — let the chain decide
            return;
        }

        String token = header.substring(7);
        String username = jwtService.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext()
                                                     .getAuthentication() == null) {
            UserDetails user = userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(token, user)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        user, null, user.getAuthorities());
                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(req, res);
    }
}`
        },
        {
          t: 'sub',
          text: 'Method-Level Authorization'
        },
        {
          t: 'code',
          lang: 'java',
          title: '@PreAuthorize and @PostAuthorize — fine-grained access control',
          code:
`@RestController
@RequestMapping("/api/orders")
public class OrderController {

    // only ADMIN or the user who owns the order
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @orderSecurity.isOwner(#id, authentication)")
    public OrderDto getById(@PathVariable Long id) { ... }

    // run the method; then check return value — owner only
    @GetMapping("/my")
    @PostAuthorize("returnObject.userId == authentication.principal.id")
    public OrderDto getMyOrder() { ... }

    // roles
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { ... }
}`
        },
        {
          t: 'callout',
          kind: 'info',
          title: 'Authentication vs Authorization',
          html: 'Authentication = Who are you? (verify identity via username/password or JWT). Authorization = What are you allowed to do? (check roles/permissions). Spring Security separates these cleanly — AuthenticationManager handles AuthN, AccessDecisionManager / @PreAuthorize handles AuthZ.'
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 5 — MICROSERVICES
    ══════════════════════════════════════════════════════════ */
    {
      id: 'microservices', num: '05', accent: 'purple',
      part: 'PHASE 5 · MICROSERVICES',
      eyebrow: 'SPRING CLOUD',
      title: 'Gateway, Eureka & Resilience',
      intro: 'When a single Spring Boot app is not enough, Spring Cloud provides the building blocks: a gateway for routing, Eureka for discovery, Resilience4j for fault tolerance, and Kafka for async communication.',
      blocks: [
        {
          t: 'sub',
          text: 'Microservices Architecture Overview'
        },
        {
          t: 'diagram',
          name: 'microservicesArch',
          cap: 'Gateway routes all external traffic; Eureka tracks which instances are alive; Resilience4j wraps inter-service calls'
        },
        {
          t: 'sub',
          text: 'API Gateway — Spring Cloud Gateway'
        },
        {
          t: 'code',
          lang: 'yaml',
          title: 'application.yml — route configuration for the gateway',
          code:
`spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://USER-SERVICE       # lb:// = load-balanced via Eureka
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
            - AddRequestHeader=X-Internal-Request, true

        - id: order-service
          uri: lb://ORDER-SERVICE
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=1
            - name: CircuitBreaker
              args:
                name: orderCircuitBreaker
                fallbackUri: forward:/fallback/orders`
        },
        {
          t: 'sub',
          text: 'Service Discovery — Eureka'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Eureka Server (standalone Spring Boot app)',
          code:
`// Eureka Server
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServer { ... }

// Each microservice — Eureka Client
@SpringBootApplication
@EnableDiscoveryClient
public class UserService { ... }`
        },
        {
          t: 'code',
          lang: 'yaml',
          title: 'Each microservice registers itself by setting its name',
          code:
`# user-service application.yml
spring:
  application:
    name: USER-SERVICE         # this is the lb:// name the gateway uses
eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka/
  instance:
    prefer-ip-address: true`
        },
        {
          t: 'sub',
          text: 'Circuit Breaker — Resilience4j'
        },
        {
          t: 'diagram',
          name: 'circuitBreaker',
          cap: 'CLOSED = healthy; OPEN = fast-fail with fallback; HALF_OPEN = recovery probe'
        },
        {
          t: 'code',
          lang: 'java',
          title: '@CircuitBreaker with fallback — protect inter-service calls',
          code:
`@Service
public class OrderService {

    private final ProductServiceClient productClient;

    @CircuitBreaker(name = "productService", fallbackMethod = "productFallback")
    @Retry(name = "productService")
    @TimeLimiter(name = "productService")
    public List<ProductDto> getProducts(List<Long> ids) {
        return productClient.getByIds(ids);   // REST call to Product Service
    }

    // fallback must have same return type + Throwable param
    public List<ProductDto> productFallback(List<Long> ids, Throwable t) {
        log.warn("Product service down, returning empty list: {}", t.getMessage());
        return Collections.emptyList();
    }
}`
        },
        {
          t: 'code',
          lang: 'yaml',
          title: 'Resilience4j config in application.yml',
          code:
`resilience4j:
  circuitbreaker:
    instances:
      productService:
        slidingWindowSize: 10
        failureRateThreshold: 50        # open when 50% of last 10 calls fail
        waitDurationInOpenState: 10s
        permittedNumberOfCallsInHalfOpenState: 3
  retry:
    instances:
      productService:
        maxAttempts: 3
        waitDuration: 500ms`
        },
        {
          t: 'sub',
          text: 'Inter-Service Communication — RestTemplate vs WebClient'
        },
        {
          t: 'table',
          head: ['Client', 'Style', 'When to use'],
          rows: [
            ['RestTemplate', 'Synchronous / blocking', 'Legacy code; simple one-off calls; Spring MVC apps'],
            ['WebClient', 'Reactive / non-blocking', 'High-throughput; streaming; Spring WebFlux apps'],
            ['FeignClient', 'Declarative (annotation-driven)', 'Clean interface; auto load-balanced; pairs with Eureka'],
            ['RestClient (Spring 6.1)', 'Fluent, synchronous', 'Modern replacement for RestTemplate in Spring Boot 3.2+']
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 6 — AOP & TESTING
    ══════════════════════════════════════════════════════════ */
    {
      id: 'aop-testing', num: '06', accent: 'teal',
      part: 'PHASE 6 · AOP & TESTING',
      eyebrow: 'CROSS-CUTTING CONCERNS',
      title: 'AOP, Testing & Best Practices',
      intro: 'AOP lets you inject behaviour (logging, timing, security) around any method without touching it. Testing gives you confidence to change everything else.',
      blocks: [
        {
          t: 'sub',
          text: 'AOP — Aspect-Oriented Programming'
        },
        {
          t: 'table',
          head: ['Annotation', 'When it runs', 'Use case'],
          rows: [
            ['@EnableAspectJAutoProxy', 'Startup — enables AOP proxy creation', 'Put on @Configuration class to activate AOP'],
            ['@Aspect', 'Marks the class as an aspect', 'Must be combined with @Component to be picked up'],
            ['@Pointcut', 'Defines reusable match expression', 'execution(* com.example.service.*.*(..)) — reuse with method name'],
            ['@Before', 'Before the method runs', 'Logging entry, security pre-check — cannot stop call (throw to abort)'],
            ['@After', 'After method returns OR throws', 'Cleanup / "finally" block equivalent — runs no matter what'],
            ['@AfterReturning', 'After successful return only', 'Access return value via returning param; audit successes'],
            ['@AfterThrowing', 'After exception is thrown only', 'Error logging with exception type filter'],
            ['@Around', 'Wraps entire execution', 'Timing, caching, transaction — calls pjp.proceed() yourself']
          ]
        },
        {
          t: 'code',
          lang: 'java',
          title: 'All five advice types in one aspect — shows when each fires',
          code:
`@Aspect
@Component
@EnableAspectJAutoProxy              // enable on @Configuration class; @SpringBootApplication does it too
public class AuditAspect {

    @Pointcut("execution(* com.example.service..*.*(..))")
    public void serviceLayer() {}    // reusable pointcut — reference by method name

    @Before("serviceLayer()")
    public void logEntry(JoinPoint jp) {
        log.info(">>> {}.{}()", jp.getTarget().getClass().getSimpleName(),
                                 jp.getSignature().getName());
    }

    @After("serviceLayer()")         // always runs — like finally
    public void logExit(JoinPoint jp) {
        log.debug("<<< {}", jp.getSignature().getName());
    }

    @AfterReturning(pointcut = "serviceLayer()", returning = "result")
    public void logSuccess(JoinPoint jp, Object result) {
        log.info("SUCCESS: {} returned {}", jp.getSignature().getName(), result);
    }

    @AfterThrowing(pointcut = "serviceLayer()", throwing = "ex")
    public void logError(JoinPoint jp, Exception ex) {
        log.error("EXCEPTION in {}: {}", jp.getSignature().getName(), ex.getMessage());
    }

    @Around("serviceLayer()")
    public Object measureAndCache(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = pjp.proceed();   // actual method call
        log.info("{} took {}ms", pjp.getSignature().getName(),
                                  System.currentTimeMillis() - start);
        return result;
    }
}`
        },
        {
          t: 'diagram',
          name: 'aopConcepts',
          cap: '@Around wraps the full execution; @Before / @AfterReturning / @AfterThrowing are for specific moments'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Pointcut expression types — how to target exactly what you want',
          code:
`// execution: most common — match by method signature
@Pointcut("execution(* com.example.service.*.*(..))")          // all service methods
@Pointcut("execution(public * *(..))")                          // all public methods
@Pointcut("execution(* *.create*(..)) ")                       // methods starting with "create"

// @annotation: intercept methods annotated with a specific annotation
@Pointcut("@annotation(com.example.annotation.Audited)")       // only @Audited methods

// within: all methods in a type or package
@Pointcut("within(com.example.controller..*)")                 // all controller classes

// bean: target a specific Spring bean by name
@Pointcut("bean(orderService)")                                 // only orderService bean

// Combining with &&, ||, !
@Pointcut("serviceLayer() && !@annotation(com.example.annotation.NoAudit)")`
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Performance logging aspect — applied to every service method automatically',
          code:
`@Aspect
@Component
public class PerformanceAspect {

    private static final Logger log = LoggerFactory.getLogger(PerformanceAspect.class);

    // pointcut: all methods in any class in the service package
    @Pointcut("execution(* com.example.service..*.*(..))")
    public void serviceMethods() {}

    @Around("serviceMethods()")
    public Object measureTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            Object result = pjp.proceed();      // call the actual method
            long elapsed = System.currentTimeMillis() - start;
            log.info("{}.{} completed in {}ms",
                pjp.getTarget().getClass().getSimpleName(),
                pjp.getSignature().getName(),
                elapsed);
            return result;
        } catch (Throwable t) {
            log.error("Exception in {}: {}", pjp.getSignature(), t.getMessage());
            throw t;
        }
    }
}`
        },
        {
          t: 'sub',
          text: 'Testing Strategy'
        },
        {
          t: 'diagram',
          name: 'testingPyramid',
          cap: 'Many fast unit tests; fewer integration tests; a handful of full-context E2E tests'
        },
        {
          t: 'sub',
          text: 'Unit Testing — JUnit 5 + Mockito'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Service unit test — mock the repository, test business logic only',
          code:
`@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository repo;

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private OrderService service;       // Spring context NOT loaded — fast!

    @Test
    void createOrder_shouldSaveAndReturnDto() {
        // Arrange
        CreateOrderRequest req = new CreateOrderRequest(1L, List.of(10L, 20L));
        Order savedOrder = Order.builder().id(99L).status(PENDING).build();
        when(repo.save(any(Order.class))).thenReturn(savedOrder);

        // Act
        OrderDto result = service.createOrder(req);

        // Assert
        assertThat(result.getId()).isEqualTo(99L);
        verify(repo, times(1)).save(any(Order.class));
        verify(paymentService, never()).charge(any());   // not charged yet
    }
}`
        },
        {
          t: 'sub',
          text: 'Integration Testing'
        },
        {
          t: 'code',
          lang: 'java',
          title: '@DataJpaTest — real H2 database, only JPA slice loaded',
          code:
`@DataJpaTest
class OrderRepositoryTest {

    @Autowired
    private OrderRepository repo;

    @Autowired
    private TestEntityManager em;

    @Test
    void findByStatus_shouldReturnMatchingOrders() {
        em.persistAndFlush(Order.builder().status(PENDING).total(new BigDecimal("99.99")).build());
        em.persistAndFlush(Order.builder().status(SHIPPED).total(new BigDecimal("49.99")).build());

        List<Order> results = repo.findByStatus(PENDING, Pageable.unpaged()).getContent();

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTotal()).isEqualByComparingTo("99.99");
    }
}`
        },
        {
          t: 'code',
          lang: 'java',
          title: '@WebMvcTest — controller slice, MockMvc, no real DB',
          code:
`@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean                           // replaces real bean in Spring context
    private UserService userService;

    @Test
    void getById_shouldReturn200WithDto() throws Exception {
        UserDto dto = new UserDto(1L, "Alice", "alice@example.com");
        when(userService.findById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/v1/users/1")
                   .contentType(MediaType.APPLICATION_JSON))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.name").value("Alice"))
               .andExpect(jsonPath("$.email").value("alice@example.com"));
    }

    @Test
    void create_withInvalidEmail_shouldReturn400() throws Exception {
        String body = "{\"name\":\"Bob\",\"email\":\"not-an-email\",\"password\":\"Pass123!\",\"age\":25}";

        mockMvc.perform(post("/api/v1/users")
                   .contentType(MediaType.APPLICATION_JSON)
                   .content(body))
               .andExpect(status().isBadRequest())
               .andExpect(jsonPath("$.email").exists());
    }
}`
        },
        {
          t: 'callout',
          kind: 'tip',
          title: 'Use TestContainers for real database tests',
          html: 'Replace H2 with a real PostgreSQL or MySQL container in CI: @Testcontainers + @Container PostgreSQLContainer. The container starts before the test and is thrown away after. Your queries run against the exact same engine as production — no SQL dialect surprises.'
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 7 — PRODUCTION & INTERVIEW
    ══════════════════════════════════════════════════════════ */
    {
      id: 'production', num: '07', accent: 'green',
      part: 'PHASE 7 · PRODUCTION & INTERVIEWS',
      eyebrow: 'SHIP IT',
      title: 'Configuration, Actuator & Key Q&A',
      intro: 'The last mile: externalise configuration for each environment, expose health and metrics via Actuator, and know the answers to the questions every Spring Boot interview will ask.',
      blocks: [
        {
          t: 'sub',
          text: 'Externalised Configuration'
        },
        {
          t: 'code',
          lang: 'yaml',
          title: 'application.yml — base config; profiles override specific keys',
          code:
`spring:
  application:
    name: order-service
  datasource:
    url: jdbc:postgresql://localhost:5432/orders
    username: orders_user
    password: changeme           # override with env var in prod
  jpa:
    hibernate:
      ddl-auto: validate         # never 'create-drop' in production
    show-sql: false

server:
  port: 8082

management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus,metrics
  endpoint:
    health:
      show-details: when-authorized`
        },
        {
          t: 'code',
          lang: 'yaml',
          title: 'application-prod.yml — overrides only what changes in production',
          code:
`spring:
  datasource:
    url: jdbc:postgresql://prod-db:5432/orders
    username: orders_prod
    password: \${DB_PASSWORD}      # inject from environment variable / secret manager

logging:
  level:
    root: WARN
    com.example: INFO`
        },
        {
          t: 'code',
          lang: 'java',
          title: '@ConfigurationProperties — type-safe config binding',
          code:
`@ConfigurationProperties(prefix = "app.kafka")
@Component
public class KafkaProperties {
    private String bootstrapServers;
    private String topic;
    private int retries = 3;
    // getters + setters
}

// in application.yml:
// app:
//   kafka:
//     bootstrap-servers: kafka:9092
//     topic: orders.created
//     retries: 5`
        },
        {
          t: 'sub',
          text: 'Spring Boot Actuator — production health & metrics'
        },
        {
          t: 'table',
          head: ['Endpoint', 'What it shows'],
          rows: [
            ['/actuator/health', 'UP/DOWN + DB, Redis, Kafka health details'],
            ['/actuator/metrics', 'List of all registered metric names'],
            ['/actuator/metrics/http.server.requests', 'Histogram: request count, max, percentiles'],
            ['/actuator/prometheus', 'Prometheus text format — scraped by Prometheus server'],
            ['/actuator/env', 'All resolved property sources (careful with secrets)'],
            ['/actuator/beans', 'All beans in the context — useful for debugging auto-config'],
            ['/actuator/threaddump', 'Full JVM thread dump — diagnose deadlocks']
          ]
        },
        {
          t: 'sub',
          text: 'Key Interview Questions'
        },
        {
          t: 'list',
          items: [
            '<strong>What is the difference between @Component, @Service, @Repository?</strong> — All register beans. @Repository additionally translates SQL exceptions into the Spring DataAccessException hierarchy. @Service is semantic only. Use the right one so the intent is clear.',
            '<strong>Constructor vs field injection?</strong> — Constructor injection makes dependencies mandatory, visible in tests, and works with final fields. Field injection hides dependencies, breaks immutability, and requires reflection. Always use constructor injection.',
            '<strong>What is the N+1 problem?</strong> — Fetching N parent entities then issuing one query per parent to load a lazy collection = N+1 queries. Fix with JOIN FETCH, @EntityGraph, or batch fetching.',
            '<strong>How does @Transactional work?</strong> — Spring wraps the method in a proxy. On success: commit. On unchecked exception: rollback. On checked exception: commit by default (override with rollbackFor). Self-invocation bypasses the proxy — call via the injected bean, not `this`.',
            '<strong>What happens when @Transactional is called within the same class?</strong> — The proxy is bypassed. The transaction annotation has no effect. Refactor to a separate bean or inject self.',
            '<strong>What is @SpringBootApplication?</strong> — A composite of @Configuration + @EnableAutoConfiguration + @ComponentScan. One annotation to rule them all.',
            '<strong>Explain the circuit breaker pattern.</strong> — CLOSED: requests flow normally, failures tracked. OPEN: threshold exceeded, all calls fast-fail to fallback. HALF_OPEN: after wait period, trial calls probe recovery. Prevents cascading failures across services.',
            '<strong>What is a BeanPostProcessor?</strong> — A Spring extension point that intercepts every bean after creation. Used internally for @Autowired, @PostConstruct, AOP proxy creation. Rarely implement yourself — use @Aspect instead.'
          ]
        },
        {
          t: 'sub',
          text: 'Common Pitfalls to Avoid'
        },
        {
          t: 'cards',
          items: [
            { title: 'Circular Dependency', body: 'Bean A needs B, B needs A. Fix by refactoring (preferred) or @Lazy on one constructor param. Root cause is usually a design problem — a shared component both should depend on.' },
            { title: 'LazyInitializationException', body: 'Accessing a LAZY collection outside a @Transactional boundary. Fix: fetch eagerly in the query (JOIN FETCH), open transaction wider, or use a DTO projection that fetches exactly what you need.' },
            { title: 'ddl-auto = create-drop', body: 'Drops and recreates your schema every restart. Use "validate" in production (Flyway/Liquibase owns the schema), "update" in dev, "create-drop" only in tests.' },
            { title: 'Transaction self-invocation', body: '@Transactional on a method called by another method in the same class does nothing — the Spring proxy is bypassed. Extract the inner call to a separate @Service bean.' }
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 8 — ADVANCED JPA
    ══════════════════════════════════════════════════════════ */
    {
      id: 'advanced-jpa', num: '08', accent: 'amber',
      part: 'PHASE 8 · ADVANCED JPA',
      eyebrow: 'BEYOND THE BASICS',
      title: 'Specifications, Locking & Advanced Queries',
      intro: 'Once basic CRUD is working, these patterns separate junior from senior data access code: type-safe dynamic queries, optimistic locking for concurrent edits, soft deletes, and projections to avoid over-fetching.',
      blocks: [
        {
          t: 'sub',
          text: 'Specifications — Dynamic Queries Without String SQL'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'JpaSpecificationExecutor + Specification for dynamic filtering',
          code:
`// 1. Repository extends JpaSpecificationExecutor
public interface OrderRepository
        extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {}

// 2. Specification factory — each method returns a composable predicate
public class OrderSpec {

    public static Specification<Order> hasStatus(OrderStatus status) {
        return (root, query, cb) ->
            status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    public static Specification<Order> totalGreaterThan(BigDecimal min) {
        return (root, query, cb) ->
            min == null ? cb.conjunction() : cb.greaterThan(root.get("total"), min);
    }

    public static Specification<Order> createdAfter(LocalDate date) {
        return (root, query, cb) ->
            date == null ? cb.conjunction() : cb.greaterThanOrEqualTo(root.get("createdAt"), date);
    }
}

// 3. Combine at call site with and() / or()
Page<Order> results = repo.findAll(
    hasStatus(PENDING)
        .and(totalGreaterThan(new BigDecimal("100")))
        .and(createdAfter(LocalDate.now().minusDays(30))),
    PageRequest.of(0, 20, Sort.by("createdAt").descending())
);`
        },
        {
          t: 'sub',
          text: 'Query Projections — Fetch Only What You Need'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Interface projection and DTO projection — avoid loading unused columns',
          code:
`// Interface projection — Spring generates a proxy at runtime
public interface OrderSummary {
    Long getId();
    BigDecimal getTotal();
    OrderStatus getStatus();
    // only these 3 columns fetched — not the full entity graph
}

// Use it directly in the repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<OrderSummary> findByUserId(Long userId);
}

// DTO projection — constructor expression in JPQL
public record OrderDto(Long id, BigDecimal total, String userName) {}

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT new com.example.dto.OrderDto(o.id, o.total, o.user.name) " +
           "FROM Order o WHERE o.status = :status")
    List<OrderDto> findSummariesByStatus(@Param("status") OrderStatus status);
}`
        },
        {
          t: 'sub',
          text: 'Soft Deletes — Mark as Deleted, Never Actually Remove'
        },
        {
          t: 'code',
          lang: 'java',
          title: '@SQLDelete + @Where — transparent soft delete via Hibernate',
          code:
`@Entity
@SQLDelete(sql = "UPDATE orders SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")    // appended to ALL queries automatically
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant deletedAt;           // null = active; non-null = soft-deleted

    // When you call repo.delete(order):
    //   Hibernate runs:  UPDATE orders SET deleted_at = NOW() WHERE id = 42
    //   NOT:            DELETE FROM orders WHERE id = 42
    //
    // When you call repo.findAll():
    //   Hibernate adds: WHERE deleted_at IS NULL  (from @Where)
}`
        },
        {
          t: 'sub',
          text: 'Optimistic vs Pessimistic Locking'
        },
        {
          t: 'table',
          head: ['Strategy', 'How it works', 'When to use'],
          rows: [
            ['Optimistic (OCC)', '@Version field — Hibernate checks version on UPDATE; throws OptimisticLockException if stale', 'Low contention — reads are common, conflicts are rare. Retry on exception.'],
            ['Pessimistic READ', 'SELECT ... FOR SHARE — other transactions can read but not write', 'Need consistent read but writes are rare'],
            ['Pessimistic WRITE', 'SELECT ... FOR UPDATE — exclusive lock, all others block', 'High contention on a single row — inventory deduction, seat booking']
          ]
        },
        {
          t: 'code',
          lang: 'java',
          title: '@Version for optimistic locking — zero boilerplate',
          code:
`@Entity
public class Product {

    @Id @GeneratedValue
    private Long id;

    private int stock;

    @Version                          // Hibernate auto-increments on every UPDATE
    private Long version;             // if version mismatch → OptimisticLockException
}

// Pessimistic write lock in repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);
}

// Service: retry loop on optimistic lock exception
@Retryable(value = OptimisticLockingFailureException.class, maxAttempts = 3)
@Transactional
public void decrementStock(Long productId, int qty) {
    Product p = repo.findById(productId).orElseThrow();
    if (p.getStock() < qty) throw new InsufficientStockException();
    p.setStock(p.getStock() - qty);
    // repo.save(p) fires UPDATE with WHERE version = current_version
}`
        },
        {
          t: 'sub',
          text: 'Named Queries & Derived Query Methods'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Derived methods — Spring parses the method name into a query',
          code:
`// Spring derives these queries automatically from the method name:
List<Order> findByStatus(OrderStatus status);
// SELECT * FROM orders WHERE status = ?

List<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, OrderStatus status);
// SELECT * FROM orders WHERE user_id = ? AND status = ? ORDER BY created_at DESC

Optional<Order> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
// SELECT ... LIMIT 1

long countByStatus(OrderStatus status);
boolean existsByUserIdAndStatus(Long userId, OrderStatus status);
void deleteByStatusAndCreatedAtBefore(OrderStatus status, Instant cutoff);

// Keywords: find/read/get/count/exists/delete/remove
//           By, And, Or, Not, Is, Equals, Between, LessThan, GreaterThan,
//           Like, StartingWith, EndingWith, Containing, OrderBy, First, Top`
        },
        {
          t: 'sub',
          text: 'Sequence Generators & ID Strategies'
        },
        {
          t: 'table',
          head: ['Strategy', 'How', 'Best for'],
          rows: [
            ['IDENTITY', '@GeneratedValue(strategy=IDENTITY) — DB auto-increment', 'MySQL/MariaDB; simple; no batch insert optimization'],
            ['SEQUENCE', '@SequenceGenerator + strategy=SEQUENCE — DB sequence', 'PostgreSQL/Oracle; Hibernate can pre-allocate IDs (allocationSize=50) for batch inserts'],
            ['UUID', '@UuidGenerator (Hibernate 6) or @GeneratedValue with UUID type', 'Distributed systems — globally unique without coordination'],
            ['TABLE', 'Sequence table in DB — portable but slow', 'Legacy databases; avoid in new projects']
          ]
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Sequence generator with allocationSize for batch insert performance',
          code:
`@Entity
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
    @SequenceGenerator(
        name           = "order_seq",
        sequenceName   = "order_sequence",   // DB sequence name
        allocationSize = 50                  // Hibernate pre-fetches 50 IDs per round-trip
    )
    private Long id;
}`
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 9 — REACTIVE PROGRAMMING (WEBFLUX)
    ══════════════════════════════════════════════════════════ */
    {
      id: 'reactive', num: '09', accent: 'teal',
      part: 'PHASE 9 · REACTIVE PROGRAMMING',
      eyebrow: 'SPRING WEBFLUX',
      title: 'Project Reactor, Mono & Flux',
      intro: 'Spring MVC blocks a thread per request. WebFlux is non-blocking — a small thread pool handles thousands of concurrent connections using reactive streams. The tradeoff: more complex mental model, but far better throughput under I/O-heavy load.',
      blocks: [
        {
          t: 'sub',
          text: 'Mono and Flux — the two reactive types'
        },
        {
          t: 'diagram',
          name: 'monoFlux',
          cap: 'Mono = 0 or 1 element; Flux = 0 to N elements — both are lazy until subscribed'
        },
        {
          t: 'table',
          head: ['Type', 'Elements', 'Analogous to'],
          rows: [
            ['Mono<T>', '0 or 1', 'CompletableFuture<T> or Optional<T>'],
            ['Flux<T>', '0 to N (possibly infinite)', 'Stream<T> or List<T> — but lazy and async'],
            ['Mono<Void>', '0 (just completion signal)', 'CompletableFuture<Void> — fire-and-forget'],
            ['Mono<List<T>>', '1 (a list)', 'Returns the whole list as one signal — not streaming']
          ]
        },
        {
          t: 'sub',
          text: 'Spring WebFlux Setup'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Switch from spring-boot-starter-web to spring-boot-starter-webflux in pom.xml',
          code:
`<!-- Remove this -->
<!-- <dependency>spring-boot-starter-web</dependency> -->

<!-- Add this instead -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>

<!-- Reactive database driver (R2DBC for SQL databases) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-r2dbc</artifactId>
</dependency>
<dependency>
    <groupId>io.r2dbc</groupId>
    <artifactId>r2dbc-postgresql</artifactId>
</dependency>`
        },
        {
          t: 'sub',
          text: 'Reactive Controllers — @RestController with Mono/Flux returns'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Reactive controller — returns Mono/Flux instead of plain objects',
          code:
`@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    @GetMapping("/{id}")
    public Mono<OrderDto> getById(@PathVariable Long id) {
        return service.findById(id);        // non-blocking DB read
    }

    @GetMapping
    public Flux<OrderDto> getAll() {
        return service.findAll();           // streams rows as they arrive from DB
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<OrderDto> create(@Valid @RequestBody Mono<CreateOrderRequest> req) {
        return req.flatMap(service::create);
    }

    // Server-Sent Events — real-time stream to browser
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<OrderDto> streamOrders() {
        return service.streamNewOrders()
                      .delayElements(Duration.ofMillis(500));
    }
}`
        },
        {
          t: 'sub',
          text: 'Functional Endpoints — RouterFunction + HandlerFunction'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Functional style — no annotations; router maps paths to handler methods',
          code:
`@Configuration
public class OrderRouter {

    @Bean
    public RouterFunction<ServerResponse> routes(OrderHandler handler) {
        return RouterFunctions.route()
            .GET("/api/orders",       handler::getAll)
            .GET("/api/orders/{id}",  handler::getById)
            .POST("/api/orders",      handler::create)
            .DELETE("/api/orders/{id}", handler::delete)
            .build();
    }
}

@Component
public class OrderHandler {

    private final OrderService service;

    public Mono<ServerResponse> getById(ServerRequest req) {
        Long id = Long.parseLong(req.pathVariable("id"));
        return service.findById(id)
            .flatMap(dto -> ServerResponse.ok().bodyValue(dto))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getAll(ServerRequest req) {
        return ServerResponse.ok().body(service.findAll(), OrderDto.class);
    }
}`
        },
        {
          t: 'sub',
          text: 'Reactive Operators — transforming streams'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Common operators — map, flatMap, filter, zip, merge',
          code:
`// map: synchronous 1-to-1 transform (like Stream.map)
Flux<String> names = flux.map(order -> order.getUser().getName());

// flatMap: async 1-to-1 transform — inner publisher merged concurrently
Flux<OrderDto> dtos = flux.flatMap(order -> enrichWithProducts(order));

// filter: keep elements matching predicate
Flux<Order> pending = flux.filter(o -> o.getStatus() == PENDING);

// zip: combine two publishers element by element
Mono<OrderDetails> details = Mono.zip(
    orderService.findById(id),
    userService.findById(userId),
    (order, user) -> new OrderDetails(order, user)
);

// switchIfEmpty: fallback when publisher is empty
Mono<Order> result = repo.findById(id)
    .switchIfEmpty(Mono.error(new NotFoundException("Order not found")));

// onErrorReturn / onErrorResume: error handling
Flux<Order> safe = flux
    .onErrorReturn(TimeoutException.class, Order.empty())
    .onErrorResume(ex -> fallbackService.getOrders());

// take / skip: limit elements
Flux<Order> latest10 = flux.take(10);

// collectList: Flux<T> -> Mono<List<T>> (buffers all elements)
Mono<List<Order>> all = flux.collectList();`
        },
        {
          t: 'sub',
          text: 'Backpressure — consumer controls the flow rate'
        },
        {
          t: 'prose',
          html: 'Backpressure is a reactive streams protocol feature: a slow consumer signals the producer to slow down rather than letting a buffer overflow. In Project Reactor, the subscriber requests <code>N</code> elements at a time via <code>Subscription.request(N)</code>. Most of the time frameworks handle this automatically, but you need to understand it when building custom publishers or when debugging a <code>BufferOverflowException</code>.'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Backpressure strategies — what to do when producer is faster than consumer',
          code:
`// BUFFER: buffer elements until consumer catches up (default — may OOM)
Flux.interval(Duration.ofMillis(1))
    .onBackpressureBuffer(1000)          // buffer up to 1000

// DROP: discard elements when downstream is busy
Flux.interval(Duration.ofMillis(1))
    .onBackpressureDrop(dropped -> log.warn("Dropped: {}", dropped))

// LATEST: keep only the most recent element
Flux.interval(Duration.ofMillis(1))
    .onBackpressureLatest()

// LIMIT rate: tell upstream how fast you want items
Flux.range(1, 1_000_000)
    .limitRate(100)                      // request 100 at a time from upstream`
        },
        {
          t: 'callout',
          kind: 'warning',
          title: 'MVC vs WebFlux — when to choose which',
          html: '<strong>Choose WebFlux when:</strong> many concurrent connections, heavy I/O wait (external APIs, DB), streaming responses. <strong>Stay with MVC when:</strong> blocking libraries in the stack (JDBC, some messaging), simpler mental model is priority, team unfamiliar with reactive. <em>Never mix blocking calls inside a reactive pipeline</em> — it ties up the event loop thread.'
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 10 — ADVANCED MICROSERVICES PATTERNS
    ══════════════════════════════════════════════════════════ */
    {
      id: 'ms-patterns', num: '10', accent: 'purple',
      part: 'PHASE 10 · MICROSERVICES PATTERNS',
      eyebrow: 'DISTRIBUTED SYSTEMS',
      title: 'Saga, Eventual Consistency & Load Balancing',
      intro: 'Once you have multiple services, you face problems that cannot be solved with @Transactional. Distributed transactions, eventual consistency, and saga patterns are the vocabulary of production microservices.',
      blocks: [
        {
          t: 'sub',
          text: 'The Distributed Transaction Problem'
        },
        {
          t: 'prose',
          html: 'A @Transactional annotation works within a single database connection. When Order Service writes to its DB and then calls Payment Service which writes to its DB, those are two separate transactions. If Payment Service fails <em>after</em> Order Service committed, the order exists but was never charged. You cannot wrap this in a single atomic operation — this is the fundamental challenge of microservices data management.'
        },
        {
          t: 'sub',
          text: 'Saga Pattern — Choreography vs Orchestration'
        },
        {
          t: 'diagram',
          name: 'sagaPattern',
          cap: 'Choreography: services react to events; Orchestration: a central coordinator directs each step'
        },
        {
          t: 'table',
          head: ['Approach', 'How', 'Pros', 'Cons'],
          rows: [
            ['Choreography', 'Each service publishes an event after its step; next service listens and reacts', 'Loose coupling; no single point of failure', 'Hard to visualise flow; debugging is difficult'],
            ['Orchestration', 'A Saga Orchestrator (separate service) calls each step and handles failures', 'Clear flow; easy to debug; central error handling', 'Orchestrator is a coupling point; can become a bottleneck']
          ]
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Choreography saga with Kafka — compensating transactions on failure',
          code:
`// Step 1: Order Service creates order and publishes event
@Service
public class OrderService {
    @Transactional
    public Order createOrder(CreateOrderRequest req) {
        Order order = repo.save(new Order(req, PENDING));
        kafkaTemplate.send("order.created", new OrderCreatedEvent(order.getId(), order.getTotal()));
        return order;
    }
}

// Step 2: Payment Service listens and charges
@KafkaListener(topics = "order.created")
public void onOrderCreated(OrderCreatedEvent event) {
    try {
        paymentService.charge(event.getOrderId(), event.getTotal());
        kafkaTemplate.send("payment.succeeded", event.getOrderId());
    } catch (PaymentException e) {
        // Compensating transaction — tell Order Service to cancel
        kafkaTemplate.send("payment.failed", event.getOrderId());
    }
}

// Step 3: Order Service listens to payment result
@KafkaListener(topics = "payment.failed")
public void onPaymentFailed(Long orderId) {
    orderRepo.findById(orderId).ifPresent(o -> {
        o.setStatus(CANCELLED);
        orderRepo.save(o);              // compensating transaction
    });
}`
        },
        {
          t: 'sub',
          text: 'Eventual Consistency Patterns'
        },
        {
          t: 'table',
          head: ['Pattern', 'What it solves'],
          rows: [
            ['Outbox Pattern', 'Write to local DB table + publish event atomically. Separate relay process reads the outbox and sends to Kafka. Prevents lost events on crash.'],
            ['CQRS (Command Query Responsibility Segregation)', 'Separate write model (commands) from read model (queries). Read model is eventually consistent with write model.'],
            ['Event Sourcing', 'Store every state change as an event. Rebuild current state by replaying events. Full audit trail.'],
            ['Idempotent Consumer', 'Track processed event IDs. Replay or duplicate events are skipped. Essential with at-least-once delivery.'],
            ['Two-Phase Commit (2PC)', 'Distributed lock-based atomic commit across multiple DBs. Avoid in microservices — high latency, single point of failure.']
          ]
        },
        {
          t: 'sub',
          text: 'Load Balancing Strategies'
        },
        {
          t: 'table',
          head: ['Strategy', 'How', 'When to use'],
          rows: [
            ['Round Robin', 'Requests distributed evenly in order across instances', 'Default; homogeneous instances with similar load'],
            ['Least Connections', 'Route to the instance with fewest active connections', 'Long-lived connections; varied response times'],
            ['Weighted Round Robin', 'Instances have weights; higher-weight gets proportionally more requests', 'Mixed instance sizes in the same pool'],
            ['Random', 'Random instance selection', 'Stateless apps; surprisingly effective at scale'],
            ['IP Hash (Sticky Sessions)', 'Same client always routes to same instance', 'Session-state stored on instance (avoid if possible)']
          ]
        },
        {
          t: 'sub',
          text: 'Retry & Timeout Patterns'
        },
        {
          t: 'code',
          lang: 'yaml',
          title: 'Resilience4j retry with exponential backoff + jitter',
          code:
`resilience4j:
  retry:
    instances:
      paymentService:
        maxAttempts: 4
        waitDuration: 200ms
        enableExponentialBackoff: true
        exponentialBackoffMultiplier: 2   # 200ms → 400ms → 800ms → 1600ms
        randomizedWaitFactor: 0.3         # add ±30% jitter to avoid thundering herd
        retryExceptions:
          - java.net.ConnectException
          - java.util.concurrent.TimeoutException
        ignoreExceptions:
          - com.example.exception.BusinessException   # don't retry business errors

  timelimiter:
    instances:
      paymentService:
        timeoutDuration: 3s              # fail fast if no response in 3 seconds`
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 11 — PERFORMANCE OPTIMIZATION
    ══════════════════════════════════════════════════════════ */
    {
      id: 'performance', num: '11', accent: 'green',
      part: 'PHASE 11 · PERFORMANCE',
      eyebrow: 'OPTIMIZATION',
      title: 'HikariCP, Caching Strategies & Startup Time',
      intro: 'Performance problems in Spring Boot fall into three buckets: database query slowness, unnecessary object allocation, and slow startup. Each has a specific toolkit.',
      blocks: [
        {
          t: 'sub',
          text: 'HikariCP Connection Pool — tuning the most critical resource'
        },
        {
          t: 'code',
          lang: 'yaml',
          title: 'HikariCP configuration — default pool size of 10 is rarely right',
          code:
`spring:
  datasource:
    hikari:
      maximum-pool-size: 20          # max connections — set to (CPU cores * 2) + disk spindles
      minimum-idle: 5                # keep 5 connections warm at all times
      connection-timeout: 30000      # ms to wait for a connection from pool (default 30s)
      idle-timeout: 600000           # ms before idle connections are removed (10 min)
      max-lifetime: 1800000          # ms max lifetime of a connection (30 min — less than DB timeout)
      leak-detection-threshold: 2000 # warn if connection held longer than 2s — finds leaked connections
      pool-name: OrderServicePool    # visible in JMX / metrics`
        },
        {
          t: 'table',
          head: ['Problem', 'Symptom', 'Fix'],
          rows: [
            ['Pool too small', 'Connection timeout errors under load', 'Increase maximum-pool-size; verify with Hikari metrics'],
            ['Pool too large', 'DB CPU high; context switching overhead', 'Reduce pool size; rule: cores×2+1 is often optimal'],
            ['Connection leaks', 'Pool exhausts over time without traffic increase', 'Enable leak-detection-threshold; ensure all connections closed'],
            ['Idle connections dropped by DB', 'Stale connection errors', 'Set max-lifetime below DB wait_timeout']
          ]
        },
        {
          t: 'sub',
          text: 'Query Optimization'
        },
        {
          t: 'code',
          lang: 'yaml',
          title: 'Enable query logging in dev — never in production',
          code:
`# Show SQL + bind parameters (dev only)
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
        generate_statistics: true    # logs cache hit rates, query counts

logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql: TRACE   # shows actual bind parameter values`
        },
        {
          t: 'table',
          head: ['Technique', 'What it does'],
          rows: [
            ['JOIN FETCH / @EntityGraph', 'Eliminate N+1 — load associations in one query'],
            ['Interface/DTO projections', 'SELECT only needed columns instead of full entity'],
            ['Pagination (Pageable)', 'Never load unbounded result sets — always page'],
            ['Native @Query', 'Use SQL-specific features (window functions, CTEs) Hibernate cannot express'],
            ['Read replicas', 'Route readOnly transactions to a replica via routing DataSource'],
            ['Database indexes', 'Add indexes on columns used in WHERE, JOIN, ORDER BY — verify with EXPLAIN'],
            ['Batch inserts/updates', 'hibernate.jdbc.batch_size=50 — reduces round-trips for bulk operations']
          ]
        },
        {
          t: 'sub',
          text: 'Caching Strategies Comparison'
        },
        {
          t: 'table',
          head: ['Cache', 'Type', 'Best for', 'Eviction'],
          rows: [
            ['ConcurrentHashMap (default)', 'In-process heap', 'Small datasets; simple setup; single-node only', 'None (manual @CacheEvict)'],
            ['Caffeine', 'In-process heap with eviction policy', 'High-performance local cache; size/TTL/LRU eviction built in', 'Size, TTL, or LRU'],
            ['Redis', 'Distributed / shared across nodes', 'Multi-instance apps; session store; large objects; TTL', 'TTL, LRU, LFU'],
            ['EhCache', 'In-process with optional disk tier', 'Enterprise; complex eviction; JCache standard', 'LRU, LFU, heap size'],
            ['Memcached', 'Distributed; simple key-value', 'Simple string/byte caching; very high throughput', 'LRU only; no persistence']
          ]
        },
        {
          t: 'sub',
          text: 'Startup Time Optimization'
        },
        {
          t: 'table',
          head: ['Technique', 'Impact', 'How to apply'],
          rows: [
            ['spring.main.lazy-initialization=true', 'Medium', 'Beans created on first use, not at startup. May shift errors to runtime.'],
            ['spring-boot-starter-data-jpa → narrow starter', 'Medium', 'Replace heavy starters with only what you need'],
            ['@SpringBootApplication(exclude=...)', 'Low–Medium', 'Exclude auto-configs you do not need (DevTools, H2Console in prod)'],
            ['Native image (GraalVM)', 'Very High', 'AOT compilation — startup in milliseconds, lower memory. Requires compatible libraries.'],
            ['@Index on @SpringBootApplication', 'Low', 'spring-context-indexer pre-computes @Component scan at compile time'],
            ['Profile-specific bean loading', 'Low', '@Profile("!dev") prevents dev-only beans loading in prod']
          ]
        },
        {
          t: 'sub',
          text: 'Async Processing for Long-Running Work'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Custom @Async executor — control thread pool for async tasks',
          code:
`@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean("reportExecutor")
    public Executor reportExecutor() {
        ThreadPoolTaskExecutor exec = new ThreadPoolTaskExecutor();
        exec.setCorePoolSize(4);
        exec.setMaxPoolSize(8);
        exec.setQueueCapacity(100);
        exec.setThreadNamePrefix("report-");
        exec.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        exec.initialize();
        return exec;
    }
}

@Service
public class ReportService {

    @Async("reportExecutor")            // uses the named executor
    public CompletableFuture<Report> generateReport(Long userId) {
        // runs on report- thread, not HTTP request thread
        Report r = buildExpensiveReport(userId);
        return CompletableFuture.completedFuture(r);
    }
}`
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 12 — COMMON ISSUES & SPRING BOOT STARTERS
    ══════════════════════════════════════════════════════════ */
    {
      id: 'issues-starters', num: '12', accent: 'rose',
      part: 'PHASE 12 · ISSUES & STARTERS',
      eyebrow: 'DIAGNOSE & BOOTSTRAP',
      title: 'Troubleshooting & Spring Boot Starters',
      intro: 'Knowing the error, its root cause, and the fix separates confident Spring Boot developers from frustrated ones. And knowing which starter to add prevents half the errors in the first place.',
      blocks: [
        {
          t: 'sub',
          text: 'Common Exceptions — Cause & Fix'
        },
        {
          t: 'table',
          head: ['Exception', 'Root cause', 'Fix'],
          rows: [
            ['NoSuchBeanDefinitionException', 'Spring cannot find a bean of the requested type/name', 'Check: is the class annotated? Is it in a package scanned by @ComponentScan? Is a @Bean method returning it?'],
            ['UnsatisfiedDependencyException', 'A required constructor param has no matching bean', 'Usually wraps NoSuchBeanDefinitionException — read the inner cause'],
            ['BeanCreationException (circular)', 'Bean A needs B, B needs A', 'Refactor to a third shared bean, or @Lazy on one param'],
            ['LazyInitializationException', 'Accessing LAZY collection outside a transaction', 'JOIN FETCH, @EntityGraph, or keep access inside @Transactional method'],
            ['OptimisticLockingFailureException', '@Version mismatch on concurrent update', 'Retry the operation; expose 409 Conflict to client'],
            ['DataIntegrityViolationException', 'DB constraint violation (unique, FK, not-null)', 'Validate before saving; catch and map to 400 Bad Request'],
            ['MethodArgumentNotValidException', '@Valid failed on @RequestBody', 'Caught by @ExceptionHandler; return 400 with field errors'],
            ['TransactionSystemException', 'Exception during commit (often wraps ConstraintViolation)', 'Check inner cause; usually a validation/constraint error'],
            ['HikariPool-1 - Connection is not available', 'All pool connections in use (pool exhausted)', 'Increase pool size; check for connection leaks; reduce slow queries'],
            ['ClassNotFoundException / NoClassDefFoundError', 'Missing dependency on classpath', 'Add the missing Maven/Gradle dependency; check for version conflicts']
          ]
        },
        {
          t: 'sub',
          text: 'Circular Dependency — Detailed Resolution'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'Three strategies for circular dependency — best to worst',
          code:
`// ❌ Problem: A → B → A
@Service class A { @Autowired B b; }
@Service class B { @Autowired A a; }

// ✅ Strategy 1 (best): Extract shared logic into a third bean C
@Service class C { /* shared logic */ }
@Service class A { A(C c) {} }
@Service class B { B(C c) {} }

// ✅ Strategy 2: Use setter injection on one side + @Lazy
@Service class A {
    private B b;
    @Autowired
    public void setB(@Lazy B b) { this.b = b; }   // B proxy created lazily
}

// ✅ Strategy 3: ApplicationContext.getBean() at runtime (breaks IoC — use as last resort)
@Service class A {
    @Autowired ApplicationContext ctx;
    public void doSomething() {
        B b = ctx.getBean(B.class);    // B fetched at call time, not startup
    }
}`
        },
        {
          t: 'sub',
          text: 'OutOfMemoryError Prevention'
        },
        {
          t: 'table',
          head: ['Cause', 'Fix'],
          rows: [
            ['Loading unbounded query results', 'Always use Pageable; never repo.findAll() on large tables'],
            ['EAGER loading of large collections', 'Switch to LAZY; use JOIN FETCH only when needed'],
            ['Large file upload stored in memory', 'Stream to disk: MultipartFile.transferTo(path)'],
            ['Heap too small for workload', 'Increase -Xmx in JVM args; profile with VisualVM or Java Flight Recorder'],
            ['Memory leak in static collection', 'Never add to a static list without a removal strategy'],
            ['ThreadLocal not cleared', 'Always MDC.clear() in finally block after MDC.put()']
          ]
        },
        {
          t: 'sub',
          text: 'Spring Boot Starters — What Each Includes'
        },
        {
          t: 'table',
          head: ['Starter', 'What you get'],
          rows: [
            ['spring-boot-starter-web', 'Spring MVC, embedded Tomcat, Jackson JSON, Hibernate Validator, Logback'],
            ['spring-boot-starter-webflux', 'Spring WebFlux, Netty (non-blocking server), Project Reactor, Jackson'],
            ['spring-boot-starter-data-jpa', 'Spring Data JPA, Hibernate ORM, Spring Tx, JDBC'],
            ['spring-boot-starter-data-redis', 'Spring Data Redis, Lettuce client, RedisTemplate'],
            ['spring-boot-starter-security', 'Spring Security, BCrypt, filter chain infrastructure'],
            ['spring-boot-starter-actuator', 'Health, metrics, info, env, beans, threaddump endpoints'],
            ['spring-boot-starter-test', 'JUnit 5, Mockito, AssertJ, Hamcrest, MockMvc, @SpringBootTest'],
            ['spring-boot-starter-kafka', 'Spring for Apache Kafka, KafkaTemplate, @KafkaListener'],
            ['spring-boot-starter-cache', 'Spring Cache abstraction, @Cacheable, @CacheEvict'],
            ['spring-boot-starter-validation', 'Jakarta Bean Validation, Hibernate Validator, @Valid support'],
            ['spring-boot-starter-mail', 'JavaMailSender, SMTP configuration auto-config'],
            ['spring-boot-starter-batch', 'Spring Batch, JobRepository, chunk-oriented processing']
          ]
        },
        {
          t: 'sub',
          text: 'Starter Version Management'
        },
        {
          t: 'code',
          lang: 'java',
          title: 'pom.xml — the parent BOM manages all starter versions',
          code:
`<!-- The Spring Boot parent BOM: declares 3000+ dependency versions -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.0</version>           <!-- upgrade here = upgrade everything -->
</parent>

<!-- You never specify versions for starters — the BOM manages them -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <!-- NO <version> needed -->
    </dependency>

    <!-- Override a specific version if needed -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.17.0</version>      <!-- overrides the BOM version -->
    </dependency>
</dependencies>

<!-- Without parent (e.g. in corporate projects using another parent): -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>3.3.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>`
        },
        {
          t: 'callout',
          kind: 'tip',
          title: 'Use Spring Initializr to bootstrap any project',
          html: '<strong>start.spring.io</strong> is the fastest way to create a new Spring Boot project. Select Java version, build tool (Maven/Gradle), and dependencies — it generates a ready-to-run project with the correct parent BOM and starter dependencies. Never manually assemble a pom.xml for a new project.'
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 13 — BEST PRACTICES AT A GLANCE
    ══════════════════════════════════════════════════════════ */
    {
      id: 'best-practices', num: '13', accent: 'green',
      part: 'PHASE 13 · BEST PRACTICES',
      eyebrow: 'QUICK REFERENCE',
      title: 'Best Practices at a Glance',
      intro: 'Five categories of production-grade best practices — each principle condensed to one card for fast revision. Build these habits into every project from day one.',
      blocks: [
        {
          t: 'sub',
          text: 'Code Quality'
        },
        {
          t: 'cards',
          items: [
            { title: 'SOLID — Single Responsibility', body: 'Every class has exactly one reason to change. A UserService handles user business logic — not email sending, not file storage. Split anything that grows a second responsibility.' },
            { title: 'SOLID — Open/Closed', body: 'Open for extension, closed for modification. Add behaviour through new classes (Strategy, Decorator) rather than editing existing ones. Protects stable code from regression.' },
            { title: 'SOLID — Liskov Substitution', body: 'Subclasses must be substitutable for their parent. If a method takes an Animal, passing a Dog must not break it. Violated when overriding methods changes semantics.' },
            { title: 'SOLID — Interface Segregation', body: 'Many small, focused interfaces beat one large "fat" interface. A ReadableRepository and WritableRepository is better than one giant interface that some clients ignore.' },
            { title: 'SOLID — Dependency Inversion', body: 'Depend on abstractions (interfaces), not concrete classes. OrderService depends on PaymentGateway interface — not on StripePaymentGateway. Swap implementations without touching callers.' },
            { title: 'DRY — Don\'t Repeat Yourself', body: 'Every piece of knowledge should have a single authoritative representation. If you copy-paste logic, you have two places to update on the next change. Extract to a shared method or service.' },
            { title: 'Immutability', body: 'Prefer final fields and records. Immutable objects are thread-safe by definition, easier to reason about, and cannot be accidentally mutated. Use Lombok @Value or Java records.' },
            { title: 'Constructor Injection', body: 'All required dependencies in the constructor — no @Autowired on fields. Makes dependencies explicit, enables final fields, and makes the class testable without a Spring context.' },
            { title: 'Package by Feature', body: 'Group classes by feature (com.example.order.*) not by layer (com.example.repository.*). Features can be extracted into their own services later without cross-cutting moves.' }
          ]
        },
        {
          t: 'sub',
          text: 'Performance'
        },
        {
          t: 'cards',
          items: [
            { title: 'Fix N+1 First', body: 'Enable SQL logging in dev (show-sql=true). Count queries per request. Any number above 3-5 for a single endpoint is suspicious. Fix with JOIN FETCH or @EntityGraph before tuning anything else.' },
            { title: 'Always Paginate', body: 'Never return unbounded result sets. findAll() on a 10M-row table will kill the app. Always accept Pageable as a parameter and return Page<T>. Cap default page size at 20-50.' },
            { title: 'Cache What\'s Stable', body: 'Cache data that is read frequently and changes rarely: reference data, user profiles, product catalogues. Never cache real-time data. Set a TTL. Evict on write (@CacheEvict).' },
            { title: 'Right-size HikariCP', body: 'Default pool size of 10 is rarely right. Formula: (CPU cores * 2) + 1. Too large wastes DB resources; too small causes timeouts under load. Monitor pool metrics via Actuator.' },
            { title: 'Async Long Work', body: '@Async offloads slow operations (PDF generation, email, report building) to a thread pool so HTTP threads are not blocked. Return CompletableFuture<T> or use a message queue for durability.' },
            { title: 'LAZY by Default, Fetch Intentionally', body: 'All relationships LAZY. Load associations only when you actually need them, using JOIN FETCH in the specific query. EAGER loading on a relation means every query pays the join cost.' }
          ]
        },
        {
          t: 'sub',
          text: 'Security Best Practices'
        },
        {
          t: 'cards',
          items: [
            { title: 'No Secrets in Code', body: 'Passwords, API keys, JWT secrets must never appear in source files or git history. Use environment variables, Spring profiles, or a secrets manager (AWS Secrets Manager, Vault). Rotate on breach.' },
            { title: 'Enforce HTTPS', body: 'Redirect all HTTP to HTTPS at the load balancer or reverse proxy. Enable HSTS (HTTP Strict Transport Security) so browsers remember. Never terminate TLS inside the app in production.' },
            { title: 'Validate All Input', body: 'Use @Valid + @NotBlank, @Size, @Pattern on every @RequestBody and @RequestParam. Never trust client data. Reject early at the controller layer before it reaches business logic.' },
            { title: 'JPA Prevents SQL Injection', body: 'Never concatenate user input into query strings. JPA/Hibernate always uses parameterised queries (PreparedStatement). If you write native SQL, use @Param binding — never string concatenation.' },
            { title: 'CSRF for Browser Clients', body: 'Enable CSRF protection for any endpoint called from a browser form. Disable only for stateless REST APIs that authenticate via JWT (not cookies). Spring Security enables CSRF by default.' },
            { title: 'XSS Prevention', body: 'Encode all output inserted into HTML. Jackson by default does not escape HTML in JSON — use @JsonInclude and configure ObjectMapper to escape HTML. Never reflect raw user input into pages.' },
            { title: 'Bcrypt for Passwords', body: 'Always hash passwords with BCryptPasswordEncoder. BCrypt is intentionally slow (cost factor). Never MD5, SHA-1, or SHA-256 for passwords — they are too fast. Never store plain-text passwords.' }
          ]
        },
        {
          t: 'sub',
          text: 'API Design'
        },
        {
          t: 'cards',
          items: [
            { title: 'URL Versioning', body: 'Include the version in the URL path: /api/v1/users. Simplest strategy — each version is a separate endpoint. Alternative: Accept header versioning (cleaner URLs, harder to cache/test).' },
            { title: 'Backward Compatibility', body: 'Never remove or rename a field in an existing API response — consumers will break. Add new fields (additive changes are safe). For breaking changes, increment the version: v1 → v2.' },
            { title: 'Consistent Error Shape', body: 'Every error response must have the same structure: { status, message, timestamp, path, errors[] }. Use @ControllerAdvice to centralise. Frontend teams should never need to parse two different error formats.' },
            { title: 'Document with OpenAPI', body: 'Use SpringDoc + @Operation + @ApiResponse annotations. Auto-generates /swagger-ui.html and /v3/api-docs. Keep docs in sync with code — not in a separate wiki that rots.' },
            { title: 'Rate Limiting', body: 'Protect endpoints from abuse with rate limiting at the API Gateway level (Spring Cloud Gateway + Redis rate limiter) or with Resilience4j @RateLimiter on the service. Return 429 Too Many Requests.' },
            { title: 'Paginate Large Datasets', body: 'Return { content: [], page: 0, size: 20, totalElements: 1000, totalPages: 50 } for any collection endpoint. Never return arrays without pagination metadata. Spring Data Page<T> gives you this for free.' }
          ]
        },
        {
          t: 'sub',
          text: 'Deployment'
        },
        {
          t: 'cards',
          items: [
            { title: 'Dockerize Everything', body: 'Build a thin Docker image: FROM eclipse-temurin:21-jre-alpine, COPY the fat JAR, ENTRYPOINT java -jar. Use multi-stage builds to keep image small. Never bake secrets into images.' },
            { title: 'Environment Config', body: 'One artifact, many environments. All environment differences (DB URL, credentials, feature flags) come from environment variables or a config server — not separate build artefacts.' },
            { title: 'Health Checks', body: '/actuator/health must return UP for the container orchestrator (Kubernetes liveness + readiness probes). Customize health indicators to include DB, Redis, and downstream services.' },
            { title: 'Graceful Shutdown', body: 'server.shutdown=graceful + spring.lifecycle.timeout-per-shutdown-phase=30s. On SIGTERM, Spring stops accepting new requests and waits up to 30s for in-flight requests to complete before shutting down.' },
            { title: 'Centralised Logging', body: 'Log in JSON (LogstashEncoder). Ship to ELK, Splunk, or CloudWatch. Add MDC fields (requestId, userId, traceId) to every log line. Never write logs to local disk in production containers.' },
            { title: 'Monitoring from Day One', body: 'Add spring-boot-starter-actuator + micrometer-registry-prometheus from day 1. Wire Prometheus + Grafana in docker-compose for local dev. Alert on heap %, error rate, and p99 latency before going live.' }
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 14 — INTERVIEW Q&A (PARTS 1–6)
    ══════════════════════════════════════════════════════════ */
    {
      id: 'qa-part1', num: '14', accent: 'blue',
      part: 'PHASE 14 · INTERVIEW Q&A',
      eyebrow: 'RAPID REVISION',
      title: 'Q&A: Basics, Annotations, Data & Transactions',
      intro: 'The questions asked in 90% of Spring Boot interviews — grouped by topic. One sentence per answer. Review these the night before.',
      blocks: [
        {
          t: 'sub',
          text: 'Spring Boot Basics'
        },
        {
          t: 'list',
          items: [
            '<strong>What is Spring Boot and why use it?</strong> — Auto-configuration, embedded Tomcat/Jetty, opinionated defaults, production-ready starter POMs — dramatically reduces boilerplate vs raw Spring Framework.',
            '<strong>Difference between Spring and Spring Boot?</strong> — Spring Framework is the core container. Spring Boot adds auto-config, embedded server, and starter dependencies so you write zero XML and minimal setup code.',
            '<strong>What are Spring Boot Starters?</strong> — Pre-assembled Maven/Gradle dependency descriptors. Adding spring-boot-starter-web pulls in Spring MVC, Tomcat, Jackson, Validator, and Logback in tested compatible versions.',
            '<strong>How does Spring Boot know what to auto-configure?</strong> — @EnableAutoConfiguration reads META-INF/spring/AutoConfiguration.imports. Each listed class uses @ConditionalOnClass, @ConditionalOnBean, @ConditionalOnProperty, @ConditionalOnMissingBean to decide whether to create its beans.',
            '<strong>What is the embedded server and why is it useful?</strong> — Tomcat (default), Jetty, or Undertow packaged inside the JAR. No external server to configure — java -jar app.jar starts the complete application. Essential for containerised deployment.',
            '<strong>What is spring.profiles.active and how do you use it?</strong> — Sets which profile is active. application-prod.yml properties override application.yml when prod is active. Set via environment variable SPRING_PROFILES_ACTIVE=prod in Kubernetes.'
          ]
        },
        {
          t: 'sub',
          text: 'Annotations'
        },
        {
          t: 'list',
          items: [
            '<strong>Difference between @Component, @Service, @Repository, @Controller?</strong> — All are @Component specialisations. @Repository translates SQL exceptions → DataAccessException. The rest are semantic only — use the correct one to communicate intent.',
            '<strong>What is @Autowired and how does it work?</strong> — Marks a constructor, field, or setter for dependency injection by type. Spring searches the ApplicationContext for a matching bean. On a single constructor in Spring 4.3+, the annotation is optional.',
            '<strong>Difference between @Autowired and @Inject?</strong> — @Autowired is Spring-specific with required=false option. @Inject is the JSR-330 standard (javax.inject). Functionally identical for basic injection; @Qualifier works with both.',
            '<strong>What is @Qualifier used for?</strong> — When two beans implement the same interface, @Qualifier("beanName") on the injection point selects the specific one. Alternatively, name the parameter to match the bean name (with constructor injection).',
            '<strong>Difference between @RequestParam and @PathVariable?</strong> — @PathVariable extracts from the URL path segment (/users/{id}). @RequestParam extracts from the query string (/users?id=1) or form data. Both can have defaultValue and required attributes.',
            '<strong>What is @ResponseEntity?</strong> — A generic HTTP response wrapper. Lets you explicitly set the status code, headers, and body from a controller method. ResponseEntity.ok(body) = 200; ResponseEntity.created(uri).body(dto) = 201.',
            '<strong>What does @Transactional(readOnly=true) do?</strong> — Tells Hibernate to skip dirty-checking on session flush and allows the JDBC driver / database to use optimisations (e.g., route to read replica). Always put on read methods in @Service.'
          ]
        },
        {
          t: 'sub',
          text: 'Data Access (JPA / Hibernate)'
        },
        {
          t: 'list',
          items: [
            '<strong>Explain JPA and Hibernate relationship.</strong> — JPA (Jakarta Persistence API) is the specification — defines annotations and EntityManager API. Hibernate is the most popular implementation. Spring Data JPA wraps both with repositories.',
            '<strong>What is the N+1 problem and how do you solve it?</strong> — Fetching N orders then issuing one SELECT per order to load the user = N+1 queries. Fix: JOIN FETCH in JPQL, @EntityGraph, or FetchType.EAGER (sparingly). Verify with SQL logging.',
            '<strong>Difference between FetchType.LAZY and FetchType.EAGER?</strong> — LAZY: association loaded only when accessed (proxy placeholder until then). EAGER: loaded in the same query as the parent. LAZY is the default and preferred — EAGER causes unexpected joins everywhere.',
            '<strong>What are Specifications in JPA?</strong> — JpaSpecificationExecutor lets you build composable, type-safe predicates programmatically. Each Specification is a lambda (root, query, criteriaBuilder) → Predicate. Combine with .and() / .or().',
            '<strong>Explain derived query methods.</strong> — Spring Data parses method names into queries: findByFirstNameAndLastName(String first, String last) → SELECT ... WHERE first_name = ? AND last_name = ?. Supports operators: GreaterThan, Between, Like, OrderBy, etc.',
            '<strong>What is @Transient in JPA?</strong> — Marks a field that should not be mapped to a database column. Hibernate skips it during SELECT and INSERT. Use for calculated fields or fields only relevant at runtime (display labels, etc.)'
          ]
        },
        {
          t: 'sub',
          text: 'Transactions'
        },
        {
          t: 'list',
          items: [
            '<strong>What is @Transactional and when to use it?</strong> — Spring wraps the annotated method in a proxy that opens a transaction before the call and commits on return (or rolls back on unchecked exception). Use on Service methods that write to the DB.',
            '<strong>What is transaction propagation?</strong> — Controls what happens when a @Transactional method calls another @Transactional method. REQUIRED (default): join or create. REQUIRES_NEW: always create, suspend outer. NESTED: savepoint. NEVER: throw if active tx exists.',
            '<strong>Checked vs unchecked exceptions in @Transactional?</strong> — Unchecked (RuntimeException and subclasses): rolled back automatically. Checked (Exception subclasses): committed by default — you must add rollbackFor=SomeCheckedException.class explicitly.',
            '<strong>What are the isolation levels?</strong> — READ_UNCOMMITTED: dirty reads possible. READ_COMMITTED: no dirty reads (default in most DBs). REPEATABLE_READ: no phantom reads from same transaction. SERIALIZABLE: full isolation, slowest.',
            '<strong>What is transaction self-invocation?</strong> — Calling a @Transactional method from another method in the same bean bypasses the Spring proxy — so the transaction annotation has no effect. Fix: extract to a second bean or inject self.'
          ]
        },
        {
          t: 'sub',
          text: 'REST & Web'
        },
        {
          t: 'list',
          items: [
            '<strong>What are HTTP status codes?</strong> — 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized (not authenticated), 403 Forbidden (authenticated but no permission), 404 Not Found, 409 Conflict, 422 Unprocessable, 500 Internal Server Error.',
            '<strong>How to handle exceptions in Spring Boot?</strong> — @ExceptionHandler in a controller handles exceptions for that controller only. @RestControllerAdvice handles them globally across all controllers. @ResponseStatus on the exception class sets the HTTP status code.',
            '<strong>What is content negotiation?</strong> — Client sends Accept: application/json or Accept: application/xml. Server picks the right MessageConverter and serialises accordingly. Spring MVC supports JSON (Jackson) and XML (JAXB) out of the box.',
            '<strong>How to validate request body?</strong> — Add @Valid before @RequestBody in the controller method parameter. Spring calls the Hibernate Validator on the DTO. On failure it throws MethodArgumentNotValidException — catch in @ControllerAdvice and return 400.',
            '<strong>Difference between @Controller and @RestController?</strong> — @Controller returns view names (resolved by ViewResolver). @RestController = @Controller + @ResponseBody — every method return value is serialised directly to the HTTP response body as JSON.'
          ]
        },
        {
          t: 'sub',
          text: 'Configuration'
        },
        {
          t: 'list',
          items: [
            '<strong>Difference between application.properties and application.yml?</strong> — Same functionality; different syntax. YAML is hierarchical (spring.datasource.url → nested), reduces repetition, supports multi-document files with ---. Both are supported; YAML is preferred for complex config.',
            '<strong>How to use environment-specific configurations?</strong> — Create application-dev.yml, application-prod.yml, etc. Activate with spring.profiles.active=prod or SPRING_PROFILES_ACTIVE=prod environment variable. Profile file overrides the base application.yml.',
            '<strong>What is @ConfigurationProperties?</strong> — Binds a prefix of properties to a typed Java class. @ConfigurationProperties(prefix="app.kafka") maps app.kafka.bootstrapServers → bootstrapServers field. Type-safe, IDE-completable, and validated with @Valid.',
            '<strong>How to externalise configuration?</strong> — Priority order (highest first): command line args, SPRING_APPLICATION_JSON, OS environment variables, application-{profile}.yml, application.yml, @PropertySource. Secrets should come from env vars or a Vault, never from files in the image.'
          ]
        }
      ]
    },

    /* ══════════════════════════════════════════════════════════
       PHASE 15 — INTERVIEW Q&A (PARTS 7–12) + QUICK REFERENCE
    ══════════════════════════════════════════════════════════ */
    {
      id: 'qa-part2', num: '15', accent: 'purple',
      part: 'PHASE 15 · Q&A + QUICK REFERENCE',
      eyebrow: 'FINAL REVISION',
      title: 'Q&A: Testing → Microservices + Annotation Reference',
      intro: 'The remaining interview topics plus a complete annotation quick-reference — every category on one page for last-day revision.',
      blocks: [
        {
          t: 'sub',
          text: 'Testing'
        },
        {
          t: 'list',
          items: [
            '<strong>Difference between @SpringBootTest and @WebMvcTest?</strong> — @SpringBootTest loads the full application context (all beans, DB, etc.) — slow but complete. @WebMvcTest loads only the web slice (controllers, filters, security) with a MockMvc — fast, use for controller tests.',
            '<strong>What is @DataJpaTest?</strong> — Loads only JPA repositories, the EntityManager, and an embedded H2 database by default. Spring Security, controllers, and service beans are excluded. Use TestEntityManager to set up data. Transactions rolled back after each test.',
            '<strong>How to mock beans in tests?</strong> — @MockBean (Spring Boot test slice): replaces the real bean in the ApplicationContext with a Mockito mock. @Mock (plain Mockito, no Spring context): use with @ExtendWith(MockitoExtension.class) + @InjectMocks.',
            '<strong>What are TestContainers?</strong> — Library that starts real Docker containers (PostgreSQL, Redis, Kafka) for integration tests. @Testcontainers + @Container PostgreSQLContainer starts a real DB — no SQL dialect surprises vs H2.',
            '<strong>What is MockMvc?</strong> — Spring MVC Test framework that simulates HTTP requests without a running server. Verifies JSON responses with jsonPath, checks status codes, and tests content negotiation — all without starting a Tomcat instance.'
          ]
        },
        {
          t: 'sub',
          text: 'Security'
        },
        {
          t: 'list',
          items: [
            '<strong>How does Spring Security work?</strong> — A chain of servlet filters intercepts every request. The SecurityFilterChain bean configures which filters run, in what order. Each filter (CORS, CSRF, JwtFilter, AuthorizationFilter) is responsible for one concern.',
            '<strong>What is JWT?</strong> — A self-contained token with three base64url-encoded parts: Header (alg, typ), Payload (sub, roles, exp), Signature (HMAC-SHA256 of header + payload with secret). Stateless — server verifies signature without a session store.',
            '<strong>Authentication vs Authorization?</strong> — Authentication: "Who are you?" — verify identity (username/password or JWT). Authorization: "What are you allowed to do?" — check roles/permissions (ROLE_ADMIN, hasAuthority). @PreAuthorize enforces authorization.',
            '<strong>How to implement OAuth2 in Spring Boot?</strong> — Add spring-boot-starter-oauth2-resource-server or oauth2-client. Configure issuer-uri. Spring Security validates JWTs issued by the authorization server automatically. Implement JwtAuthenticationConverter for custom roles.',
            '<strong>What is @PreAuthorize and @PostAuthorize?</strong> — @PreAuthorize("hasRole(\'ADMIN\')") checks expression before the method runs. @PostAuthorize("returnObject.userId == authentication.principal.id") checks after — useful for ensuring users can only read their own data.'
          ]
        },
        {
          t: 'sub',
          text: 'Microservices'
        },
        {
          t: 'list',
          items: [
            '<strong>What is API Gateway and why is it needed?</strong> — Single entry point for all client traffic. Handles routing, load balancing, authentication, rate limiting, CORS, and logging centrally — so individual services do not each implement these cross-cutting concerns.',
            '<strong>How does Spring Cloud Gateway work?</strong> — Routes match incoming requests using Predicates (Path, Host, Method, Header). Matched routes are transformed by Filters (StripPrefix, AddRequestHeader, CircuitBreaker). URIs beginning lb:// are load-balanced via Eureka.',
            '<strong>Explain the circuit breaker pattern.</strong> — CLOSED (normal): failures tracked. When failure rate exceeds threshold → OPEN: all calls fast-fail to fallback method. After wait duration → HALF_OPEN: limited trial calls. If they succeed → CLOSED again.',
            '<strong>What is service discovery?</strong> — Services register themselves at startup with a registry (Eureka, Consul). Callers look up instances by service name instead of hardcoded host:port. Enables horizontal scaling — new instances automatically join the pool.',
            '<strong>Explain Saga pattern for distributed transactions.</strong> — Choreography: each service publishes an event after its step; downstream services react. Orchestration: a central saga orchestrator calls each service and handles rollback (compensating transactions) if a step fails.',
            '<strong>What is distributed tracing?</strong> — A Trace ID is assigned at the first service and propagated (via HTTP header X-B3-TraceId or W3C traceparent) to every downstream call. Each service creates a Span with timing. Visualised in Jaeger or Zipkin.'
          ]
        },
        {
          t: 'sub',
          text: 'Performance'
        },
        {
          t: 'list',
          items: [
            '<strong>How to optimise database queries?</strong> — Add DB indexes on WHERE/JOIN/ORDER BY columns. Use pagination (Pageable). Fix N+1 with JOIN FETCH. Select only needed columns with projections. Use query cache for stable data. Profile with EXPLAIN.',
            '<strong>When to use caching?</strong> — Data that is: (1) read much more than written, (2) expensive to compute or fetch, (3) tolerable with some staleness. Reference data, product catalogues, user profiles. Never cache real-time financial data.',
            '<strong>What is connection pooling?</strong> — Maintains a pool of pre-established DB connections that are reused across requests. Creating a new JDBC connection takes ~100ms. HikariCP reuse takes microseconds. Spring Boot auto-configures HikariCP as the default pool.',
            '<strong>How to handle large datasets?</strong> — Pagination (Page/Slice). Streaming with ScrollableResults or Flux for reactive. Spring Batch for bulk processing. Never hold millions of rows in memory — process in chunks of 100–1000.',
            '<strong>What is async processing and when to use it?</strong> — @Async runs the method on a separate thread from the HTTP request thread. Use for slow operations that the caller does not need to wait for: emails, reports, notifications. Always configure a custom TaskExecutor.'
          ]
        },
        {
          t: 'sub',
          text: 'Monitoring & Common Issues'
        },
        {
          t: 'list',
          items: [
            '<strong>What is Spring Boot Actuator?</strong> — Auto-configured endpoints exposing health, metrics, environment, beans, thread dump, and more. Add spring-boot-starter-actuator. Expose selectively in production — /actuator/health is safe; /actuator/env may expose secrets.',
            '<strong>Important actuator endpoints?</strong> — /actuator/health (liveness probe), /actuator/metrics (list all metrics), /actuator/prometheus (scrape endpoint for Prometheus), /actuator/env (property sources), /actuator/beans (all beans), /actuator/threaddump (diagnose deadlocks).',
            '<strong>How to create custom metrics?</strong> — Inject MeterRegistry. Counter.builder("orders.placed").tag("region","EU").register(registry).increment(). Timer.builder("payment.duration").register(registry).record(duration, MILLISECONDS). These appear in /actuator/prometheus automatically.',
            '<strong>Difference between monitoring and logging?</strong> — Monitoring: numeric time-series (heap %, request rate, error %). Shows trends and triggers alerts. Logging: discrete events with context (which user, which query, what error). Both are needed — metrics tell you something is wrong, logs tell you why.',
            '<strong>What is circular dependency?</strong> — Bean A requires B in its constructor, Bean B requires A. Spring cannot instantiate either. Fix: refactor shared logic to a third bean C that both depend on. Or @Lazy on one parameter. Or use setter injection on one side.',
            '<strong>How to handle LazyInitializationException?</strong> — Accessing a LAZY collection after the Hibernate session closes. Fix: keep access inside a @Transactional method, use JOIN FETCH / @EntityGraph to load eagerly in the query, or use a DTO projection that fetches exactly what you need.'
          ]
        },
        {
          t: 'sub',
          text: 'Advanced Interview Questions'
        },
        {
          t: 'list',
          items: [
            '<strong>Explain Bean Lifecycle.</strong> — Instantiate (constructor) → Populate (inject @Autowired) → Aware interfaces (setBeanName, setBeanFactory) → @PostConstruct → In use (serving requests) → @PreDestroy → Destroy (GC eligible).',
            '<strong>What is ApplicationContext?</strong> — The central IoC container. Reads configuration, creates and manages all beans, handles dependency injection, supports AOP, publishes application events, and provides environment abstraction. Extends BeanFactory with enterprise features.',
            '<strong>Difference between BeanFactory and ApplicationContext?</strong> — BeanFactory is the basic container — lazy bean creation, dependency injection. ApplicationContext adds AOP integration, event publishing, internationalisation, and eager singleton initialisation on startup.',
            '<strong>What is Inversion of Control (IoC)?</strong> — The framework creates and manages object dependencies instead of the application doing it (new SomeService()). Results in loose coupling — classes declare what they need; Spring decides how to provide it.',
            '<strong>What is AspectJ weaving?</strong> — The process of inserting aspect advice code into target class bytecode. Compile-time weaving: done by ajc compiler. Load-time weaving: done by a Java agent at class loading. Spring AOP uses runtime proxy weaving (no ajc needed).',
            '<strong>Explain Proxy pattern in Spring.</strong> — Spring wraps @Transactional, @Async, @Cacheable, and AOP-advised beans in proxies. JDK Dynamic Proxy if the bean implements an interface. CGLIB proxy for concrete classes (subclass at runtime). Self-invocation bypasses the proxy.',
            '<strong>What is BeanPostProcessor?</strong> — An extension point called once per bean after instantiation. postProcessBeforeInitialization (before @PostConstruct) and postProcessAfterInitialization (after). Used internally for @Autowired, AOP proxy creation, @Scheduled.',
            '<strong>What is FactoryBean?</strong> — A special bean that creates other beans. Implements FactoryBean<T>. Spring calls getObject() to produce the actual bean. getObjectType() declares the type. Used internally for creating proxies, JPA EntityManagerFactory, etc.'
          ]
        },
        {
          t: 'sub',
          text: 'Real-World Scenario Questions'
        },
        {
          t: 'list',
          items: [
            '<strong>How to handle file uploads?</strong> — @RequestParam MultipartFile file in the controller. Call file.transferTo(destinationPath) to stream to disk — never store in a byte[] for large files. Configure max size with spring.servlet.multipart.max-file-size=10MB.',
            '<strong>How to implement pagination?</strong> — Controller accepts @RequestParam int page and size, creates PageRequest.of(page, size, Sort.by("createdAt").descending()), passes to the repository which returns Page<T>. Page contains content, totalPages, totalElements.',
            '<strong>How to schedule tasks?</strong> — @EnableScheduling on config, @Scheduled on the method. fixedRate=30000 runs every 30s regardless of previous run time. fixedDelay=30000 waits 30s after completion. cron="0 0 6 * * MON-FRI" uses cron expression.',
            '<strong>How to send emails?</strong> — Add spring-boot-starter-mail. Configure spring.mail.host/port/username/password. Inject JavaMailSender. Build a SimpleMailMessage or MimeMessage for HTML emails. Use @Async to avoid blocking the request thread.',
            '<strong>How to implement multi-tenancy?</strong> — Schema-per-tenant: use AbstractRoutingDataSource to switch connection based on tenant header/JWT claim. Row-level: add tenantId column to every table and filter every query via Spring Data @Query or Hibernate Filter annotation.'
          ]
        },
        {
          t: 'sub',
          text: 'Annotation Quick Reference — Stereotypes & DI'
        },
        {
          t: 'tags',
          items: ['@Component', '@Service', '@Repository', '@Controller', '@RestController']
        },
        {
          t: 'table',
          head: ['Category', 'Annotations'],
          rows: [
            ['Configuration', '@Configuration · @Bean · @EnableAutoConfiguration · @SpringBootApplication · @PropertySource · @ConditionalOnProperty · @Profile'],
            ['Injection', '@Autowired · @Qualifier · @Resource · @Inject · @Primary · @Lazy · @Value'],
            ['HTTP Mapping', '@RequestMapping · @GetMapping · @PostMapping · @PutMapping · @DeleteMapping · @PatchMapping'],
            ['Method Params', '@PathVariable · @RequestParam · @RequestBody · @ResponseBody · @RequestHeader · @CookieValue · @ModelAttribute'],
            ['Validation', '@Valid · @Validated · @NotNull · @NotBlank · @NotEmpty · @Size · @Min · @Max · @Pattern · @Email · @Positive · @Negative'],
            ['JPA / Data', '@Entity · @Table · @Id · @GeneratedValue · @Column · @Transient · @OneToOne · @OneToMany · @ManyToOne · @ManyToMany · @JoinColumn · @JoinTable · @Version · @CreatedDate · @LastModifiedDate'],
            ['Transactions', '@Transactional · @EnableTransactionManagement · @Lock'],
            ['Security', '@EnableWebSecurity · @EnableMethodSecurity · @PreAuthorize · @PostAuthorize · @Secured · @RolesAllowed'],
            ['Async & Scheduling', '@EnableAsync · @Async · @EnableScheduling · @Scheduled'],
            ['Caching', '@EnableCaching · @Cacheable · @CachePut · @CacheEvict · @Caching'],
            ['Testing', '@SpringBootTest · @WebMvcTest · @DataJpaTest · @MockBean · @Mock · @InjectMocks · @ExtendWith · @Testcontainers'],
            ['AOP', '@EnableAspectJAutoProxy · @Aspect · @Pointcut · @Before · @After · @AfterReturning · @AfterThrowing · @Around'],
            ['Microservices', '@EnableEurekaServer · @EnableDiscoveryClient · @LoadBalanced · @CircuitBreaker · @Retry · @TimeLimiter · @FeignClient'],
            ['Reactive (WebFlux)', '@EnableWebFlux · RouterFunction · HandlerFunction (functional style)'],
            ['OpenAPI Docs', '@OpenAPIDefinition · @Operation · @Parameter · @ApiResponse · @Schema · @Tag']
          ]
        },
        {
          t: 'callout',
          kind: 'key',
          html: '<strong>Revision strategy:</strong> For each annotation in the table, be able to answer: (1) Which layer does it belong to? (2) What problem does it solve? (3) What happens if you leave it out? If you can answer those three questions for every annotation in your interview domain, you are ready.'
        }
      ]
    }

  ] // end levels
}; // end window.CONTENT
