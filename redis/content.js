/* ============================================================
   Redis — learning content as structured blocks.
   Rendered by app.js (shared with the other guides).
   Code is stored raw and auto-escaped on render, so < > & in
   code need no escaping. Avoid ${...} and backticks in code.
   ============================================================ */
window.CONTENT = {
  hero: {
    eyebrow: 'The Complete Guide',
    title: 'Redis',
    sub: 'From the single-threaded event loop and the five core data types up to caching patterns, persistence, replication, Sentinel, Cluster, and Streams. Seven phases covering every layer of Redis — each concept explained with diagrams, real CLI / Java / Spring code, and the interview-grade gotchas (the three cache killers, eviction policies, RDB vs AOF). Built for deep study and fast revision.',
    stats: [
      { num: '7', label: 'Phases' },
      { num: '5+', label: 'Data types' },
      { num: '50+', label: 'Code samples' },
      { num: '16', label: 'Diagrams' },
    ],
  },

  levels: [
    /* ========================================================
       PHASE 0 — Why Redis?
       ======================================================== */
    {
      id: 'phase-0', num: '00', accent: 'rose', part: 'Context',
      eyebrow: 'Phase 0 · Real-World Context',
      title: 'Why Redis?',
      intro: 'Start with the "why" before the "how". Redis is an in-memory data store used as a cache, session store, message broker, and more. Understanding where it fits — and where it does not — is what separates memorising commands from designing systems.',
      blocks: [
        { t: 'sub', text: 'Where Redis fits' },
        { t: 'prose', html: `Redis usually sits <strong>between your application and your database</strong> as a fast in-memory layer. Reads it can answer never touch the database, so the database stays cool under load and your users get microsecond responses.` },
        { t: 'diagram', name: 'whereRedis', cap: 'Redis absorbs reads in front of a slower, durable database' },

        { t: 'sub', text: 'Real-world use cases' },
        { t: 'cards', cols: 2, items: [
          { title: 'Caching layer', body: 'Cache user profiles, product listings, computed results — cut database load &amp; latency.' },
          { title: 'Session storage', body: 'HTTP session data, faster than a DB and auto-expiring via TTL.' },
          { title: 'Leaderboards', body: 'Sorted Sets keep real-time rankings and scores ordered for you.' },
          { title: 'Rate limiting', body: 'Count requests per user/IP to enforce API limits without hitting the DB.' },
          { title: 'Message queues', body: 'Lists as simple job queues; Pub/Sub &amp; Streams for event delivery.' },
          { title: 'Real-time analytics', body: 'Counters, time-series, and HyperLogLog for page views &amp; unique users.' },
          { title: 'Geo-location', body: 'Geo structures for "nearby" queries — restaurants, drivers, friends.' },
          { title: 'Full-text search', body: 'The RediSearch module builds search indexes over your data.' },
        ] },

        { t: 'sub', text: 'The roles Redis plays' },
        { t: 'list', items: [
          `<strong>Cache</strong> — the primary use case: reduce database load and latency.`,
          `<strong>Session store</strong> — replace DB-backed HTTP sessions.`,
          `<strong>Message broker</strong> — Pub/Sub and Streams for async service communication.`,
          `<strong>Job queue</strong> — background jobs with prioritisation (Lists / Streams).`,
          `<strong>Analytics engine</strong> — counters, time-series, aggregations.`,
          `<strong>Lock manager</strong> — distributed locks coordinating work across microservices.`,
          `<strong>Database (limited)</strong> — only for volatile data that can tolerate loss.`,
        ] },

        { t: 'sub', text: 'When to use Redis — and when not to' },
        { t: 'callout', kind: 'tip', html: `<strong>✅ Use Redis when:</strong> you need very fast reads/writes, can tolerate some data loss, your working set fits in RAM (&lt; ~100GB/instance), and you're working with volatile or cacheable data.` },
        { t: 'callout', kind: 'danger', html: `<strong>❌ Avoid Redis when:</strong> you need full ACID transactions, durable persistence is critical without a backup strategy, your data is larger than available RAM, or you need rich/complex queries (use a real database).` },
        { t: 'callout', kind: 'key', html: `<strong>Mental model:</strong> Redis is a <em>speed layer</em>, not a system of record. Pair it with a durable database — Redis serves the hot path, the database owns the truth.` },
      ],
    },

    /* ========================================================
       PHASE 1 — Core Fundamentals
       ======================================================== */
    {
      id: 'phase-1', num: '01', accent: 'purple', part: 'Fundamentals',
      eyebrow: 'Phase 1 · The Basics',
      title: 'Core Fundamentals',
      intro: 'How Redis works and how you talk to it. The single-threaded in-memory architecture explains both its speed and its constraints, and the five core data types are the vocabulary you build everything from.',
      blocks: [
        { t: 'sub', text: 'In-memory architecture' },
        { t: 'prose', html: `Redis keeps all data in <strong>RAM</strong>, which is roughly <strong>1000× faster</strong> than disk. That single fact is most of why it's fast.` },
        { t: 'diagram', name: 'inMemory', cap: 'RAM (microseconds) vs disk (milliseconds) — a 1000× gap' },
        { t: 'prose', html: `Redis processes commands on a <strong>single thread</strong> with non-blocking I/O (the reactor pattern). Commands run one at a time, to completion — so every command is <strong>atomic</strong> and there are no locks or race conditions to reason about.` },
        { t: 'diagram', name: 'eventLoop', cap: 'One thread processes commands serially — atomic by construction' },
        { t: 'list', items: [
          `<strong>Why it's fast:</strong> RAM access + no lock contention + simple data structures.`,
          `<strong>Atomic operations:</strong> a command never partially applies — impossible to observe a half-done update.`,
          `<strong>Trade-off:</strong> command processing is bound to a single CPU core (Redis 6+ adds threaded I/O for network, but command execution stays single-threaded).`,
        ] },
        { t: 'callout', kind: 'note', html: `Because everything is serialized on one thread, a single <strong>slow command</strong> (e.g. <code>KEYS *</code> on millions of keys) blocks <em>all</em> clients. Avoid O(n) commands on big datasets in production.` },

        { t: 'sub', text: 'The CLI' },
        { t: 'prose', html: `Connect with <code>redis-cli -h localhost -p 6379</code> (or just <code>redis-cli</code> for localhost). The essential commands:` },
        { t: 'code', title: 'redis-cli — basics', code:
`SET key value          # store a value
GET key                # retrieve it
DEL key                # delete it
EXISTS key             # 1 if present, 0 if not
EXPIRE key 3600        # auto-delete in 3600s
KEYS pattern           # find keys (AVOID in prod -- O(n), blocks)
DBSIZE                 # number of keys
FLUSHDB / FLUSHALL     # DANGER: wipe the db / all dbs` },
        { t: 'code', title: 'Introspection', code:
`INFO                   # server stats & diagnostics
INFO memory            # memory usage, fragmentation
MONITOR                # stream every command live (debugging)
CLIENT LIST            # connected clients
SLOWLOG GET 10         # the 10 slowest recent commands` },
        { t: 'callout', kind: 'tip', html: `Need to scan keys in production? Use <code>SCAN</code> (cursor-based, non-blocking) instead of <code>KEYS</code> — it iterates in small batches without stalling the server.` },

        { t: 'sub', text: 'The five core data types' },
        { t: 'prose', html: `Choosing the right type is the single biggest lever on memory and performance. Here are the five you'll use constantly:` },
        { t: 'diagram', name: 'dataTypes', cap: 'String, Hash, List, Set, Sorted Set — the everyday toolkit' },

        { t: 'sub', text: 'String' },
        { t: 'prose', html: `The simplest type: a key maps to a value (text, a number, JSON, or raw bytes up to 512MB). Great for counters thanks to atomic <code>INCR</code>.` },
        { t: 'code', title: 'String commands', code:
`SET key value EX 3600       # set with a 1-hour expiry
INCR counter                # atomic +1 (returns new value)
INCRBY views 10             # atomic += 10
APPEND key " more"          # append to the value
GETRANGE key 0 5            # substring (bytes 0..5)
MSET a 1 b 2 c 3            # set many at once` },
        { t: 'callout', kind: 'tip', html: `Store JSON objects as String values for readability — in Spring use <code>GenericJackson2JsonRedisSerializer</code> so the data is human-readable in <code>redis-cli</code>.` },

        { t: 'sub', text: 'Hash' },
        { t: 'prose', html: `A map of field→value under one key — like a row in a table. Ideal for objects (a user, a product) because you can read/update individual fields without (de)serialising the whole thing.` },
        { t: 'code', title: 'Hash commands', code:
`HSET user:123 name "John" age 30   # set multiple fields
HGET user:123 name                 # one field
HGETALL user:123                   # all fields
HDEL user:123 age                  # delete a field
HINCRBY user:123 age 1             # atomic field increment` },
        { t: 'callout', kind: 'tip', html: `A Hash is far more memory-efficient than many separate String keys for an object's fields (one key's overhead instead of N). Perfect for user profiles and product details.` },

        { t: 'sub', text: 'List' },
        { t: 'prose', html: `An ordered sequence of strings (a linked list). Push/pop from either end in O(1) — the basis for queues, stacks, and activity feeds.` },
        { t: 'code', title: 'List commands', code:
`LPUSH queue job1 job2     # push to the head (left)
RPUSH queue job3          # push to the tail (right)
RPOP queue                # pop from the tail
LLEN queue                # length
LRANGE queue 0 -1         # all items (0 to last)
BLPOP queue 0             # BLOCKING pop — wait for an item` },
        { t: 'callout', kind: 'note', html: `<code>BLPOP</code>/<code>BRPOP</code> block until an item arrives — a clean producer-consumer queue. For consumer groups, acknowledgements, and replay, reach for <strong>Streams</strong> (Phase 6) instead.` },

        { t: 'sub', text: 'Set' },
        { t: 'prose', html: `An unordered collection of <strong>unique</strong> strings with O(1) membership tests, plus set algebra (union/intersection/difference). Great for tags, followers, and deduplication.` },
        { t: 'code', title: 'Set commands', code:
`SADD tags python java golang   # add members (dupes ignored)
SMEMBERS tags                  # all members
SISMEMBER tags python          # 1 if member, 0 if not (O(1))
SCARD tags                     # cardinality (count)
SINTER set1 set2               # intersection
SUNION set1 set2               # union` },
        { t: 'callout', kind: 'tip', html: `O(1) membership makes Sets perfect for "has this user already voted?", "is this tag present?", or computing mutual followers via <code>SINTER</code>.` },

        { t: 'sub', text: 'Sorted Set (ZSET)' },
        { t: 'prose', html: `Like a Set, but every member carries a numeric <strong>score</strong> and the set stays ordered by it. The go-to structure for leaderboards, priority queues, and time-series (use a timestamp as the score).` },
        { t: 'diagram', name: 'sortedSet', cap: 'Members kept sorted by score — rank and range queries in O(log n)' },
        { t: 'code', title: 'Sorted Set commands', code:
`ZADD leaderboard 100 player1 200 player2   # add with scores
ZREVRANGE leaderboard 0 9 WITHSCORES        # top 10 (high to low)
ZRANK leaderboard player1                   # rank (0-based, low to high)
ZSCORE leaderboard player1                  # a member's score
ZINCRBY leaderboard 50 player1              # bump a score by 50
ZCOUNT leaderboard 100 200                  # how many in score range` },
        { t: 'callout', kind: 'tip', html: `Scores are floats — use a Unix timestamp as the score to turn a ZSET into a time-ordered log you can range-query by time window.` },

        { t: 'sub', text: 'Beyond the core five' },
        { t: 'table', head: ['Type', 'Use'],
          rows: [
            ['Bitmap', 'Compact boolean flags — e.g. daily online status per user id'],
            ['HyperLogLog', 'Approximate unique-count (cardinality) in ~12KB for billions'],
            ['Geospatial', 'Store lat/long, query "nearby" within a radius'],
            ['Stream', 'Append-only log with consumer groups (Phase 6)'],
          ] },
      ],
    },

    /* ========================================================
       PHASE 2 — Memory Management & Eviction
       ======================================================== */
    {
      id: 'phase-2', num: '02', accent: 'blue', part: 'Fundamentals',
      eyebrow: 'Phase 2 · Under the Hood',
      title: 'Memory Management & Eviction',
      intro: 'Redis lives in RAM, so RAM is finite and precious. This phase is about expiry (TTL), what Redis does when memory fills up (eviction policies), and squeezing more into the space you have.',
      blocks: [
        { t: 'sub', text: 'Time-To-Live (TTL)' },
        { t: 'prose', html: `Give a key an expiry and Redis deletes it automatically — perfect for sessions, temporary caches, and self-cleaning rate-limit counters.` },
        { t: 'diagram', name: 'ttl', cap: 'Keys with a TTL expire on their own — no cleanup job needed' },
        { t: 'code', title: 'Setting & checking expiry', code:
`EXPIRE key 3600            # expire in 3600 seconds
PEXPIRE key 3600000        # ...in milliseconds
EXPIREAT key 1609459200    # ...at a Unix timestamp
SET key value EX 3600      # set + expire in one command

TTL key                    # seconds left (-1 = no expiry, -2 = missing)
PTTL key                   # milliseconds left
PERSIST key                # remove the expiry (make it permanent)` },
        { t: 'callout', kind: 'note', html: `Redis doesn't delete expired keys the instant they expire. It removes them <strong>lazily</strong> (when you next access them) and <strong>actively</strong> (a background sampler). So an expired key may briefly still occupy memory.` },

        { t: 'sub', text: 'Eviction policies' },
        { t: 'prose', html: `When memory hits <code>maxmemory</code> and a new write arrives, the <strong>eviction policy</strong> decides what (if anything) to drop.` },
        { t: 'diagram', name: 'eviction', cap: 'At maxmemory, the policy evicts a key to make room for the new write' },
        { t: 'table', head: ['Policy', 'Evicts', 'Best for'],
          rows: [
            ['allkeys-lru', 'Least-recently-used key (any key)', 'General-purpose caching (most common)'],
            ['allkeys-lfu', 'Least-<em>frequently</em>-used key', 'A small hot set (80/20 traffic)'],
            ['volatile-lru / lfu', 'LRU/LFU but only keys with a TTL', 'Mixed permanent + temporary data'],
            ['allkeys-random', 'A random key', 'Rarely a good idea'],
            ['volatile-ttl', 'Key with the shortest TTL first', 'Niche'],
            ['noeviction <em>(default)</em>', 'Nothing — write fails', 'When loss is unacceptable'],
          ] },
        { t: 'code', title: 'redis.conf', code:
`maxmemory 2gb
maxmemory-policy allkeys-lru` },
        { t: 'callout', kind: 'warning', html: `<code>noeviction</code> means a write that would exceed memory fails with <strong>"OOM command not allowed"</strong>. Use it only when paired with replication + persistence and you genuinely cannot drop data.` },
        { t: 'callout', kind: 'key', html: `<strong>LRU vs LFU:</strong> LRU evicts what you haven't touched <em>recently</em>; LFU evicts what you touch <em>least often</em>. LFU shines when a small set of keys is hot and you don't want a one-off scan to evict them.` },

        { t: 'sub', text: 'Memory optimisation' },
        { t: 'list', items: [
          `<strong>Key overhead</strong> — every key carries ~90 bytes of metadata. Millions of tiny keys waste memory; group fields into a Hash.`,
          `<strong>Value size</strong> — values &gt; 1MB are dangerous: slow to ship over the network and they pressure eviction. Keep values small.`,
          `<strong>Pick the right type</strong> — a Hash beats many String keys for an object's fields.`,
          `<strong>Compress</strong> — store large JSON gzipped (trade CPU for memory).`,
        ] },
        { t: 'code', title: 'Diagnose memory', code:
`MEMORY DOCTOR              # plain-English diagnosis of memory issues
MEMORY USAGE key           # bytes used by a specific key
INFO memory                # peak memory, fragmentation ratio, etc.` },
        { t: 'callout', kind: 'tip', html: `Watch the <strong>fragmentation ratio</strong> in <code>INFO memory</code>: well above 1.0 means the allocator is holding memory the OS can't reclaim — consider <code>activedefrag yes</code>.` },
      ],
    },
    /* ========================================================
       PHASE 3 — Caching Patterns
       ======================================================== */
    {
      id: 'phase-3', num: '03', accent: 'amber', part: 'System Design',
      eyebrow: 'Phase 3 · System Design',
      title: 'Caching Patterns',
      intro: 'The architectural strategies for keeping a cache and a database in sync — and the three classic failure modes ("cache killers") that every system-design interview asks about. This is the most important phase for interviews.',
      blocks: [
        { t: 'sub', text: 'Cache-Aside (lazy loading)' },
        { t: 'prose', html: `The most common pattern. The <strong>application</strong> manages the cache: check it first, and on a miss load from the database and populate it. Redis itself stays oblivious to the database.` },
        { t: 'diagram', name: 'cacheAside', cap: 'App checks the cache, falls back to the DB on a miss, then backfills' },
        { t: 'code', title: 'Cache-aside (pseudocode)', code:
`def get_user(user_id):
    cached = redis.get("user:" + user_id)
    if cached:
        return cached                       # cache hit
    user = database.query(user_id)          # miss -> hit the DB
    redis.set("user:" + user_id, user, ex=3600)   # backfill, 1h TTL
    return user` },
        { t: 'callout', kind: 'note', html: `<strong>Pros:</strong> simple, resilient (cache failure just means more DB load). <strong>Cons:</strong> the first read is always a miss, and data can go stale until the TTL expires.` },

        { t: 'sub', text: 'Write-Through' },
        { t: 'prose', html: `Write to the cache and the database <strong>synchronously</strong> on every update, and serve all reads from the cache. The cache is always fresh.` },
        { t: 'diagram', name: 'writeThrough', cap: 'Every write updates cache then DB before returning' },
        { t: 'code', title: 'Write-through (pseudocode)', code:
`def update_user(user_id, data):
    redis.set("user:" + user_id, data)      # 1. write cache
    database.update(user_id, data)          # 2. write DB (blocking)
    return "ok"                             # only after both succeed` },
        { t: 'callout', kind: 'note', html: `<strong>Pros:</strong> cache always consistent with the DB. <strong>Cons:</strong> slower writes (you pay the DB latency on every write), more moving parts.` },

        { t: 'sub', text: 'Write-Behind (write-back)' },
        { t: 'prose', html: `Write only to the cache and return immediately; a background worker flushes to the database <strong>asynchronously</strong> (often batched). The fastest writes — at the cost of a durability window.` },
        { t: 'diagram', name: 'writeBehind', cap: 'Write to cache, return now, sync to the DB later in batches' },
        { t: 'code', title: 'Write-behind (pseudocode)', code:
`def update_user(user_id, data):
    redis.set("user:" + user_id, data)      # write cache only (fast)
    job_queue.enqueue(persist_user, user_id, data)  # queue async DB write
    return "ok"                             # returns BEFORE the DB write` },
        { t: 'callout', kind: 'danger', html: `<strong>Pros:</strong> fastest writes, batching cuts DB load. <strong>Cons:</strong> if the cache crashes before the flush, those writes are <strong>lost</strong> — only eventual consistency.` },

        { t: 'sub', text: 'The three cache killers' },
        { t: 'prose', html: `Three failure modes where the cache stops protecting the database — and the database takes the full hit. Know all three cold for interviews.` },

        { t: 'sub', text: '1. Cache Penetration' },
        { t: 'prose', html: `Requests ask for keys that <strong>don't exist anywhere</strong> (e.g. random/invalid ids). Every request misses the cache <em>and</em> the database, so the DB is hammered with pointless queries — a common attack vector.` },
        { t: 'diagram', name: 'penetration', cap: 'Non-existent keys miss the cache every time and pound the database' },
        { t: 'code', title: 'Fix: cache the null', code:
`user = redis.get("user:" + user_id)
if user is None:
    user = database.query(user_id)
    if not user:
        redis.set("user:" + user_id, "NULL", ex=300)   # cache the miss, 5min
        return None
    redis.set("user:" + user_id, user, ex=3600)
return user` },
        { t: 'list', items: [
          `<strong>Null caching</strong> — cache the fact that a key doesn't exist (short TTL).`,
          `<strong>Bloom filter</strong> — a probabilistic pre-filter that instantly rejects ids that were never inserted.`,
          `<strong>Rate limiting</strong> — throttle suspicious clients hammering invalid ids.`,
        ] },

        { t: 'sub', text: '2. Cache Avalanche' },
        { t: 'prose', html: `A huge number of keys expire at <strong>the same instant</strong> (e.g. everything cached at startup with the same TTL). All miss together, all hit the database at once — a thundering herd that can crash it.` },
        { t: 'diagram', name: 'avalanche', cap: 'Synchronised expiry → mass simultaneous DB load' },
        { t: 'code', title: 'Fix: jitter the TTL', code:
`import random
ttl = 3600 + random.randint(-300, 300)   # 1h +/- 5min of randomness
redis.set(key, value, ex=ttl)            # expirations now spread out` },
        { t: 'list', items: [
          `<strong>Randomise TTLs</strong> (add jitter) so keys don't all expire together.`,
          `<strong>Replication + persistence</strong> so a cache restart restores fast.`,
          `<strong>Circuit breaker</strong> — if the DB is overwhelmed, fail fast instead of queuing.`,
        ] },

        { t: 'sub', text: '3. Thundering Herd (dogpile)' },
        { t: 'prose', html: `A <strong>single very popular key</strong> expires, and thousands of concurrent requests all try to rebuild it from the database at the same moment.` },
        { t: 'diagram', name: 'thunderingHerd', cap: 'One hot key expires; thousands rebuild it simultaneously' },
        { t: 'code', title: 'Fix: distributed lock (one rebuilds)', code:
`# only the first caller wins the lock and rebuilds
got_lock = redis.set("lock:" + user_id, "building", nx=True, ex=10)
if got_lock:
    user = database.query(user_id)
    redis.set("user:" + user_id, user, ex=3600)
    redis.delete("lock:" + user_id)
else:
    while redis.get("user:" + user_id) is None:   # others wait for the result
        time.sleep(0.1)` },
        { t: 'list', items: [
          `<strong>Distributed lock</strong> — one thread rebuilds, the rest wait for the result.`,
          `<strong>Probabilistic early expiry</strong> — refresh a key <em>before</em> it fully expires.`,
          `<strong>Cache warming</strong> — pre-populate hot keys before they can expire.`,
        ] },
        { t: 'callout', kind: 'key', html: `<strong>Interview cheat sheet:</strong> Penetration = key exists <em>nowhere</em> (fix: cache null / Bloom filter). Avalanche = <em>many</em> keys expire together (fix: TTL jitter). Thundering herd = <em>one hot</em> key expires under load (fix: a lock).` },
      ],
    },

    /* ========================================================
       PHASE 4 — Spring Ecosystem
       ======================================================== */
    {
      id: 'phase-4', num: '04', accent: 'green', part: 'Integration',
      eyebrow: 'Phase 4 · The Application Layer',
      title: 'Spring Data Redis',
      intro: 'How you wire Redis into a real Spring Boot backend — the right driver and serializer, the declarative caching annotations that hide most of the boilerplate, and the RedisTemplate / Redisson escape hatches for when you need full control.',
      blocks: [
        { t: 'sub', text: 'Spring Data Redis & drivers' },
        { t: 'prose', html: `Add <code>spring-boot-starter-data-redis</code> and Spring Boot auto-configures <code>RedisTemplate</code> and <code>StringRedisTemplate</code>. Pick a driver:` },
        { t: 'table', head: ['Driver', 'Notes'],
          rows: [
            ['Lettuce <em>(default)</em>', 'Non-blocking, async, reactive, thread-safe — the recommended choice'],
            ['Jedis', 'Simpler synchronous API; older but still common'],
          ] },

        { t: 'sub', text: 'Serialization (do this in production)' },
        { t: 'prose', html: `The default JDK serializer produces unreadable, bloated binary blobs. Switch values to JSON so the data is compact and inspectable in <code>redis-cli</code>.` },
        { t: 'code', title: 'RedisConfig.java', code:
`@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory cf) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(cf);

        // keys as plain strings, values as JSON
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        var json = new GenericJackson2JsonRedisSerializer();
        template.setValueSerializer(json);
        template.setHashValueSerializer(json);

        template.afterPropertiesSet();
        return template;
    }
}` },

        { t: 'sub', text: 'Declarative caching annotations' },
        { t: 'prose', html: `Turn on caching with <code>@EnableCaching</code>, then annotate methods. Spring intercepts the calls and manages Redis for you — no manual get/set.` },
        { t: 'code', title: 'The three caching annotations', code:
`@Configuration @EnableCaching
public class CacheConfig { }   // master switch

// READ-THROUGH: return cached value if present, else run method & cache it
@Cacheable(value = "users", key = "#id", unless = "#result == null")
public User getUserById(Long id) { return repo.findById(id); }

// INVALIDATE: drop stale entries on update/delete
@CacheEvict(value = "users", key = "#id")
public void deleteUser(Long id) { repo.deleteById(id); }

@CacheEvict(value = "users", allEntries = true)   // clear the whole cache
public void refreshAll() { }

// ALWAYS run & update cache (no bypass) -- good for writes
@CachePut(value = "users", key = "#user.id")
public User updateUser(User user) { return repo.save(user); }` },
        { t: 'callout', kind: 'note', html: `Keys use <strong>SpEL</strong>: <code>key = "#id"</code>. Add <code>condition = "#id &gt; 100"</code> to cache selectively, or <code>unless = "#result == null"</code> to skip caching nulls. <code>value</code> names the logical cache.` },

        { t: 'sub', text: 'RedisTemplate — manual control' },
        { t: 'prose', html: `When annotations aren't enough, drive Redis directly via type-specific operation views.` },
        { t: 'code', title: 'RedisTemplate operations', code:
`@Autowired RedisTemplate<String, Object> redis;

redis.opsForValue().set("key", "value", Duration.ofHours(1));
Object v = redis.opsForValue().get("key");

redis.opsForHash().put("user:1", "name", "John");   // Hash
redis.opsForList().leftPush("queue", "job");        // List
redis.opsForSet().add("tags", "java");              // Set
redis.opsForZSet().add("board", "player1", 100);    // Sorted Set` },

        { t: 'sub', text: 'Distributed locking with Redisson' },
        { t: 'prose', html: `<strong>Redisson</strong> is a higher-level client that ships a robust distributed <code>RLock</code> — with auto-renewal (the "watchdog") so the lock won't expire while you're still working.` },
        { t: 'code', title: 'Redisson RLock', code:
`@Autowired RedissonClient redisson;

public void processOrder(Long orderId) {
    RLock lock = redisson.getLock("order:" + orderId);
    lock.lock();                       // blocks until acquired (auto-renewed)
    try {
        // only one instance across the cluster runs this at a time
        Order o = repo.findById(orderId);
        o.process();
        repo.save(o);
    } finally {
        lock.unlock();
    }
}

// ...or bail out instead of waiting forever:
if (lock.tryLock(10, 60, TimeUnit.SECONDS)) {   // wait 10s, hold up to 60s
    try { /* critical section */ } finally { lock.unlock(); }
}` },
        { t: 'callout', kind: 'tip', html: `Prefer Redisson over hand-rolling locks: it handles the UUID ownership token, safe Lua-based release, and lease auto-renewal — the things people get subtly wrong by hand (see Phase 6).` },
      ],
    },
    /* ========================================================
       PHASE 5 — High Availability & Scaling
       ======================================================== */
    {
      id: 'phase-5', num: '05', accent: 'cyan', part: 'Production',
      eyebrow: 'Phase 5 · Production Grade',
      title: 'High Availability & Scaling',
      intro: 'How to stop Redis losing your data or falling over under load: persistence (RDB/AOF) survives restarts, replication scales reads and enables failover, Sentinel automates that failover, and Cluster shards data across machines.',
      blocks: [
        { t: 'sub', text: 'Persistence — RDB vs AOF' },
        { t: 'prose', html: `Redis is in-memory, so without persistence a restart loses everything. Two mechanisms (often combined): <strong>RDB</strong> takes point-in-time snapshots; <strong>AOF</strong> logs every write operation.` },
        { t: 'diagram', name: 'persistence', cap: 'RDB = periodic snapshot of RAM; AOF = a log of every write to replay' },
        { t: 'code', title: 'redis.conf — RDB snapshots & AOF', code:
`# RDB: snapshot if N keys changed within a window
save 900 1        # 1 change in 15 min
save 300 10       # 10 changes in 5 min
save 60 10000     # 10000 changes in 1 min

# AOF: log every write
appendonly yes
appendfsync everysec    # fsync to disk each second (good balance)
# appendfsync always    # zero loss, much slower
# appendfsync no        # fastest, OS decides (risky)` },
        { t: 'table', head: ['', 'RDB', 'AOF'],
          rows: [
            ['What', 'Snapshot of RAM', 'Append-only write log'],
            ['Data loss', '<span class="mid">Up to last snapshot</span>', '<span class="yes">~1s (or zero with always)</span>'],
            ['File size', '<span class="yes">Compact</span>', '<span class="no">Larger</span>'],
            ['Restart speed', '<span class="yes">Fast</span>', '<span class="no">Slower (replays log)</span>'],
          ] },
        { t: 'callout', kind: 'key', html: `<strong>Best practice — use both.</strong> RDB gives fast restarts and compact backups; AOF gives durability between snapshots. Recent Redis even writes a hybrid AOF that starts with an RDB preamble.` },
        { t: 'callout', kind: 'warning', html: `<code>BGSAVE</code> snapshots in the background (fork + copy-on-write — safe). <code>SAVE</code> blocks the entire server until done — never run it on a live instance.` },

        { t: 'sub', text: 'Replication (leader / follower)' },
        { t: 'prose', html: `A <strong>master</strong> takes writes; one or more read-only <strong>replicas</strong> copy its data (via <code>PSYNC</code>). Replicas let you scale reads, take backups without touching the master, and stand ready to be promoted on failure.` },
        { t: 'diagram', name: 'replication', cap: 'One writable master fanning out to read-only replicas' },
        { t: 'code', title: 'Configure & inspect', code:
`# on the replica (redis.conf)
replicaof master_host 6379

ROLE                # master or replica?
INFO replication    # offsets, connected replicas, lag` },
        { t: 'callout', kind: 'note', html: `<strong>Pros:</strong> read scaling, backup source, failover capability. <strong>Cons:</strong> replication is async so replicas <em>lag</em> (eventual consistency), and there's still a single master bottleneck for writes.` },

        { t: 'sub', text: 'Redis Sentinel — automatic failover' },
        { t: 'prose', html: `Replication gives you a standby, but who promotes it when the master dies? <strong>Sentinel</strong>: a set of processes that monitor the master, and on failure elect a replica to be the new master and tell clients about it.` },
        { t: 'diagram', name: 'sentinel', cap: 'A quorum of Sentinels detects master failure and promotes a replica' },
        { t: 'code', title: 'sentinel.conf', code:
`sentinel monitor mymaster 127.0.0.1 6379 2   # quorum = 2 sentinels must agree
sentinel down-after-milliseconds mymaster 30000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 180000` },
        { t: 'callout', kind: 'note', html: `The <strong>quorum</strong> (a majority of Sentinels must agree the master is down) prevents <strong>split-brain</strong> from a single Sentinel's bad network view. <strong>Pros:</strong> automatic HA. <strong>Cons:</strong> more to operate, and writes still go through one master.` },

        { t: 'sub', text: 'Redis Cluster — horizontal scaling' },
        { t: 'prose', html: `When one machine can't hold the data or absorb the write throughput, <strong>Cluster</strong> shards data across nodes. The keyspace is split into <strong>16,384 hash slots</strong>; each node owns a range. A key's slot is <code>CRC16(key) mod 16384</code>, and each shard can have its own replicas.` },
        { t: 'diagram', name: 'cluster', cap: '16,384 hash slots distributed across nodes — write scaling by sharding' },
        { t: 'code', title: 'Cluster config & commands', code:
`# redis.conf
cluster-enabled yes
cluster-node-timeout 15000

CLUSTER INFO        # cluster state
CLUSTER NODES       # nodes and the slots they own
CLUSTER SLOTS       # slot -> node mapping` },
        { t: 'callout', kind: 'warning', html: `<strong>Cons:</strong> no multi-key operations across different slots (use <strong>hash tags</strong> like <code>{user1}:profile</code> to force related keys onto one slot), clients must speak the cluster protocol, and resharding moves data around. <strong>Use it</strong> when you outgrow a single instance (&gt; ~100GB or write-bound).` },
        { t: 'callout', kind: 'key', html: `<strong>Replication vs Cluster:</strong> replication scales <em>reads</em> and gives HA but keeps one master for writes; Cluster scales <em>writes</em> by sharding across many masters. They compose — each Cluster shard is itself replicated.` },
      ],
    },

    /* ========================================================
       PHASE 6 — Advanced Capabilities
       ======================================================== */
    {
      id: 'phase-6', num: '06', accent: 'indigo', part: 'Advanced',
      eyebrow: 'Phase 6 · Beyond Caching',
      title: 'Advanced Capabilities',
      intro: 'Redis is far more than a cache. Messaging with Pub/Sub and Streams, coordination with distributed locks, and specialised structures for search, JSON, approximate counting, and bitmaps.',
      blocks: [
        { t: 'sub', text: 'Pub/Sub' },
        { t: 'prose', html: `Fire-and-forget broadcasting. A publisher sends to a <strong>channel</strong>; every currently-subscribed client receives it. There's <strong>no persistence</strong> — if nobody is listening, the message is gone.` },
        { t: 'diagram', name: 'pubsub', cap: 'Messages reach only the subscribers connected at that moment' },
        { t: 'code', title: 'Pub/Sub commands', code:
`SUBSCRIBE news              # listen on a channel
PSUBSCRIBE news.*           # pattern subscription
PUBLISH news "breaking!"    # send to all subscribers of "news"
UNSUBSCRIBE news` },
        { t: 'callout', kind: 'note', html: `<strong>Pros:</strong> lightweight, fast, dead simple. <strong>Cons:</strong> no persistence, no consumer groups, no acknowledgements — not for critical messaging. Great for live notifications, dashboards, and chat.` },

        { t: 'sub', text: 'Redis Streams' },
        { t: 'prose', html: `An <strong>append-only log</strong> data structure — Kafka-like, inside Redis. Unlike Pub/Sub, messages are <strong>persisted</strong>, consumers can replay history, and <strong>consumer groups</strong> distribute work with acknowledgements.` },
        { t: 'diagram', name: 'streams', cap: 'Persisted log + consumer groups + acks — durable, unlike Pub/Sub' },
        { t: 'code', title: 'Streams commands', code:
`XADD mystream * field1 value1      # append (auto id)
XRANGE mystream - +                # read all entries
XREVRANGE mystream + - COUNT 10    # last 10

# consumer groups (Kafka-style)
XGROUP CREATE mystream mygroup $           # create group at the tail
XREADGROUP GROUP mygroup c1 COUNT 1 STREAMS mystream >   # read new
XACK mystream mygroup 1680000000-0         # acknowledge processed` },
        { t: 'callout', kind: 'key', html: `<strong>Pub/Sub vs Streams:</strong> Pub/Sub is fire-and-forget (no history, no acks); Streams persist, support replay, consumer groups, and acknowledgements. Reach for Streams when delivery actually matters — event sourcing, audit logs, job queues.` },

        { t: 'sub', text: 'Distributed locks (by hand)' },
        { t: 'prose', html: `The core idea behind Redisson's <code>RLock</code>: <code>SET key uuid NX EX 10</code> atomically acquires a lock only if it's free, with an auto-expiry so a crashed holder can't deadlock everyone. Release with a Lua script so you only delete <em>your own</em> lock.` },
        { t: 'diagram', name: 'distLock', cap: 'SET ... NX EX — one winner; UUID + Lua release prevents stealing' },
        { t: 'code', title: 'Acquire & safe release (Python)', code:
`import uuid

def acquire(redis, key, ttl=10):
    token = str(uuid.uuid4())
    # NX = set only if absent, EX = auto-expire (no deadlock on crash)
    if redis.set(key, token, nx=True, ex=ttl):
        return token
    return None

# Lua makes check-and-delete ATOMIC so you never release someone else's lock
RELEASE = """
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
"""

def release(redis, key, token):
    return redis.eval(RELEASE, 1, key, token)` },
        { t: 'list', items: [
          `<strong>Unique token (UUID)</strong> — so you only release a lock you actually hold.`,
          `<strong>Auto-expiry (EX)</strong> — a crashed holder's lock frees itself; no permanent deadlock.`,
          `<strong>Lua for release</strong> — check-and-delete must be atomic, or you can delete a lock that was reassigned after your TTL expired.`,
        ] },
        { t: 'callout', kind: 'warning', html: `Single-node locks can be lost on failover. For stronger guarantees across masters there's the <strong>Redlock</strong> algorithm — though it's debated; for most apps a Redisson lock on a replicated master is plenty.` },

        { t: 'sub', text: 'Specialised structures & modules' },
        { t: 'code', title: 'HyperLogLog — approximate unique count', code:
`PFADD unique_visitors user1 user2 user3
PFCOUNT unique_visitors        # ~3 (approximate, ~12KB for billions)` },
        { t: 'code', title: 'Bitmaps — compact booleans', code:
`SETBIT online:2026-06-25 123 1     # mark user 123 online
GETBIT online:2026-06-25 123       # is user 123 online?
BITCOUNT online:2026-06-25         # how many users online today` },
        { t: 'code', title: 'RedisJSON & RediSearch (modules)', code:
`JSON.SET user:1 $ '{"name":"John","age":30}'
JSON.GET user:1 $.name

FT.CREATE idx ON JSON SCHEMA $.name AS name TEXT
FT.SEARCH idx "john"` },
        { t: 'callout', kind: 'key', html: `<strong>You made it — all 7 phases.</strong> From "why Redis" to Streams and distributed locks. The interview essentials: the three cache killers, eviction policies (LRU vs LFU), RDB vs AOF, replication vs cluster, and why single-threaded means atomic. Revisit the phases you're shaky on — the diagrams and code are here to drill them in.` },
      ],
    },
  ],
};
