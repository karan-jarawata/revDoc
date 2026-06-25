/* ============================================================
   All learning content as structured blocks.
   Block types are rendered by app.js. Code is stored raw and
   auto-escaped on render, so < > & in Java need no escaping here.
   ============================================================ */
window.CONTENT = {
  hero: {
    eyebrow: 'The Complete Guide',
    title: 'Java Multithreading',
    sub: 'From the hardware and OS up to virtual threads in Java 21+. Ten levels of concurrency — every concept explained with diagrams, runnable code, and the production gotchas that actually bite. Built for deep learning and fast revision.',
    stats: [
      { num: '10', label: 'Levels' },
      { num: '40+', label: 'Concepts' },
      { num: '50+', label: 'Code samples' },
      { num: 'Java 21', label: 'Up to date' },
    ],
  },

  levels: [
    /* ========================================================
       LEVEL 1
       ======================================================== */
    {
      id: 'level-1', num: '01', accent: 'purple', part: 'Foundations',
      eyebrow: 'Level 1 · The Ground Floor',
      title: 'Hardware & OS Foundation',
      intro: 'Before a single line of concurrent Java, you need a mental model of how the OS and JVM manage execution and memory. Almost every concurrency bug is really a memory bug — so we start here.',
      blocks: [
        { t: 'sub', text: 'Processes vs. Threads' },
        { t: 'prose', html: `A <strong>process</strong> is an independent execution environment — launching the JVM, opening a browser. It owns an isolated memory space and is "heavy" to start and stop. A <strong>thread</strong> is the smallest unit the OS scheduler runs. Threads live <em>inside</em> a process and crucially <strong>share that process's memory</strong>, which makes them lightweight — and dangerous.` },
        { t: 'diagram', name: 'processVsThread', cap: 'Threads share their process heap; each gets its own private stack' },
        { t: 'table', head: ['', 'Process', 'Thread'],
          rows: [
            ['Memory', 'Isolated, private', 'Shares process heap'],
            ['Weight', 'Heavy', 'Lightweight'],
            ['Crash blast radius', 'Contained', 'Can corrupt siblings'],
            ['Communication', 'IPC (slow)', 'Shared memory (fast, risky)'],
          ] },

        { t: 'sub', text: 'The Memory Model — root of all concurrency issues' },
        { t: 'prose', html: `The JVM splits memory into two regions that behave very differently under concurrency.` },
        { t: 'list', items: [
          `<strong>The Heap (shared):</strong> all objects and instance variables live here. Because every thread shares the heap, this is your <strong>danger zone</strong> — two threads touching the same object without coordination is where bugs are born.`,
          `<strong>The Stack (private):</strong> every thread gets its own stack at creation. Local variables and method call frames live here. Since no other thread can reach another's stack, <strong>local variables are inherently thread-safe</strong> — which is exactly why stateless methods are so valuable.`,
        ] },
        { t: 'diagram', name: 'heapStack', cap: 'Shared heap needs synchronization; private stacks never do' },

        { t: 'sub', text: 'Creating a thread — three ways' },
        { t: 'code', title: 'ThreadCreation.java', code:
`// 1. Implement Runnable (preferred — composition over inheritance)
Runnable task = () -> System.out.println("Hi from " + Thread.currentThread().getName());
Thread t1 = new Thread(task);
t1.start();          // start() spawns a new thread; run() would NOT

// 2. Extend Thread (rarely used — couples you to the Thread class)
class Worker extends Thread {
    public void run() { System.out.println("working..."); }
}
new Worker().start();

// 3. Submit to an executor (what you actually use in production — Level 8)
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(task);` },
        { t: 'callout', kind: 'danger', html: `Calling <code>run()</code> directly runs the code on the <strong>current</strong> thread — no new thread is created. Always call <code>start()</code>.` },

        { t: 'sub', text: 'The Thread Lifecycle' },
        { t: 'prose', html: `A Java thread (<code>Thread.State</code>) is always in exactly one of six states:` },
        { t: 'diagram', name: 'threadLifecycle', cap: 'The six thread states and the transitions between them' },
        { t: 'table', head: ['State', 'Meaning'],
          rows: [
            ['NEW', 'Thread object created, <code>start()</code> not yet called'],
            ['RUNNABLE', 'Eligible to run / running in the JVM (includes waiting for CPU)'],
            ['BLOCKED', 'Waiting to acquire a monitor lock for a <code>synchronized</code> block'],
            ['WAITING', 'Waiting indefinitely for another thread — <code>wait()</code>, <code>join()</code>'],
            ['TIMED_WAITING', 'Waiting with a timeout — <code>sleep(t)</code>, <code>wait(t)</code>'],
            ['TERMINATED', '<code>run()</code> finished or threw. Dead — cannot restart'],
          ] },
        { t: 'callout', kind: 'key', html: `<strong>Big idea:</strong> a thread cannot be restarted. Once TERMINATED it's gone — which is why we pool and reuse threads instead of constantly creating new ones (Level 8).` },
      ],
    },

    /* ========================================================
       LEVEL 2
       ======================================================== */
    {
      id: 'level-2', num: '02', accent: 'rose', part: 'Foundations',
      eyebrow: 'Level 2 · When Threads Collide',
      title: 'The Dangers',
      intro: 'When multiple threads hit the same heap objects at once, four classic hazards appear. Knowing their exact signatures is half the battle — the fixes come in the next levels.',
      blocks: [
        { t: 'sub', text: 'Race Condition — silent data corruption' },
        { t: 'prose', html: `A race happens when threads interleave operations unpredictably. The textbook case is <code>count++</code>, which looks atomic but is actually <strong>three</strong> steps: read, add, write.` },
        { t: 'diagram', name: 'raceCondition', cap: 'Two increments, but the value only rises by one — a lost update' },
        { t: 'code', title: 'LostUpdate.java', code:
`class Counter {
    private int count = 0;
    public void increment() { count++; }   // read, +1, write — NOT atomic
    public int get() { return count; }
}

// 1000 threads each increment once -> you expect 1000
Counter c = new Counter();
ExecutorService pool = Executors.newFixedThreadPool(50);
for (int i = 0; i < 1000; i++) pool.submit(c::increment);
pool.shutdown();
pool.awaitTermination(1, TimeUnit.SECONDS);
System.out.println(c.get());   // prints e.g. 987 — updates were lost` },
        { t: 'callout', kind: 'danger', html: `If <code>count = 5</code> and two threads read simultaneously, both see 5, both write 6. Two increments happened, but the counter rose by one. <strong>Data is permanently lost.</strong>` },

        { t: 'sub', text: 'Deadlock — the fatal freeze' },
        { t: 'prose', html: `Two or more threads wait on each other <em>forever</em>. Thread A holds Lock 1 and needs Lock 2; Thread B holds Lock 2 and needs Lock 1. Neither lets go. The app hangs and only a restart clears it.` },
        { t: 'diagram', name: 'deadlock', cap: 'Circular wait: the defining condition of a deadlock' },
        { t: 'code', title: 'Deadlock.java', code:
`// Thread 1
synchronized (lockA) {
    synchronized (lockB) { /* work */ }   // waits for lockB
}
// Thread 2  (locks acquired in the OPPOSITE order)
synchronized (lockB) {
    synchronized (lockA) { /* work */ }   // waits for lockA  -> DEADLOCK
}` },
        { t: 'callout', kind: 'tip', html: `<strong>Prevention:</strong> always acquire locks in a <strong>consistent global order</strong> (e.g. sort by object id). If every thread grabs <code>lockA</code> before <code>lockB</code>, the cycle can never form. Or use <code>tryLock</code> with a timeout (Level 5).` },

        { t: 'sub', text: 'Livelock — the infinite dance' },
        { t: 'prose', html: `Threads are <strong>not</strong> frozen — they're actively running but making zero progress, endlessly reacting to each other.` },
        { t: 'analogy', html: `<b>Two people in a hallway</b> both step right to dodge, then both step left, then right again — forever in sync. CPU pegged at 100%, nothing accomplished.` },

        { t: 'sub', text: 'Starvation — the unfair queue' },
        { t: 'prose', html: `A thread is neither dead-locked nor live-locked — it's just perpetually ignored. A low-priority logger keeps getting pushed to the back of the line while high-priority request threads hog the CPU. It "starves." The fix is <strong>fairness policies</strong> (Level 5).` },

        { t: 'table', head: ['Hazard', 'Threads moving?', 'Progress?', 'Typical fix'],
          rows: [
            ['Race condition', '<span class="yes">Yes</span>', '<span class="mid">Wrong result</span>', 'synchronized / atomics'],
            ['Deadlock', '<span class="no">No (frozen)</span>', '<span class="no">None</span>', 'Lock ordering / tryLock'],
            ['Livelock', '<span class="yes">Yes (spinning)</span>', '<span class="no">None</span>', 'Backoff / randomized retry'],
            ['Starvation', '<span class="yes">Yes (others)</span>', '<span class="no">None for victim</span>', 'Fair locks / priorities'],
          ] },
      ],
    },

    /* ========================================================
       LEVEL 3
       ======================================================== */
    {
      id: 'level-3', num: '03', accent: 'teal', part: 'Synchronization & Memory',
      eyebrow: 'Level 3 · The Bouncer & The Pager',
      title: 'Basic Synchronization',
      intro: 'The classic toolkit: the synchronized keyword to keep threads from colliding, wait/notify to let them coordinate, interrupt for graceful shutdown, and immutability — the ultimate cheat code.',
      blocks: [
        { t: 'sub', text: 'The synchronized keyword' },
        { t: 'prose', html: `Every Java object has a hidden built-in lock (its <strong>intrinsic lock</strong> or <strong>monitor</strong>). <code>synchronized</code> tells a thread to grab that lock. If Thread A holds it, Thread B waits outside in the <strong>BLOCKED</strong> state until A releases.` },
        { t: 'diagram', name: 'monitor', cap: 'One thread inside the monitor; the rest are BLOCKED at the door' },
        { t: 'code', title: 'Synchronized.java', code:
`class BankAccount {
    private int balance = 0;
    private final Object lock = new Object();

    // Method level — locks the WHOLE instance ('this')
    public synchronized void deposit(int x) { balance += x; }

    // Block level — lock only the lines that matter (better throughput)
    public void depositBlock(int x) {
        doExpensiveValidation(x);          // runs concurrently, unlocked
        synchronized (lock) { balance += x; }  // only this is serialized
    }
}` },
        { t: 'callout', kind: 'tip', html: `Prefer <strong>block-level</strong> locking on a private final lock object. Less code under the lock = more parallelism. Locking a smaller region is one of the cheapest performance wins in concurrent code.` },

        { t: 'sub', text: 'wait() and notify() — coordination' },
        { t: 'prose', html: `Locks stop collisions; <code>wait()</code>/<code>notify()</code> let threads <em>coordinate</em>. The rule: <strong>you must hold the lock to call them.</strong> <code>wait()</code> releases the lock and parks the thread; <code>notify()</code> wakes one waiter, <code>notifyAll()</code> wakes them all.` },
        { t: 'diagram', name: 'waitNotify', cap: 'Consumer waits and releases the lock; producer notifies when data is ready' },
        { t: 'code', title: 'WaitNotify.java', code:
`synchronized (lock) {
    // ALWAYS wait in a while loop, never an if — guards against
    // spurious wakeups and stale conditions (the data may already
    // be gone by the time you re-acquire the lock).
    while (!dataReady) {
        lock.wait();           // releases lock, sleeps, re-acquires on wake
    }
    consume();
}

// Producer side
synchronized (lock) {
    dataReady = true;
    lock.notifyAll();          // wake waiters to re-check the condition
}` },
        { t: 'callout', kind: 'warning', html: `<strong>Spurious wakeups are real:</strong> a thread can wake from <code>wait()</code> with no <code>notify()</code> at all. That's why the condition check must be a <code>while</code> loop, not an <code>if</code>.` },

        { t: 'sub', text: 'Graceful shutdown — interrupt(), not kill' },
        { t: 'prose', html: `You cannot safely "kill" a thread mid-work — if it's halfway through a DB write, you corrupt data. That's why <code>Thread.stop()</code> is deprecated. Instead you <strong>request</strong> a stop with <code>interrupt()</code>, which sets a flag. A blocked thread (in <code>sleep</code>/<code>wait</code>) is jolted awake with an <code>InterruptedException</code>.` },
        { t: 'code', title: 'GracefulShutdown.java', code:
`public void run() {
    try {
        while (!Thread.currentThread().isInterrupted()) {
            doChunkOfWork();
            Thread.sleep(100);     // throws InterruptedException if interrupted
        }
    } catch (InterruptedException e) {
        // Best practice: restore the flag, then clean up & exit
        Thread.currentThread().interrupt();
    } finally {
        closeConnections();        // leave the world consistent
    }
}` },
        { t: 'callout', kind: 'danger', html: `Never swallow <code>InterruptedException</code> with an empty <code>catch</code>. Either propagate it or re-assert the flag via <code>Thread.currentThread().interrupt()</code> — otherwise the shutdown signal is silently lost.` },

        { t: 'sub', text: 'Immutability — the ultimate cheat code' },
        { t: 'prose', html: `A race <em>requires</em> mutable shared state. Remove the mutability and the race is impossible. An <strong>immutable</strong> object has no setters and all-<code>final</code> fields — once built, its state can never change, so a million threads can read it with zero locks.` },
        { t: 'code', title: 'Immutable.java', code:
`public final class Point {          // final class — no subclass can add mutability
    private final int x, y;         // final fields — set once
    public Point(int x, int y) { this.x = x; this.y = y; }
    public int x() { return x; }
    public int y() { return y; }
    // No setters. Want a change? Return a NEW object:
    public Point withX(int nx) { return new Point(nx, y); }
}` },
        { t: 'callout', kind: 'key', html: `<code>String</code>, <code>Integer</code>, <code>LocalDate</code> and records are immutable — share them freely across threads, no synchronization needed. <strong>Immutability is the most powerful thread-safety tool there is.</strong>` },
      ],
    },

    /* ========================================================
       LEVEL 4
       ======================================================== */
    {
      id: 'level-4', num: '04', accent: 'blue', part: 'Synchronization & Memory',
      eyebrow: 'Level 4 · Down to the Hardware',
      title: 'Memory Visibility & volatile',
      intro: 'Now we look at the CPU itself. This is where the sneaky, production-only bugs hide — code that works on your laptop and mysteriously hangs on the server.',
      blocks: [
        { t: 'sub', text: 'The visibility problem — CPU caches vs RAM' },
        { t: 'prose', html: `RAM is slow, so each CPU core has its own fast caches (L1/L2/L3). When a thread reads a variable it often copies it into its core's cache. If Thread A updates a shared field, the write may sit in <strong>A's local cache only</strong>. Thread B on another core reads <strong>its own</strong> cache and never sees the update.` },
        { t: 'diagram', name: 'cacheVisibility', cap: 'Each core trusts its own cache — Thread B never sees Thread A\'s write' },
        { t: 'code', title: 'StuckForever.java', code:
`class Worker {
    private boolean stop = false;      // NOT volatile — bug!

    public void run() {
        while (!stop) { /* busy work */ }   // may loop FOREVER:
        // the JIT can cache 'stop' in a register and never re-read it
        System.out.println("stopped");
    }
    public void requestStop() { stop = true; }  // B sets it, A never sees it
}` },

        { t: 'sub', text: 'The volatile keyword' },
        { t: 'prose', html: `Marking a field <code>volatile</code> is a direct order to the CPU: <strong>every write goes straight to main memory, every read comes straight from main memory.</strong> It also establishes a <strong>happens-before</strong> relationship and blocks instruction reordering across the access, so state transitions occur in the order you wrote them.` },
        { t: 'code', title: 'VolatileFlag.java', code:
`class Worker {
    private volatile boolean stop = false;   // now writes/reads hit RAM

    public void run() {
        while (!stop) { /* busy work */ }     // sees requestStop() immediately
        System.out.println("stopped");
    }
    public void requestStop() { stop = true; }
}` },
        { t: 'callout', kind: 'warning', html: `<strong>volatile fixes visibility, NOT atomicity.</strong> It's perfect for a <code>boolean</code> flag, but useless for <code>count++</code> — that's still read-modify-write and still races. For atomic counters you need Level 7.` },
        { t: 'sub', text: 'volatile vs synchronized vs atomic' },
        { t: 'table', head: ['Tool', 'Visibility', 'Atomicity', 'Blocks?', 'Use for'],
          rows: [
            ['volatile', '<span class="yes">Yes</span>', '<span class="no">No</span>', '<span class="yes">No</span>', 'flags, single writer'],
            ['synchronized', '<span class="yes">Yes</span>', '<span class="yes">Yes</span>', '<span class="no">Yes</span>', 'compound state, multi-step invariants'],
            ['Atomic*', '<span class="yes">Yes</span>', '<span class="yes">Yes</span>', '<span class="yes">No (CAS)</span>', 'counters, lock-free updates'],
          ] },

        { t: 'sub', text: 'ThreadLocal — total isolation' },
        { t: 'prose', html: `If <code>volatile</code> makes data visible to everyone, <code>ThreadLocal</code> is the opposite: it gives <strong>each thread its own private copy</strong>. Even a globally-declared <code>ThreadLocal</code> returns a different value per thread. Frameworks like Spring use it to bind security contexts, transactions, and trace IDs to the running thread without passing them through every method.` },
        { t: 'diagram', name: 'threadLocal', cap: 'One variable, an isolated value per thread' },
        { t: 'code', title: 'ThreadLocalDemo.java', code:
`private static final ThreadLocal<SimpleDateFormat> FORMAT =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));

// SimpleDateFormat is NOT thread-safe — but each thread gets its own:
String today = FORMAT.get().format(new Date());

// In a thread pool you MUST clean up or you leak / cross-contaminate:
try {
    FORMAT.get().format(new Date());
} finally {
    FORMAT.remove();      // critical in pooled threads (see warning)
}` },
        { t: 'callout', kind: 'danger', html: `<strong>ThreadLocal + thread pools = leaks.</strong> Pool threads live forever and are reused across requests. If you don't call <code>remove()</code>, the value lingers and the next request on that thread sees stale data. Always clean up in a <code>finally</code>.` },
      ],
    },

    /* ========================================================
       LEVEL 5
       ======================================================== */
    {
      id: 'level-5', num: '05', accent: 'amber', part: 'Locks & Coordination',
      eyebrow: 'Level 5 · Beyond synchronized',
      title: 'Advanced Locking',
      intro: 'The java.util.concurrent.locks package gives you everything synchronized does, plus timeouts, fairness, interruptibility, and separate read/write locks. Explicit control at the cost of explicit discipline.',
      blocks: [
        { t: 'sub', text: 'ReentrantLock — the smart lock' },
        { t: 'prose', html: `The modern replacement for <code>synchronized</code>. "Reentrant" means a thread already holding the lock can re-acquire it without deadlocking itself. You call <code>lock()</code> and <code>unlock()</code> manually — and <code>unlock()</code> <strong>must</strong> live in a <code>finally</code> block, or an exception will leave the lock held forever.` },
        { t: 'code', title: 'ReentrantLockDemo.java', code:
`private final ReentrantLock lock = new ReentrantLock();

public void transfer() {
    lock.lock();
    try {
        // ... critical section ...
    } finally {
        lock.unlock();      // ALWAYS in finally — non-negotiable
    }
}

// tryLock: the deadlock killer — bail out instead of waiting forever
public boolean tryTransfer() throws InterruptedException {
    if (lock.tryLock(5, TimeUnit.SECONDS)) {
        try { /* work */ } finally { lock.unlock(); }
        return true;
    }
    return false;           // couldn't get it in 5s — do something else
}` },
        { t: 'callout', kind: 'tip', html: `<code>tryLock(timeout)</code> is the headline feature: "I'll wait 5 seconds, then give up." It turns a potential deadlock into a recoverable failure.` },
        { t: 'prose', html: `<strong>Fairness:</strong> by default locks are <em>unfair</em> (any waiter may win, which maximizes throughput). Pass <code>new ReentrantLock(true)</code> for a fair lock that hands the lock to the longest-waiting thread — preventing starvation at some throughput cost.` },

        { t: 'sub', text: 'ReadWriteLock — the performance booster' },
        { t: 'prose', html: `Imagine a config map read 10,000×/second but written once a day. A plain lock serializes every read — a massive bottleneck. <code>ReadWriteLock</code> keeps two locks: many threads may hold the <strong>read lock</strong> at once, but the <strong>write lock</strong> is exclusive and waits for all readers to finish.` },
        { t: 'diagram', name: 'readWriteLock', cap: 'Unlimited concurrent readers, or one exclusive writer' },
        { t: 'code', title: 'ReadWriteLockDemo.java', code:
`private final ReadWriteLock rw = new ReentrantReadWriteLock();
private final Map<String,String> cache = new HashMap<>();

public String get(String k) {
    rw.readLock().lock();              // many readers run in parallel
    try { return cache.get(k); }
    finally { rw.readLock().unlock(); }
}

public void put(String k, String v) {
    rw.writeLock().lock();             // exclusive — blocks all readers
    try { cache.put(k, v); }
    finally { rw.writeLock().unlock(); }
}` },
        { t: 'callout', kind: 'note', html: `Only a win for <strong>read-heavy</strong> workloads. If writes are frequent, the constant exclusivity makes it no better — sometimes worse — than a plain lock.` },

        { t: 'sub', text: 'StampedLock — optimistic reads (Java 8+)' },
        { t: 'prose', html: `An evolution that adds <strong>optimistic reading</strong>: grab a cheap stamp, read without locking at all, then validate. If a writer interfered, fall back to a real read lock. For very read-heavy data this beats <code>ReadWriteLock</code> — but it is <em>not</em> reentrant, so use it carefully.` },
        { t: 'code', title: 'StampedLockDemo.java', code:
`private final StampedLock sl = new StampedLock();
private double x, y;

double distanceFromOrigin() {
    long stamp = sl.tryOptimisticRead();   // no lock — just a stamp
    double cx = x, cy = y;
    if (!sl.validate(stamp)) {             // a writer interfered?
        stamp = sl.readLock();             // fall back to a real read lock
        try { cx = x; cy = y; }
        finally { sl.unlockRead(stamp); }
    }
    return Math.sqrt(cx*cx + cy*cy);
}` },
        { t: 'table', head: ['Lock', 'Reentrant', 'Read/Write split', 'tryLock', 'Best for'],
          rows: [
            ['synchronized', '<span class="yes">Yes</span>', '<span class="no">No</span>', '<span class="no">No</span>', 'Simple, low contention'],
            ['ReentrantLock', '<span class="yes">Yes</span>', '<span class="no">No</span>', '<span class="yes">Yes</span>', 'Need timeout / fairness'],
            ['ReentrantReadWriteLock', '<span class="yes">Yes</span>', '<span class="yes">Yes</span>', '<span class="yes">Yes</span>', 'Read-heavy maps'],
            ['StampedLock', '<span class="no">No</span>', '<span class="yes">Yes</span>', '<span class="yes">Yes</span>', 'Extreme read-heavy'],
          ] },
      ],
    },

    /* ========================================================
       LEVEL 6
       ======================================================== */
    {
      id: 'level-6', num: '06', accent: 'green', part: 'Locks & Coordination',
      eyebrow: 'Level 6 · Traffic Cops',
      title: 'Synchronizers',
      intro: 'Locks protect individual data. Synchronizers orchestrate whole fleets of threads — coordinating them by counts, groups, or available permits. These are the high-level traffic controllers of concurrency.',
      blocks: [
        { t: 'diagram', name: 'synchronizers', cap: 'The three workhorses: a one-shot gate, a reusable rally point, and a permit throttle' },

        { t: 'sub', text: 'CountDownLatch — the one-way gate' },
        { t: 'prose', html: `Initialise with a count. The main thread calls <code>await()</code> and freezes; workers call <code>countDown()</code>. The instant the count hits zero the gate snaps open. <strong>Single-use</strong> — it cannot be reset. Think rocket-launch countdown.` },
        { t: 'code', title: 'CountDownLatch.java', code:
`CountDownLatch ready = new CountDownLatch(3);   // wait for 3 services

for (String svc : List.of("db", "cache", "queue")) {
    pool.submit(() -> {
        initialize(svc);
        ready.countDown();          // each worker signals "I'm up"
    });
}

ready.await();                      // main thread blocks until all 3 done
System.out.println("All services up — accepting traffic");` },

        { t: 'sub', text: 'CyclicBarrier — the multi-phase rally point' },
        { t: 'prose', html: `Initialise with N "parties". Each thread runs independently, then calls <code>await()</code> and freezes until <strong>all</strong> N arrive. The moment the last one arrives, an optional barrier action runs and all are released together. <strong>Cyclic</strong> — it resets for the next round.` },
        { t: 'code', title: 'CyclicBarrier.java', code:
`CyclicBarrier barrier = new CyclicBarrier(4,
    () -> System.out.println("All 4 ready — starting next phase"));

Runnable player = () -> {
    prepare();
    try { barrier.await(); }        // wait for the other 3
    catch (Exception e) { /* handle */ }
    playMatch();                    // everyone starts together
};` },
        { t: 'callout', kind: 'note', html: `<strong>Latch vs Barrier:</strong> a latch waits for <em>events</em> (any threads can count down, one waiter); a barrier waits for <em>each other</em> (the same N threads rendezvous) and is reusable.` },

        { t: 'sub', text: 'Semaphore — the resource throttle' },
        { t: 'prose', html: `Holds a fixed set of permits. <code>acquire()</code> takes one (or blocks if none left); <code>release()</code> returns one. It controls <strong>how many</strong> threads may enter a section at once — concurrency limiting, not exclusive locking.` },
        { t: 'code', title: 'Semaphore.java', code:
`// Allow at most 5 concurrent calls to a fragile third-party API
Semaphore gate = new Semaphore(5);

public Response call() throws InterruptedException {
    gate.acquire();                 // blocks if 5 are already in flight
    try { return externalApi.send(); }
    finally { gate.release(); }     // always release, even on error
}` },
        { t: 'callout', kind: 'tip', html: `A <code>Semaphore(1)</code> behaves like a lock — but unlike a lock, a permit can be released by a <em>different</em> thread than the one that acquired it. Handy for signalling.` },

        { t: 'sub', text: 'Also worth knowing' },
        { t: 'list', items: [
          `<strong>Phaser</strong> — like a CyclicBarrier but parties can dynamically register/deregister across multiple phases. The flexible modern choice.`,
          `<strong>Exchanger</strong> — a rendezvous point where two threads swap objects with each other. Useful for pipeline hand-offs.`,
        ] },
      ],
    },

    /* ========================================================
       LEVEL 7
       ======================================================== */
    {
      id: 'level-7', num: '07', accent: 'cyan', part: 'Lock-Free & Executors',
      eyebrow: 'Level 7 · No Locks at All',
      title: 'Lock-Free Programming & Atomics',
      intro: 'The java.util.concurrent.atomic package achieves thread safety with no locks at all — using optimistic concurrency and a single magic CPU instruction. Faster, and immune to deadlock.',
      blocks: [
        { t: 'sub', text: 'CAS — Compare-And-Swap' },
        { t: 'prose', html: `CAS is not a Java feature — it's a <strong>native CPU instruction</strong>. Instead of locking, a thread says: "set this to 6, but <em>only if</em> it's still 5. If someone changed it, fail and tell me." On failure the thread just re-reads and retries in a tight <strong>spin loop</strong> — it never sleeps, so it's blazingly fast.` },
        { t: 'diagram', name: 'casLoop', cap: 'Read → compute → compare-and-swap → retry on failure. No locks, no blocking' },

        { t: 'sub', text: 'The Atomic classes' },
        { t: 'prose', html: `Java wraps CAS in <code>AtomicInteger</code>, <code>AtomicLong</code>, <code>AtomicBoolean</code>, <code>AtomicReference</code>. For a thread-safe counter, never wrap <code>count++</code> in <code>synchronized</code> — use an atomic and call <code>incrementAndGet()</code>. Lock-free, fully thread-safe, much faster.` },
        { t: 'code', title: 'AtomicCounter.java', code:
`AtomicInteger count = new AtomicInteger(0);

count.incrementAndGet();        // atomic ++count, returns new value
count.getAndAdd(5);             // atomic += 5, returns old value
count.compareAndSet(10, 0);     // if it's 10, set to 0 (the raw CAS)

// AtomicReference for objects — lock-free updates of immutable state:
AtomicReference<Config> cfg = new AtomicReference<>(initial);
cfg.updateAndGet(old -> old.withFlag(true));   // CAS-loops the lambda` },

        { t: 'sub', text: 'The ABA problem' },
        { t: 'prose', html: `CAS only checks the <em>value</em>, not its history. If the value goes A → B → A between your read and your swap, CAS happily succeeds even though things changed underneath you.` },
        { t: 'callout', kind: 'warning', html: `Fix with <code>AtomicStampedReference</code>, which pairs the value with a version stamp — so A-with-stamp-1 and A-with-stamp-3 are distinguishable. Matters most for lock-free stacks and queues.` },

        { t: 'sub', text: 'LongAdder — high-contention counting' },
        { t: 'prose', html: `Atomics have one weakness: under <em>extreme</em> contention, if 100 threads hammer <code>incrementAndGet()</code> at once, 99 fail their CAS and spin furiously, burning CPU. <code>LongAdder</code> (Java 8) fixes this by keeping an internal <strong>array of cells</strong> and spreading threads across them — so they rarely collide. <code>sum()</code> adds the cells when you finally need the total.` },
        { t: 'diagram', name: 'longAdder', cap: 'One hot cell (contention) vs many cells (LongAdder spreads the load)' },
        { t: 'code', title: 'LongAdder.java', code:
`LongAdder requests = new LongAdder();

// hot path — called millions of times/sec across many threads
requests.increment();           // updates some internal cell, ~zero contention

// cold path — read the total occasionally
long total = requests.sum();    // adds all cells together` },
        { t: 'table', head: ['Counter', 'Contention', 'Read cost', 'Use when'],
          rows: [
            ['AtomicLong', '<span class="mid">Spins under load</span>', '<span class="yes">Exact, cheap</span>', 'Low-to-moderate traffic'],
            ['LongAdder', '<span class="yes">Near zero</span>', '<span class="mid">sum() walks cells</span>', 'Massive write throughput (metrics)'],
          ] },
        { t: 'callout', kind: 'key', html: `<strong>Rule of thumb:</strong> <code>AtomicLong</code> when you read often and write moderately; <code>LongAdder</code> for write-heavy metrics like "requests per second" where you rarely read the total.` },
      ],
    },

    /* ========================================================
       LEVEL 8
       ======================================================== */
    {
      id: 'level-8', num: '08', accent: 'orange', part: 'Lock-Free & Executors',
      eyebrow: 'Level 8 · Don\'t Manage Threads',
      title: 'Executors & Thread Pools',
      intro: 'Stop creating threads by hand. A thread pool is a fixed team of reusable workers — you hand it tasks and it figures out who runs what. This is how real production code does concurrency.',
      blocks: [
        { t: 'sub', text: 'ExecutorService — the manager' },
        { t: 'prose', html: `Create a pool of N threads that stay alive; submit tasks and they queue up. Submit 100 tasks to a 50-thread pool and the first 50 run immediately while task #51 waits in the queue for a worker to free up. No thread-per-task explosion.` },
        { t: 'diagram', name: 'threadPool', cap: 'Tasks queue up; a fixed set of reused threads drain the queue into results' },
        { t: 'code', title: 'ExecutorBasics.java', code:
`ExecutorService pool = Executors.newFixedThreadPool(4);

Future<Integer> f = pool.submit(() -> heavyCompute());   // returns a Future
pool.submit(() -> log("fire and forget"));               // Runnable

pool.shutdown();                                  // no new tasks; finish queued
if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
    pool.shutdownNow();                           // interrupt stragglers
}` },
        { t: 'callout', kind: 'danger', html: `<strong>NEVER do <code>new Thread().start()</code> in a loop.</strong> You'll exhaust memory and the OS. Always go through an executor — it bounds resource use and reuses threads.` },
        { t: 'table', head: ['Factory', 'Threads', 'Use for'],
          rows: [
            ['newFixedThreadPool(n)', 'Exactly n', 'Steady, bounded CPU work'],
            ['newCachedThreadPool()', 'Grows/shrinks', 'Many short-lived I/O tasks'],
            ['newSingleThreadExecutor()', '1', 'Serial task ordering'],
            ['newScheduledThreadPool(n)', 'n', 'Delayed / periodic tasks'],
            ['newVirtualThreadPerTaskExecutor()', 'Unbounded (virtual)', 'Java 21 — massive I/O concurrency'],
          ] },

        { t: 'sub', text: 'Under the hood — ThreadPoolExecutor' },
        { t: 'prose', html: `The factory methods build a <code>ThreadPoolExecutor</code>. For production you often configure it directly to control the queue and rejection behaviour. The key knobs:` },
        { t: 'list', items: [
          `<strong>corePoolSize</strong> — threads kept alive even when idle.`,
          `<strong>maximumPoolSize</strong> — the ceiling when the queue fills up.`,
          `<strong>workQueue</strong> — where tasks wait. Bounded (<code>ArrayBlockingQueue</code>) gives backpressure; unbounded (<code>LinkedBlockingQueue</code>) can OOM you.`,
          `<strong>keepAliveTime</strong> — how long extra (above core) idle threads survive.`,
          `<strong>RejectedExecutionHandler</strong> — what happens when queue + pool are both full.`,
        ] },
        { t: 'code', title: 'TunedPool.java', code:
`ThreadPoolExecutor pool = new ThreadPoolExecutor(
    8,                              // core
    16,                             // max
    60, TimeUnit.SECONDS,           // keep-alive for the extra 8
    new ArrayBlockingQueue<>(1000), // BOUNDED queue -> backpressure
    new ThreadPoolExecutor.CallerRunsPolicy()  // overflow: run on caller
);` },
        { t: 'table', head: ['Rejection policy', 'Behaviour'],
          rows: [
            ['AbortPolicy <em>(default)</em>', 'Throws RejectedExecutionException'],
            ['CallerRunsPolicy', 'Runs the task on the submitting thread (natural backpressure)'],
            ['DiscardPolicy', 'Silently drops the task'],
            ['DiscardOldestPolicy', 'Drops the oldest queued task, retries'],
          ] },

        { t: 'sub', text: 'Runnable vs Callable, and Future' },
        { t: 'prose', html: `<code>Runnable</code> has <code>void run()</code> — no result, no checked exceptions. <code>Callable&lt;T&gt;</code> has <code>T call() throws Exception</code> — returns a value and can throw. Submitting a <code>Callable</code> hands you a <strong>Future</strong>: a claim ticket you redeem later with <code>get()</code> (which blocks until the result is ready).` },
        { t: 'table', head: ['', 'Runnable', 'Callable<T>'],
          rows: [
            ['Returns a value', '<span class="no">No (void)</span>', '<span class="yes">Yes (T)</span>'],
            ['Throws checked exceptions', '<span class="no">No</span>', '<span class="yes">Yes</span>'],
            ['Method', 'run()', 'call()'],
          ] },
        { t: 'code', title: 'Futures.java', code:
`Future<Integer> f = pool.submit(() -> {
    Thread.sleep(1000);
    return 42;
});

doOtherWork();                     // run while the task computes
Integer result = f.get();          // BLOCKS here until ready
Integer safe = f.get(2, TimeUnit.SECONDS);  // ...or bail after 2s` },
        { t: 'callout', kind: 'warning', html: `<code>future.get()</code> blocks the calling thread. Chaining many <code>get()</code> calls re-serializes your work — that pain is exactly what <code>CompletableFuture</code> (Level 10) solves.` },

        { t: 'sub', text: 'ForkJoinPool — the work stealer' },
        { t: 'prose', html: `A specialised pool for divide-and-conquer (Java 7). Its trick is <strong>work-stealing</strong>: when a worker empties its own queue, it steals tasks from the bottom of a busy worker's queue, keeping every core pegged at 100%. It's the engine behind <code>parallelStream()</code>.` },
        { t: 'diagram', name: 'forkJoin', cap: 'An idle worker steals tasks from a busy one — no core sits idle' },
        { t: 'code', title: 'ForkJoin.java', code:
`// The common pool powers parallel streams:
long sum = list.parallelStream()
               .mapToLong(this::expensive)
               .sum();

// Or a custom RecursiveTask for true divide-and-conquer:
class SumTask extends RecursiveTask<Long> {
    // split into subtasks, fork() them, join() the results
}` },
      ],
    },

    /* ========================================================
       LEVEL 9
       ======================================================== */
    {
      id: 'level-9', num: '09', accent: 'pink', part: 'Collections & Modern Java',
      eyebrow: 'Level 9 · Thread-Safe Data',
      title: 'Concurrent Collections',
      intro: 'Hand-rolling synchronization around a HashMap is slow and error-prone. The java.util.concurrent collections are purpose-built for high-throughput concurrent access — use them.',
      blocks: [
        { t: 'sub', text: 'ConcurrentHashMap — king of collections' },
        { t: 'prose', html: `Old options like <code>Hashtable</code> and <code>Collections.synchronizedMap()</code> lock the <strong>entire</strong> map — Thread A updating "User1" blocks Thread B from even reading "User2". <code>ConcurrentHashMap</code> uses <strong>lock striping / node locking</strong>: it locks only the specific bucket being written, so independent keys update fully in parallel.` },
        { t: 'diagram', name: 'concurrentMap', cap: 'Per-bucket locks let independent keys be updated simultaneously' },
        { t: 'code', title: 'ConcurrentHashMap.java', code:
`ConcurrentHashMap<String,Integer> map = new ConcurrentHashMap<>();

// Atomic compound ops — no external locking needed:
map.putIfAbsent("a", 1);
map.compute("a", (k, v) -> v == null ? 1 : v + 1);   // atomic upsert
map.merge("a", 1, Integer::sum);                      // atomic counter
map.computeIfAbsent("cache", k -> loadExpensively(k));` },
        { t: 'callout', kind: 'note', html: `Use the atomic methods (<code>merge</code>, <code>compute</code>, <code>computeIfAbsent</code>). A naive <code>if (!map.containsKey(k)) map.put(...)</code> is two operations and still races.` },

        { t: 'sub', text: 'CopyOnWriteArrayList — the reader\'s paradise' },
        { t: 'prose', html: `Picture a list of server IPs read 100,000×/min by health checks but written once a week. On every write, this class copies the whole array, mutates the copy, then swaps the reference. <strong>Reads are 100% lock-free</strong> and never see a half-finished update.` },
        { t: 'code', title: 'CopyOnWrite.java', code:
`// Perfect for event-listener lists: tons of reads, rare writes
CopyOnWriteArrayList<Listener> listeners = new CopyOnWriteArrayList<>();

listeners.add(newListener);        // expensive: clones the array
for (Listener l : listeners) {     // cheap: lock-free iteration, no CME
    l.onEvent(e);
}` },
        { t: 'callout', kind: 'warning', html: `The copy-on-every-write makes it <strong>terrible for write-heavy</strong> lists. Reserve it for read-dominated data like listener registries and config snapshots.` },

        { t: 'sub', text: 'BlockingQueue — the producer-consumer lifeline' },
        { t: 'prose', html: `The clean modern replacement for the <code>wait()</code>/<code>notify()</code> dance. A bounded queue where <strong>producers</strong> <code>put()</code> and <strong>consumers</strong> <code>take()</code>. If it's full, <code>put()</code> blocks until space frees up; if it's empty, <code>take()</code> blocks until data arrives. Backpressure for free.` },
        { t: 'diagram', name: 'producerConsumer', cap: 'put() blocks when full, take() blocks when empty — automatic flow control' },
        { t: 'code', title: 'BlockingQueue.java', code:
`BlockingQueue<Task> queue = new ArrayBlockingQueue<>(10);

// Producer
queue.put(task);        // blocks if the queue is full (10 items)

// Consumer (on another thread)
Task t = queue.take();  // blocks if the queue is empty
process(t);` },
        { t: 'table', head: ['Collection', 'Replaces', 'Sweet spot'],
          rows: [
            ['ConcurrentHashMap', 'Hashtable / synchronizedMap', 'General concurrent key-value'],
            ['CopyOnWriteArrayList', 'synchronizedList', 'Read-mostly lists (listeners)'],
            ['ArrayBlockingQueue', 'wait/notify queues', 'Bounded producer-consumer'],
            ['ConcurrentLinkedQueue', 'synchronized LinkedList', 'Lock-free unbounded queue'],
          ] },
      ],
    },

    /* ========================================================
       LEVEL 10
       ======================================================== */
    {
      id: 'level-10', num: '10', accent: 'indigo', part: 'Collections & Modern Java',
      eyebrow: 'Level 10 · The Modern Era',
      title: 'CompletableFuture, Virtual Threads & Beyond',
      intro: 'The frontier: async pipelines, the biggest JVM change in a decade (Project Loom), structured concurrency, and the framework trap that catches everyone. This is Java 21+ concurrency.',
      blocks: [
        { t: 'sub', text: 'CompletableFuture — async pipelines' },
        { t: 'prose', html: `Instead of blocking on <code>Future.get()</code>, you <strong>chain callbacks</strong>. As soon as one stage finishes, the framework fires the next — the thread never sits idle waiting.` },
        { t: 'diagram', name: 'completableFuture', cap: 'A non-blocking chain: each stage runs when its predecessor completes' },
        { t: 'code', title: 'CompletableFuture.java', code:
`CompletableFuture
    .supplyAsync(() -> fetchUser(id))          // run async
    .thenApply(user -> user.getOrders())       // transform result
    .thenCompose(orders -> fetchDetailsAsync(orders))  // chain another future
    .thenAccept(details -> sendEmail(details)) // consume, no return
    .exceptionally(ex -> { log(ex); return null; });   // handle any failure

// Combine independent futures:
CompletableFuture<String> a = CompletableFuture.supplyAsync(() -> callA());
CompletableFuture<String> b = CompletableFuture.supplyAsync(() -> callB());
a.thenCombine(b, (ra, rb) -> ra + rb);          // run A & B in parallel, merge
CompletableFuture.allOf(a, b).join();           // wait for both` },
        { t: 'table', head: ['Method', 'Does'],
          rows: [
            ['thenApply', 'Transform the result (sync function)'],
            ['thenCompose', 'Chain another future (flatMap — avoids nesting)'],
            ['thenCombine', 'Merge two independent futures'],
            ['allOf / anyOf', 'Wait for all / first of many'],
            ['exceptionally / handle', 'Recover from failures in the chain'],
          ] },

        { t: 'sub', text: 'Virtual Threads — Project Loom (Java 21)' },
        { t: 'prose', html: `The biggest Java change in a decade. Traditional <strong>platform threads</strong> wrap heavy OS threads — a server tops out around a few thousand, and blocking them wastes precious OS resources. <strong>Virtual threads</strong> are ultra-light, JVM-managed threads; you can launch <em>millions</em>. When one blocks (I/O, sleep), the JVM <strong>unmounts</strong> it from its carrier OS thread, which goes off to do other work, then <strong>remounts</strong> it when the I/O completes.` },
        { t: 'diagram', name: 'virtualThreads', cap: 'Millions of cheap virtual threads multiplexed onto a few OS carrier threads' },
        { t: 'code', title: 'VirtualThreads.java', code:
`// One virtual thread per task — scales to millions:
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 1_000_000; i++) {
        executor.submit(() -> {
            var data = blockingHttpCall();   // blocks the VIRTUAL thread only
            return process(data);            // OS thread stays free meanwhile
        });
    }
}   // simple, readable, BLOCKING code that scales like async` },
        { t: 'callout', kind: 'key', html: `<strong>The payoff:</strong> you write plain, sequential, blocking code — and it scales like hand-written async. No callback hell, no reactive operators.` },
        { t: 'callout', kind: 'warning', html: `<strong>Pinning:</strong> if a virtual thread blocks <em>inside</em> a <code>synchronized</code> block (or a native call), it can't unmount and stays pinned to its carrier — killing the benefit. Prefer <code>ReentrantLock</code> over <code>synchronized</code> in hot paths under Loom.` },

        { t: 'sub', text: 'Structured Concurrency' },
        { t: 'prose', html: `Introduced alongside virtual threads to kill <strong>orphan threads</strong>. Fire 3 async fetches; if the order fetch fails instantly, the user and payment fetches keep running and waste resources. Structured concurrency treats a group of related threads as one unit of work — if one fails, the rest are cancelled automatically.` },
        { t: 'code', title: 'StructuredConcurrency.java', code:
`try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var user    = scope.fork(() -> fetchUser(id));
    var order   = scope.fork(() -> fetchOrder(id));
    var payment = scope.fork(() -> fetchPayment(id));

    scope.join();              // wait for all
    scope.throwIfFailed();     // if ANY failed, others are cancelled

    return new Dashboard(user.get(), order.get(), payment.get());
}   // no leaked threads — the scope guarantees cleanup` },

        { t: 'sub', text: 'Context Propagation — the framework trap' },
        { t: 'prose', html: `In Spring you lean on <code>ThreadLocal</code> for the security context (JWT), the transaction, and MDC trace IDs. The trap: when you hand work to an <code>@Async</code> method, a <code>CompletableFuture</code>, or a new virtual thread, it runs on a <strong>different thread</strong> with an <strong>empty</strong> ThreadLocal context. Suddenly your user is "unauthenticated."` },
        { t: 'callout', kind: 'danger', html: `The fix is explicit <strong>context propagation</strong>. Libraries like <code>micrometer-context-propagation</code> capture the parent's ThreadLocals and inject them into the child thread before it runs — so security and logging survive the thread hop.` },
        { t: 'callout', kind: 'key', html: `<strong>You made it.</strong> From CPU caches to virtual threads — that's the full arc of Java concurrency. Re-read the levels you're shaky on; the diagrams and code are here to drill in.` },
      ],
    },
  ],
};
