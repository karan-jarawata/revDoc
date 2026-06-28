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
    sub: 'From the single-threaded event loop and the five core data types up to caching patterns, persistence, replication, Sentinel, Cluster, and Streams. Eight phases covering every layer of Redis — each concept explained with diagrams, real CLI / Java / Spring code, and the interview-grade gotchas (the three cache killers, eviction policies, RDB vs AOF). Built for deep study and fast revision.',
    stats: [
      { num: '8', label: 'Phases' },
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
        { t: 'callout', kind: 'key', html: `<strong>Phases 0–6 complete.</strong> From "why Redis" to Streams and distributed locks. Head to Phase 7 for the interview Q&A that consolidates everything.` },
      ],
    },

    /* ========================================================
       PHASE 7 — INTERVIEW Q&A
       ======================================================== */
    {
      id: 'phase-7', num: '07', accent: 'purple', part: 'Interview Prep',
      eyebrow: 'Phase 7 · Most Asked',
      title: 'Interview Q & A',
      intro: 'The 14 most common Redis interview questions — each with a complete, production-grade answer. Scan the phases above for depth; come here to consolidate and rehearse.',
      blocks: [
        { t: 'sub', text: 'Core Concepts & Data Structures' },
        { t: 'cards', cols: 2, items: [
          {
            title: 'Q: What is Redis and what are its main use cases?',
            body: `Redis is an <strong>in-memory data structure store</strong> — it holds everything in RAM for microsecond latency, with optional persistence to disk.<br><br>
<strong>Primary use cases:</strong><br>
• <strong>Caching</strong>: sub-millisecond reads for hot data (user profiles, product pages)<br>
• <strong>Session storage</strong>: JWT / auth tokens with automatic TTL expiry<br>
• <strong>Rate limiting</strong>: atomic INCR + EXPIRE for token-bucket counters<br>
• <strong>Leaderboards</strong>: Sorted Sets rank players by score in O(log N)<br>
• <strong>Pub/Sub</strong>: real-time notifications between services<br>
• <strong>Task queues</strong>: List LPUSH/BRPOP for background job processing<br>
• <strong>Distributed locks</strong>: SET NX EX for cross-process mutual exclusion`
          },
          {
            title: 'Q: What are the Redis data structures and when do you use each?',
            body: `<strong>String</strong>: any value ≤512MB. Counters, cached JSON, session tokens. INCR is atomic.<br><br>
<strong>Hash</strong>: field→value map. Ideal for objects (user profile) — cheaper than JSON string per field.<br><br>
<strong>List</strong>: ordered, allows duplicates. LPUSH/BRPOP = message queue / task queue. LRANGE = timeline feed.<br><br>
<strong>Set</strong>: unique, unordered. SADD/SINTER/SUNION — tags, followers, deduplication.<br><br>
<strong>Sorted Set</strong>: unique members + float score. ZADD/ZRANGE — leaderboards, priority queues, TTL-indexed caches.<br><br>
<strong>Stream</strong>: append-only log with consumer groups. Like Kafka inside Redis — reliable event queues with history.<br><br>
<strong>HyperLogLog</strong>: probabilistic unique-count (~0.81% error). PFADD/PFCOUNT — unique visitor counts at 12KB regardless of cardinality.`
          },
          {
            title: 'Q: Why is Redis single-threaded? Does that make it slow?',
            body: `Redis processes commands on a <strong>single main thread</strong>. This is a deliberate design choice, not a limitation.<br><br>
<strong>Why it works:</strong> all data is in RAM, so operations are nanoseconds to microseconds. The CPU is never the bottleneck — I/O and network are. The single thread eliminates all lock contention and race conditions, making commands inherently atomic.<br><br>
<strong>Not truly single-threaded today:</strong> Redis 6+ uses I/O threads for network reads/writes (multi-threaded I/O), while keeping command execution single-threaded. Handles 1–2M simple ops/sec on a single instance. For higher throughput, use Redis Cluster to shard across nodes.`
          },
          {
            title: 'Q: What is TTL and how does Redis expire keys?',
            body: `<strong>TTL (Time To Live)</strong>: an expiration countdown on a key. After it reaches zero, the key is automatically deleted.<br><br>
<strong>How expiry works (two mechanisms):</strong><br>
• <strong>Lazy expiry</strong>: key is checked when accessed — if expired, deleted then. Low overhead but stale keys linger in RAM until touched.<br>
• <strong>Active expiry</strong>: Redis periodically samples ~20 random expiring keys per cycle and deletes expired ones. Continues cycling if >25% were expired.<br><br>
<strong>Key commands:</strong> <code>EXPIRE key seconds</code>, <code>PEXPIRE key ms</code>, <code>TTL key</code> (returns -1 if no TTL, -2 if key gone), <code>PERSIST key</code> removes the TTL.`
          },
        ] },

        { t: 'sub', text: 'Persistence, Replication & High Availability' },
        { t: 'cards', cols: 2, items: [
          {
            title: 'Q: What is the difference between RDB and AOF persistence?',
            body: `<strong>RDB (snapshot)</strong>: writes a binary point-in-time snapshot at configured intervals (e.g. every 15 min if 1+ key changed). Fast to restore, compact file. Risk: data written since the last snapshot is lost on crash.<br><br>
<strong>AOF (Append-Only File)</strong>: logs every write command. On restart, replays the log to rebuild state. Much more durable — with <code>appendfsync everysec</code> you lose at most 1 second of data. Larger files, slower restores.<br><br>
<strong>Best practice:</strong> enable <em>both</em>. On restart Redis prefers AOF (more up-to-date). Run <code>BGREWRITEAOF</code> periodically to compact the AOF. RDB gives you a fast backup; AOF gives you durability.`
          },
          {
            title: 'Q: What is Redis replication and what is Sentinel for?',
            body: `<strong>Replication</strong>: one Master handles all writes; one or more Replicas receive a continuous stream of changes and serve reads. Replicas are read-only. If the master fails, you must manually promote a replica — there is no automatic failover in plain replication.<br><br>
<strong>Redis Sentinel</strong>: adds automatic high-availability on top of replication. A quorum of Sentinel processes (typically 3) monitors the master. If the master is unreachable by a majority of Sentinels, they elect a new master, reconfigure replicas to follow it, and notify clients via the Sentinel API. Sentinel provides HA without sharding.`
          },
          {
            title: 'Q: What is Redis Cluster and how does data sharding work?',
            body: `Redis Cluster partitions data across multiple master nodes for horizontal scaling beyond a single machine's RAM.<br><br>
<strong>Hash slots:</strong> Redis divides the keyspace into 16,384 hash slots. Each key maps to a slot via <code>CRC16(key) % 16384</code>. Each master owns a contiguous range of slots. Add a node → move slots to it; remove a node → redistribute its slots.<br><br>
<strong>Fault tolerance:</strong> each master has ≥1 replica. If a master fails, its replica is automatically promoted.<br><br>
<strong>Client requirement:</strong> clients must be cluster-aware (follow MOVED/ASK redirections) or use a smart client library that handles slot routing transparently.`
          },
          {
            title: 'Q: What are Redis eviction policies and when do you use each?',
            body: `When <code>maxmemory</code> is reached and a new write comes in, Redis applies the eviction policy:<br><br>
• <code>noeviction</code>: return error — write fails. Safe, explicit. Use when you must never lose data.<br>
• <code>allkeys-lru</code>: evict any key, least-recently-used first. Best for general caches where all keys may be hot.<br>
• <code>volatile-lru</code>: evict only keys with TTL set, LRU order. Use when some keys must never expire (permanent config) while others are cache candidates.<br>
• <code>allkeys-lfu</code>: evict least-frequently-used. Better than LRU for skewed access patterns (a few keys accessed millions of times).<br>
• <code>allkeys-random</code>: random eviction. Use only if all keys are equally important / unimportant.`
          },
        ] },

        { t: 'sub', text: 'Patterns, Performance & Comparisons' },
        { t: 'cards', cols: 2, items: [
          {
            title: 'Q: What are the three cache failure patterns?',
            body: `<strong>Cache Miss (cold start)</strong>: key not in cache → DB hit. Expected; the cache warms up over time.<br><br>
<strong>Cache Stampede (thundering herd)</strong>: a popular key expires → hundreds of requests simultaneously hit the DB. Fix: mutex lock on first miss, probabilistic early re-computation, or sliding TTL.<br><br>
<strong>Cache Penetration</strong>: requests for keys that will NEVER exist in DB (e.g., invalid IDs) bypass cache every time. Fix: cache negative results (<code>SET key "null" EX 60</code>) or use a Bloom filter at the gateway to reject known-nonexistent keys.<br><br>
<strong>Cache Avalanche</strong>: many keys expire simultaneously (e.g. after a cache flush) → DB overwhelmed. Fix: jitter the TTLs (<code>base_ttl + random(0, 60)</code>) so expiries are spread out.`
          },
          {
            title: 'Q: What are Redis Transactions (MULTI/EXEC)?',
            body: `Redis transactions queue commands with <code>MULTI</code> and execute them atomically with <code>EXEC</code>. No other client's commands interleave during execution.<br><br>
<strong>Important nuance:</strong> Redis transactions are <em>not</em> rollback-capable. If a queued command has a runtime error (e.g. wrong type), the other commands still execute. Only syntax errors (checked at queue time) abort the whole transaction.<br><br>
<strong>WATCH for optimistic locking:</strong> <code>WATCH key</code> before <code>MULTI</code> — if the watched key changes before <code>EXEC</code>, the transaction is aborted (returns nil). Your code retries. This is Redis's CAS-style pattern.`
          },
          {
            title: 'Q: What is Redis Pipelining and when do you use it?',
            body: `Normally, each command incurs a full network round-trip (send → server processes → response). Pipelining sends multiple commands in one TCP write and reads all responses in one batch — dramatically cutting latency for bulk operations.<br><br>
<strong>Example:</strong> setting 1000 keys with individual calls = 1000 round-trips (~200ms on LAN). With a pipeline = 1 round-trip (~0.2ms).<br><br>
<strong>Use when:</strong> bulk inserts on startup, batch cache warming, periodic metric flushes. Most Redis client libraries support it natively. Note: pipelining is not atomic — use MULTI/EXEC if you need atomicity.`
          },
          {
            title: 'Q: What is the difference between Redis and Memcached?',
            body: `<strong>Memcached</strong>: pure, dead-simple key-value cache. Strings only. No persistence, no replication, no pub/sub. Extremely fast for raw cache hits, multi-threaded.<br><br>
<strong>Redis</strong>: rich data structures (5+ types), optional persistence (RDB/AOF), replication, Sentinel/Cluster HA, pub/sub, Streams, Lua scripting, transactions.<br><br>
<strong>Choose Memcached when:</strong> you only need simple string caching, need multi-threaded scaling on a single node, and want the absolute simplest ops story.<br><br>
<strong>Choose Redis when:</strong> you need any advanced feature — sorted sets for leaderboards, persistence so the cache survives a restart, Streams for reliable queues, or Cluster for sharding.`
          },
          {
            title: 'Q: What causes Redis memory issues and how do you fix them?',
            body: `<strong>Common causes:</strong><br>
• Keys without TTL accumulating indefinitely<br>
• Storing large blobs (images, full HTML) — should be in object storage<br>
• Wrong data structure (storing objects as JSON strings instead of Hashes)<br>
• Memory fragmentation over time<br><br>
<strong>Fixes:</strong><br>
• Always set TTLs on cache keys<br>
• Check <code>INFO memory</code>, use <code>MEMORY USAGE key</code> to find big keys<br>
• Run <code>MEMORY DOCTOR</code> for recommendations<br>
• Use <code>redis-cli --bigkeys</code> to find top memory consumers<br>
• Set <code>maxmemory</code> + an eviction policy so Redis self-manages under pressure`
          },
          {
            title: 'Q: What are Redis Streams and how do they compare to Pub/Sub?',
            body: `<strong>Pub/Sub</strong>: fire-and-forget. Subscribers only receive messages published <em>after</em> they subscribe — no history, no persistence. If no subscriber is online, the message is gone.<br><br>
<strong>Streams</strong>: an append-only, persistent log with consumer groups (like Kafka inside Redis). Messages have unique auto-generated IDs (timestamp-sequence). Consumers acknowledge messages (<code>XACK</code>); unacknowledged messages are redelivered. Multiple consumer groups read independently.<br><br>
<strong>Use Pub/Sub for:</strong> ephemeral real-time notifications (live chat typing indicators, price ticks).<br><br>
<strong>Use Streams for:</strong> reliable async task queues, event sourcing, any use case where you can't afford to lose a message.`
          },
        ] },

        { t: 'callout', kind: 'key', html: `<strong>All 8 phases complete.</strong> From in-memory data structures to distributed Cluster, persistence, and the interview Q&A that ties it all together. The three cache killers, eviction policies, RDB vs AOF, replication vs cluster — you've got them all.` },
      ],
    },
  ],
};
