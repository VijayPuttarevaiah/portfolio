/**
 * SINGLE SOURCE OF TRUTH for every claim on this site.
 *
 * Everything here traces to CONTEXT.md / the master resume in the parent
 * repository. Nothing is invented, inflated, or rounded up.
 *
 * Hard constraints carried over from CONTEXT.md — do not "improve" these:
 *  - "3.5 years" of software engineering. Measured as elapsed time in the
 *    field: Apr 2022 (Wipro start) to Dec 2025 (Acuver end) is 3yr8mo, so
 *    3.5 is accurate and slightly conservative. Do NOT recompute this as
 *    summed employment months (3yr3mo) and "correct" it back down to 3+.
 *  - "5 years" is TOTAL industry experience, not engineering experience.
 *  - Amazon was NOT a software engineering role (Transaction Risk
 *    Investigator). Never imply otherwise, and never surface the technical
 *    half of the ATLAS fact here.
 *  - The Shopizer pull request is OPEN, not merged. Say "submitted"/"open".
 *  - MeetFocus has NO frontend. Never describe UI work on it.
 *  - Work authorization: "Eligible to work in Canada." Never imply PR or
 *    citizenship.
 */

export const person = {
  name: "Vijay Puttarevaiah",
  headline: "Software Engineer",
  tagline:
    "I build software that has to keep running — services, APIs, and the infrastructure around them. Three and a half years of that in production, at Wipro and Acuver Consulting.",
  /** Not displayed on the page — retained for structured data only. */
  location: "Halifax, Nova Scotia",
  email: "vijayputtarevaiah@gmail.com",
  phone: "902-452-2085",
  github: "https://github.com/VijayPuttarevaiah",
  githubHandle: "VijayPuttarevaiah",
  linkedin: "https://linkedin.com/in/vijayputtarevaiah",
  linkedinHandle: "in/vijayputtarevaiah",
  resumeHref: "/resume.pdf",
  portfolio: "https://vijayputtarevaiah.vercel.app",
  workAuth: "Eligible to work in Canada",
  availability: "Available for Winter 2027 co-op — 4 and 8 month terms",
} as const;

/** Hero stat strip. Each figure is verified in CONTEXT.md. */
export const stats = [
  { value: "3.5", label: "years as a software engineer" },
  { value: "5", label: "years in industry overall" },
  { value: "2", label: "AWS certifications" },
  { value: "3.88", label: "GPA at Dalhousie, out of 4.30" },
] as const;

export const about = {
  paragraphs: [
    "I spent three and a half years building backend systems before coming back to school. Order routing for a US wholesale retailer, a claims platform for a healthcare technology company, and carrier integrations moving shipment data across eight logistics providers.",
    "My undergraduate degree is in Electrical and Electronics Engineering, not computer science. I moved into software through certifications and work I actually shipped. That route probably explains what I care about: whether a system holds up in production, not which framework is fashionable this year.",
    "Most of what I am proud of is quiet. Test coverage that catches a regression before a customer does. Retry logic that survives a vendor API having a bad afternoon. Infrastructure written as code so anyone can rebuild it.",
    "I am finishing a Master of Applied Computer Science at Dalhousie University, which has pushed me further into cloud architecture, distributed systems, and building with LLMs responsibly.",
  ],
  interests: [
    "Distributed systems and event-driven design",
    "Cloud infrastructure as code",
    "Production reliability and observability",
    "Building with LLMs, with real safety limits",
  ],
} as const;

export type Role = {
  company: string;
  companyUrl?: string;
  title: string;
  period: string;
  /** Human-readable tenure, e.g. "1 year 8 months". */
  duration: string;
  location: string;
  /** Honest framing note rendered as a small qualifier. */
  note?: string;
  context: string;
  highlights: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    company: "Acuver Consulting",
    companyUrl: "https://acuverconsulting.com",
    title: "Software Engineer",
    period: "Jan 2025 — Dec 2025",
    duration: "1 year",
    location: "Bengaluru, India",
    context:
      "Built order management and logistics integrations for enterprise retail clients, working against live production systems.",
    highlights: [
      "Built a Smart Order Rerouting system in Java and Spring Boot that moves an order to another courier when a vendor cancels at the last minute. Orders affected by cancellations fell from around 10% to under 1%, which meant fewer refunds going out.",
      "Took branch coverage to 85% and line coverage past 90% with JUnit 5 suites running in Jenkins. Added a per-club kill switch so a rollout could be turned off for one location without touching the rest.",
      "Led the DoorDash Full Service integration, checking delivery coverage through their Serviceability APIs and automating the reservation step so orders could be picked up straight from a club.",
      "Cut the work of onboarding a new carrier by 75% by moving carrier-specific logic behind a Strategy pattern, then built Turnaround Time APIs for BlueDart, Criticalog, and Delhivery.",
      "Built an ETL pipeline on Aekyam that pulls order data through validation, mapping, and transformation across eight carrier integrations.",
    ],
    stack: ["Java", "Spring Boot", "REST APIs", "JUnit 5", "Jenkins", "React.js", "ETL"],
  },
  {
    company: "Wipro",
    companyUrl: "https://www.wipro.com",
    title: "Software Engineer",
    period: "Apr 2022 — Jul 2024",
    duration: "2 years 3 months",
    location: "Bengaluru, India",
    context:
      "Modernized a real-time healthcare claims platform for Oracle Cerner, moving it off a legacy engine onto containerized services.",
    highlights: [
      "Moved real-time healthcare claims scrubbing from legacy IBM BPM onto Edifecs, reworking the scrubbing profiles and containerizing the Spring Boot services with Docker. Infrastructure costs came down 20%.",
      "Built a health-check service that watches 36+ services across Dockerized and non-Dockerized environments, with thresholds for service health, filesystem mounts, and disk capacity set through configuration rather than code.",
      "Shipped four releases on schedule across Development and Cert, running the Jenkins and Kubernetes deployments and handling third-level support when UAT or production issues came in.",
      "Brought post-release defects down 25% by raising coverage to 85% with JUnit 5, running code reviews, and digging into the root cause of production incidents rather than patching symptoms.",
      "Secured the platform's integration endpoints to Edifecs with OAuth 2.0.",
    ],
    stack: ["Java", "Spring Boot", "Docker", "Kubernetes", "Jenkins", "OAuth 2.0", "Splunk"],
  },
  {
    company: "Amazon",
    title: "Transaction Risk Investigator",
    period: "Sep 2020 — Apr 2022",
    duration: "1 year 8 months",
    location: "Bengaluru, India",
    note: "An analytical role rather than an engineering one, included here so the timeline is complete.",
    context:
      "Investigated fraudulent transaction patterns on the A to Z Claims programme and worked with stakeholders on how investigations were run.",
    highlights: [
      "Used SQL to find patterns in fraudulent transactions and turned them into insights the team could act on, contributing to a 30% improvement in fraud detection accuracy.",
      "Took part in Amazon's ATLAS technical upskilling programme, and worked with senior managers, project managers, and subject-matter experts to improve investigation SOPs.",
    ],
    stack: ["SQL", "Data analysis"],
  },
];

export type Project = {
  name: string;
  blurb: string;
  problem: string;
  built: string;
  concepts: string[];
  stack: string[];
  href?: string;
  hrefLabel?: string;
  /** Honest status qualifier, rendered verbatim. */
  status?: string;
};

export const projects: Project[] = [
  {
    name: "Triage",
    blurb: "Autonomous incident response and self-healing infrastructure",
    problem:
      "Production incidents wake people up for problems a machine could resolve — but handing an LLM direct control of cloud infrastructure is not something you can defend in a review.",
    built:
      "A closed-loop remediation pipeline on AWS. Ten Python Lambda functions orchestrated by Step Functions detect, diagnose, remediate, and verify incidents against a Java/Spring Boot workload on ECS Fargate. AWS Bedrock reads CloudWatch evidence and produces a structured diagnosis, but a separate deterministic policy engine backed by DynamoDB decides whether an action auto-executes or escalates for human approval — the model only ever names an action, it never calls an AWS API. Incident-ID-keyed conditional writes make remediation idempotent, so duplicate alarms cannot double-remediate.",
    concepts: [
      "Infrastructure as code",
      "Idempotency",
      "Human-in-the-loop safety",
      "Least-privilege IAM",
      "OIDC federation",
    ],
    stack: [
      "Python",
      "AWS Lambda",
      "Step Functions",
      "AWS Bedrock",
      "DynamoDB",
      "ECS Fargate",
      "Terraform",
      "GitHub Actions",
      "pytest",
    ],
    href: "https://github.com/VijayPuttarevaiah/triage",
    hrefLabel: "GitHub",
    status:
      "Provisioned entirely through Terraform — roughly 100 managed resources across 10 files, including 16 least-privilege IAM roles. CI authenticates via GitHub OIDC, so no long-lived AWS credentials exist anywhere. Engineered to a target of under 120 seconds MTTR on the auto-approved path.",
  },
  {
    name: "MeetFocus",
    blurb: "Link-less video conferencing platform",
    problem:
      "Meeting links are a poor primitive — they leak, expire, and say nothing about who should actually be in the room. The interesting problem is coordinating invitation, presence, and moderation across services in real time.",
    built:
      "Five Spring Boot microservices — user, meeting, signaling, gateway, and discovery — plus a Python FastAPI moderation service, coordinated over Kafka with Eureka handling service discovery. A host's invite publishes to a Kafka topic and the signaling service relays it straight to an attendee's open WebSocket session. Chat messages route through Kafka to the Python toxicity classifier and back over WebSocket, blocking flagged messages before broadcast. A thread-safe telemetry engine aggregates meeting attention in real time.",
    concepts: [
      "Event-driven architecture",
      "Service discovery",
      "WebSocket sessions",
      "Concurrency",
      "API gateway",
    ],
    stack: [
      "Java",
      "Spring Boot",
      "Spring Cloud",
      "Apache Kafka",
      "WebSocket",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    href: "https://github.com/VijayPuttarevaiah/meetfocus",
    hrefLabel: "GitHub",
    status:
      "Concurrency-tested against 150 parallel attendee connections. The full system — five Java services, one Python service, PostgreSQL, Redis, and Kafka — runs under Docker Compose. Backend only; there is no frontend.",
  },
  {
    name: "LEDGR",
    blurb: "Personal finance and collaborative bill splitting",
    problem:
      "Splitting a shared expense usually means reconciling it by hand afterwards. And bolting an LLM onto a finance app raises an obvious question: what stops it running up a bill or leaking data when a feature is supposed to be off?",
    built:
      "A full-stack application where a user's share of any group expense flows automatically into their personal ledger and analytics. The AI features — receipt OCR and expense categorization — sit behind a kill-switch architecture: every route re-verifies server-side regardless of client state, AI interface elements are absent rather than merely hidden when disabled, and a monthly spend cap disables all AI features automatically. Row-level security is enforced at the database layer with zod validation as the authorization boundary on every mutating route.",
    concepts: [
      "Defense in depth",
      "Row-level security",
      "Cost-bounded AI",
      "Property-based testing",
      "Rate limiting",
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "Supabase",
      "PostgreSQL",
      "React Native",
      "Anthropic Claude",
      "Google Cloud Vision",
      "Vitest",
      "Playwright",
    ],
    href: "https://github.com/VijayPuttarevaiah/ledgr",
    hrefLabel: "GitHub",
    status:
      "22+ API routes behind a 63-test suite — 51 unit tests including property-based fuzzing of the split-math invariant across 200 randomized runs, 10 integration tests, and 2 end-to-end scenarios, all running in CI. A Semgrep SAST pass returned zero findings; OWASP ZAP baseline findings were resolved via security headers.",
  },
  {
    name: "Shopizer",
    blurb: "Open-source contribution to a Java e-commerce platform",
    problem:
      "The payment-processing module of an established open-source e-commerce platform had grown an unwieldy if-else chain and duplicated mapper code — the kind of thing everyone works around rather than fixes.",
    built:
      "A substantial refactoring pull request applying eight techniques: extracting methods, renaming for clarity, simplifying conditionals, moving methods to reduce feature envy, consolidating duplicated mapper code, extracting a shipping facade, and replacing the if-else chain with a Strategy pattern for payment processing.",
    concepts: [
      "Design patterns",
      "Refactoring",
      "Code quality gates",
      "Open source",
    ],
    stack: ["Java", "Strategy pattern", "Static analysis"],
    href: "https://github.com/shopizer-ecommerce/shopizer/pull/1094",
    hrefLabel: "Pull request",
    status:
      "Passed the project's quality gate with zero new issues and a green test suite. The pull request is submitted and open — not yet merged.",
  },
];

export type SkillGroup = {
  title: string;
  /** primary = strongest professional technologies, weighted visually. */
  emphasis: "primary" | "secondary";
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    emphasis: "primary",
    skills: ["Java", "Python", "TypeScript", "JavaScript", "SQL"],
  },
  {
    title: "Backend",
    emphasis: "primary",
    skills: [
      "Spring Boot",
      "Spring MVC",
      "Spring Cloud",
      "Spring Security",
      "Spring Data JPA",
      "Hibernate",
      "REST APIs",
      "FastAPI",
      "Django",
    ],
  },
  {
    title: "Distributed Systems",
    emphasis: "primary",
    skills: [
      "Microservices",
      "Apache Kafka",
      "Event-Driven Architecture",
      "WebSocket",
      "System Design",
      "Design Patterns",
      "SOLID Principles",
    ],
  },
  {
    title: "Cloud & DevOps",
    emphasis: "primary",
    skills: [
      "AWS",
      "Lambda",
      "ECS Fargate",
      "Step Functions",
      "Terraform",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "CI/CD",
      "GitHub Actions",
      "Linux",
    ],
  },
  {
    title: "Databases",
    emphasis: "secondary",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Redis"],
  },
  {
    title: "Testing & Quality",
    emphasis: "secondary",
    skills: [
      "JUnit 5",
      "Mockito",
      "Pytest",
      "Vitest",
      "Playwright",
      "TDD",
      "Code Reviews",
    ],
  },
  {
    title: "Observability",
    emphasis: "secondary",
    skills: ["CloudWatch", "Grafana", "Prometheus", "Splunk", "Structured Logging"],
  },
  {
    title: "Frontend & Additional",
    emphasis: "secondary",
    skills: ["React.js", "Next.js", "React Native", "Redux", "Git", "Jira", "Agile/Scrum"],
  },
];

export const education = [
  {
    credential: "Master of Applied Computer Science",
    institution: "Dalhousie University",
    location: "Halifax, Nova Scotia",
    period: "Jan 2026 — Apr 2027",
    detail: "GPA 3.88 / 4.30",
  },
  {
    credential: "Bachelor of Electrical and Electronics Engineering",
    institution: "National Institute of Engineering",
    location: "Mysuru, India",
    period: "Aug 2015 — Jul 2019",
    detail: "Full tuition scholarship (e-PASS), Government of Karnataka",
  },
] as const;

export const certifications = [
  {
    name: "AWS Certified AI Practitioner",
    href: "https://www.credly.com/badges/eeae3828-22e0-4ec6-9a81-d1a5ec79746c/public_url",
    status: null,
  },
  {
    name: "AWS Certified Cloud Practitioner",
    href: null,
    status: null,
  },
  {
    name: "AWS Certified Solutions Architect – Associate",
    href: null,
    status: "In progress",
  },
] as const;

export const leadership = {
  role: "Student Representative",
  organization: "Dalhousie Machine Learning Society",
  detail:
    "Authored end-to-end planning documentation for a Machine Learning Hackathon, and partnered with other student societies to organize supporting workshops.",
} as const;

export type Recommendation = {
  /** Full name of the person who wrote it. */
  name: string;
  /** Their role/company at the time of writing. */
  title: string;
  /** e.g. "Managed Vijay directly at Acuver Consulting". Optional. */
  relationship?: string;
  /** The recommendation text, verbatim. */
  quote: string;
};

/**
 * LinkedIn recommendations.
 *
 * EMPTY ON PURPOSE. LinkedIn blocks automated access (HTTP 999), so these
 * cannot be fetched — they must be pasted in from the profile by hand.
 *
 * NEVER put invented, paraphrased, or placeholder text here. Every entry is
 * a quote attributed to a real, named person; anything not written by that
 * person is a fabricated endorsement. Copy them verbatim or leave this empty.
 *
 * The Recommendations section renders nothing while this array is empty.
 */
export const recommendations: Recommendation[] = [];

export type Photo = {
  /** Path under /public, e.g. "/photos/acuver-team.jpg". */
  src: string;
  /** Required. Describes the image for screen readers and when it fails to load. */
  alt: string;
  caption?: string;
};

/**
 * Photos of the places behind the work, all supplied by Vijay.
 *
 * Captions describe the location only. They never assert that a given
 * building is where a specific project shipped, because that is not
 * something a photograph establishes.
 *
 * The Gallery section renders nothing while this array is empty.
 */
export const photos: Photo[] = [
  {
    src: "/photos/vijay-office.jpg",
    alt: "Vijay Puttarevaiah standing in an office atrium, wearing a work badge on a lanyard.",
    caption: "On site at Wipro",
  },
  {
    src: "/photos/wipro-campus.jpg",
    alt: "Wipro's Kodathi campus in Bengaluru, seen from the central courtyard between two office towers.",
    caption: "Wipro Kodathi campus, Bengaluru",
  },
  {
    src: "/photos/wipro-entrance.jpg",
    alt: "The main gate at Wipro's Kodathi campus, with the Wipro sign in the foreground.",
    caption: "Kodathi campus, Gate 1",
  },
  {
    src: "/photos/acuver-office.jpg",
    alt: "The Acuver Consulting office floor, with desks behind a glass partition and the company sign on the wall.",
    caption: "Acuver Consulting, Bengaluru",
  },
];

export type JourneyKind = "education" | "work" | "now" | "next";

export type JourneyStop = {
  year: string;
  kind: JourneyKind;
  /** Key into BrandMark's logo/monogram table. */
  brand: string;
  marker: string;
  title: string;
  org: string;
  period: string;
  summary: string;
  note?: string;
};

/**
 * EDUCATION TRACK — kept separate from the professional track on purpose.
 * Two short, legible arcs read better than one long mixed one, and the
 * five-year gap between the degrees is the whole point of the story.
 */
export const educationJourney: JourneyStop[] = [
  {
    year: "2015",
    kind: "education",
    brand: "nie",
    marker: "Where it began",
    title: "Bachelor of Electrical and Electronics Engineering",
    org: "National Institute of Engineering, Mysuru",
    period: "Aug 2015 — Jul 2019",
    summary:
      "Four years on a full tuition scholarship from the Government of Karnataka. An electrical degree, not a computer science one — the move into software came afterwards, through certifications and shipped work.",
  },
  {
    year: "2026",
    kind: "now",
    brand: "dalhousie",
    marker: "Now",
    title: "Master of Applied Computer Science",
    org: "Dalhousie University, Halifax",
    period: "Jan 2026 — Apr 2027 · GPA 3.88 / 4.30",
    summary:
      "Back to school after five years in industry, this time for the computer science foundations. Coursework and projects have pushed deeper into cloud architecture, distributed systems, and building with LLMs.",
  },
];

/**
 * PROFESSIONAL TRACK. Amazon carries an explicit qualifier: it was an
 * analytical role, not an engineering one, and the site must never imply
 * otherwise. The final stop is a TARGET, not a secured role.
 */
export const professionalJourney: JourneyStop[] = [
  {
    year: "2020",
    kind: "work",
    brand: "amazon",
    marker: "First role",
    title: "Transaction Risk Investigator",
    org: "Amazon",
    period: "Sep 2020 — Apr 2022 · 1 yr 8 mo",
    summary:
      "SQL-driven fraud pattern analysis on the A to Z Claims programme, contributing to a 30% improvement in detection accuracy. Completed Amazon's ATLAS technical upskilling programme along the way.",
    note: "An analytical role, not an engineering one.",
  },
  {
    year: "2022",
    kind: "work",
    brand: "wipro",
    marker: "Into engineering",
    title: "Software Engineer",
    org: "Wipro · client: Oracle Cerner",
    period: "Apr 2022 — Jul 2024 · 2 yr 3 mo",
    summary:
      "The switch into software. Moved a real-time healthcare claims platform off legacy IBM BPM onto containerized Spring Boot services, cutting infrastructure cost 20% and post-release defects 25%.",
  },
  {
    year: "2025",
    kind: "work",
    brand: "acuver",
    marker: "Deeper into backend",
    title: "Software Engineer",
    org: "Acuver Consulting · clients: BJ's Wholesale, Titan",
    period: "Jan 2025 — Dec 2025 · 1 yr",
    summary:
      "Order rerouting between DoorDash and Roadie that cut affected orders from ~10% to under 1%. Carrier integrations and an ETL pipeline spanning eight logistics providers.",
  },
  {
    year: "2027",
    kind: "next",
    brand: "next",
    marker: "Next",
    title: "Software Engineering Co-op",
    org: "Seeking · Winter 2027",
    period: "Jan 2027 start · 4 or 8 month terms",
    summary:
      "Looking for a team where three years of production backend work and a graduate degree both count for something.",
  },
];

export const navItems = [
  { id: "journey", label: "Journey" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "gallery", label: "Photos" },
  { id: "recommendations", label: "Recommendations" },
  { id: "expertise", label: "Expertise" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
] as const;
