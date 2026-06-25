/* ============================================================
   Java Design Patterns — learning content as structured blocks.
   Rendered by app.js (shared with the other guides).
   Code is stored raw and auto-escaped on render, so < > & in
   code need no escaping. Avoid ${...} and backticks in code.
   ============================================================ */
window.CONTENT = {
  hero: {
    eyebrow: 'The Complete Guide',
    title: 'Java Design Patterns',
    sub: 'The Gang of Four patterns, the way you actually use them in Java. Three families — Creational, Structural, Behavioral — each pattern explained with its intent, a UML-style diagram, real Java code, when to reach for it, and the traps to avoid. Built for deep study and fast interview revision.',
    stats: [
      { num: '3', label: 'Families' },
      { num: '15+', label: 'Patterns' },
      { num: '40+', label: 'Code samples' },
      { num: '16', label: 'Diagrams' },
    ],
  },

  levels: [
    /* ========================================================
       FOUNDATIONS
       ======================================================== */
    {
      id: 'foundations', num: '00', accent: 'purple', part: 'Overview',
      eyebrow: 'Start Here',
      title: 'Foundations',
      intro: 'Design patterns are named, reusable solutions to recurring design problems — a shared vocabulary for talking about structure. Before the catalog, get the lay of the land: the three families, the SOLID principles patterns serve, and how to pick one.',
      blocks: [
        { t: 'sub', text: 'What a pattern is (and is not)' },
        { t: 'prose', html: `A pattern is a <strong>proven template</strong> for solving a class of problems, not copy-paste code. It captures intent and structure so two engineers can say "use a Strategy here" and immediately share a mental model. Patterns are about <strong>communication and flexibility</strong> — don't force one in where a plain method would do.` },
        { t: 'callout', kind: 'warning', html: `<strong>Don't over-engineer.</strong> A pattern adds indirection. Reach for one when you feel real pain (rigid creation, tangled dependencies, exploding subclasses) — not preemptively. The simplest design that works wins.` },

        { t: 'sub', text: 'The three families' },
        { t: 'prose', html: `The 23 classic GoF patterns split into three groups by <em>what they organise</em>:` },
        { t: 'diagram', name: 'categories', cap: 'Creational (object creation) · Structural (object composition) · Behavioral (object interaction)' },
        { t: 'table', head: ['Family', 'Concerned with', 'Examples'],
          rows: [
            ['Creational', 'How objects get created', 'Singleton, Factory, Builder'],
            ['Structural', 'How objects are composed into bigger structures', 'Adapter, Facade, Decorator, Proxy'],
            ['Behavioral', 'How objects communicate &amp; share responsibility', 'Strategy, Observer, State, Command'],
          ] },

        { t: 'sub', text: 'SOLID — the principles patterns serve' },
        { t: 'prose', html: `Patterns are tools for honouring good OO principles. Most exist to satisfy one or more of <strong>SOLID</strong>:` },
        { t: 'table', head: ['', 'Principle', 'In one line'],
          rows: [
            ['S', 'Single Responsibility', 'A class should have one reason to change'],
            ['O', 'Open/Closed', 'Open for extension, closed for modification'],
            ['L', 'Liskov Substitution', 'Subtypes must be usable wherever the base type is'],
            ['I', 'Interface Segregation', 'Many small interfaces beat one fat one'],
            ['D', 'Dependency Inversion', 'Depend on abstractions, not concretions'],
          ] },
        { t: 'callout', kind: 'key', html: `<strong>The golden thread:</strong> almost every pattern is really applying <em>Open/Closed</em> and <em>Dependency Inversion</em> — program to an interface, inject the variation, and you can extend behaviour without editing existing code.` },

        { t: 'sub', text: 'How to choose' },
        { t: 'list', items: [
          `Struggling with <strong>how/when objects are created</strong>? → a Creational pattern (Factory, Builder, Singleton).`,
          `Need to <strong>fit pieces together</strong> or simplify a messy structure? → a Structural pattern (Adapter, Facade, Decorator, Proxy).`,
          `Want to <strong>vary behaviour or coordinate objects</strong> at runtime? → a Behavioral pattern (Strategy, Observer, State, Command).`,
        ] },
      ],
    },

    /* ========================================================
       CREATIONAL
       ======================================================== */
    {
      id: 'creational', num: '01', accent: 'green', part: 'GoF Patterns',
      eyebrow: 'Family 1',
      title: 'Creational Patterns',
      intro: 'These patterns abstract the instantiation process — making a system independent of how its objects are created, composed, and represented. They give you control over the "new" keyword.',
      blocks: [
        { t: 'sub', text: 'Singleton' },
        { t: 'prose', html: `<strong>Intent:</strong> ensure a class has exactly <strong>one instance</strong> and give a global access point to it. Use for shared, stateless-ish resources: a DB connection pool, a config loader, a cache, a logger.` },
        { t: 'diagram', name: 'singleton', cap: 'One instance, private constructor, accessed via getInstance()' },
        { t: 'code', title: 'Singleton.java', code:
`// BEST in Java: an enum — thread-safe, serialization- & reflection-proof
public enum Config {
    INSTANCE;
    private final Properties props = load();
    public String get(String key) { return props.getProperty(key); }
}
// usage:  Config.INSTANCE.get("db.url");

// Lazy + thread-safe the classic way: double-checked locking
public class DbPool {
    private static volatile DbPool instance;      // volatile is REQUIRED
    private DbPool() { }
    public static DbPool getInstance() {
        if (instance == null) {                   // 1st check (no lock)
            synchronized (DbPool.class) {
                if (instance == null)             // 2nd check (locked)
                    instance = new DbPool();
            }
        }
        return instance;
    }
}` },
        { t: 'callout', kind: 'danger', html: `<strong>Watch thread safety.</strong> A naive lazy singleton creates two instances under concurrency. Fixes: the <code>enum</code> (simplest), double-checked locking with <code>volatile</code>, or the lazy-holder idiom. Also beware: singletons are global state — they make testing and reasoning harder, so use sparingly.` },

        { t: 'sub', text: 'Factory Method' },
        { t: 'prose', html: `<strong>Intent:</strong> define an interface for creating an object, but let subclasses decide which concrete class to instantiate. It <strong>decouples creation logic</strong> from use — the caller depends on an interface, not a constructor. Heavily used across the JDK and frameworks.` },
        { t: 'diagram', name: 'factoryMethod', cap: 'A creator returns a Product interface; subclasses pick the concrete type' },
        { t: 'code', title: 'FactoryMethod.java', code:
`interface Notification { void send(String msg); }
class EmailNotification implements Notification { public void send(String m) { } }
class SmsNotification   implements Notification { public void send(String m) { } }

abstract class NotificationFactory {
    abstract Notification create();               // <-- the factory method
    void notifyUser(String msg) { create().send(msg); }   // uses the product
}
class EmailFactory extends NotificationFactory {
    Notification create() { return new EmailNotification(); }
}
// client depends only on NotificationFactory / Notification, never on 'new Email...'` },
        { t: 'callout', kind: 'tip', html: `You meet it constantly: <code>Calendar.getInstance()</code>, <code>List.of(...)</code>, <code>LoggerFactory.getLogger(...)</code>. A plain <strong>static factory method</strong> (no subclassing) is the everyday lightweight cousin — clearer names than overloaded constructors and freedom to return a cached/subtype instance.` },

        { t: 'sub', text: 'Builder' },
        { t: 'prose', html: `<strong>Intent:</strong> construct a complex object step by step, separating construction from representation. Essential when an object has <strong>many (often optional) parameters</strong> — it kills the "telescoping constructor" anti-pattern and can produce an immutable result.` },
        { t: 'diagram', name: 'builder', cap: 'Fluent steps accumulate state, then build() produces the final object' },
        { t: 'code', title: 'Builder.java', code:
`// The JDK uses it everywhere, e.g. HttpRequest:
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com"))
    .header("Accept", "application/json")
    .timeout(Duration.ofSeconds(10))
    .GET()
    .build();

// Your own builder -> readable + immutable
public class User {
    private final String name;
    private final int age;
    private User(Builder b) { this.name = b.name; this.age = b.age; }

    public static class Builder {
        private String name;
        private int age;
        public Builder name(String n) { this.name = n; return this; }  // fluent
        public Builder age(int a)     { this.age = a;  return this; }
        public User build() { return new User(this); }
    }
}
User u = new User.Builder().name("Ada").age(36).build();` },
        { t: 'callout', kind: 'tip', html: `Use a Builder once you pass ~4+ constructor args or have optional fields. In modern Java, a <code>record</code> covers simple immutable data; reach for a Builder when construction is genuinely complex or stepwise. Lombok's <code>@Builder</code> generates all of this for you.` },

        { t: 'sub', text: 'The rest of the creational family' },
        { t: 'cards', cols: 2, items: [
          { title: 'Abstract Factory', body: 'A factory of factories — create whole <strong>families</strong> of related objects (e.g. a WindowsWidgetFactory vs MacWidgetFactory producing matching buttons, checkboxes).' },
          { title: 'Prototype', body: 'Create new objects by <strong>cloning</strong> an existing prototype instead of building from scratch — useful when construction is costly. Java\'s <code>Cloneable</code> / copy constructors.' },
        ] },
      ],
    },
    /* ========================================================
       STRUCTURAL
       ======================================================== */
    {
      id: 'structural', num: '02', accent: 'amber', part: 'GoF Patterns',
      eyebrow: 'Family 2',
      title: 'Structural Patterns',
      intro: 'These patterns are about composition — how classes and objects combine into larger structures while keeping them flexible and efficient. They are the glue and the wrappers of object-oriented design.',
      blocks: [
        { t: 'sub', text: 'Adapter' },
        { t: 'prose', html: `<strong>Intent:</strong> make two <strong>incompatible interfaces</strong> work together by wrapping one in an adapter that exposes the interface the client expects. The classic fix for integrating legacy or third-party code you can't change.` },
        { t: 'diagram', name: 'adapter', cap: 'The adapter implements the target interface and translates calls to the adaptee' },
        { t: 'code', title: 'Adapter.java', code:
`// What the client wants
interface MediaPlayer { void play(String file); }

// Adaptee: a legacy / third-party API with the "wrong" shape
class LegacyAudioEngine { void playAudio(byte[] data) { } }

// Adapter: implements the target, delegates to the adaptee
class AudioAdapter implements MediaPlayer {
    private final LegacyAudioEngine engine = new LegacyAudioEngine();
    public void play(String file) {
        byte[] data = readBytes(file);     // translate the call...
        engine.playAudio(data);            // ...to the adaptee's API
    }
}` },
        { t: 'callout', kind: 'tip', html: `In the JDK: <code>Arrays.asList()</code> adapts an array to a <code>List</code>; <code>InputStreamReader</code> adapts a byte stream to a char stream. Adapter vs Facade: an adapter changes an interface to match what's expected; a facade <em>simplifies</em> a complex one.` },

        { t: 'sub', text: 'Facade' },
        { t: 'prose', html: `<strong>Intent:</strong> provide a single, simple interface to a complex subsystem. The facade orchestrates many moving parts behind one friendly method, so clients don't need to know the internals.` },
        { t: 'diagram', name: 'facade', cap: 'One entry point hides the orchestration of many subsystems' },
        { t: 'code', title: 'Facade.java', code:
`// A messy subsystem of independent services
class InventoryService { boolean inStock(String id) { return true; } }
class PaymentService   { void charge(String acct, double amt) { } }
class ShippingService  { void ship(String id, String addr) { } }

// Facade: one method hides the choreography
class OrderFacade {
    private final InventoryService inv  = new InventoryService();
    private final PaymentService   pay  = new PaymentService();
    private final ShippingService  ship = new ShippingService();

    public void placeOrder(String item, String acct, String addr) {
        if (inv.inStock(item)) {
            pay.charge(acct, priceOf(item));
            ship.ship(item, addr);
        }
    }
}
// client just calls: orderFacade.placeOrder(...)` },
        { t: 'callout', kind: 'note', html: `A facade doesn't hide the subsystem — advanced clients can still use it directly. It just offers a convenient default path. Most service-layer classes in a Spring app are effectively facades over repositories and helpers.` },

        { t: 'sub', text: 'Decorator' },
        { t: 'prose', html: `<strong>Intent:</strong> attach extra behaviour to an object dynamically by <strong>wrapping</strong> it in objects that share the same interface. A flexible alternative to subclassing for extending functionality — stack as many wrappers as you like.` },
        { t: 'diagram', name: 'decorator', cap: 'Each wrapper adds behaviour and forwards to the one inside — same interface throughout' },
        { t: 'code', title: 'Decorator.java', code:
`interface Coffee { double cost(); String desc(); }

class Espresso implements Coffee {                 // the base component
    public double cost() { return 2.0; }
    public String desc() { return "espresso"; }
}

abstract class CoffeeDecorator implements Coffee { // wraps another Coffee
    protected final Coffee inner;
    CoffeeDecorator(Coffee c) { this.inner = c; }
}
class Milk extends CoffeeDecorator {
    Milk(Coffee c) { super(c); }
    public double cost() { return inner.cost() + 0.5; }
    public String desc() { return inner.desc() + " + milk"; }
}

Coffee order = new Milk(new Milk(new Espresso()));  // stack the wrappers
order.cost();   // 3.0` },
        { t: 'callout', kind: 'tip', html: `<strong>The canonical example is <code>java.io</code>:</strong> <code>new BufferedReader(new InputStreamReader(inputStream))</code> — each wrapper adds buffering / decoding without changing the <code>Reader</code> interface. UI toolkits use it for borders and scrollbars.` },

        { t: 'sub', text: 'Composite' },
        { t: 'prose', html: `<strong>Intent:</strong> compose objects into <strong>tree structures</strong> and let clients treat individual objects (leaves) and groups (composites) <em>uniformly</em> through one interface. Think file systems, UI component trees, org charts.` },
        { t: 'diagram', name: 'composite', cap: 'Leaves and composites share an interface, so the tree is processed uniformly' },
        { t: 'code', title: 'Composite.java', code:
`interface FileNode { int size(); }                 // common interface

class File implements FileNode {                   // leaf
    private final int bytes;
    File(int b) { this.bytes = b; }
    public int size() { return bytes; }
}

class Folder implements FileNode {                 // composite
    private final List<FileNode> children = new ArrayList<>();
    public void add(FileNode n) { children.add(n); }
    public int size() {                            // recurse uniformly
        return children.stream().mapToInt(FileNode::size).sum();
    }
}
// a Folder can hold Files AND Folders -- the client doesn't care which` },
        { t: 'callout', kind: 'note', html: `The power is uniformity: <code>node.size()</code> works whether <code>node</code> is a single file or a deep folder tree. The recursion lives inside the composite, not in client code.` },

        { t: 'sub', text: 'Proxy' },
        { t: 'prose', html: `<strong>Intent:</strong> provide a <strong>stand-in</strong> for another object to control access to it — same interface, but the proxy adds a layer: lazy loading, access control, caching, or remote calls.` },
        { t: 'diagram', name: 'proxy', cap: 'The proxy shares the real object\'s interface and decides when/whether to forward' },
        { t: 'code', title: 'Proxy.java', code:
`interface Image { void render(); }

class RealImage implements Image {                 // heavy: loads from disk
    RealImage(String path) { loadFromDisk(path); } // expensive!
    public void render() { }
}

class LazyImageProxy implements Image {            // defers the heavy work
    private final String path;
    private RealImage real;                        // created only when needed
    LazyImageProxy(String path) { this.path = path; }
    public void render() {
        if (real == null) real = new RealImage(path);   // lazy init
        real.render();
    }
}` },
        { t: 'callout', kind: 'key', html: `<strong>Proxy powers Spring.</strong> <code>@Transactional</code>, <code>@Cacheable</code>, and <code>@Async</code> all work by wrapping your bean in a dynamic proxy that runs extra logic around your method — that's why calling an annotated method from <em>within the same class</em> bypasses it (the call doesn't go through the proxy).` },

        { t: 'sub', text: 'The rest of the structural family' },
        { t: 'cards', cols: 2, items: [
          { title: 'Bridge', body: 'Split an abstraction from its implementation so the two vary <strong>independently</strong> (e.g. Shape × RenderingEngine) instead of a class explosion of every combination.' },
          { title: 'Flyweight', body: 'Share fine-grained objects to save memory when you have <strong>huge numbers</strong> of similar instances (e.g. interning characters/glyphs, Java\'s <code>Integer</code> cache).' },
        ] },
      ],
    },
    /* ========================================================
       BEHAVIORAL
       ======================================================== */
    {
      id: 'behavioral', num: '03', accent: 'cyan', part: 'GoF Patterns',
      eyebrow: 'Family 3',
      title: 'Behavioral Patterns',
      intro: 'These patterns are about communication — how objects interact, distribute responsibility, and vary behaviour at runtime. They are the most numerous family and the ones you reach for most in everyday app logic.',
      blocks: [
        { t: 'sub', text: 'Strategy' },
        { t: 'prose', html: `<strong>Intent:</strong> define a family of interchangeable algorithms, encapsulate each one, and make them <strong>swappable at runtime</strong>. The classic answer to a big <code>if/else</code> or <code>switch</code> over "which algorithm" — payment methods, sort orders, compression schemes.` },
        { t: 'diagram', name: 'strategy', cap: 'The context delegates to a strategy interface; concrete strategies are swapped in' },
        { t: 'code', title: 'Strategy.java', code:
`interface PaymentStrategy { void pay(double amount); }

class CreditCardPayment implements PaymentStrategy {
    public void pay(double amt) { }
}
class PayPalPayment implements PaymentStrategy {
    public void pay(double amt) { }
}

class Checkout {
    private PaymentStrategy strategy;                  // the swappable part
    public void setStrategy(PaymentStrategy s) { this.strategy = s; }
    public void process(double amt) { strategy.pay(amt); }   // delegate
}

Checkout c = new Checkout();
c.setStrategy(new PayPalPayment());                   // choose at runtime
c.process(99.0);` },
        { t: 'callout', kind: 'tip', html: `In modern Java a strategy is often just a <strong>lambda</strong> — <code>Comparator</code>, <code>Runnable</code>, and any functional interface are strategies. <code>list.sort(Comparator.comparing(User::age))</code> is Strategy in action.` },

        { t: 'sub', text: 'Observer' },
        { t: 'prose', html: `<strong>Intent:</strong> define a one-to-many dependency so that when one object (the <strong>subject</strong>) changes state, all its <strong>observers</strong> are notified automatically. The backbone of event listeners and pub/sub.` },
        { t: 'diagram', name: 'observer', cap: 'The subject broadcasts state changes to all registered observers' },
        { t: 'code', title: 'Observer.java', code:
`interface Observer { void update(String event); }

class NewsAgency {                                     // the subject
    private final List<Observer> observers = new ArrayList<>();
    public void subscribe(Observer o) { observers.add(o); }
    public void publish(String news) {
        for (Observer o : observers) o.update(news);   // notify everyone
    }
}

class EmailSubscriber implements Observer {
    public void update(String event) { }
}
// agency.subscribe(new EmailSubscriber()); agency.publish("breaking!");` },
        { t: 'callout', kind: 'note', html: `The old <code>java.util.Observer</code> is deprecated — use <code>PropertyChangeListener</code>, Spring's <code>ApplicationEvent</code> / <code>@EventListener</code>, or a reactive library. The pattern is everywhere: UI click listeners, message subscribers, reactive streams.` },

        { t: 'sub', text: 'Command' },
        { t: 'prose', html: `<strong>Intent:</strong> turn a request into a standalone <strong>object</strong>, capturing the action and its parameters. That lets you queue, log, schedule, and — crucially — <strong>undo</strong> operations.` },
        { t: 'diagram', name: 'command', cap: 'An invoker holds command objects; each command knows its receiver and how to execute/undo' },
        { t: 'code', title: 'Command.java', code:
`interface Command { void execute(); void undo(); }

class Light { void on() { } void off() { } }          // the receiver

class LightOnCommand implements Command {
    private final Light light;
    LightOnCommand(Light l) { this.light = l; }
    public void execute() { light.on(); }
    public void undo()    { light.off(); }
}

class RemoteControl {                                  // the invoker
    private final Deque<Command> history = new ArrayDeque<>();
    public void press(Command c) { c.execute(); history.push(c); }
    public void undoLast() { if (!history.isEmpty()) history.pop().undo(); }
}` },
        { t: 'callout', kind: 'tip', html: `A <code>Runnable</code> is essentially a Command. The undo stack is the killer feature — text editors, transaction logs, and task queues all lean on it. Pair with Memento to snapshot state for richer undo.` },

        { t: 'sub', text: 'State' },
        { t: 'prose', html: `<strong>Intent:</strong> let an object alter its behaviour when its internal state changes — it appears to "change class". Each state is its own object that knows the valid transitions. The clean replacement for sprawling status <code>switch</code> statements.` },
        { t: 'diagram', name: 'state', cap: 'Each state encapsulates its behaviour and the transition to the next state' },
        { t: 'code', title: 'State.java', code:
`interface OrderState { OrderState next(); String name(); }

class NewState implements OrderState {
    public OrderState next() { return new PaidState(); }
    public String name() { return "NEW"; }
}
class PaidState implements OrderState {
    public OrderState next() { return new ShippedState(); }
    public String name() { return "PAID"; }
}
class ShippedState implements OrderState {
    public OrderState next() { return this; }          // terminal
    public String name() { return "SHIPPED"; }
}

class Order {
    private OrderState state = new NewState();
    public void advance() { state = state.next(); }    // behaviour follows state
    public String status() { return state.name(); }
}` },
        { t: 'callout', kind: 'key', html: `<strong>State vs Strategy:</strong> identical structure, different intent. With Strategy the <em>client</em> picks the algorithm; with State the object <em>transitions itself</em> between states. Order processing, document workflow, and TCP connections are textbook State.` },

        { t: 'sub', text: 'Template Method' },
        { t: 'prose', html: `<strong>Intent:</strong> define the <strong>skeleton</strong> of an algorithm in a base method, deferring specific steps to subclasses via hooks. The overall flow is fixed; subclasses customise the variable parts — without touching the structure.` },
        { t: 'diagram', name: 'templateMethod', cap: 'The base class fixes the steps; subclasses override only the hooks' },
        { t: 'code', title: 'TemplateMethod.java', code:
`abstract class DataExporter {
    // the template method -- final so the skeleton can't be changed
    public final void export() {
        open();
        writeHeader();                  // hook with a default
        writeBody();                    // required hook
        close();
    }
    private void open()  { }
    private void close() { }
    protected void writeHeader() { }    // subclasses MAY override
    protected abstract void writeBody();// subclasses MUST override
}

class CsvExporter extends DataExporter {
    protected void writeBody() { }      // fills in just this step
}` },
        { t: 'callout', kind: 'note', html: `Inversion of control — the parent calls down into your overrides ("don't call us, we'll call you"). Frameworks live on this: <code>HttpServlet.service()</code> calls <code>doGet()</code>/<code>doPost()</code>; <code>AbstractList</code> implements most methods atop <code>get()</code> and <code>size()</code>.` },

        { t: 'sub', text: 'Chain of Responsibility' },
        { t: 'prose', html: `<strong>Intent:</strong> pass a request along a <strong>chain of handlers</strong> until one handles it. Each handler decides to process the request or forward it — decoupling sender from receiver. The shape of every middleware pipeline.` },
        { t: 'diagram', name: 'chain', cap: 'Each handler either processes the request or passes it to the next in line' },
        { t: 'code', title: 'ChainOfResponsibility.java', code:
`abstract class Handler {
    protected Handler next;
    public Handler linkTo(Handler n) { this.next = n; return n; }

    public void handle(Request req) {
        if (canHandle(req)) process(req);
        else if (next != null) next.handle(req);     // pass it down
    }
    abstract boolean canHandle(Request req);
    abstract void process(Request req);
}

// build the pipeline:  auth -> rate-limit -> logging -> controller
authHandler.linkTo(rateLimitHandler).linkTo(loggingHandler);` },
        { t: 'callout', kind: 'tip', html: `You use this daily: Servlet <code>Filter</code> chains, the Spring Security filter chain, Spring MVC interceptors, and most HTTP middleware are Chain of Responsibility.` },

        { t: 'sub', text: 'Iterator' },
        { t: 'prose', html: `<strong>Intent:</strong> provide a way to traverse a collection sequentially <strong>without exposing its internal structure</strong>. You can swap an ArrayList for a tree and the traversal code doesn't change.` },
        { t: 'diagram', name: 'iterator', cap: 'The iterator walks the elements; the collection\'s internals stay hidden' },
        { t: 'code', title: 'Iterator.java', code:
`List<String> names = List.of("a", "b", "c");

// explicit iterator
Iterator<String> it = names.iterator();
while (it.hasNext()) {
    String n = it.next();
}

// the for-each loop is syntactic sugar over Iterable/Iterator:
for (String n : names) { }

// any class implementing Iterable can be iterated -- including your own
class Bag<T> implements Iterable<T> {
    public Iterator<T> iterator() { return /* your traversal */ null; }
}` },
        { t: 'callout', kind: 'note', html: `It's so fundamental that Java bakes it into the language: every <code>Collection</code> is <code>Iterable</code>, and <code>for-each</code> compiles down to iterator calls. Implement <code>Iterable</code> on your own structures to get <code>for-each</code> for free.` },

        { t: 'sub', text: 'The rest of the behavioral family' },
        { t: 'cards', cols: 3, items: [
          { title: 'Mediator', body: 'Centralise complex many-to-many communication in one mediator object, so components don\'t reference each other directly (e.g. a chat room, a UI dialog coordinator).' },
          { title: 'Memento', body: 'Capture and restore an object\'s state without exposing its internals — the snapshot behind undo/redo and checkpoints.' },
          { title: 'Visitor', body: 'Add new operations to a fixed object structure without changing its classes — separate the algorithm from the elements it walks.' },
        ] },
        { t: 'callout', kind: 'key', html: `<strong>You made it — all three families.</strong> The interview essentials: know each pattern's <em>intent</em> in one sentence, a real Java example (most live in the JDK and Spring), and the classic distinctions — Strategy vs State, Adapter vs Facade, Factory vs Builder. Revisit the diagrams; pattern names are a vocabulary you build by recognising them in code you already use.` },
      ],
    },
  ],
};
