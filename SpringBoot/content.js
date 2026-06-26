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
      { num: '7',   label: 'PHASES' },
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

    // getters/setters or use Lombok @Data
}`
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
          t: 'diagram',
          name: 'aopConcepts',
          cap: '@Around wraps the full execution; @Before / @AfterReturning / @AfterThrowing are for specific moments'
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
    }

  ] // end levels
}; // end window.CONTENT
