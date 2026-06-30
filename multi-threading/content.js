/* ============================================================
   All learning content as structured blocks.
   Block types are rendered by app.js. Code is stored raw and
   auto-escaped on render, so < > & in Java need no escaping here.
   ============================================================ */
window.CONTENT = {
  hero: {
    eyebrow: 'The Complete Guide',
    title: 'Java Multithreading',
    sub: 'From the hardware and OS up to virtual threads in Java 21+. Ten levels of concurrency — every concept explained with diagrams, runnable code, plain-English jargon busters, and the production gotchas that actually bite.',
    stats: [
      { num: '11', label: 'Levels' },
      { num: '50+', label: 'Concepts' },
      { num: '60+', label: 'Code samples' },
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
        { t: 'prose', html: '<span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.4;font-family:system-ui,sans-serif">Key Terms</span>' },
        { t: 'table', head: ['Term', 'Plain English'],
          rows: [
            ['<strong>Process</strong>', 'A running program. When you launch IntelliJ or Chrome, each is a process. It has its own memory bubble — completely isolated from everything else.'],
            ['<strong>Thread</strong>', 'A line of execution INSIDE a process. Like multiple workers sharing the same office (process). They share the desks (heap) but each has their own notepad (stack).'],
            ['<strong>JVM</strong>', 'Java Virtual Machine — the engine that runs your .class files. One JVM = one process.'],
            ['<strong>Heap</strong>', 'Shared memory. Where all your objects live. If two threads touch the same object here without rules, bugs happen.'],
            ['<strong>Stack</strong>', 'Private memory. Each thread gets its own. Holds local variables and method calls. Nobody else can touch your stack.'],
            ['<strong>Context Switch</strong>', 'The OS pausing one thread and resuming another. Like switching windows on your desktop — fast but not free. Too many threads = too many switches = wasted time.'],
            ['<strong>Scheduler</strong>', 'The OS component that decides which thread runs on which CPU core and for how long.'],
            ['<strong>Daemon Thread</strong>', 'A background service thread (e.g., garbage collector). JVM exits when only daemon threads remain. Non-daemon threads keep the JVM alive.'],
          ] },

        { t: 'sub', text: 'Processes vs. Threads' },
        { t: 'prose', html: `A <strong>process</strong> is an independent execution environment — launching the JVM, opening a browser. It owns an isolated memory space and is "heavy" to start and stop. A <strong>thread</strong> is the smallest unit the OS scheduler runs. Threads live <em>inside</em> a process and crucially <strong>share that process's memory</strong>, which makes them lightweight — and dangerous.` },
        { t: 'diagram', name: 'processVsThread', cap: 'Threads share their process heap; each gets its own private stack' },
        { t: 'table', head: ['', 'Process', 'Thread'],
          rows: [
            ['Memory', 'Isolated, private', 'Shares process heap'],
            ['Weight', 'Heavy (MB each)', 'Lightweight (KB each)'],
            ['Crash blast radius', 'Contained to itself', 'Can corrupt sibling threads'],
            ['Communication', 'IPC — pipes, sockets (slow)', 'Shared memory (fast, but risky)'],
            ['Real example', 'Starting Chrome, IntelliJ', 'Separate tab rendering, HTTP handler'],
          ] },

        { t: 'sub', text: 'The Memory Model — root of all concurrency issues' },
        { t: 'prose', html: `The JVM splits memory into two regions that behave very differently under concurrency.` },
        { t: 'list', items: [
          `<strong>The Heap (shared):</strong> all objects and instance variables live here. Because every thread shares the heap, this is your <strong>danger zone</strong> — two threads touching the same object here without coordination is where bugs are born.`,
          `<strong>The Stack (private):</strong> every thread gets its own stack at creation. Local variables and method call frames live here. Since no other thread can reach another's stack, <strong>local variables are inherently thread-safe</strong> — which is exactly why stateless methods are so valuable.`,
        ] },
        { t: 'diagram', name: 'heapStack', cap: 'Shared heap needs synchronization; private stacks never do' },
        { t: 'analogy', html: `<b>Real world:</b> A restaurant kitchen is the heap (shared, coordination needed). Each chef's mental task list is their stack (private, no coordination needed). Chefs fight over the same chopping board (shared data) — they never fight over their own memories.` },

        { t: 'sub', text: 'Creating a thread — three ways' },
        { t: 'prose', html: `Java gives you three ways to spin up a thread. They all eventually call <code>start()</code>, but they differ in flexibility and how production-ready they are.` },
        { t: 'code', title: 'ThreadCreation.java', code:
`// 1. Implement Runnable (preferred — composition over inheritance)
//    Why: keeps your class free to extend something else
Runnable task = () -> System.out.println("Hi from " + Thread.currentThread().getName());
Thread t1 = new Thread(task);
t1.setName("my-worker");   // always name your threads — helps in thread dumps
t1.start();          // start() spawns a new OS thread and calls run() on it
// t1.run();         // WRONG — this would run on THE CURRENT thread, no new thread

// 2. Extend Thread (avoid in production — you're burning inheritance for nothing)
class Worker extends Thread {
    public void run() { System.out.println("working..."); }
}
new Worker().start();

// 3. Submit to an executor (what real code uses — covered in Level 8)
//    The pool reuses threads instead of creating/destroying them constantly
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(task);` },
        { t: 'callout', kind: 'danger', html: `Calling <code>run()</code> directly runs the code on the <strong>current</strong> thread — no new thread is created. Always call <code>start()</code>.` },
        { t: 'callout', kind: 'tip', html: `<strong>Where to use each:</strong> <code>Runnable</code> lambda for quick one-off tasks. Extend <code>Thread</code> only in toy examples. Use Executors (Level 8) for everything production.` },

        { t: 'sub', text: 'Daemon vs. Non-Daemon threads' },
        { t: 'prose', html: `By default every thread you create is <strong>non-daemon</strong> — the JVM will not exit while one is still running. A <strong>daemon</strong> thread is marked as a background servant: the JVM happily exits once only daemon threads remain, even if they're mid-loop. Use daemon threads for housekeeping work that should never block shutdown.` },
        { t: 'code', title: 'DaemonDemo.java', code:
`Thread logger = new Thread(() -> {
    while (true) {
        System.out.println("logging...");
        Thread.sleep(1000);
    }
});
logger.setDaemon(true);    // mark as daemon BEFORE start()
logger.start();

// JVM will exit even while logger is "running" — it's a background servant
// Use daemon for: GC, housekeeping, monitoring
// Use non-daemon (default) for: user-visible work you must complete` },

        { t: 'sub', text: 'The Thread Lifecycle' },
        { t: 'prose', html: `A Java thread (<code>Thread.State</code>) is always in exactly one of six states:` },
        { t: 'diagram', name: 'threadLifecycle', cap: 'The six thread states and the transitions between them' },
        { t: 'table', head: ['State', 'Meaning', 'Real trigger'],
          rows: [
            ['NEW', 'Thread object created, <code>start()</code> not yet called', '<code>new Thread(task)</code>'],
            ['RUNNABLE', 'Eligible to run / currently running on a CPU', '<code>t.start()</code>'],
            ['BLOCKED', 'Waiting to enter a <code>synchronized</code> block another thread holds', 'Trying to enter locked code'],
            ['WAITING', 'Waiting indefinitely for a signal', '<code>wait()</code>, <code>join()</code>'],
            ['TIMED_WAITING', 'Waiting with a timeout', '<code>sleep(t)</code>, <code>wait(t)</code>'],
            ['TERMINATED', '<code>run()</code> finished or threw uncaught exception', 'Normal exit or crash'],
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
        { t: 'prose', html: '<span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.4;font-family:system-ui,sans-serif">Key Terms</span>' },
        { t: 'table', head: ['Term', 'Plain English'],
          rows: [
            ['<strong>Atomic</strong>', 'An operation that completes in one indivisible step — no thread can see it "half done." <code>i = 5</code> is atomic for ints. <code>i++</code> is NOT — it\'s three steps.'],
            ['<strong>Critical Section</strong>', 'The piece of code that touches shared data. This is the zone that needs protection.'],
            ['<strong>Interleave</strong>', 'The OS can pause Thread A mid-instruction and run Thread B. Their operations become mixed ("interleaved"). This is where races happen.'],
            ['<strong>Lost Update</strong>', 'A write by one thread is overwritten by another thread that didn\'t see it. Classic race outcome.'],
            ['<strong>Monitor</strong>', 'Every Java object secretly has a built-in lock called its "monitor." <code>synchronized</code> uses this lock.'],
          ] },

        { t: 'sub', text: 'Race Condition — silent data corruption' },
        { t: 'prose', html: `A race happens when threads interleave operations unpredictably. The textbook case is <code>count++</code>, which <em>looks</em> atomic but is actually <strong>three</strong> steps: read, add, write.` },
        { t: 'diagram', name: 'raceCondition', cap: 'Two increments, but the value only rises by one — a lost update' },
        { t: 'code', title: 'BankBalance.java — Real-World Race', code:
`// Think of a bank account shared between two ATM machines
class BankAccount {
    private int balance = 1000;

    // This looks safe but IS NOT. Three hidden steps:
    // Step 1: read balance (1000) into CPU register
    // Step 2: add 100
    // Step 3: write 1100 back to memory
    public void deposit(int amount) { balance += amount; }  // BUG

    public int getBalance() { return balance; }
}

// Simulate two ATMs depositing at the same time:
BankAccount account = new BankAccount();
ExecutorService atms = Executors.newFixedThreadPool(2);
for (int i = 0; i < 200; i++) {
    atms.submit(() -> account.deposit(100));   // 200 deposits of 100
}
atms.shutdown();
atms.awaitTermination(2, TimeUnit.SECONDS);
// Expected: 1000 + (200 × 100) = 21000
// Actual:   somewhere between 11000 and 21000 — money is LOST` },
        { t: 'callout', kind: 'danger', html: `If <code>balance = 5000</code> and two ATMs read simultaneously, both see 5000, both add 100, both write 5100. Two deposits happened but only one registered. <strong>Money vanished. Race conditions in financial systems are catastrophic.</strong>` },
        { t: 'callout', kind: 'note', html: `<strong>WHERE this appears in real life:</strong> any shared counter, shared collection, session state, inventory systems, booking systems. Basically everywhere shared mutable data lives.` },

        { t: 'sub', text: 'Deadlock — the fatal freeze' },
        { t: 'prose', html: `Two or more threads wait on each other <em>forever</em>. Thread A holds Lock 1 and needs Lock 2; Thread B holds Lock 2 and needs Lock 1. Neither lets go. The app hangs and only a restart clears it.` },
        { t: 'diagram', name: 'deadlock', cap: 'Circular wait: the defining condition of a deadlock' },
        { t: 'code', title: 'BankTransfer.java — Classic Deadlock', code:
`// Classic deadlock: transferring money between two accounts
class Account {
    private final int id;
    private int balance;
    public Account(int id, int bal) { this.id = id; this.balance = bal; }
}

void transfer(Account from, Account to, int amount) {
    synchronized (from) {              // Thread 1 locks accountA
        synchronized (to) {            // Thread 1 waits for accountB...
            from.balance -= amount;    // (never gets here)
            to.balance   += amount;
        }
    }
}

// Thread 1: transfer(accountA, accountB, 100)  → locks A, waits for B
// Thread 2: transfer(accountB, accountA, 50)   → locks B, waits for A
// DEADLOCK — both freeze forever` },
        { t: 'callout', kind: 'tip', html: `<strong>Prevention rule:</strong> always acquire locks in a <strong>consistent global order</strong>. Sort by account ID before locking: <code>synchronized(id1 &lt; id2 ? acc1 : acc2)</code>. If every thread grabs locks in the same order, the circular wait can never form.` },
        { t: 'callout', kind: 'note', html: `<strong>WHERE deadlocks hide:</strong> database row locks (Transaction A locks Row 1 then Row 2; Transaction B does the reverse), ORM lazy loading inside synchronized blocks, nested <code>synchronized</code> on collections.` },

        { t: 'sub', text: 'Livelock — the infinite dance' },
        { t: 'prose', html: `Threads are <strong>not</strong> frozen — they're actively running but making zero progress, endlessly reacting to each other.` },
        { t: 'analogy', html: `<b>Two people in a hallway</b> both step right to dodge, then both step left, then right again — forever in sync. CPU pegged at 100%, nothing accomplished. Classic in badly written retry logic.` },
        { t: 'code', title: 'Livelock.java', code:
`// Badly written retry: both threads keep "being polite" and backing off
// simultaneously, so they never actually proceed
while (!lock1.tryLock()) {
    if (lock2.isHeld()) {
        lock1.release();       // be polite, step back
        Thread.sleep(10);      // wait...
        // But Thread B does the EXACT same thing at the EXACT same time
    }
}
// Result: both keep releasing and retrying in sync, forever
// Fix: add randomized backoff — Thread.sleep(random.nextInt(50))` },

        { t: 'sub', text: 'Starvation — the unfair queue' },
        { t: 'prose', html: `A thread is neither dead-locked nor live-locked — it's just perpetually ignored. A low-priority background thread keeps getting pushed to the back of the line while high-priority threads hog the CPU. It "starves." The fix is <strong>fairness policies</strong> (Level 5).` },
        { t: 'analogy', html: `<b>A checkout line</b> where VIP customers always cut in front. The regular customer at the back waits indefinitely — they're not stuck (the line IS moving), they just never reach the front.` },

        { t: 'table', head: ['Hazard', 'Threads moving?', 'Progress?', 'Real example', 'Fix'],
          rows: [
            ['Race condition', 'Yes', 'Wrong result', 'Bank balance corruption', 'synchronized / atomics'],
            ['Deadlock', 'No (frozen)', 'None', 'DB row lock cycle', 'Lock ordering / tryLock'],
            ['Livelock', 'Yes (spinning)', 'None', 'Retry logic that retries in sync', 'Randomized backoff'],
            ['Starvation', 'Others yes', 'None for victim', 'Low-priority log thread', 'Fair locks / priorities'],
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
      intro: 'The classic toolkit: synchronized to stop collisions, wait/notify to coordinate, interrupt for graceful shutdown, and immutability — the ultimate cheat code.',
      blocks: [
        { t: 'prose', html: '<span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.4;font-family:system-ui,sans-serif">Key Terms</span>' },
        { t: 'table', head: ['Term', 'Plain English'],
          rows: [
            ['<strong>Monitor</strong>', 'The built-in lock every Java object secretly carries. Like a single key to one room — only one thread holds it at a time.'],
            ['<strong>Intrinsic Lock</strong>', 'Same as monitor. Just another name for the built-in object lock that <code>synchronized</code> uses.'],
            ['<strong>Reentrant</strong>', 'A thread that ALREADY holds a lock can re-enter (grab) that same lock again without blocking itself. Java\'s <code>synchronized</code> is always reentrant. Without this, a synchronized method calling another synchronized method on the same object would deadlock itself.'],
            ['<strong>Spurious Wakeup</strong>', 'A thread waking from <code>wait()</code> with NO notify() having been called. It just woke up randomly. The OS is allowed to do this. That\'s why you ALWAYS check the condition in a while loop after wait().'],
            ['<strong>Critical Section</strong>', 'The block of code that must run atomically — only one thread at a time. What you wrap in synchronized.'],
            ['<strong>Immutable</strong>', 'An object whose state can NEVER change after creation. No setters, all final fields. Completely thread-safe with zero locks.'],
          ] },

        { t: 'sub', text: 'Reentrant — the deep explanation' },
        { t: 'prose', html: `This is one of the most confusing terms. Let's break it down with a concrete example.` },
        { t: 'code', title: 'Reentrant.java — WHY it matters', code:
`class BankAccount {
    private int balance = 1000;

    // This method is synchronized — it holds the lock on 'this'
    public synchronized void deposit(int amount) {
        balance += amount;
        logTransaction(amount);   // calls another synchronized method!
    }

    // This is also synchronized on 'this'
    public synchronized void logTransaction(int amount) {
        System.out.println("Deposited: " + amount + ", Balance: " + balance);
    }
}

// What happens when deposit() calls logTransaction()?
// Thread 1 holds the lock on the BankAccount (to run deposit())
// Then tries to grab the SAME lock (to run logTransaction())
//
// WITHOUT reentrancy: Thread 1 would wait for itself -> instant deadlock
// WITH reentrancy (Java's behavior): the JVM tracks "Thread 1 already
// holds this lock" and lets it re-enter. Lock count goes from 1 -> 2.
// When logTransaction() exits, count goes 2 -> 1.
// When deposit() exits, count goes 1 -> 0 -> lock released.
//
// Reentrant = a thread can re-enter its own locks freely. Java does this
// for ALL synchronized blocks. ReentrantLock explicitly names this feature.` },

        { t: 'sub', text: 'The synchronized keyword' },
        { t: 'prose', html: `Every Java object has a hidden built-in lock (its <strong>monitor</strong>). <code>synchronized</code> tells a thread to grab that lock. If Thread A holds it, Thread B waits outside in the <strong>BLOCKED</strong> state until A releases.` },
        { t: 'diagram', name: 'monitor', cap: 'One thread inside the monitor; the rest are BLOCKED at the door' },
        { t: 'code', title: 'BankAccount.java — Fixed with synchronized', code:
`class BankAccount {
    private int balance = 0;
    private final Object lock = new Object();   // separate lock object (best practice)

    // Option A: synchronize the whole method
    // Locks 'this' — simple but you might lock more than needed
    public synchronized void depositA(int x) {
        balance += x;
    }

    // Option B: synchronized block — PREFERRED for performance
    // Only the critical section is locked; expensive validation runs concurrently
    public void depositB(int x) {
        validate(x);                            // runs on any thread, no lock needed
        synchronized (lock) {
            balance += x;                       // only THIS is serialized
        }
        sendReceipt(x);                         // also runs concurrently, fine
    }

    // Option C: static synchronized — locks the CLASS, not an instance
    // Affects ALL instances — use sparingly
    public static synchronized void globalAudit() { /* ... */ }
}` },
        { t: 'callout', kind: 'tip', html: `<strong>Rule:</strong> always lock on a <code>private final Object</code> field, not on <code>this</code>. Locking <code>this</code> exposes your lock to outside code that could accidentally synchronized on your object and cause deadlocks.` },
        { t: 'callout', kind: 'warning', html: `<strong>Where NOT to use synchronized:</strong> around I/O operations or long-running tasks. The longer you hold a lock, the longer other threads wait. Do the I/O outside, only lock the tiny data update.` },

        { t: 'sub', text: 'wait() and notify() — coordination' },
        { t: 'prose', html: `Locks stop collisions; <code>wait()</code>/<code>notify()</code> let threads <em>coordinate turns</em>. The rule: <strong>you must hold the lock to call them.</strong> <code>wait()</code> releases the lock and parks the thread; <code>notify()</code> wakes one waiter, <code>notifyAll()</code> wakes them all.` },
        { t: 'diagram', name: 'waitNotify', cap: 'Consumer waits and releases the lock; producer notifies when data is ready' },
        { t: 'code', title: 'PrinterQueue.java — Producer-Consumer with wait/notify', code:
`// Classic producer-consumer: a printer job queue
class PrintQueue {
    private final List<String> jobs = new ArrayList<>();
    private final Object lock = new Object();

    // Producer: adds a print job
    public void addJob(String doc) {
        synchronized (lock) {
            jobs.add(doc);
            lock.notifyAll();     // wake up any waiting printer thread
        }
    }

    // Consumer: printer waits for a job
    public String takeJob() throws InterruptedException {
        synchronized (lock) {
            // ALWAYS while loop — never if
            // Why? Spurious wakeups can happen. Another thread may have
            // taken the job between notify() and this thread re-acquiring
            // the lock. The while re-checks to be sure.
            while (jobs.isEmpty()) {
                lock.wait();      // releases lock, sleeps until notified
            }
            return jobs.remove(0);
        }
    }
}` },
        { t: 'callout', kind: 'warning', html: `<strong>Spurious wakeups are real:</strong> a thread can wake from <code>wait()</code> with no <code>notify()</code> at all. The OS is allowed to do this. That's why the condition check must be a <code>while</code> loop, not an <code>if</code>.` },

        { t: 'sub', text: 'Graceful shutdown — interrupt(), not kill' },
        { t: 'prose', html: `You cannot safely "kill" a thread mid-work — if it's halfway through a DB write, you corrupt data. That's why <code>Thread.stop()</code> is deprecated. Instead you <strong>request</strong> a stop with <code>interrupt()</code>, which sets a flag. A blocked thread (in sleep/wait) is jolted awake with an <code>InterruptedException</code>.` },
        { t: 'code', title: 'BackgroundWorker.java — Graceful Shutdown', code:
`public class BackgroundWorker implements Runnable {
    public void run() {
        try {
            while (!Thread.currentThread().isInterrupted()) {
                processNextBatch();
                Thread.sleep(200);     // InterruptedException thrown here if interrupted
            }
        } catch (InterruptedException e) {
            // 1. Re-set the interrupt flag (it gets cleared when the exception fires)
            Thread.currentThread().interrupt();
            // 2. Now exit cleanly
        } finally {
            cleanupResources();        // ALWAYS runs — leave the world consistent
            System.out.println("Worker shut down cleanly.");
        }
    }
}

// Caller:
Thread worker = new Thread(new BackgroundWorker());
worker.start();
// ... later, to shut down:
worker.interrupt();
worker.join();    // wait for it to actually finish cleanup` },
        { t: 'callout', kind: 'danger', html: `<strong>Never swallow InterruptedException silently.</strong><br><code>catch (InterruptedException e) { }</code> loses the shutdown signal — the thread keeps running forever and the application hangs on exit. Always either re-throw it or call <code>Thread.currentThread().interrupt()</code>.` },

        { t: 'sub', text: 'Immutability — the ultimate cheat code' },
        { t: 'prose', html: `A race <em>requires</em> mutable shared state. Remove the mutability and the race is impossible. An <strong>immutable</strong> object has no setters and all-<code>final</code> fields — once built, its state can never change, so a million threads can read it with zero locks.` },
        { t: 'code', title: 'Money.java — Immutable Value Object', code:
`// Use case: representing a monetary amount (currency + value) shared across threads
public final class Money {            // final class — no subclass can break immutability
    private final long cents;         // final fields — set exactly once in constructor
    private final String currency;

    public Money(long cents, String currency) {
        this.cents    = cents;
        this.currency = Objects.requireNonNull(currency);
    }

    public long cents()    { return cents; }
    public String currency() { return currency; }

    // Mutations return NEW objects — the original never changes:
    public Money add(Money other) {
        if (!currency.equals(other.currency)) throw new IllegalArgumentException();
        return new Money(this.cents + other.cents, currency);
    }
    public Money subtract(Money other) {
        return new Money(this.cents - other.cents, currency);
    }
}

// Now you can share Money across 1000 threads with ZERO synchronization:
Money price = new Money(999, "USD");   // immutable — safe everywhere` },
        { t: 'callout', kind: 'key', html: `<code>String</code>, <code>Integer</code>, <code>LocalDate</code>, <code>BigDecimal</code> and Java Records are all immutable. <strong>Immutability is the most powerful thread-safety tool</strong> — it eliminates the problem instead of managing it.` },
        { t: 'callout', kind: 'note', html: `<strong>Where immutability doesn\'t work:</strong> when you genuinely need to track changing state (a shopping cart, a game score, a connection). There you need synchronization. But the less shared mutable state you have, the fewer bugs.` },
      ],
    },

    /* ========================================================
       LEVEL 4
       ======================================================== */
    {
      id: 'level-4', num: '04', accent: 'blue', part: 'Synchronization & Memory',
      eyebrow: 'Level 4 · Down to the Hardware',
      title: 'Memory Visibility & volatile',
      intro: 'Now we look at the CPU itself. This is where the sneaky, production-only bugs hide — code that works fine on your dev machine and mysteriously loops forever on the server.',
      blocks: [
        { t: 'prose', html: '<span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.4;font-family:system-ui,sans-serif">Key Terms</span>' },
        { t: 'table', head: ['Term', 'Plain English'],
          rows: [
            ['<strong>CPU Cache (L1/L2/L3)</strong>', 'A tiny, fast memory right on the CPU chip. Way faster than RAM. Each core has its own private cache. Problem: if Thread A updates a variable in Core 1\'s cache, Core 2 still sees the old value in its own cache.'],
            ['<strong>Visibility Problem</strong>', 'When one thread writes a value but another thread can\'t "see" the new value because it\'s stuck in a CPU cache. The variable looks different to different threads.'],
            ['<strong>volatile</strong>', 'A Java keyword that forces reads/writes to go directly to main RAM — bypassing CPU caches. Guarantees every thread sees the same up-to-date value.'],
            ['<strong>Happens-Before</strong>', 'A Java Memory Model guarantee: "if action A happens-before action B, everything A wrote is visible to B." volatile writes happen-before subsequent volatile reads of the same variable.'],
            ['<strong>Instruction Reordering</strong>', 'The CPU and JIT compiler can reorder your instructions for speed — as long as the program behaves correctly on a single thread. Under multithreading, this reordering can cause chaos. volatile prevents this.'],
            ['<strong>JIT</strong>', 'Just-In-Time compiler — the part of the JVM that converts bytecode to fast native machine code at runtime. It can aggressively optimize, including caching variables in registers (which breaks visibility).'],
            ['<strong>ThreadLocal</strong>', 'A special variable that has a SEPARATE VALUE PER THREAD. Thread 1 and Thread 2 both have their own "copy" of the variable. Zero sharing, zero synchronization needed.'],
          ] },

        { t: 'sub', text: 'The visibility problem — CPU caches vs RAM' },
        { t: 'prose', html: `RAM is slow, so each CPU core has its own fast caches (L1/L2/L3). When a thread reads a variable it copies it into its core's cache. If Thread A updates a shared field, the write may sit in <strong>A's local cache only</strong>. Thread B on another core reads <strong>its own</strong> cache and never sees the update. Your program has two different "realities."` },
        { t: 'diagram', name: 'cacheVisibility', cap: 'Each core trusts its own cache — Thread B never sees Thread A\'s write' },
        { t: 'code', title: 'InfiniteLoop.java — The Visibility Bug', code:
`class Worker implements Runnable {
    private boolean stop = false;    // NOT volatile — catastrophic bug

    public void run() {
        // The JIT may optimize this to: while (true) { busyWork(); }
        // because it "knows" (incorrectly) that stop never changes from
        // THIS thread's perspective. It caches 'stop' in a register.
        while (!stop) {
            busyWork();
        }
        System.out.println("Stopped");   // may NEVER print
    }

    public void requestStop() {
        stop = true;   // Thread B writes to its cache, Thread A never sees it
    }
}

// This can run FOREVER on a multi-core machine even though requestStop()
// was called. Works fine on single-core (no caches to disagree).
// This is the most insidious class of Java bug — impossible to reproduce
// in development, appears in production under load.` },

        { t: 'sub', text: 'The volatile keyword' },
        { t: 'prose', html: `Marking a field <code>volatile</code> is a direct order to the CPU: <strong>every write goes straight to main memory, every read comes straight from main memory.</strong> It also establishes a <strong>happens-before</strong> relationship and blocks instruction reordering.` },
        { t: 'code', title: 'ShutdownFlag.java — volatile fix', code:
`class Worker implements Runnable {
    private volatile boolean stop = false;   // magic fix: bypasses CPU cache

    public void run() {
        while (!stop) {     // reads from RAM every iteration — sees the update
            busyWork();
        }
        System.out.println("Stopped cleanly");   // always prints when requestStop() called
    }

    public void requestStop() {
        stop = true;   // writes to RAM immediately — all threads see it at once
    }
}

// Real-world usage of volatile:
// - Shutdown flags (exactly this)
// - Status flags (service.isRunning(), isInitialized())
// - Singleton pattern "initialized" flag in double-checked locking` },
        { t: 'callout', kind: 'warning', html: `<strong>volatile fixes visibility, NOT atomicity.</strong> It's perfect for a <code>boolean</code> flag with one writer. It is USELESS for <code>count++</code> — that's still read-modify-write and still races. For atomic counters use Level 7.` },

        { t: 'sub', text: 'volatile vs synchronized — choosing between them' },
        { t: 'table', head: ['Tool', 'Visibility', 'Atomicity', 'Blocks threads?', 'Use for'],
          rows: [
            ['<code>volatile</code>', 'Yes', 'No', 'No — zero contention', 'Boolean flags, status fields with one writer'],
            ['<code>synchronized</code>', 'Yes', 'Yes', 'Yes — BLOCKED state', 'Compound operations, multi-step invariants'],
            ['<code>Atomic*</code>', 'Yes', 'Yes (CAS)', 'No — spin only', 'Counters, single-variable lock-free updates'],
          ] },
        { t: 'callout', kind: 'tip', html: `Rule of thumb: if only ONE thread writes and others only read, <code>volatile</code> is enough. If multiple threads write (or you do read-then-write), you need <code>synchronized</code> or atomics.` },

        { t: 'sub', text: 'ThreadLocal — total per-thread isolation' },
        { t: 'prose', html: `If <code>volatile</code> makes data visible to everyone, <code>ThreadLocal</code> is the opposite: it gives <strong>each thread its own private copy</strong>. Even a globally-declared <code>ThreadLocal</code> returns a different value per thread — like everyone having their own "shopping cart" in the same store.` },
        { t: 'diagram', name: 'threadLocal', cap: 'One variable, an isolated value per thread' },
        { t: 'code', title: 'ThreadLocalDemo.java — Per-Thread User Context', code:
`// Real use case: web framework storing current user per request thread
public class RequestContext {
    // One static field, but each thread gets its own value
    private static final ThreadLocal<User> CURRENT_USER = new ThreadLocal<>();

    public static void setUser(User u) { CURRENT_USER.set(u); }
    public static User getUser()       { return CURRENT_USER.get(); }

    // CRITICAL: must clean up in thread pools — threads are REUSED
    // If you don't remove, Thread 5 might process User A's request and
    // accidentally still see User B's ThreadLocal from a previous request
    public static void clear()         { CURRENT_USER.remove(); }
}

// Spring does exactly this for SecurityContextHolder (JWT/OAuth user info):
// Set at filter layer, read by any service method, cleared after response

// Also classic use: SimpleDateFormat (NOT thread-safe)
private static final ThreadLocal<SimpleDateFormat> FMT =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
// Each thread gets its own formatter — no synchronization needed` },
        { t: 'callout', kind: 'danger', html: `<strong>ThreadLocal + thread pools = memory leaks.</strong> Pool threads are reused across requests. If you don't call <code>remove()</code>, the old value lingers forever on that thread. Next request on that thread sees stale or wrong data. Always clean up in a <code>finally</code> block.` },
        { t: 'callout', kind: 'note', html: `<strong>Where ThreadLocal is used in production:</strong> Spring Security\'s <code>SecurityContextHolder</code>, Hibernate\'s session tracking, logging MDC (Mapped Diagnostic Context — adding user/trace IDs to every log line), database transaction management.` },
      ],
    },

    /* ========================================================
       LEVEL 5
       ======================================================== */
    {
      id: 'level-5', num: '05', accent: 'amber', part: 'Locks & Coordination',
      eyebrow: 'Level 5 · Beyond synchronized',
      title: 'Advanced Locking',
      intro: 'The java.util.concurrent.locks package gives you everything synchronized does, plus timeouts, fairness, interruptibility, and separate read/write locks.',
      blocks: [
        { t: 'prose', html: '<span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.4;font-family:system-ui,sans-serif">Key Terms</span>' },
        { t: 'table', head: ['Term', 'Plain English'],
          rows: [
            ['<strong>Reentrant (again)</strong>', 'A thread can re-acquire a lock it already holds. "ReentrantLock" literally means "a lock that supports re-entry." This is required because synchronized methods often call other synchronized methods on the same object.'],
            ['<strong>tryLock</strong>', 'Instead of waiting forever for a lock, tryLock() says "give me the lock, but if I can\'t have it in N seconds, I\'ll do something else." The deadlock killer.'],
            ['<strong>Fairness</strong>', 'Fair lock = the longest-waiting thread gets the lock next (FIFO). Unfair (default) = any waiting thread may win. Fair = no starvation, but slower throughput.'],
            ['<strong>Read/Write Split</strong>', 'A lock that allows MANY threads to read simultaneously, but only ONE thread to write (and only when no readers). Perfect for rarely-changing data like config caches.'],
            ['<strong>Optimistic Read</strong>', 'A bet: "I\'ll read without locking and assume nobody wrote. If I was wrong (validate fails), I\'ll re-read with a real lock." Fastest approach when writes are very rare.'],
            ['<strong>Stamp</strong>', 'A version number returned by StampedLock. You use it to validate that no write happened since you got the stamp.'],
          ] },

        { t: 'sub', text: 'Why leave synchronized behind?' },
        { t: 'table', head: ['Need', 'synchronized can do it?', 'ReentrantLock can do it?'],
          rows: [
            ['"Try to get the lock, give up after 2 seconds"', 'No', 'Yes — <code>tryLock(2, SECONDS)</code>'],
            ['"Interrupt me if I\'m waiting for the lock"', 'No', 'Yes — <code>lockInterruptibly()</code>'],
            ['"Give the lock to the longest-waiting thread"', 'No', 'Yes — <code>new ReentrantLock(true)</code>'],
            ['"Multiple readers allowed, one writer"', 'No', 'Yes — <code>ReentrantReadWriteLock</code>'],
            ['Simple mutual exclusion', 'Yes (cleaner)', 'Yes (more verbose)'],
          ] },

        { t: 'sub', text: 'ReentrantLock — the smart lock' },
        { t: 'prose', html: `<code>ReentrantLock</code> (from <code>java.util.concurrent.locks</code>) does everything <code>synchronized</code> does, plus the things it can't: timeouts, interruptibility, and fairness. You call <code>lock()</code>/<code>unlock()</code> explicitly instead of relying on a code block — which means <strong>you must remember to unlock</strong>, always in a <code>finally</code>. Use it when you need to give up on a lock rather than wait forever.` },
        { t: 'code', title: 'ReentrantLock.java — Bank Transfer with Timeout', code:
`// Real use: bank transfer that refuses to deadlock
class SafeBank {
    private final ReentrantLock lock = new ReentrantLock(true); // fair=true
    private int balance;

    // The tryLock pattern — the #1 reason to use ReentrantLock over synchronized
    public boolean transfer(SafeBank target, int amount) {
        // Try to lock myself for 2 seconds
        boolean gotMine = false;
        try {
            gotMine = lock.tryLock(2, TimeUnit.SECONDS);
            if (!gotMine) return false;   // couldn't get it — bail out cleanly

            // Try to lock the target for 2 seconds
            if (!target.lock.tryLock(2, TimeUnit.SECONDS)) {
                return false;   // deadlock avoided! We simply give up
            }
            try {
                this.balance   -= amount;
                target.balance += amount;
                return true;
            } finally {
                target.lock.unlock();   // ALWAYS unlock in finally
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        } finally {
            if (gotMine) lock.unlock();  // ALWAYS unlock in finally
        }
    }
}` },
        { t: 'callout', kind: 'danger', html: `<code>unlock()</code> <strong>MUST</strong> be in a <code>finally</code> block. If an exception is thrown between <code>lock()</code> and <code>unlock()</code> and you skip the finally, the lock is held forever. Every waiting thread will block forever.` },

        { t: 'sub', text: 'ReadWriteLock — the performance booster' },
        { t: 'prose', html: `Imagine a config map read 10,000 times/second but written once a day. A plain lock serializes every read — a massive bottleneck. <code>ReadWriteLock</code> keeps two locks: many threads may hold the <strong>read lock</strong> at once, but the <strong>write lock</strong> is exclusive and waits for all readers to finish.` },
        { t: 'diagram', name: 'readWriteLock', cap: 'Unlimited concurrent readers, or one exclusive writer' },
        { t: 'code', title: 'ConfigCache.java — Read-Heavy Cache', code:
`// Real use: a shared feature-flag config read by every API request
class FeatureFlagCache {
    private final ReentrantReadWriteLock rw = new ReentrantReadWriteLock();
    private Map<String, Boolean> flags = new HashMap<>();

    // READ: many threads can read simultaneously — full parallelism
    public boolean isEnabled(String feature) {
        rw.readLock().lock();
        try {
            return flags.getOrDefault(feature, false);
        } finally {
            rw.readLock().unlock();
        }
    }

    // WRITE: exclusive — all readers must finish before this proceeds
    public void reload(Map<String, Boolean> newFlags) {
        rw.writeLock().lock();
        try {
            flags = new HashMap<>(newFlags);
        } finally {
            rw.writeLock().unlock();
        }
    }
}
// Result: 10,000 reads/sec with no blocking between them. Only the
// once-a-day reload causes any wait.` },
        { t: 'callout', kind: 'note', html: `<strong>Only a win for read-heavy workloads (90%+ reads).</strong> If writes are frequent, the constant write-exclusivity overhead makes it slower than a plain lock. Profile before switching.` },

        { t: 'sub', text: 'StampedLock — optimistic reads (Java 8+)' },
        { t: 'prose', html: `<code>StampedLock</code> adds a third mode on top of read/write: <strong>optimistic reading</strong>. Instead of acquiring a real read lock, you grab a cheap "stamp" (a version number), read the data without blocking anyone, then validate the stamp afterwards. If a writer snuck in, you fall back to a real lock and retry. It's the fastest option when writes are rare — but it is NOT reentrant, so use it carefully.` },
        { t: 'code', title: 'StampedLock.java — Point Distance (Optimistic)', code:
`// Optimistic read: "I'll read without locking and HOPE nobody wrote"
// If they did write, I fall back to a real read lock. Fast when writes are rare.
class Point {
    private final StampedLock sl = new StampedLock();
    private double x, y;

    double distanceFromOrigin() {
        long stamp = sl.tryOptimisticRead();   // Step 1: get a "version stamp", no lock
        double cx = x, cy = y;                // Step 2: read the data
        if (!sl.validate(stamp)) {            // Step 3: did a WRITER interfere?
            // Yes — fall back to a proper read lock
            stamp = sl.readLock();
            try { cx = x; cy = y; }
            finally { sl.unlockRead(stamp); }
        }
        return Math.sqrt(cx*cx + cy*cy);      // Step 4: use the data
    }

    void move(double dx, double dy) {
        long stamp = sl.writeLock();
        try { x += dx; y += dy; }
        finally { sl.unlockWrite(stamp); }
    }
}
// StampedLock is NOT reentrant — a thread that already holds the write lock
// cannot acquire the read lock. Only use it when you need maximum read throughput.` },

        { t: 'table', head: ['Lock', 'Reentrant', 'Read/Write split', 'tryLock', 'Best for'],
          rows: [
            ['synchronized', 'Yes', 'No', 'No', 'Simple mutual exclusion, low contention'],
            ['ReentrantLock', 'Yes', 'No', 'Yes', 'Need timeout, fairness, or interruptibility'],
            ['ReentrantReadWriteLock', 'Yes', 'Yes', 'Yes', 'Read-heavy caches (90%+ reads)'],
            ['StampedLock', 'No', 'Yes', 'Yes', 'Extreme read throughput, writes very rare'],
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
      intro: 'Locks protect individual data. Synchronizers orchestrate whole fleets of threads — coordinating them by counts, groups, or available permits.',
      blocks: [
        { t: 'prose', html: '<span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.4;font-family:system-ui,sans-serif">Key Terms</span>' },
        { t: 'table', head: ['Term', 'Plain English'],
          rows: [
            ['<strong>Synchronizer</strong>', 'A coordination primitive — not for protecting data, but for controlling WHEN threads start, stop, or proceed.'],
            ['<strong>Latch</strong>', 'A one-way gate with a countdown. Once the count hits zero, it opens and NEVER closes again. Single-use.'],
            ['<strong>Barrier</strong>', 'A meeting point. All threads must arrive before any can proceed. Reusable — resets after each round.'],
            ['<strong>Semaphore</strong>', 'A bucket of permits. Take one to enter; return it when done. Controls HOW MANY threads can do something at once.'],
            ['<strong>Permit</strong>', 'A token that allows a thread through a Semaphore. Like a ticket — you need one to enter, and you return it when you leave.'],
          ] },

        { t: 'diagram', name: 'synchronizers', cap: 'The three workhorses: a one-shot gate, a reusable rally point, and a permit throttle' },

        { t: 'sub', text: 'CountDownLatch — the one-way gate' },
        { t: 'prose', html: `Initialise with a count. The main thread calls <code>await()</code> and freezes; workers call <code>countDown()</code>. The instant the count hits zero the gate snaps open. <strong>Single-use</strong> — it cannot be reset.` },
        { t: 'analogy', html: `<b>Rocket launch countdown.</b> Mission control (<code>await()</code>) waits. Three teams check their systems and each calls <code>countDown()</code>. When all three are ready (count = 0), launch proceeds. You can't un-launch — hence single-use.` },
        { t: 'code', title: 'MicroserviceStartup.java — Real-World Latch', code:
`// Real use: wait for all downstream services before accepting traffic
// Seen in Spring Boot startup hooks, test setup, integration test harnesses
class AppStartup {
    public void start(ExecutorService pool) throws InterruptedException {
        CountDownLatch ready = new CountDownLatch(3);  // wait for 3 dependencies

        pool.submit(() -> { connectDatabase();  ready.countDown(); });
        pool.submit(() -> { connectCache();     ready.countDown(); });
        pool.submit(() -> { connectMessageBus();ready.countDown(); });

        boolean allReady = ready.await(30, TimeUnit.SECONDS);  // timeout version
        if (!allReady) throw new RuntimeException("Startup timed out");
        System.out.println("All dependencies up — serving traffic");
    }
}
// Use when: fan-out to multiple tasks, wait for ALL to complete, then proceed ONCE` },
        { t: 'callout', kind: 'tip', html: `<strong>CountDownLatch vs CompletableFuture.allOf:</strong> use Latch when the tasks are already submitted to a pool. Use <code>allOf</code> (Level 10) when you want to chain further actions.` },

        { t: 'sub', text: 'CyclicBarrier — the multi-phase rally point' },
        { t: 'prose', html: `Initialise with N parties. Each thread runs independently, then calls <code>await()</code> and freezes until <strong>all</strong> N arrive. The moment the last one arrives, an optional barrier action runs and all are released. <strong>Cyclic</strong> — it resets for the next round.` },
        { t: 'analogy', html: `<b>Multiplayer game lobby.</b> Each player joins and sees "waiting for 3 more…" When all 4 arrive, the game starts simultaneously for everyone. Then the barrier resets for the next round/phase.` },
        { t: 'code', title: 'ParallelDataProcessing.java — Real-World Barrier', code:
`// Real use: parallel data processing with phases
// Phase 1: all threads load their data chunk
// Phase 2: all threads process (depends on Phase 1 being complete for ALL)
// Phase 3: all threads write results
CyclicBarrier phaseGate = new CyclicBarrier(4,
    () -> System.out.println("--- Phase complete — proceeding ---"));

Runnable worker = () -> {
    try {
        loadMyChunk();             // Phase 1: independent work
        phaseGate.await();         // wait for ALL 4 to finish loading

        processChunk();            // Phase 2: can now use any other chunk's data
        phaseGate.await();         // wait for ALL 4 to finish processing

        writeResults();            // Phase 3: final output
    } catch (Exception e) { Thread.currentThread().interrupt(); }
};
// The barrier resets between phases — that's what CyclicBarrier means` },
        { t: 'callout', kind: 'note', html: `<strong>Latch vs Barrier:</strong> a Latch waits for N <em>events</em> (any thread can countdown, one waiter). A Barrier waits for N <em>threads to rendezvous</em> and then releases ALL of them together. Barrier is reusable; Latch is not.` },

        { t: 'sub', text: 'Semaphore — the resource throttle' },
        { t: 'prose', html: `Holds a fixed set of permits. <code>acquire()</code> takes one (blocks if none left); <code>release()</code> returns one. Controls <strong>how many</strong> threads may enter a section at once.` },
        { t: 'analogy', html: `<b>A car park with 5 spaces.</b> 5 permits = 5 spaces. You wait at the barrier (<code>acquire()</code>) if full. When someone leaves (<code>release()</code>), the barrier opens.` },
        { t: 'code', title: 'RateLimiter.java — Real-World Semaphore', code:
`// Real use: limit concurrent calls to a fragile external API
// (don't hammer it with 500 simultaneous requests)
class ExternalApiClient {
    private final Semaphore throttle = new Semaphore(10);   // max 10 in-flight calls

    public Response call(Request req) throws InterruptedException {
        throttle.acquire();   // blocks the 11th+ caller until a permit frees up
        try {
            return externalApi.send(req);   // only 10 run at once
        } finally {
            throttle.release();   // ALWAYS return the permit, even on exception
        }
    }
}

// Other real uses:
// - Connection pool: Semaphore(poolSize) limits concurrent DB connections
// - Rate limiting: Semaphore(maxPerSec) with a refill timer
// - File handle limits: Semaphore(maxFiles) to prevent OS file handle exhaustion` },
        { t: 'callout', kind: 'tip', html: `A <code>Semaphore(1)</code> behaves like a lock — but a permit can be released by a <em>different</em> thread than the one that acquired it. Useful for signalling patterns (unlike a regular lock where only the holder can release).` },

        { t: 'sub', text: 'Phaser & Exchanger — the advanced ones' },
        { t: 'list', items: [
          `<strong>Phaser</strong> — like a CyclicBarrier but parties can dynamically join/leave between phases. Use it when the number of threads isn't fixed up front (e.g., tasks that spawn subtasks). More flexible but harder to reason about.`,
          `<strong>Exchanger</strong> — a rendezvous point where exactly two threads hand off an object to each other simultaneously. Thread A gives B its object; B gives A its object — in one atomic swap. Useful for pipeline hand-offs and double-buffer patterns.`,
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
      intro: 'The java.util.concurrent.atomic package achieves thread safety with no locks at all — using optimistic concurrency and a single magic CPU instruction.',
      blocks: [
        { t: 'prose', html: '<span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.4;font-family:system-ui,sans-serif">Key Terms</span>' },
        { t: 'table', head: ['Term', 'Plain English'],
          rows: [
            ['<strong>CAS (Compare-And-Swap)</strong>', 'A single CPU instruction that says: "Set memory address X to new value N, BUT ONLY IF it currently holds expected value E. If it doesn\'t, tell me and do nothing." It\'s atomic at the hardware level — faster than any lock.'],
            ['<strong>Optimistic Concurrency</strong>', 'Assume no conflict, proceed without locking, then CHECK if a conflict happened. If it did, retry. Opposite of pessimistic (lock first, then proceed).'],
            ['<strong>Spin Loop / Busy-Wait</strong>', 'Instead of sleeping (BLOCKED state), the thread keeps looping: "did CAS succeed? No. Try again. No. Try again…" Fast, but burns CPU. Fine for microsecond contention; bad for seconds.'],
            ['<strong>Lock-Free</strong>', 'A guarantee that SOME thread will make progress in a finite number of steps, even if others are delayed. Not "no locking" — means the system can\'t deadlock.'],
            ['<strong>ABA Problem</strong>', 'CAS only checks current value. If value was A, changed to B, then changed back to A — CAS thinks nothing changed. Sometimes that\'s wrong (e.g., in lock-free linked lists).'],
            ['<strong>Striped Counter</strong>', 'LongAdder\'s trick: instead of one counter all threads fight over, maintain an ARRAY of counters, hash threads to different cells, then sum them. Massively reduces contention.'],
          ] },

        { t: 'sub', text: 'CAS — Compare-And-Swap' },
        { t: 'prose', html: `CAS is not a Java feature — it's a <strong>native CPU instruction</strong>. Instead of locking, a thread says: "set this to 6, but <em>only if</em> it's still 5. If someone changed it, fail and tell me." On failure the thread re-reads and retries in a tight <strong>spin loop</strong> — it never sleeps.` },
        { t: 'diagram', name: 'casLoop', cap: 'Read → compute → compare-and-swap → retry on failure. No locks, no blocking' },
        { t: 'code', title: 'CASMechanics.java — How CAS works under the hood', code:
`// What AtomicInteger.incrementAndGet() actually does (simplified):
public int incrementAndGet() {
    while (true) {                          // spin loop — retry until success
        int current = get();                // Step 1: read current value
        int next    = current + 1;          // Step 2: compute desired value
        if (compareAndSet(current, next)) { // Step 3: CAS — only sets if still 'current'
            return next;                    // Success! Value updated atomically
        }
        // CAS failed — another thread incremented between Step 1 and Step 3
        // Loop back and try again with the new current value
    }
}

// Why it beats synchronized:
// synchronized: threads SLEEP (context switch overhead) then WAKE UP
// CAS: threads RETRY immediately (no context switch, stays in CPU)
// For nanosecond-scale contention, CAS is 3-10x faster` },

        { t: 'sub', text: 'The Atomic classes — in practice' },
        { t: 'prose', html: `<code>java.util.concurrent.atomic</code> gives you wrapper types — <code>AtomicInteger</code>, <code>AtomicLong</code>, <code>AtomicBoolean</code>, <code>AtomicReference</code> — that perform read-modify-write operations as a single CAS instruction instead of a lock. They're the right tool for a single shared counter or flag: faster than <code>synchronized</code>, with no risk of deadlock, but only for <strong>one</strong> variable at a time — they don't help when you need several fields updated together consistently.` },
        { t: 'code', title: 'RequestCounter.java — AtomicLong in Production', code:
`// Real use: HTTP request counter in a high-traffic web server
class Metrics {
    private final AtomicLong totalRequests  = new AtomicLong(0);
    private final AtomicLong failedRequests = new AtomicLong(0);
    private final AtomicReference<String> lastError = new AtomicReference<>("");

    // Called by every request thread — must be blazingly fast
    public void recordSuccess() {
        totalRequests.incrementAndGet();  // atomic, lock-free, very fast
    }

    public void recordFailure(String message) {
        totalRequests.incrementAndGet();
        failedRequests.incrementAndGet();
        lastError.set(message);           // atomic reference swap — safe for strings
    }

    // Read at any time — always consistent snapshot of each field
    public void printStats() {
        System.out.printf("Total: %d, Failed: %d, Last Error: %s%n",
            totalRequests.get(),
            failedRequests.get(),
            lastError.get());
    }
}

// Other useful ops:
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();         // ++count, returns new value
count.getAndIncrement();         // count++, returns OLD value
count.addAndGet(5);              // count += 5, returns new value
count.compareAndSet(10, 0);      // if count == 10, set to 0; else do nothing` },

        { t: 'sub', text: 'The ABA problem — when CAS gets fooled' },
        { t: 'prose', html: `CAS only compares the <em>current value</em> to the <em>expected value</em> — it has no idea whether that value changed and changed back in between. If a value goes A → B → A, a CAS still sees "A" and happily proceeds, even though the data was touched twice by someone else. This rarely matters for plain counters, but it can silently corrupt lock-free data structures like stacks and linked lists where <em>identity</em>, not just value, matters.` },
        { t: 'code', title: 'ABA.java — The Problem and Fix', code:
`// Thread 1 reads: value = "Alice"
// Thread 2 changes: "Alice" -> "Bob" -> "Alice"  (ABA!)
// Thread 1 CAS: "is it still Alice?" YES! CAS succeeds.
// Thread 1 thinks nothing changed — but everything changed.

// This matters in lock-free data structures (stacks, queues) where
// you care about identity, not just value equality.

// Fix: AtomicStampedReference — pairs value with a version number
AtomicStampedReference<String> ref =
    new AtomicStampedReference<>("Alice", 1);   // value + stamp (version)

int[] stampHolder = new int[1];
String current = ref.get(stampHolder);          // read value AND stamp
int currentStamp = stampHolder[0];

// CAS now checks BOTH value AND stamp — "Alice with stamp 1"
// Even if it goes Alice(1) -> Bob(2) -> Alice(3), the stamp changed
ref.compareAndSet("Alice", "NewValue", currentStamp, currentStamp + 1);` },

        { t: 'sub', text: 'LongAdder — high-contention counting' },
        { t: 'prose', html: `Atomics have one weakness: under <em>extreme</em> contention, if 100 threads hammer <code>incrementAndGet()</code> at once, 99 fail their CAS and spin furiously, burning CPU. <code>LongAdder</code> (Java 8) fixes this by spreading threads across an internal <strong>array of cells</strong>.` },
        { t: 'diagram', name: 'longAdder', cap: 'One hot cell (contention) vs many cells (LongAdder spreads the load)' },
        { t: 'code', title: 'MetricsCollector.java — LongAdder for High Traffic', code:
`// Real use: metrics collection in a high-traffic system
// (thousands of threads incrementing simultaneously)
class TrafficMetrics {
    // AtomicLong would spin heavily under this load
    private final LongAdder requestCount = new LongAdder();
    private final LongAdder errorCount   = new LongAdder();

    // Called by THOUSANDS of threads per second — near-zero contention
    public void hit()   { requestCount.increment(); }
    public void error() { errorCount.increment(); }

    // Called once per second by a metrics publisher thread
    public void report() {
        // sumThenReset() reads and atomically resets — perfect for rate metrics
        System.out.printf("Requests: %d, Errors: %d%n",
            requestCount.sumThenReset(),
            errorCount.sumThenReset());
    }
}
// LongAdder in Micrometer, Prometheus, Dropwizard Metrics — all use this pattern` },
        { t: 'table', head: ['Counter', 'Contention', 'Read cost', 'Use when'],
          rows: [
            ['AtomicLong', 'Spins under heavy load', 'Exact, instant O(1)', 'Low-moderate write traffic, need precise reads'],
            ['LongAdder', 'Near-zero (striped cells)', 'sum() sums cells — O(threads)', 'High-throughput write-heavy metrics'],
          ] },
      ],
    },

    /* ========================================================
       LEVEL 8
       ======================================================== */
    {
      id: 'level-8', num: '08', accent: 'orange', part: 'Lock-Free & Executors',
      eyebrow: 'Level 8 · Don\'t Manage Threads',
      title: 'Executors & Thread Pools',
      intro: 'Stop creating threads by hand. A thread pool is a fixed team of reusable workers — you hand it tasks and it figures out who runs what.',
      blocks: [
        { t: 'prose', html: '<span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.4;font-family:system-ui,sans-serif">Key Terms</span>' },
        { t: 'table', head: ['Term', 'Plain English'],
          rows: [
            ['<strong>Thread Pool</strong>', 'A fixed set of reusable threads. Like a team of workers that stay on shift. You give them tasks; they execute and immediately pick up the next one. No hiring/firing overhead.'],
            ['<strong>Executor / ExecutorService</strong>', 'The manager. Accepts tasks (Runnable/Callable), decides which pool thread runs them, and handles the queue.'],
            ['<strong>Future</strong>', 'A claim ticket for a result that\'s being computed. You get a Future immediately; you call get() later when you want the actual result (it blocks if not done yet).'],
            ['<strong>Blocking</strong>', 'When a thread stops and waits — for a lock, an I/O response, or Future.get(). Blocking is expensive: the thread sits idle, wasting OS resources.'],
            ['<strong>Backpressure</strong>', 'When the queue is full and the system pushes back on new work ("I\'m full, slow down"). Prevents OOM. CallerRunsPolicy is natural backpressure.'],
            ['<strong>Work-Stealing</strong>', 'ForkJoinPool trick: idle threads steal tasks from busy threads\' queues. Keeps all CPUs busy with uneven workloads.'],
            ['<strong>Pool Starvation</strong>', 'Deadlock via thread pool: all pool threads are blocked waiting for results of tasks that are still QUEUED (not running). Classic in poorly designed async code.'],
          ] },

        { t: 'sub', text: 'Why thread pools? The real cost of new Thread()' },
        { t: 'prose', html: `Each <code>new Thread()</code> costs real OS resources — roughly 1MB of stack memory and a kernel scheduling entry — and creating/destroying threads constantly adds up fast under load. A <strong>thread pool</strong> creates a fixed team of threads once and reuses them for every task, eliminating that overhead entirely. This is the single biggest practical lesson in this guide: never call <code>new Thread()</code> per request in production.` },
        { t: 'code', title: 'ThreadCost.java — Why NOT to create threads manually', code:
`// NEVER do this in production:
for (HttpRequest req : incomingRequests) {
    new Thread(() -> handle(req)).start();   // creates a new OS thread per request
    // Each thread: ~1MB stack by default, kernel scheduling entry, context switch
    // 1000 requests = 1000 threads = ~1GB RAM just for stacks
    // OS starts thrashing on context switches
    // Result: OutOfMemoryError or extreme slowness
}

// DO this instead:
ExecutorService pool = Executors.newFixedThreadPool(
    Runtime.getRuntime().availableProcessors() * 2   // rule of thumb for I/O-bound
);
for (HttpRequest req : incomingRequests) {
    pool.submit(() -> handle(req));   // task goes to queue; pool thread picks it up
    // Max threads: 8. Memory: constant. Performance: excellent.
}` },
        { t: 'diagram', name: 'threadPool', cap: 'Tasks queue up; a fixed set of reused threads drain the queue into results' },

        { t: 'sub', text: 'ExecutorService — the manager' },
        { t: 'prose', html: `<code>ExecutorService</code> is the interface that sits in front of a thread pool. You hand it tasks via <code>submit()</code> and it returns a <code>Future</code> immediately — you decide later when (and whether) to block on the result. It also owns the task queue and lets you shut the pool down cleanly when your application stops.` },
        { t: 'code', title: 'SearchService.java — Parallel Fan-Out', code:
`// Real use: parallel search across multiple data sources
class SearchService {
    private final ExecutorService pool = Executors.newFixedThreadPool(8);

    public SearchResult search(String query) throws Exception {
        // Submit 3 tasks to run in parallel
        Future<List<Product>> products = pool.submit(() -> searchProducts(query));
        Future<List<Article>> articles = pool.submit(() -> searchArticles(query));
        Future<List<User>>    users    = pool.submit(() -> searchUsers(query));

        // Collect results (get() blocks until each is ready)
        return new SearchResult(
            products.get(5, TimeUnit.SECONDS),   // bail if search hangs >5s
            articles.get(5, TimeUnit.SECONDS),
            users.get(5, TimeUnit.SECONDS)
        );
    }

    // CRITICAL: always shut down the pool on application shutdown
    @PreDestroy
    public void shutdown() {
        pool.shutdown();
        try {
            if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
                pool.shutdownNow();   // force interrupt remaining tasks
            }
        } catch (InterruptedException e) {
            pool.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}` },
        { t: 'callout', kind: 'danger', html: `<strong>NEVER use Executors.newCachedThreadPool() for CPU-bound work.</strong> It creates unlimited threads — under load your server creates 10,000 threads and OOMs. Reserve cached pools for short-lived I/O tasks.` },

        { t: 'table', head: ['Factory', 'Threads', 'Queue', 'Use for'],
          rows: [
            ['newFixedThreadPool(n)', 'Exactly n', 'Unbounded (LinkedBlockingQueue)', 'Steady CPU or I/O work with known concurrency'],
            ['newCachedThreadPool()', 'Grows on demand, shrinks', 'Direct handoff (SynchronousQueue)', 'Many short-lived I/O tasks (risky under load)'],
            ['newSingleThreadExecutor()', '1', 'Unbounded', 'Serial task ordering, ordered log writers'],
            ['newScheduledThreadPool(n)', 'n', 'Delay queue', 'Delayed/periodic tasks (cron jobs)'],
            ['newVirtualThreadPerTaskExecutor()', 'Unbounded (virtual)', 'None needed', 'Java 21 — massive I/O concurrency'],
          ] },

        { t: 'sub', text: 'Configuring ThreadPoolExecutor for production' },
        { t: 'prose', html: `The factory methods (<code>newFixedThreadPool</code>, etc.) are convenient defaults, but production systems usually need to hand-tune the underlying <code>ThreadPoolExecutor</code> directly — controlling exactly how many threads exist, how big the backlog queue is, and what happens when the system is overwhelmed.` },
        { t: 'code', title: 'ProductionPool.java — The Right Way', code:
`// The 5 knobs you need to tune for production:
ThreadPoolExecutor pool = new ThreadPoolExecutor(
    8,                                  // corePoolSize: always-alive threads
    16,                                 // maximumPoolSize: burst capacity
    60, TimeUnit.SECONDS,               // keepAlive: how long extra threads idle
    new ArrayBlockingQueue<>(500),      // BOUNDED queue: backpressure if overwhelmed
                                        // Never use unbounded here — OOM risk
    new ThreadFactory() {               // Give threads meaningful names (debug logs!)
        int n = 0;
        public Thread newThread(Runnable r) {
            return new Thread(r, "api-worker-" + n++);
        }
    },
    new ThreadPoolExecutor.CallerRunsPolicy()  // overflow: caller does the work itself
    // This naturally throttles the submitter — the best backpressure policy
);

// Sizing formula:
// CPU-bound work: coreSize = CPU cores (no more, no less)
// I/O-bound work: coreSize = CPU cores × (1 + wait_time / compute_time)
//   If a task is 90% waiting for DB: cores × 10` },

        { t: 'sub', text: 'Runnable vs Callable, and Future' },
        { t: 'prose', html: `<code>Runnable</code> is "fire and forget" — its <code>run()</code> method returns nothing and can't throw a checked exception. <code>Callable&lt;T&gt;</code> is its richer cousin: <code>call()</code> returns a value and is allowed to throw. Submitting a <code>Callable</code> to an executor hands you back a <code>Future&lt;T&gt;</code> — a placeholder for a result that's still being computed, which you collect later with <code>get()</code>.` },
        { t: 'code', title: 'FutureDemo.java — Parallel Price Fetching', code:
`// Real use: fetch prices from 3 vendors in parallel, use the fastest
ExecutorService pool = Executors.newFixedThreadPool(3);

// Callable<T>: can return a value AND throw checked exceptions
Callable<Price> vendorA = () -> fetchPriceFromA(sku);  // might throw IOException
Callable<Price> vendorB = () -> fetchPriceFromB(sku);
Callable<Price> vendorC = () -> fetchPriceFromC(sku);

Future<Price> fa = pool.submit(vendorA);
Future<Price> fb = pool.submit(vendorB);
Future<Price> fc = pool.submit(vendorC);

// Do other work here while all three fetch in parallel...
preparePageLayout();

// Collect with timeout:
try {
    Price priceA = fa.get(3, TimeUnit.SECONDS);
    Price priceB = fb.get(3, TimeUnit.SECONDS);
    Price priceC = fc.get(3, TimeUnit.SECONDS);
    return Stream.of(priceA, priceB, priceC).min(Comparator.naturalOrder());
} catch (TimeoutException e) {
    fa.cancel(true); fb.cancel(true); fc.cancel(true);
    return fallbackPrice(sku);
}` },
        { t: 'callout', kind: 'warning', html: `<code>future.get()</code> blocks the calling thread. Chaining many <code>get()</code> calls in sequence re-serializes your parallel work. The solution is <code>CompletableFuture</code> (Level 10) which never blocks.` },

        { t: 'sub', text: 'ForkJoinPool — the work stealer' },
        { t: 'prose', html: `A regular thread pool is great for independent tasks, but bad for <strong>divide-and-conquer</strong> work where a big task splits into smaller subtasks recursively (sorting, tree traversal, parallel computations). <code>ForkJoinPool</code> is purpose-built for this — each thread keeps its own task queue, and idle threads <strong>steal</strong> work from busy threads to keep every core occupied. It's also the engine quietly powering <code>parallelStream()</code>.` },
        { t: 'code', title: 'ParallelMergeSort.java — Work Stealing in Action', code:
`// ForkJoinPool powers parallelStream() and is perfect for recursive divide-and-conquer
class MergeSort extends RecursiveAction {
    private final int[] arr;
    private final int from, to;

    protected void compute() {
        if (to - from < 1000) {          // small enough — just sort directly
            Arrays.sort(arr, from, to);
            return;
        }
        int mid = (from + to) / 2;
        // FORK: submit both halves as sub-tasks
        MergeSort left  = new MergeSort(arr, from, mid);
        MergeSort right = new MergeSort(arr, mid, to);
        left.fork();   // runs on some pool thread
        right.compute(); // this thread does the right half itself
        left.join();   // wait for left half
        merge(arr, from, mid, to);
    }
}

// The common pool (powers parallelStream):
List<Long> results = largeList.parallelStream()
                              .map(this::expensiveComputation)
                              .collect(Collectors.toList());
// Work-stealing: if one thread finishes early, it steals tasks from busy threads` },
      ],
    },

    /* ========================================================
       LEVEL 9
       ======================================================== */
    {
      id: 'level-9', num: '09', accent: 'pink', part: 'Collections & Modern Java',
      eyebrow: 'Level 9 · Thread-Safe Data',
      title: 'Concurrent Collections',
      intro: 'Hand-rolling synchronization around a HashMap is slow and error-prone. The java.util.concurrent collections are purpose-built for high-throughput concurrent access.',
      blocks: [
        { t: 'prose', html: '<span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.4;font-family:system-ui,sans-serif">Key Terms</span>' },
        { t: 'table', head: ['Term', 'Plain English'],
          rows: [
            ['<strong>Lock Striping</strong>', 'Instead of one lock for the whole collection, divide it into N stripes (buckets), each with its own lock. Thread A can update stripe 1 while Thread B updates stripe 7 simultaneously. ConcurrentHashMap does this.'],
            ['<strong>Copy-On-Write</strong>', 'On every write, copy the whole data structure, mutate the copy, then swap the reference atomically. Readers always see a consistent (never half-written) snapshot. Fast for reads, expensive for writes.'],
            ['<strong>ConcurrentModificationException (CME)</strong>', 'What a regular ArrayList or HashMap throws if you modify it while iterating. CopyOnWriteArrayList NEVER throws this because iterators see an old snapshot.'],
            ['<strong>Producer-Consumer</strong>', 'A design pattern: one group of threads creates work (producers), another group processes it (consumers). A blocking queue between them handles flow control automatically.'],
          ] },

        { t: 'sub', text: 'Why NOT use synchronized wrappers?' },
        { t: 'prose', html: `<code>Collections.synchronizedMap/List</code> wrap a regular collection with a single lock around every method call. It works, but it serializes <strong>all</strong> access — two threads touching completely unrelated keys still block each other — and compound operations like "check then insert" still aren't atomic even though each individual call is synchronized. This is exactly the gap the <code>java.util.concurrent</code> collections were built to close.` },
        { t: 'code', title: 'WhyNot.java — The Problem with synchronizedMap', code:
`// Old school: Collections.synchronizedMap wraps HashMap with one big lock
Map<String, Integer> old = Collections.synchronizedMap(new HashMap<>());

// Problem 1: One lock = one thread at a time. Thread A reading "user1"
// blocks Thread B reading "user999" — they have nothing in common!

// Problem 2: Compound operations STILL RACE even with synchronized wrapping:
if (!old.containsKey("user")) {    // acquire lock, check, release lock
    old.put("user", 0);            // acquire lock again, put, release
}
// Between containsKey and put, another thread can put "user"!
// You need to lock MANUALLY around both operations anyway.

// Solution: ConcurrentHashMap handles both problems natively:
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
map.computeIfAbsent("user", k -> 0);  // atomic check-and-insert, built in` },

        { t: 'sub', text: 'ConcurrentHashMap — king of collections' },
        { t: 'prose', html: `<code>ConcurrentHashMap</code> is the default go-to replacement for <code>HashMap</code> under concurrent access. Internally it splits the map into independently-locked buckets (lock striping), so threads updating different keys never block each other, and reads are essentially lock-free. It also offers atomic compound operations — <code>compute</code>, <code>computeIfAbsent</code>, <code>merge</code> — that close the "check then act" race the old synchronized wrappers couldn't.` },
        { t: 'code', title: 'SessionStore.java — Real-World ConcurrentHashMap', code:
`// Real use: web session store — thousands of concurrent reads and writes
class SessionStore {
    // ConcurrentHashMap: per-bucket locking, reads are lock-free
    private final ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();

    // Safe atomic operations — no external locking needed:
    public Session getOrCreate(String userId) {
        // computeIfAbsent: atomic "if not present, compute and insert"
        return sessions.computeIfAbsent(userId, Session::new);
    }

    public void incrementPageViews(String userId) {
        // compute: atomic read-modify-write (like an inline synchronized block)
        sessions.compute(userId, (k, v) -> {
            if (v == null) return new Session(1);
            return v.withPageViews(v.pageViews() + 1);
        });
    }

    public void recordLogin(String userId) {
        // merge: combine existing value with new one atomically
        sessions.merge(userId, new Session(1), (existing, newSess) ->
            existing.withLastLogin(Instant.now()));
    }
}` },
        { t: 'diagram', name: 'concurrentMap', cap: 'Per-bucket locks let independent keys be updated simultaneously' },
        { t: 'callout', kind: 'note', html: `<strong>Use the atomic methods:</strong> <code>compute</code>, <code>computeIfAbsent</code>, <code>merge</code>, <code>putIfAbsent</code>. A naive <code>if (!map.containsKey(k)) map.put(...)</code> is still two separate operations and still races between them, even with ConcurrentHashMap.` },

        { t: 'sub', text: 'CopyOnWriteArrayList — the reader\'s paradise' },
        { t: 'prose', html: `Every write to a <code>CopyOnWriteArrayList</code> copies the entire backing array, mutates the copy, then atomically swaps the reference. The payoff: reads need <strong>zero locking</strong> and an iterator never throws <code>ConcurrentModificationException</code> — it just sees a consistent snapshot, even if another thread is adding entries at that exact moment. The cost is that every write is O(n), so it's only a good fit when reads vastly outnumber writes (listener lists are the textbook example).` },
        { t: 'code', title: 'EventListeners.java — Real-World CopyOnWrite', code:
`// Real use: event listener list in a framework (read by every event, written rarely)
class EventBus {
    // CopyOnWriteArrayList: perfect for listener lists
    // Reads: zero locking, safe to iterate even if a listener is being added
    // Writes: expensive (copies the whole array) but writes are rare
    private final CopyOnWriteArrayList<EventListener> listeners =
        new CopyOnWriteArrayList<>();

    // Called once at startup (expensive — copies array)
    public void register(EventListener l)   { listeners.add(l); }
    public void unregister(EventListener l) { listeners.remove(l); }

    // Called millions of times — completely lock-free, never CME
    public void publish(Event e) {
        for (EventListener listener : listeners) {   // snapshot of array
            listener.onEvent(e);                     // even if add() runs concurrently
        }
    }
}
// Also used in Spring's ApplicationEventMulticaster under the hood` },
        { t: 'callout', kind: 'warning', html: `<strong>Where NOT to use CopyOnWriteArrayList:</strong> any list with frequent writes (shopping cart items, score updates, etc.). The copy-on-write makes every write O(n). For write-heavy cases, use a synchronized ArrayList or ConcurrentLinkedQueue.` },

        { t: 'sub', text: 'BlockingQueue — the producer-consumer lifeline' },
        { t: 'prose', html: `A <code>BlockingQueue</code> is a queue that knows how to make threads wait: <code>put()</code> blocks the producer when the queue is full, <code>take()</code> blocks the consumer when it's empty — no manual <code>wait()</code>/<code>notify()</code> required. It's the standard backbone for the producer-consumer pattern: decouple work creation from work processing, with automatic, built-in flow control (backpressure) between them.` },
        { t: 'code', title: 'LogProcessor.java — Real-World BlockingQueue', code:
`// Real use: async log processing — don't slow down the request thread
// Producers: request threads that generate log entries
// Consumer: a background thread that writes to disk
class AsyncLogger {
    // Bounded: if the consumer can't keep up, producers block (backpressure)
    private final BlockingQueue<LogEntry> queue = new ArrayBlockingQueue<>(10_000);

    // Request threads call this (producers) — non-blocking if queue has space
    public boolean log(LogEntry entry) {
        return queue.offer(entry, 100, TimeUnit.MILLISECONDS);  // timeout version
        // offer() vs put(): offer returns false if full; put() blocks indefinitely
    }

    // Background thread — the consumer
    class ConsumerThread implements Runnable {
        public void run() {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    LogEntry entry = queue.take();   // blocks if empty — no busy-wait
                    writeToDisk(entry);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    flushRemainingEntries();          // drain queue before exit
                    break;
                }
            }
        }
    }
}` },
        { t: 'diagram', name: 'producerConsumer', cap: 'put() blocks when full, take() blocks when empty — automatic flow control' },

        { t: 'table', head: ['Collection', 'Replaces', 'Read perf', 'Write perf', 'Sweet spot'],
          rows: [
            ['ConcurrentHashMap', 'Hashtable / synchronizedMap', 'Lock-free', 'Per-bucket lock', 'General concurrent key-value'],
            ['CopyOnWriteArrayList', 'synchronizedList', 'Lock-free', 'O(n) copy', 'Read-mostly (listeners)'],
            ['ArrayBlockingQueue', 'wait/notify queues', 'N/A (blocks)', 'Lock-based', 'Bounded producer-consumer'],
            ['ConcurrentLinkedQueue', 'synchronized LinkedList', 'Lock-free', 'CAS-based', 'Unbounded lock-free queue'],
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
      intro: 'The frontier: async pipelines, the biggest JVM change in a decade (Project Loom), structured concurrency, and the framework trap that catches everyone.',
      blocks: [
        { t: 'prose', html: '<span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.4;font-family:system-ui,sans-serif">Key Terms</span>' },
        { t: 'table', head: ['Term', 'Plain English'],
          rows: [
            ['<strong>Async / Non-blocking</strong>', 'Start a task, immediately return, and get called back when it\'s done. Never wait (block) for the result yourself. Like placing a food order and going about your day instead of standing at the counter.'],
            ['<strong>Callback</strong>', 'A function you hand to a framework saying "when you\'re done, call this." thenApply(), thenAccept() are callbacks in CompletableFuture.'],
            ['<strong>Pipeline</strong>', 'A chain of transformations: A produces → B transforms → C consumes. CompletableFuture creates async pipelines where each stage runs as soon as the previous one finishes.'],
            ['<strong>Platform Thread</strong>', 'A traditional Java thread, backed 1:1 by an OS thread. Heavy (~1MB stack). OS manages scheduling. Max practical count: a few thousand per JVM.'],
            ['<strong>Virtual Thread</strong>', 'Project Loom\'s ultra-light thread, managed by the JVM (not OS). Backed by a small heap object. You can run millions. When it blocks (I/O), the JVM swaps it out without wasting an OS thread.'],
            ['<strong>Carrier Thread</strong>', 'A regular platform thread that "carries" (runs) virtual threads. A handful of carriers run millions of virtual threads. Like a few buses (carriers) serving millions of passengers (virtual threads).'],
            ['<strong>Pinning</strong>', 'When a virtual thread blocks INSIDE a synchronized block, it can\'t unmount from its carrier. The carrier is stuck (pinned). Kills the scalability benefit. Fix: use ReentrantLock instead of synchronized.'],
            ['<strong>Structured Concurrency</strong>', 'Treating related concurrent tasks as a unit of work. If any sub-task fails, all others are automatically cancelled. No orphan threads, no resource leaks.'],
          ] },

        { t: 'sub', text: 'CompletableFuture — async pipelines' },
        { t: 'prose', html: `Instead of blocking on <code>Future.get()</code>, you <strong>chain callbacks</strong>. As soon as one stage finishes, the framework fires the next — the thread never sits idle waiting.` },
        { t: 'diagram', name: 'completableFuture', cap: 'A non-blocking chain: each stage runs when its predecessor completes' },
        { t: 'code', title: 'OrderDashboard.java — Real-World CompletableFuture', code:
`// Real use: building an order dashboard by fetching 3 things in parallel
// then combining them — without any thread blocking
class OrderService {
    public CompletableFuture<Dashboard> getDashboard(String userId) {
        // 3 async calls fire simultaneously:
        CompletableFuture<UserProfile> userFuture =
            CompletableFuture.supplyAsync(() -> userApi.fetch(userId));
        CompletableFuture<List<Order>> ordersFuture =
            CompletableFuture.supplyAsync(() -> orderApi.list(userId));
        CompletableFuture<LoyaltyPoints> pointsFuture =
            CompletableFuture.supplyAsync(() -> loyaltyApi.fetch(userId));

        // Combine all three when they're all done:
        return CompletableFuture.allOf(userFuture, ordersFuture, pointsFuture)
            .thenApply(__ -> new Dashboard(
                userFuture.join(),    // join() is safe here — already complete
                ordersFuture.join(),
                pointsFuture.join()
            ))
            .exceptionally(ex -> {
                log.error("Dashboard fetch failed", ex);
                return Dashboard.empty();   // fallback on any failure
            });
    }
}` },
        { t: 'table', head: ['Method', 'Does', 'Returns'],
          rows: [
            ['thenApply(fn)', 'Transform the result (like map)', 'CompletableFuture<NewType>'],
            ['thenCompose(fn)', 'Chain another future (like flatMap — avoids nesting)', 'CompletableFuture<T>'],
            ['thenCombine(other, fn)', 'Merge two independent futures when both complete', 'CompletableFuture<R>'],
            ['allOf(futures…)', 'Wait for ALL to complete', 'CompletableFuture<Void>'],
            ['anyOf(futures…)', 'Complete when the FIRST one completes', 'CompletableFuture<Object>'],
            ['exceptionally(fn)', 'Catch any exception in the chain, return fallback', 'CompletableFuture<T>'],
          ] },
        { t: 'callout', kind: 'warning', html: `<strong>CompletableFuture runs on the common ForkJoinPool by default.</strong> Never do blocking I/O (JDBC, HTTP) inside <code>thenApply</code> — it will starve the pool. Use <code>thenApplyAsync(fn, myIOPool)</code> with a dedicated I/O executor.` },

        { t: 'sub', text: 'Virtual Threads — Project Loom (Java 21)' },
        { t: 'prose', html: `The biggest Java change in a decade. Traditional <strong>platform threads</strong> wrap heavy OS threads — a server tops out around a few thousand. <strong>Virtual threads</strong> are ultra-light, JVM-managed; you can launch <em>millions</em>. When one blocks (I/O, sleep), the JVM <strong>unmounts</strong> it from its carrier OS thread, which goes off to do other work.` },
        { t: 'diagram', name: 'virtualThreads', cap: 'Millions of cheap virtual threads multiplexed onto a few OS carrier threads' },
        { t: 'code', title: 'VirtualThreadServer.java — Java 21 HTTP Handler', code:
`// Before virtual threads (traditional): limited to ~200-500 concurrent threads
// Each blocking DB call wastes an OS thread for 100ms
ExecutorService platformPool = Executors.newFixedThreadPool(200); // hard ceiling

// After virtual threads (Java 21): one virtual thread per request — scales to millions
// Same blocking code, but the JVM unmounts the virtual thread during the DB call
ExecutorService vtExecutor = Executors.newVirtualThreadPerTaskExecutor();

// Your code stays SIMPLE and BLOCKING — no callbacks, no reactive operators:
vtExecutor.submit(() -> {
    UserData user = db.query("SELECT * FROM users WHERE id=?", userId); // blocks VT only
    List<Order> orders = orderService.fetchOrders(userId);               // blocks VT only
    return buildResponse(user, orders);                                  // clean, readable
});

// You can start 1,000,000 of these — the JVM handles scheduling
// OS thread count stays small (e.g. 8 carriers for 8 CPUs)
// No callback hell, no reactive operators, no CompletableFuture chaining needed` },
        { t: 'callout', kind: 'key', html: `<strong>The payoff:</strong> you write plain, sequential, blocking code — and it scales like hand-written async. A Spring Boot app can handle 10x more concurrent requests just by switching to virtual threads with no code changes.` },
        { t: 'callout', kind: 'warning', html: `<strong>Pinning kills virtual threads.</strong> If your virtual thread blocks inside <code>synchronized(lock) { db.query(...) }</code>, it PINS to its carrier OS thread (can\'t unmount). The carrier is stuck until the I/O completes. In hot paths under Loom, replace <code>synchronized</code> with <code>ReentrantLock</code>.` },
        { t: 'callout', kind: 'note', html: `<strong>Virtual threads are NOT for CPU-bound work.</strong> They shine for I/O — DB calls, HTTP requests, file reads. For CPU-heavy tasks (image processing, encryption), use a bounded platform thread pool (typically CPU core count threads).` },

        { t: 'sub', text: 'Structured Concurrency (Java 21 preview)' },
        { t: 'prose', html: `When you fork several subtasks with <code>CompletableFuture</code> or raw threads, nothing ties their lifetimes together — if one fails, the others keep running in the background, wasting resources or even leaking. <strong>Structured concurrency</strong> treats a group of related subtasks as a single unit: they're forked together, and if any one fails, the rest are automatically cancelled when the scope closes. No orphaned threads, no manual cleanup bookkeeping.` },
        { t: 'code', title: 'StructuredScope.java — No Orphan Threads', code:
`// Problem without structured concurrency: fire 3 fetches; order fails instantly;
// user and payment fetches keep running and wasting resources for seconds.

// With StructuredTaskScope: they're a team. One fails = all cancelled.
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Subtask<UserProfile> user    = scope.fork(() -> fetchUser(id));
    Subtask<OrderList>   orders  = scope.fork(() -> fetchOrders(id));
    Subtask<PaymentInfo> payment = scope.fork(() -> fetchPayment(id));

    scope.join();             // wait for all to finish (or fail)
    scope.throwIfFailed();    // if ANY failed, throws — cancels the rest automatically

    return new Dashboard(user.get(), orders.get(), payment.get());
}   // scope closes: any still-running subtasks are cancelled. No leaks.` },

        { t: 'sub', text: 'Context Propagation — the framework trap' },
        { t: 'prose', html: `In Spring you lean on <code>ThreadLocal</code> for security context (JWT), transactions, and MDC trace IDs. The trap: when you hand work to <code>@Async</code>, <code>CompletableFuture</code>, or a virtual thread, it runs on a <strong>different thread</strong> with an <strong>empty</strong> ThreadLocal. Suddenly your user is "unauthenticated."` },
        { t: 'code', title: 'ContextPropagation.java — The Trap and Fix', code:
`// THE TRAP:
@Async
public CompletableFuture<Report> generateReport(String userId) {
    // This runs on a different thread — ThreadLocal is EMPTY here!
    User user = SecurityContextHolder.getContext().getAuthentication(); // NULL
    return CompletableFuture.completedFuture(buildReport(user));       // NPE
}

// FIX 1: Capture context before the thread hop and restore it:
SecurityContext ctx = SecurityContextHolder.getContext();  // capture on caller thread
CompletableFuture.supplyAsync(() -> {
    SecurityContextHolder.setContext(ctx);  // restore on worker thread
    try { return buildReport(ctx.getAuthentication()); }
    finally { SecurityContextHolder.clearContext(); }  // clean up!
}, pool);

// FIX 2 (Spring 6 / Boot 3): DelegatingSecurityContextExecutorService
// Wraps your pool and automatically propagates security context to every task:
ExecutorService securePool = new DelegatingSecurityContextExecutorService(pool);
securePool.submit(() -> buildReport(getAuth()));  // context propagated automatically` },
        { t: 'callout', kind: 'danger', html: `This context-loss trap burns everyone. Symptoms: NullPointerExceptions in async methods, Spring Security treating async tasks as anonymous users, MDC trace IDs missing from async log lines. Always propagate context explicitly or use the framework wrappers.` },
      ],
    },

    /* ========================================================
       LEVEL 11 — INTERVIEW Q&A
       ======================================================== */
    {
      id: 'level-11', num: '11', accent: 'purple', part: 'Interview Prep',
      eyebrow: 'Level 11 · Most Asked',
      title: 'Interview Q & A',
      intro: 'The 18 most common Java concurrency interview questions — each with a complete, production-grade answer. Read the code answers above first; these consolidate what you learned.',
      blocks: [
        { t: 'sub', text: 'Core Concepts' },
        { t: 'cards', cols: 2, items: [
          {
            title: 'Q: What is the difference between a Process and a Thread?',
            body: `A <strong>process</strong> is an independent execution environment with its own isolated memory. A <strong>thread</strong> is a unit of execution inside a process — lightweight, and sharing the process heap.<br><br>
Key differences: threads share heap memory (fast but dangerous); processes are fully isolated (safe but slow to communicate via IPC). The JVM is a process; your code runs on threads inside it.`
          },
          {
            title: 'Q: What is a race condition and how do you fix it?',
            body: `A race condition happens when two threads access shared data concurrently and the result depends on their execution order. Classic example: <code>count++</code> is actually three steps (read, add, write) — two threads can both read the same value, both add 1, and write the same result, losing one increment.<br><br>
<strong>Fixes:</strong> <code>synchronized</code> block, <code>AtomicInteger.incrementAndGet()</code>, or making the data immutable.`
          },
          {
            title: 'Q: What is the difference between synchronized and volatile?',
            body: `<code>volatile</code> guarantees <strong>visibility</strong> only — writes go to main memory, reads come from main memory. It does NOT ensure atomicity. Use it for a boolean flag read by many threads and written by one.<br><br>
<code>synchronized</code> guarantees both <strong>visibility AND atomicity</strong> — only one thread at a time, and all writes are flushed on exit. Use it for compound operations (check-then-act, read-modify-write).`
          },
          {
            title: 'Q: What is a deadlock? How do you prevent it?',
            body: `Deadlock: Thread A holds Lock 1, needs Lock 2. Thread B holds Lock 2, needs Lock 1. Both wait forever.<br><br>
<strong>Prevention strategies:</strong><br>
1. <em>Lock ordering</em> — always acquire locks in the same order (e.g., by ID). If every thread gets Lock A before Lock B, the cycle can't form.<br>
2. <em>tryLock with timeout</em> — use <code>ReentrantLock.tryLock(N, seconds)</code>. If you can't get it in N seconds, release what you have and retry.<br>
3. <em>Avoid nested locks</em> — the fewer nested locks, the smaller the risk.`
          },
          {
            title: 'Q: What is the difference between wait() and sleep()?',
            body: `<code>sleep(ms)</code>: pauses the thread for a fixed time. Does NOT release any lock. Available on any thread.<br><br>
<code>wait()</code>: pauses the thread AND releases the monitor lock so other threads can proceed. Must be called inside a <code>synchronized</code> block. Woken by <code>notify()</code>/<code>notifyAll()</code> or timeout.<br><br>
<strong>Key rule:</strong> always put <code>wait()</code> in a <code>while</code> loop, not an <code>if</code> — spurious wakeups are real.`
          },
          {
            title: 'Q: What is a thread-safe class? Give examples.',
            body: `A class is thread-safe if it behaves correctly when accessed by multiple threads simultaneously, with no external synchronization required.<br><br>
<strong>Examples in Java:</strong><br>
• Immutable: <code>String</code>, <code>Integer</code>, <code>LocalDate</code>, <code>BigDecimal</code><br>
• Synchronized: <code>StringBuffer</code>, <code>Hashtable</code>, <code>Vector</code><br>
• Concurrent: <code>ConcurrentHashMap</code>, <code>AtomicInteger</code>, <code>CopyOnWriteArrayList</code><br><br>
<strong>NOT thread-safe (need external sync):</strong> <code>ArrayList</code>, <code>HashMap</code>, <code>StringBuilder</code>, <code>SimpleDateFormat</code>`
          },
        ] },

        { t: 'sub', text: 'Locking & Synchronizers' },
        { t: 'cards', cols: 2, items: [
          {
            title: 'Q: When to use ReentrantLock over synchronized?',
            body: `Use <code>ReentrantLock</code> when you need features that <code>synchronized</code> can't provide:<br><br>
• <strong>Timeout:</strong> <code>tryLock(5, SECONDS)</code> — avoids deadlock by bailing out<br>
• <strong>Fairness:</strong> <code>new ReentrantLock(true)</code> — prevents starvation<br>
• <strong>Interruptibility:</strong> <code>lockInterruptibly()</code> — can interrupt waiting<br>
• <strong>Multiple condition variables:</strong> <code>lock.newCondition()</code><br><br>
For simple mutual exclusion with no timeouts needed, <code>synchronized</code> is simpler and less error-prone (no risk of forgetting unlock).`
          },
          {
            title: 'Q: What is the difference between CountDownLatch and CyclicBarrier?',
            body: `<code>CountDownLatch</code>: a one-way gate. One or more threads <em>wait</em>; others <em>count down</em>. When count = 0, waiters are released. <strong>Single-use</strong> — can't be reset.<br><br>
Use it for: "wait for all 3 services to start before accepting traffic."<br><br>
<code>CyclicBarrier</code>: a meeting point. All N threads must <em>arrive</em> before any proceeds. Automatically resets for the next round. <strong>Reusable</strong>.<br><br>
Use it for: "all 4 threads must finish Phase 1 before any starts Phase 2."`
          },
          {
            title: 'Q: What is a Semaphore and when do you use it?',
            body: `A Semaphore holds N permits. Threads <code>acquire()</code> a permit (blocking if none available) and <code>release()</code> when done. It limits <em>concurrency</em>, not exclusivity.<br><br>
<strong>Real examples:</strong><br>
• Max 10 concurrent calls to a fragile external API<br>
• Database connection pool (only 20 connections available)<br>
• Rate limiting: max 100 requests/second<br><br>
Key difference from a lock: a permit can be released by a <em>different thread</em> than the one that acquired it.`
          },
          {
            title: 'Q: What is "reentrant" in ReentrantLock?',
            body: `A lock is <strong>reentrant</strong> if a thread that already holds it can acquire it again without blocking itself.<br><br>
<strong>Without reentrancy:</strong> a synchronized method A calling synchronized method B on the same object would deadlock itself (Thread 1 holds the lock, then waits for the same lock for B).<br><br>
<strong>With reentrancy (Java's default):</strong> the JVM tracks the holding thread and a count. The same thread re-enters freely. Lock is released when the outermost block exits and count reaches 0.`
          },
        ] },

        { t: 'sub', text: 'Atomics, Executors & Modern Java' },
        { t: 'cards', cols: 2, items: [
          {
            title: 'Q: What is CAS (Compare-And-Swap)? How does AtomicInteger use it?',
            body: `CAS is a <strong>native CPU instruction</strong>: "set address X to value N, but ONLY if it currently holds expected value E. If not, do nothing and tell me."<br><br>
<code>AtomicInteger.incrementAndGet()</code> implements a spin loop: read current → compute new → CAS(current, new). If CAS fails (another thread changed it), loop and retry.<br><br>
<strong>Why it's better than locks:</strong> no thread ever sleeps or context-switches. For nanosecond-scale contention, 3-10x faster. Also immune to deadlock.`
          },
          {
            title: 'Q: When would you use LongAdder over AtomicLong?',
            body: `<code>AtomicLong</code>: one CAS cell. Under heavy contention (100 threads hammering at once), 99 fail their CAS and spin — wasted CPU.<br><br>
<code>LongAdder</code>: maintains a dynamic array of cells, threads hash to different cells, rarely collide. <code>sum()</code> adds them up when needed.<br><br>
<strong>Rule:</strong> use <code>AtomicLong</code> when you need frequent reads (it's exact and O(1)). Use <code>LongAdder</code> for write-heavy metrics (request counters, error counts) where you read the total infrequently.`
          },
          {
            title: 'Q: What is the difference between Runnable and Callable?',
            body: `<code>Runnable</code>: <code>void run()</code> — no return value, cannot throw checked exceptions. Use for "fire and forget" tasks.<br><br>
<code>Callable&lt;T&gt;</code>: <code>T call() throws Exception</code> — returns a value, can throw checked exceptions. Submit to an Executor; get a <code>Future&lt;T&gt;</code> back.<br><br>
<code>Future.get()</code> blocks until the result is ready. To avoid blocking, use <code>CompletableFuture</code> instead.`
          },
          {
            title: 'Q: What is CompletableFuture and why is it better than Future?',
            body: `<code>Future.get()</code> blocks the calling thread — chain 3 of them and you've re-serialized your parallel work.<br><br>
<code>CompletableFuture</code> lets you chain <strong>callbacks</strong> that fire automatically when each stage completes: <code>thenApply</code> transforms the result, <code>thenCompose</code> chains another future, <code>thenCombine</code> merges two futures, <code>exceptionally</code> handles errors.<br><br>
No thread ever blocks. Code reads like a pipeline. Used in Spring WebClient, reactive frameworks, and any non-blocking I/O code.`
          },
          {
            title: 'Q: What are virtual threads (Project Loom)? How are they different?',
            body: `<strong>Platform thread</strong> = 1:1 with OS thread. Max ~few thousand per JVM. Blocking one wastes an OS thread.<br><br>
<strong>Virtual thread</strong> = JVM-managed, backed by a heap object. You can have millions. When it blocks (I/O, sleep), the JVM unmounts it from its carrier OS thread, which then runs another virtual thread.<br><br>
<strong>Key benefit:</strong> write simple blocking code that scales like non-blocking code. Available in Java 21 via <code>Thread.ofVirtual()</code> or <code>Executors.newVirtualThreadPerTaskExecutor()</code>.`
          },
          {
            title: 'Q: What is ThreadLocal? What is the danger in thread pools?',
            body: `<code>ThreadLocal</code> gives each thread its own private value for the same variable. Thread 1 and Thread 2 see different values. Zero sharing, zero synchronization.<br><br>
<strong>Used by:</strong> Spring Security (current user), Hibernate (session), logging MDC (trace IDs).<br><br>
<strong>The danger:</strong> pool threads are REUSED. If you don't call <code>ThreadLocal.remove()</code> in a finally block, the old value from Request A leaks into Request B on the same thread. Always clean up.`
          },
          {
            title: 'Q: How do you prevent memory leaks in thread pools?',
            body: `Three common leak sources:<br><br>
1. <strong>ThreadLocal without remove()</strong> — value persists on the reused thread. Fix: <code>finally { tl.remove(); }</code><br>
2. <strong>Unbounded task queue</strong> — <code>Executors.newFixedThreadPool</code> uses an unbounded LinkedBlockingQueue. If tasks arrive faster than processed, queue grows until OOM. Fix: use <code>ArrayBlockingQueue(N)</code>.<br>
3. <strong>Uncancelled futures</strong> — references to large objects held in Future callbacks. Fix: cancel unused futures, use weak references for large objects in callbacks.`
          },
          {
            title: 'Q: What is "happens-before"? Why does it matter?',
            body: `A Java Memory Model guarantee: if action A <em>happens-before</em> action B, then everything A wrote is visible to B.<br><br>
Key happens-before rules:<br>
• A <code>synchronized</code> unlock happens-before the next lock of the same monitor<br>
• A <code>volatile</code> write happens-before subsequent reads of that variable<br>• <code>Thread.start()</code> happens-before any action in the started thread<br><br>
Without a happens-before, the JVM may reorder writes, and other threads may see stale cached values — the root cause of all visibility bugs.`
          },
        ] },

        { t: 'sub', text: 'Architecture & Design' },
        { t: 'cards', cols: 2, items: [
          {
            title: 'Q: How would you design a thread-safe Singleton?',
            body: `<strong>Best way — Enum:</strong> <code>enum Singleton { INSTANCE; }</code> Thread-safe by JVM class loading, serialization-safe, reflection-safe.<br><br>
<strong>Good way — Static inner class (lazy, no sync overhead):</strong><br>
<code>static class Holder { static final T INSTANCE = new T(); }</code> The JVM initializes it on first access — guaranteed thread-safe.<br><br>
<strong>Classic way — Double-checked locking (Java 5+):</strong><br>
requires <code>volatile</code> on the field to prevent half-initialized object being seen by other threads.`
          },
          {
            title: 'Q: What is the producer-consumer pattern and how do you implement it?',
            body: `Producers create work; consumers process it. A queue between them decouples their rates and provides backpressure.<br><br>
<strong>Old way:</strong> <code>wait()</code>/<code>notify()</code> in a synchronized loop — verbose, error-prone.<br><br>
<strong>Modern way:</strong> <code>BlockingQueue</code>. Producers call <code>put()</code> (blocks if full); consumers call <code>take()</code> (blocks if empty). The queue handles all coordination automatically.<br><br>
<code>ArrayBlockingQueue(N)</code> for bounded backpressure. <code>LinkedBlockingQueue</code> for unbounded (beware OOM).`
          },
        ] },

        { t: 'callout', kind: 'key', html: `<strong>You've covered the full arc.</strong> From CPU caches and race conditions all the way to virtual threads and structured concurrency. The common thread (pun intended): always understand what's shared, who writes it, and how you coordinate access. Get that mental model right, and the API choices follow naturally.` },
      ],
    },
  ],
};
