/**
 * SINGLE SOURCE OF TRUTH for every claim on this site.
 *
 * Everything here traces to CONTEXT.md / the master resume in the parent
 * repository. Nothing is invented, inflated, or rounded up.
 *
 * Hard constraints carried over from CONTEXT.md — do not "improve" these:
 *  - "3+ years" of software engineering (Wipro 2yr3mo + Acuver 1yr = 3yr3mo).
 *    NEVER write 3.5 — 3.25 does not clear 3.5.
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
  headline: "Backend Software Engineer",
  tagline:
    "I build and operate backend systems — Java and Spring Boot services, event-driven architectures, and the AWS infrastructure that keeps them running.",
  location: "Halifax, Nova Scotia",
  email: "vijayputtarevaiah@gmail.com",
  phone: "902-452-2085",
  github: "https://github.com/VijayPuttarevaiah",
  githubHandle: "VijayPuttarevaiah",
  linkedin: "https://linkedin.com/in/vijayputtarevaiah",
  linkedinHandle: "in/vijayputtarevaiah",
  resumeHref: "/resume.pdf",
  workAuth: "Eligible to work in Canada",
  availability: "Available for Winter 2027 co-op — 4 and 8 month terms",
} as const;

/** Hero stat strip. Each figure is verified in CONTEXT.md. */
export const stats = [
  { value: "3+", label: "years in software engineering" },
  { value: "5", label: "years of industry experience" },
  { value: "2", label: "AWS certifications" },
  { value: "3.88", label: "GPA at Dalhousie (of 4.30)" },
] as const;

export const about = {
  paragraphs: [
    "I spent three years building enterprise backend systems before returning to school — Spring Boot services handling order routing for a US wholesale retailer, a claims-scrubbing platform modernization for a healthcare technology company, and carrier integrations processing shipment data across eight logistics providers.",
    "My degree is in Electrical and Electronics Engineering, not computer science. I moved into software through certifications and shipped work, which is probably why I care more about whether a system holds up in production than about which framework is fashionable. Most of what I am proud of is unglamorous: test coverage that catches regressions, retry logic that survives a flaky vendor API, infrastructure defined in code so it can be rebuilt.",
    "I am currently completing a Master of Applied Computer Science at Dalhousie University in Halifax, where my coursework and personal projects have pushed me further into cloud architecture, distributed systems, and applied AI integration.",
  ],
  interests: [
    "Distributed systems and event-driven architecture",
    "Cloud infrastructure as code",
    "Production reliability and observability",
    "Applied LLM integration with real safety boundaries",
  ],
} as const;

export type Role = {
  company: string;
  companyUrl?: string;
  title: string;
  period: string;
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
    location: "Bengaluru, India",
    context:
      "Built order-management and logistics integrations for enterprise retail clients, working directly against live production systems.",
    highlights: [
      "Designed and implemented a Smart Order Rerouting solution in Java and Spring Boot that automatically rerouted orders between DoorDash and Roadie after last-minute vendor cancellations, cutting affected orders from roughly 10% to under 1% and preventing customer refunds.",
      "Raised branch coverage to 85% and line coverage above 90% with JUnit 5 suites wired into Jenkins CI/CD, alongside per-club kill-switch logic that made phased production rollouts safe to reverse.",
      "Led the DoorDash Full Service integration, wiring Serviceability APIs to validate delivery coverage and automating reservation creation for direct pickup from club locations.",
      "Reduced new-carrier onboarding effort by 75% by refactoring carrier-specific logic behind a Strategy pattern, and built Turnaround Time APIs across BlueDart, Criticalog, and Delhivery.",
      "Engineered an ETL pipeline on the Aekyam iPaaS platform that extracted, validated, mapped, and transformed order data across eight carrier integrations.",
    ],
    stack: [
      "Java",
      "Spring Boot",
      "REST APIs",
      "JUnit 5",
      "Jenkins",
      "React.js",
      "ETL",
    ],
  },
  {
    company: "Wipro",
    companyUrl: "https://www.wipro.com",
    title: "Software Engineer",
    period: "Apr 2022 — Jul 2024",
    location: "Bengaluru, India",
    context:
      "Modernized a real-time healthcare claims-scrubbing platform for Oracle Cerner, moving it off a legacy engine and onto containerized services.",
    highlights: [
      "Cut infrastructure costs by 20% by migrating real-time healthcare claims scrubbing from legacy IBM BPM to the Edifecs platform, refactoring scrubbing profiles and containerizing the Spring Boot services with Docker.",
      "Designed a configurable health-check service monitoring 36+ services across Dockerized and non-Dockerized environments, with property-driven thresholds for service health, filesystem mounts, and disk capacity.",
      "Delivered four releases on schedule across Development and Cert environments, leading Jenkins and Kubernetes deployments and providing third-level support for UAT and production issues.",
      "Cut post-release defects by 25% by raising code coverage to 85% with JUnit 5, leading code reviews, and running root cause analysis on production incidents.",
      "Secured platform-to-Edifecs integration endpoints with OAuth 2.0.",
    ],
    stack: [
      "Java",
      "Spring Boot",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "OAuth 2.0",
      "Splunk",
    ],
  },
  {
    company: "Amazon",
    title: "Transaction Risk Investigator",
    period: "Sep 2020 — Apr 2022",
    location: "Bengaluru, India",
    note: "An analytical role rather than an engineering one — included here for a complete timeline.",
    context:
      "Investigated fraudulent transaction patterns on the A to Z Claims programme and worked with stakeholders on investigation process.",
    highlights: [
      "Analyzed fraudulent transaction patterns with SQL and communicated data-driven insights to stakeholders, contributing to a 30% improvement in fraud detection accuracy.",
      "Participated in Amazon's ATLAS technical upskilling programme and collaborated with senior managers, project managers, and subject-matter experts to improve investigation SOPs.",
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
    href: "https://www.credly.com/earner/earned/badge/eeae3828-22e0-4ec6-9a81-d1a5ec79746c",
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

export const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "recommendations", label: "Recommendations" },
  { id: "expertise", label: "Expertise" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
