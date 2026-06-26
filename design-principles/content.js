/* ============================================================
   Java Design Principles — learning content as structured blocks.
   Rendered by app.js (shared with the other guides).
   Code is stored raw and auto-escaped on render, so < > & in
   code need no escaping. Avoid ${...} and backticks in code.
   ============================================================ */
window.CONTENT = {
  hero: {
    eyebrow: 'The Complete Guide',
    title: 'Java Design Principles',
    sub: 'The rules that keep code easy to change. SOLID gives you five principles for flexible classes; the everyday heuristics — DRY, KISS, YAGNI, Law of Demeter, Fail-Fast, contracts — keep you honest day to day. Each principle here comes with its core idea, a diagram, bad-vs-good Java code, and when it actually applies. Built for deep study and fast interview revision.',
    stats: [
      { num: '5', label: 'SOLID' },
      { num: '15+', label: 'Principles' },
      { num: '35+', label: 'Code samples' },
      { num: '11', label: 'Diagrams' },
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
      intro: 'Principles are the "why" behind patterns — guidelines for writing code that is easy to read, change, and extend. They are not laws to apply mechanically but pressures to balance. The two ideas underneath all of them: high cohesion and low coupling.',
      blocks: [
        { t: 'sub', text: 'Cohesion & coupling — the north star' },
        { t: 'prose', html: `Almost every principle is in service of two goals. <strong>High cohesion:</strong> a module's parts truly belong together and serve one purpose. <strong>Low coupling:</strong> modules depend on each other as little as possible, through thin, stable interfaces. Aim for both and code becomes safe to change — touch one thing without breaking ten others.` },
        { t: 'diagram', name: 'cohesionCoupling', cap: 'The goal: tight, focused modules connected by thin seams' },

        { t: 'sub', text: 'Principles vs. patterns' },
        { t: 'prose', html: `<strong>Principles</strong> are the goals (e.g. "depend on abstractions"); <strong>patterns</strong> are proven structures that achieve them (e.g. Strategy, Factory). You learn patterns to recognise solutions; you learn principles to know <em>why</em> a design is good — and when a pattern would be over-engineering.` },
        { t: 'callout', kind: 'key', html: `<strong>The throughline:</strong> manage change. Good design isolates what varies so a new requirement means <em>adding</em> code, not <em>rewriting</em> it. Every principle below is a different angle on that single idea.` },

        { t: 'sub', text: 'The two groups' },
        { t: 'table', head: ['Group', 'What it is', 'Examples'],
          rows: [
            ['SOLID', 'Five OO principles for class design', 'SRP, OCP, LSP, ISP, DIP'],
            ['Heuristics', 'Everyday rules of thumb for clean code', 'DRY, KISS, YAGNI, Demeter, Fail-Fast'],
          ] },
        { t: 'callout', kind: 'warning', html: `Principles can conflict — DRY pushes you to abstract, KISS/YAGNI push back against premature abstraction. Judgement is the skill: apply them to reduce real pain, not to score points. <strong>A rule followed blindly becomes its own anti-pattern.</strong>` },
      ],
    },

    /* ========================================================
       SOLID
       ======================================================== */
    {
      id: 'solid', num: '01', accent: 'blue', part: 'The Rules',
      eyebrow: 'Group 1',
      title: 'SOLID',
      intro: 'Five principles (Robert C. Martin) for object-oriented class design. Together they push you toward classes that are focused, extensible, and decoupled — the foundation of maintainable systems and the basis of dependency-injection frameworks like Spring.',
      blocks: [
        { t: 'diagram', name: 'solid', cap: 'Single Responsibility · Open/Closed · Liskov · Interface Segregation · Dependency Inversion' },

        { t: 'sub', text: 'S — Single Responsibility (SRP)' },
        { t: 'prose', html: `A class should have <strong>one reason to change</strong> — one responsibility, one stakeholder. When a class handles persistence <em>and</em> email <em>and</em> validation, a change to any one risks the others, and the class grows into a "god object".` },
        { t: 'diagram', name: 'srp', cap: 'Split a multi-job class so each piece has a single reason to change' },
        { t: 'code', title: 'SRP — split the responsibilities', code:
`// BAD: one class, three reasons to change
class User {
    void save()        { /* JDBC persistence */ }
    void sendEmail()   { /* SMTP */ }
    boolean validate() { /* business rules */ }
}

// GOOD: one responsibility each
class User { /* just data */ }
class UserRepository { void save(User u) { } }       // persistence
class EmailService   { void send(User u, String m) { } }  // messaging
class UserValidator  { boolean isValid(User u) { return true; } }  // rules` },
        { t: 'callout', kind: 'tip', html: `Heuristic for "one responsibility": describe the class in a sentence. If you need "and", it probably does too much. SRP is what makes the other principles possible.` },

        { t: 'sub', text: 'O — Open/Closed (OCP)' },
        { t: 'prose', html: `Software entities should be <strong>open for extension, closed for modification</strong>. You should be able to add new behaviour by writing <em>new</em> code, not by editing existing, tested code. The mechanism is abstraction + polymorphism.` },
        { t: 'diagram', name: 'ocp', cap: 'Add a new Shape implementation; never touch the existing ones' },
        { t: 'code', title: 'OCP — extend, don\'t edit', code:
`// BAD: every new shape forces an edit to this method
double area(Shape s) {
    if (s instanceof Circle c) return Math.PI * c.r * c.r;
    if (s instanceof Square q) return q.side * q.side;
    // ...edit again for Triangle, again for Hexagon...
}

// GOOD: each shape owns its area; adding one edits nothing
interface Shape { double area(); }
class Circle   implements Shape { double r;    public double area() { return Math.PI*r*r; } }
class Triangle implements Shape { double b, h; public double area() { return 0.5*b*h; } } // NEW` },
        { t: 'callout', kind: 'note', html: `OCP is why <code>switch</code>-on-type is a smell: it must be reopened for every new case. Replace it with polymorphism (or a Strategy) and new cases slot in untouched.` },

        { t: 'sub', text: 'L — Liskov Substitution (LSP)' },
        { t: 'prose', html: `Subtypes must be <strong>substitutable</strong> for their base type without breaking correctness. If code works with a <code>Base</code>, handing it any <code>Subtype</code> must not surprise it. A subtype that strengthens preconditions or weakens guarantees violates LSP — even if it compiles.` },
        { t: 'diagram', name: 'lsp', cap: 'A subtype must honour the base type\'s contract — Square breaks Rectangle\'s' },
        { t: 'code', title: 'LSP — the classic Rectangle/Square trap', code:
`class Rectangle {
    protected int w, h;
    void setW(int w) { this.w = w; }
    void setH(int h) { this.h = h; }
    int area() { return w * h; }
}
class Square extends Rectangle {        // "a square IS-A rectangle"... is it?
    void setW(int w) { this.w = w; this.h = w; }   // forces both
    void setH(int h) { this.w = h; this.h = h; }
}

// A method that trusts Rectangle's contract now breaks:
void test(Rectangle r) {
    r.setW(5); r.setH(4);
    assert r.area() == 20;   // FAILS for Square (area is 16) -> LSP violated
}` },
        { t: 'callout', kind: 'danger', html: `"Is-a" in English doesn't mean "is-a" in code — what matters is <strong>behavioural</strong> substitutability. When inheritance breaks the contract, prefer composition or model the types separately.` },

        { t: 'sub', text: 'I — Interface Segregation (ISP)' },
        { t: 'prose', html: `No client should be forced to depend on methods it doesn't use. Prefer <strong>many small, role-specific interfaces</strong> over one fat one. A fat interface forces implementers to stub or throw on methods they can't support — a clear smell.` },
        { t: 'diagram', name: 'isp', cap: 'Break a fat interface into focused ones clients can pick from' },
        { t: 'code', title: 'ISP — small, focused interfaces', code:
`// BAD: a fat interface
interface Machine { void print(); void scan(); void fax(); }
class SimplePrinter implements Machine {
    public void print() { }
    public void scan() { throw new UnsupportedOperationException(); }  // smell
    public void fax()  { throw new UnsupportedOperationException(); }  // smell
}

// GOOD: segregate by role
interface Printer { void print(); }
interface Scanner { void scan(); }
class SimplePrinter implements Printer { public void print() { } }   // only what it needs
class AllInOne    implements Printer, Scanner { public void print(){} public void scan(){} }` },
        { t: 'callout', kind: 'tip', html: `Java's <code>Comparable</code>, <code>Runnable</code>, <code>Closeable</code> are tiny single-method interfaces — textbook ISP. A class composes exactly the roles it actually fulfils.` },

        { t: 'sub', text: 'D — Dependency Inversion (DIP)' },
        { t: 'prose', html: `High-level modules shouldn't depend on low-level modules — <strong>both should depend on abstractions</strong>. And abstractions shouldn't depend on details; details depend on abstractions. This "inverts" the usual direction and is the foundation of dependency injection.` },
        { t: 'diagram', name: 'dip', cap: 'Policy and detail both point at the abstraction in the middle' },
        { t: 'code', title: 'DIP — depend on an interface, inject the detail', code:
`// BAD: high-level service hard-wired to a concrete DB
class OrderService {
    private final MySqlDatabase db = new MySqlDatabase();   // can't swap or test
}

// GOOD: depend on an abstraction; the implementation is injected
interface OrderRepository { void save(Order o); }

class OrderService {
    private final OrderRepository repo;          // abstraction
    OrderService(OrderRepository repo) { this.repo = repo; }   // DI
}
class MySqlOrderRepository implements OrderRepository { public void save(Order o) { } }
// tests inject a fake; prod injects MySql -- OrderService never changes` },
        { t: 'callout', kind: 'key', html: `<strong>This is the heart of Spring.</strong> <code>@Autowired</code> on an interface lets the framework inject any implementation — so your business logic depends only on abstractions, becoming testable and swappable. DIP + OCP are the two principles you apply most.` },
      ],
    },
    /* ========================================================
       HEURISTICS
       ======================================================== */
    {
      id: 'heuristics', num: '02', accent: 'amber', part: 'The Rules',
      eyebrow: 'Group 2',
      title: 'Heuristics',
      intro: 'The everyday rules of thumb that keep code clean and honest. Less formal than SOLID, but you apply them on every commit. The recurring theme: remove duplication, resist complexity, and make failures loud and early.',
      blocks: [
        { t: 'sub', text: 'DRY — Don\'t Repeat Yourself' },
        { t: 'prose', html: `Every piece of knowledge should have a <strong>single, authoritative representation</strong>. Duplicated logic means a bug must be fixed in N places — and you'll miss one. Consolidate repeated logic into one function, constant, or class.` },
        { t: 'diagram', name: 'dry', cap: 'Collapse copy-pasted logic into one source of truth' },
        { t: 'code', title: 'DRY — one source of truth', code:
`// BAD: the tax rule is copy-pasted (change it once, miss the others)
double priceWithTax = price + price * 0.20;
double orderTotal   = qty * (item + item * 0.20);

// GOOD: define it once
double withTax(double amount) { return amount * 1.20; }
double priceWithTax = withTax(price);
double orderTotal   = withTax(qty * item);` },
        { t: 'callout', kind: 'warning', html: `<strong>Don't over-DRY.</strong> Two pieces of code that look alike but change for <em>different reasons</em> are not duplication — merging them creates false coupling. DRY is about duplicated <em>knowledge</em>, not duplicated <em>characters</em>.` },

        { t: 'sub', text: 'KISS — Keep It Simple' },
        { t: 'prose', html: `The simplest solution that works is usually the best. Clever, dense code is a liability — it's read far more often than it's written. Optimise for the next person (often future-you) understanding it at a glance.` },
        { t: 'code', title: 'KISS — clarity beats cleverness', code:
`// Over-clever
boolean isEven = (n & 1) == 0 ? true : false;
String s = list.stream().reduce("", (a, b) -> a + b);   // why?

// Simple
boolean isEven = n % 2 == 0;
String s = String.join("", list);` },
        { t: 'callout', kind: 'tip', html: `Complexity is the enemy of reliability. If you can't explain a method in a sentence, it's probably doing too much — split it or simplify it.` },

        { t: 'sub', text: 'YAGNI — You Aren\'t Gonna Need It' },
        { t: 'prose', html: `Don't build functionality on speculation. Adding a configurable plugin system, a generic abstraction, or a "future-proof" layer before there's a concrete need is <strong>over-engineering</strong> — it's code to maintain, test, and read for a requirement that may never come.` },
        { t: 'callout', kind: 'key', html: `<strong>KISS + YAGNI vs DRY/OCP:</strong> the eternal tension. Build the simplest thing now (YAGNI), and introduce abstraction (OCP, patterns) only when a <em>second</em> real case proves it's needed. "Three strikes then refactor" — duplicate once, abstract on the third.` },

        { t: 'sub', text: 'Law of Demeter — don\'t talk to strangers' },
        { t: 'prose', html: `A method should only call methods on: itself, its parameters, objects it creates, and its direct fields. Reaching <em>through</em> objects — <code>a.getB().getC().getD().do()</code> — couples you to the entire object graph; one internal change breaks you.` },
        { t: 'diagram', name: 'demeter', cap: 'Reaching through objects (a train wreck) vs asking your direct friend' },
        { t: 'code', title: 'Law of Demeter — tell, don\'t ask', code:
`// BAD: a "train wreck" — knows Customer, Address, AND City internals
String city = order.getCustomer().getAddress().getCity().toUpperCase();

// GOOD: let Order expose what callers actually need
String city = order.shippingCity();   // Order delegates internally
// callers depend only on Order, not its whole object graph` },
        { t: 'callout', kind: 'note', html: `Chained getters aren't always wrong — fluent builders and streams chain deliberately. The smell is reaching across <em>ownership boundaries</em> to pull data out, instead of asking the object to do the work.` },

        { t: 'sub', text: 'Fail-Fast' },
        { t: 'prose', html: `Validate inputs and invariants <strong>at the boundary</strong> and throw <em>immediately</em> on violation. A bug caught at the entry point has a clear cause; the same bad data flowing deep into the system corrupts state and produces a baffling stack trace far from the real problem.` },
        { t: 'diagram', name: 'failFast', cap: 'Reject bad input at the door, not three layers deep' },
        { t: 'code', title: 'Fail-Fast — guard at the entry', code:
`void transfer(Account from, Account to, BigDecimal amount) {
    Objects.requireNonNull(from, "from account");
    Objects.requireNonNull(to,   "to account");
    if (amount.signum() <= 0)
        throw new IllegalArgumentException("amount must be positive");

    // from here on, every line can TRUST its inputs
    from.debit(amount);
    to.credit(amount);
}` },
        { t: 'callout', kind: 'tip', html: `<code>Objects.requireNonNull</code>, <code>Objects.checkIndex</code>, and Spring's <code>Assert</code> exist precisely for this. Failing fast turns "mysterious corruption later" into "clear exception now".` },

        { t: 'sub', text: 'Method Contracts' },
        { t: 'prose', html: `Every method has an implicit contract: <strong>preconditions</strong> the caller must satisfy, and <strong>postconditions</strong> the method guarantees in return (plus invariants it preserves). Make them explicit — in docs, and enforced with guards — so both sides know the deal.` },
        { t: 'diagram', name: 'contracts', cap: 'Caller satisfies the precondition; the method guarantees the postcondition' },
        { t: 'code', title: 'Method contract — preconditions & postconditions', code:
`/**
 * Returns the element at the given position.
 * Precondition:  0 <= index < size()       (the CALLER must ensure this)
 * Postcondition: returns that element; the list is left unchanged (the METHOD promises)
 * @throws IndexOutOfBoundsException if the precondition is violated
 */
public E get(int index) {
    Objects.checkIndex(index, size);   // enforce the precondition (fail fast)
    return elements[index];            // honour the postcondition
}` },
        { t: 'callout', kind: 'note', html: `Contracts connect to Liskov: a subtype may <em>weaken</em> preconditions and <em>strengthen</em> postconditions, never the reverse — that's exactly what keeps it substitutable.` },
      ],
    },

    /* ========================================================
       MORE PRINCIPLES
       ======================================================== */
    {
      id: 'more', num: '03', accent: 'green', part: 'The Rules',
      eyebrow: 'Group 3',
      title: 'More Principles',
      intro: 'A handful of high-leverage principles that sit alongside SOLID and the heuristics — the ones that quietly shape good designs and come up constantly in code review and interviews.',
      blocks: [
        { t: 'sub', text: 'Composition over Inheritance' },
        { t: 'prose', html: `Favour <strong>has-a over is-a</strong>. Inheritance is rigid (fixed at compile time, exposes the parent's internals, and breaks easily — see the Penguin). Composing behaviours as injected collaborators is flexible: swap them at runtime and avoid deep, brittle hierarchies.` },
        { t: 'diagram', name: 'composition', cap: 'Inheritance locks behaviour in; composition lets you mix and swap it' },
        { t: 'code', title: 'Composition over inheritance', code:
`// BAD: inheritance forces every Bird to fly
class Bird { void fly() { } }
class Penguin extends Bird { }     // penguins can't fly -> LSP violation

// GOOD: compose the behaviour (has-a), choose it per instance
interface FlyBehavior { void fly(); }
class Bird {
    private final FlyBehavior flyBehavior;        // has-a
    Bird(FlyBehavior fb) { this.flyBehavior = fb; }
    void performFly() { flyBehavior.fly(); }
}
Bird duck    = new Bird(() -> soar());
Bird penguin = new Bird(() -> { });               // simply doesn't fly` },
        { t: 'callout', kind: 'key', html: `This is the principle behind Strategy, Decorator, and most of the GoF catalog — and the reason "prefer composition" is the most repeated advice in OO design.` },

        { t: 'sub', text: 'Program to an Interface, not an Implementation' },
        { t: 'prose', html: `Declare variables, parameters, and return types as the most <strong>abstract</strong> type that does the job. You stay free to change the concrete implementation without touching callers.` },
        { t: 'code', title: 'Program to an interface', code:
`// BAD: tied to a concrete type
ArrayList<String> names = new ArrayList<>();
public ArrayList<String> load() { ... }

// GOOD: depend on the abstraction
List<String> names = new ArrayList<>();    // swap to LinkedList/CopyOnWrite freely
public List<String> load() { ... }         // callers don't care which List` },

        { t: 'sub', text: 'Separation of Concerns' },
        { t: 'prose', html: `Divide a program into distinct sections, each addressing a separate concern — and keep them apart. The classic layering (controller → service → repository) is SoC: HTTP handling, business logic, and persistence each live in their own layer, so each can change independently.` },

        { t: 'sub', text: 'Encapsulate What Varies' },
        { t: 'prose', html: `Identify the parts of your design that are likely to change, and isolate them behind a stable interface. Everything that stays the same is shielded from everything that moves. This is the meta-principle behind OCP, Strategy, and most patterns — "find what varies and wrap it".` },

        { t: 'sub', text: 'Principle of Least Astonishment' },
        { t: 'prose', html: `Code should behave the way a reader reasonably expects. A method named <code>getX()</code> shouldn't mutate state; <code>equals()</code> shouldn't throw; a "save" shouldn't also send emails. Surprising behaviour is where bugs and misuse breed — predictability is a feature.` },
        { t: 'callout', kind: 'key', html: `<strong>You made it.</strong> SOLID for class design, heuristics for daily craft, and the meta-principles tying them together. The interview essentials: state each in one line, give a Java example, and — crucially — know the <em>tensions</em> (DRY vs YAGNI, inheritance vs composition, when a principle would be over-engineering). Good design is judgement, not rule-following.` },
      ],
    },
  ],
};
