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
  pitchLead:
    "I build the systems businesses depend on, from backend services to the cloud infrastructure that keeps them running.",
  /** Banner across the top of the hero. */
  openTo: "Available for Winter 2027 co-op and full-time roles",
  /** Hero summary, in Vijay's own words. */
  summary:
    "I build scalable and reliable applications and RESTful APIs using Java, Spring Boot, React, and cloud technologies. I care about thoughtful system design, clean architecture, maintainable code, and well-tested solutions that solve real-world problems and remain dependable as they evolve. Currently exploring AI and ML, and pursuing a Master of Applied Computer Science at Dalhousie University.",
  focusLine: "Scalable Systems · Reliable APIs · Cloud Engineering",
  /** Cycled in the hero — every one of these is a role Vijay is applying for. */
  roles: [
    "Software Engineer",
    "Cloud Engineer",
    "DevOps Engineer",
    "Software Developer",
  ],
  study: "Master of Applied Computer Science, Dalhousie University",
  mobility: "Open to remote or relocation in Canada",
  /** Not displayed on the page — retained for structured data only. */
  location: "Halifax, Nova Scotia",
  email: "vijayputtarevaiah@gmail.com",
  phone: "902-452-2085",
  github: "https://github.com/VijayPuttarevaiah",
  githubHandle: "VijayPuttarevaiah",
  linkedin: "https://linkedin.com/in/vijayputtarevaiah",
  linkedinHandle: "in/vijayputtarevaiah",
  portfolio: "https://vijayputtarevaiah.vercel.app",
  workAuth: "Eligible to work in Canada",
  availability:
    "Available for Winter 2027 co-op — open to remote and to relocating within Canada",
} as const;

/** Hero stat strip. Each figure is verified in CONTEXT.md. */
/** Three figures under the story. Each one links to the section that evidences it. */
export const stats = [
  { value: "5", label: "Years of total industry experience", href: "experience" },
  { value: "3.5", label: "Years in software engineering", href: "experience" },
  { value: "2", label: "AWS certifications", href: "certifications" },
] as const;

export const about = {
  /** The opening paragraph, in Vijay's own words. */
  lead: "I’m a software engineer with five years of industry experience, including 3.5 years in software engineering at Wipro and Acuver Consulting and 1.5 years in transaction risk investigation at Amazon. I’m now pursuing a Master of Applied Computer Science at Dalhousie University.",
  /**
   * Bolded inside the lead. Only the two tenures — someone scanning the page
   * should read the split correctly without reading the sentence.
   */
  leadEmphasis: [
    "3.5 years in software engineering",
    "1.5 years in transaction risk investigation",
  ],
  paragraphs: [
    "My work has helped reduce delivery cancellations and lower infrastructure costs. Most of my experience is in backend development, application releases, and resolving production issues. I bring an understanding of what it takes to build a service, deploy it across environments, and keep it working when problems arise.",
    "I connect technical decisions with the people and processes they affect. Whether I’m fixing a production bug or building an integration, I aim to solve the underlying problem, write code the team can maintain, and make the software more dependable for the people using it.",
  ],
  interests: [
    "Exploring AI and ML concepts",
    "Building with LLMs, with real safety limits",
    "Cloud infrastructure as code",
    "Production reliability and observability",
    "Distributed systems and event-driven design",
  ],

} as const;

export type Engagement = {
  /** Project or programme name as it was known internally. */
  project: string;
  client?: string;
  clientUrl?: string;
  period: string;
  bullets: string[];
};

/**
 * Gmail's compose URL rather than a mailto:. Opens a prefilled draft in the
 * browser, which is what most people checking a portfolio actually have open.
 */
export function gmailCompose(subject: string) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: person.email,
    su: subject,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * The hero strip. Every entry appears in the master resume's Technical Skills
 * and in the GitHub README stack — nothing here is aspirational.
 */
export const heroTools = [
  { name: "Java", icon: "/tools/java.svg" },
  { name: "Spring Boot", icon: "/tools/spring.svg" },
  { name: "Hibernate", icon: "/tools/hibernate.svg" },
  { name: "Python", icon: "/tools/python.svg" },
  { name: "FastAPI", icon: "/tools/fastapi.svg" },
  { name: "TypeScript", icon: "/tools/ts.svg" },
  { name: "JavaScript", icon: "/tools/js.svg" },
  { name: "React", icon: "/tools/react.svg" },
  { name: "Next.js", icon: "/tools/nextjs.svg" },
  { name: "GraphQL", icon: "/tools/graphql.svg" },
  { name: "AWS", icon: "/tools/aws.svg" },
  { name: "Docker", icon: "/tools/docker.svg" },
  { name: "Kubernetes", icon: "/tools/kubernetes.svg" },
  { name: "Terraform", icon: "/tools/terraform.svg" },
  { name: "Jenkins", icon: "/tools/jenkins.svg" },
  { name: "GitHub Actions", icon: "/tools/githubactions.svg" },
  { name: "Linux", icon: "/tools/linux.svg" },
  { name: "Maven", icon: "/tools/maven.svg" },
  { name: "Kafka", icon: "/tools/kafka.svg" },
  { name: "Redis", icon: "/tools/redis.svg" },
  { name: "PostgreSQL", icon: "/tools/postgres.svg" },
  { name: "MySQL", icon: "/tools/mysql.svg" },
  { name: "MongoDB", icon: "/tools/mongodb.svg" },
  { name: "DynamoDB", icon: "/tools/dynamodb.svg" },
  { name: "Grafana", icon: "/tools/grafana.svg" },
  { name: "Prometheus", icon: "/tools/prometheus.svg" },
  { name: "Git", icon: "/tools/git.svg" },
  { name: "GitHub", icon: "/tools/github.svg" },
  { name: "Bitbucket", icon: "/tools/bitbucket.svg" },
  { name: "IntelliJ IDEA", icon: "/tools/idea.svg" },
  { name: "VS Code", icon: "/tools/vscode.svg" },
] as const;

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
  /** Location photo shown alongside the role. */
  photo?: { src: string; alt: string; caption: string };
  engagements: Engagement[];
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
    photo: {
      src: "/photos/acuver-office.jpg",
      alt: "The Acuver Consulting office floor in Bengaluru, with the company sign on the wall.",
      caption: "Acuver Consulting · Bengaluru",
    },
    engagements: [
      {
        project: "Smart Order Rerouting",
        client: "BJ's Wholesale Club",
        clientUrl: "https://www.bjs.com",
        period: "Jun 2025 — Dec 2025",
        bullets: [
          "Built a **Java** and **Spring Boot** service that reassigned orders when third party delivery vendors cancelled. The service checked alternative vendors and booked available delivery slots, reducing vendor caused cancellations from around **10%** to under **1%** and helping prevent customer refunds.",
          "Integrated third party **serviceability APIs** to confirm delivery coverage and automate reservation creation. This enabled vendors to collect and deliver orders directly from retail locations.",
          "Developed **JUnit 5** test suites and integrated them into **Jenkins** **CI/CD** pipelines to strengthen testing before releases. Branch coverage reached **85%**, and line coverage exceeded **90%**.",
          "Implemented configurable kill switches for individual retail locations to control production rollouts. The team could introduce order rerouting gradually and disable it at a specific location when issues appeared.",
          "Added retry logic, fallback paths, and structured logging to handle failures in vendor API calls. These changes supported recovery from failed requests and gave engineers the details needed to investigate integration issues.",
          "Secured internal APIs with **Spring Security** and **JWT** authentication, restricting order routing operations to authorized services.",
          "Documented backend workflows through **JavaDocs**, **Postman** collections, and **Confluence** design documents. Technical walkthroughs and stakeholder demos gave the team a shared understanding of API behaviour and integration requirements.",
        ],
      },
      {
        project: "Carrier Management Services + Aekyam (iPaaS)",
        client: "Titan",
        clientUrl: "https://www.titancompany.in/",
        period: "Jan 2025 — May 2025",
        bullets: [
          "Refactored carrier specific **Spring Boot** code using the **Strategy pattern** to simplify new integrations. This reduced the effort required to onboard a new carrier by **75%**.",
          "Built **Waybill Generation APIs** and **Aekyam** data transformation workflows to connect internal order data with **eight** carrier integrations. These workflows automated shipment creation by converting order data into each vendor’s required format.",
          "Implemented scheduled **REST** polling for vendors without webhook support and a **webhook** integration for a vendor that supported it. This replaced manual delivery tracking with updates received directly from carrier systems.",
          "Added an automatic retry path for failed transactions matching specific error codes in **Aekyam**. Eligible transactions could then be reprocessed automatically.",
          "Contributed **React** components using **hooks** and **Redux** for state management, including pagination in Aekyam’s Audit Service. These changes allowed users to browse audit records across pages.",
        ],
      },
    ],
    stack: [
      "Java",
      "Spring Boot",
      "REST APIs",
      "Spring Security",
      "JWT",
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
    duration: "2 years 3 months",
    location: "Bengaluru, India",
    photo: {
      src: "/photos/wipro-entrance.jpg",
      alt: "The main gate at Wipro's Kodathi campus in Bengaluru, with the Wipro sign in the foreground.",
      caption: "Wipro · Kodathi campus, Bengaluru",
    },
    engagements: [
      {
        project: "Integrated Scrubbing Modernization",
        client: "Oracle Cerner Corporation",
        clientUrl: "https://www.oracle.com/health/",
        period: "May 2022 — Jul 2024",
        bullets: [
          "Migrated healthcare claims processing from legacy **IBM BPM** workflows to **Edifecs** and containerized the **Spring Boot** applications with **Docker**. The modernization reduced infrastructure costs by **20%**.",
          "Coordinated application releases using **Jenkins** pipelines and **Kubernetes**, helping deliver **four** releases on schedule across Development and Cert. Responsibilities also included release activities and support across **UAT** and **Production**.",
          "Resolved production bugs by working with the operations team to inspect **Splunk** logs, trace failures, and identify their causes. Fixed issues in the live claims processing system and supported the deployment of those fixes.",
          "Developed **JUnit 5** tests that raised code coverage to **85%** and contributed to code reviews and root cause analysis. Together, these changes helped reduce bugs after release by **25%**.",
          "Built a **Spring Boot** health check service to monitor over **36** services across Dockerized and other environments. Configurable thresholds gave the team a common way to check service health, filesystem mounts, and disk capacity.",
          "Secured integration endpoints between the platform and **Edifecs** using **OAuth 2.0**, ensuring that only authorized services could invoke claims processing operations.",
        ],
      },
    ],
    stack: ["Java", "Spring Boot", "Docker", "Kubernetes", "Jenkins", "OAuth 2.0", "Splunk"],
  },
  {
    company: "Amazon",
    title: "Transaction Risk Investigator",
    period: "Sep 2020 — Apr 2022",
    duration: "1 year 8 months",
    location: "Bengaluru, India",
    photo: {
      src: "/photos/amazon-office.jpg",
      alt: "The Amazon office where Vijay worked on the A to Z Claims programme.",
      caption: "Amazon · Bengaluru",
    },
    engagements: [
      {
        project: "A to Z Claims",
        period: "Sep 2020 — Apr 2022",
        bullets: [
          "Analyzed transaction data using **SQL** to identify patterns in fraudulent activity, contributing to a **30%** improvement in fraud detection accuracy.",
          "Communicated findings from transaction analysis to stakeholders, explaining suspicious patterns and the supporting evidence to inform investigation decisions.",
          "Updated standard operating procedures with managers and subject matter specialists, keeping investigation steps aligned with changes in daily operations.",
          "Developed foundational software development skills through Amazon’s **ATLAS** programme, gaining practical experience with **REST** operations and bug fixes alongside my transaction investigation role.",
        ],
      },
    ],
    stack: ["SQL", "Data analysis"],
  },
];

export type Project = {
  /** URL segment for /projects/<slug>. */
  slug: string;
  name: string;
  blurb: string;
  /** Opens the project page: what it is, and what it solves. */
  summary?: string;
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
    slug: "triage",
    name: "Triage",
    blurb: "Autonomous incident response and self-healing infrastructure",
    summary:
      "Triage handles production incidents on its own: an LLM reads the alarm evidence and names a fix, and a policy engine decides whether it runs or waits for a person. It solves being paged at 3am for what a machine could fix, without giving the model authority over infrastructure.",
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
    slug: "meetfocus",
    name: "MeetFocus",
    blurb: "Link-less video conferencing platform",
    summary:
      "A video conferencing platform with no meeting links, where invitations, presence and chat moderation are coordinated across services in real time. It solves links leaking, expiring, and saying nothing about who belongs in the room.",
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
    slug: "ledgr",
    name: "Ledgr",
    blurb: "Personal finance and collaborative bill splitting",
    summary:
      "A personal finance app where splitting a shared expense updates everyone's own ledger automatically, with receipt scanning behind a kill switch and a monthly spend cap. It solves reconciling shared costs by hand, and an AI feature quietly running up a bill when it is supposed to be off.",
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
    slug: "recalibrate",
    name: "Recalibrate",
    blurb: "Adaptive goal planner that replans around missed work",
    summary:
      "A goal planner that rewrites the plan when you fall behind: it detects missed tasks, checks them against a threshold, and regenerates an adjusted roadmap. It solves the problem every planner has, which is that a schedule stops being useful once it stops matching reality.",
    problem:
      "A plan stops being useful the moment you fall behind it. Most planners keep the original schedule and let the user work out what to do with the gap.",
    built:
      "A full-stack planner where goals can be created, paused, resumed and replanned. The replan engine detects missed tasks, checks them against a threshold, and regenerates an adjusted roadmap; resuming a paused goal can either keep the original deadline or take a new one, with the tasks regenerated to match. Goal categories are an enum that new values can be added to without touching service code, and services depend on an injected database session, so tests swap MySQL for in-memory SQLite.",
    concepts: [
      "Test-driven development",
      "SOLID principles",
      "Dependency injection",
      "Database migrations",
      "CI/CD pipelines",
    ],
    stack: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Alembic",
      "MySQL",
      "React",
      "Vite",
      "Docker",
      "GitLab CI",
      "pytest",
      "Vitest",
    ],
    href: "https://github.com/VijayPuttarevaiah/recalibrate",
    hrefLabel: "GitHub",
    status:
      "352 backend tests at 89% line coverage and 65 front-end tests at 86% branch coverage, all running in a GitLab CI pipeline that builds, tests, checks code quality, then publishes and deploys from main and develop only. Features were built Red-Green-Refactor, and the commit history shows it.",
  },
  {
    slug: "tenant-trails",
    name: "Tenant Trails",
    blurb: "Apartment review platform for renters",
    summary:
      "A review platform for rental apartments where renters leave star-rated reviews and an AI summary condenses what all of them say. It solves choosing where to live on almost no signal, with what reviews exist scattered and unstructured.",
    problem:
      "Renters decide on an apartment with almost no signal about what living there is actually like, and the reviews that do exist are scattered and unstructured.",
    built:
      "A React and Vite application where renters leave reviews with star ratings against an apartment, and an AI summary condenses what the reviews say. Authentication and review data live in React contexts, a protected route guards the signed-in pages, and the review dialog, star rating and review card are separate components composed on the apartment detail page.",
    concepts: [
      "Component composition",
      "React context",
      "Protected routes",
      "Client-side routing",
      "Component testing",
    ],
    stack: [
      "JavaScript",
      "React",
      "Vite",
      "React Router",
      "Vitest",
      "Testing Library",
    ],
    href: "https://github.com/VijayPuttarevaiah/tenant-trails",
    hrefLabel: "GitHub",
    status:
      "Front end only, running against mock data rather than a live backend. Component and validation tests run under Vitest with Testing Library.",
  },
  {
    slug: "shopizer",
    name: "Shopizer",
    blurb: "Open-source contribution to a Java e-commerce platform",
    summary:
      "A refactoring contribution to Shopizer, an open-source Java e-commerce platform whose payment module had grown an if-else chain and duplicated mappers. It replaces the chain with a Strategy pattern, fixing what everyone on the codebase works around.",
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

/**
 * Technical Skills, taken from the master resume and merged with the stack in
 * the GitHub profile README — GitHub Actions, Linux, Redis and the editors,
 * which the resume omits. Order follows the resume.
 */
export const skills = [
  {
    category: "Languages",
    items: ["Java", "Python", "TypeScript", "JavaScript", "SQL", "HTML", "CSS"],
  },
  {
    category: "Core CS",
    items: [
      "Object-Oriented Programming",
      "Software Design Principles",
      "System Design",
      "Distributed Systems",
      "Microservices",
      "Cloud-Native Applications",
    ],
  },
  {
    category: "Backend frameworks",
    items: [
      "Spring Boot",
      "Spring MVC",
      "Spring Security",
      "Spring Data JPA",
      "Hibernate",
      "Django",
      "FastAPI",
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      "Amazon Web Services (AWS)",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "CI/CD",
      "Continuous Delivery",
      "Terraform",
      "GitHub Actions",
      "Linux",
    ],
  },
  {
    category: "APIs & messaging",
    items: ["REST APIs", "GraphQL", "WebSockets", "Webhooks", "Apache Kafka"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Redis", "H2"],
  },
  {
    category: "AI & LLM tools",
    items: [
      "AWS Bedrock",
      "Anthropic Claude API",
      "Groq API",
      "Google Cloud Vision",
      "LLM Integration",
    ],
  },
  {
    category: "Front end",
    items: ["React.js", "Next.js", "React Native"],
  },
  {
    category: "Testing",
    items: [
      "JUnit 5",
      "Mockito",
      "Vitest",
      "Pytest",
      "Unit Testing",
      "Integration Testing",
      "End-to-End Testing",
      "Test-Driven Development (TDD)",
    ],
  },
  {
    category: "Observability",
    items: ["CloudWatch", "Grafana", "Prometheus", "Structured Logging"],
  },
  {
    category: "Practices",
    items: [
      "Agile / Scrum",
      "Code Reviews",
      "Sprint Demos",
      "Full Software Development Lifecycle (SDLC)",
    ],
  },
  {
    category: "Tools",
    items: [
      "Git",
      "GitHub",
      "GitLab",
      "Bitbucket",
      "Maven",
      "Postman",
      "Jira",
      "Confluence",
      "IntelliJ IDEA",
      "VS Code",
    ],
  },
] as const;

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
    detail: "GPA 3.88 / 4.30 (current)",
    coursework: [
      "Advanced Concepts in Software Development",
      "Data Management and Warehousing",
      "Advanced Topics in Computer Networks",
      "Advanced Cloud Architecting",
      "Deep Learning Applications",
      "Advanced Topics in Web Development",
      "Machine Learning",
      "Communication Computer Science Ideas",
    ] as readonly string[],
  },
  {
    credential: "Bachelor of Electrical and Electronics Engineering",
    institution: "National Institute of Engineering",
    location: "India",
    period: "Aug 2015 — Jul 2019",
    detail: "Full tuition scholarship (e-PASS), Government of Karnataka",
  },
] as const;

/**
 * Awards and scholarships. Each is stated as it was awarded — no citation is
 * invented for what an award was given for.
 */
/** Kept for the Experience section; the standalone Recognition section is gone. */
export const achievements = [
  {
    name: "Habitat Flagbearer Award",
    issuer: "Wipro Limited",
    /** Matches Role.company, so the award renders on that role's card. */
    company: "Wipro",
    note: "",
  },
  {
    name: "Winner's Circle Award",
    issuer: "Wipro Limited",
    company: "Wipro",
    note: "",
  },
  {
    name: "Full Tuition Scholarship (e-PASS)",
    issuer: "Government of Karnataka",
    note: "Four years of undergraduate study, funded in full.",
  },
] as const;

export const certifications = [
  {
    name: "AWS Certified AI Practitioner",
    issuer: "Amazon Web Services",
    badge: "/badges/aws-ai-practitioner.png",
    href: "https://www.credly.com/badges/eeae3828-22e0-4ec6-9a81-d1a5ec79746c/public_url",
    blurb:
      "Covers AI, machine learning and generative AI on AWS — choosing between model types, prompt design, and the responsible-AI guardrails around them. It is the background behind the Bedrock work in Triage, where a model writes the diagnosis but a deterministic policy engine decides whether anything runs.",
  },
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    badge: "/badges/aws-cloud-practitioner.png",
    href: "https://www.credly.com/badges/eeae3828-22e0-4ec6-9a81-d1a5ec79746c/public_url",
    blurb:
      "The foundational AWS certification: core services, the shared responsibility model, billing, and how accounts and permissions are structured. It is the vocabulary the rest of the AWS track builds on, and the reason IAM boundaries and cost are things I now think about while designing rather than after.",
  },
  {
    name: "LFC102: Inclusive Open Source Community Orientation",
    issuer: "The Linux Foundation",
    badge: "/badges/lfc102.png",
    href: "https://www.credly.com/badges/bc72467f-0bae-46c8-9b64-443c805a33b4/public_url",
    blurb:
      "A Linux Foundation course on how open-source communities actually work — unconscious bias, inclusive contribution norms, and how to review and receive review well. It applies directly to contributing to a codebase you do not own, as with the Shopizer pull request.",
  },
] as const;

/** Kept separate, and rendered differently, so nothing unearned reads as earned. */
export const certificationsInProgress = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    badge: "/badges/aws-solutions-architect-associate.png",
    blurb:
      "Currently working through the associate architecture exam: designing for resilience, performance, security and cost across VPCs, load balancing, storage classes and managed databases. It is the step up from Cloud Practitioner — less about what each service does, more about which trade-off to make when two of them would both work.",
  },
] as const;

/**
 * Things outside the job. An array rather than a single entry, so this grows
 * as more lands — a talk, a meetup, an open-source maintainership.
 */
export const involvement = [
  {
    role: "Student Representative",
    organization: "Dalhousie Machine Learning Society",
    brand: "dmls",
    bullets: [
      "Represent the student community within the Dalhousie Machine Learning Society, acting as a bridge between students and the executive leadership team.",
      "Lead student outreach to promote engagement in AI, machine learning, and data science initiatives.",
      "Collaborate with the events and technical leads to organize workshops, hackathons, and mentorship programs that encourage hands-on learning and innovation.",
    ] as readonly string[],
  },
] as const;

export type Recommendation = {
  /** Full name of the person who wrote it. */
  name: string;
  /** Their role/company at the time of writing. */
  title: string;
  /** e.g. "Managed Vijay directly". Optional. */
  relationship?: string;
  /** Date the recommendation was written. */
  date?: string;
  /** Headshot in /public/photos/recommenders. Falls back to initials. */
  photo?: string;
  /** The recommendation text, verbatim. Never paraphrased. */
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
export const recommendations: Recommendation[] = [
  {
    name: "Vijay Shanker",
    title: "Lead Backend Engineer | Scalable Order Management Systems",
    relationship: "Managed Vijay directly",
    date: "September 1, 2026",
    photo: "/photos/recommenders/vijay-shanker.png",
    quote:
      "I worked closely with Vijay P on a Same-Day Delivery order routing initiative for a major US retailer. What stood out most was his fast ramp-up: with no prior retail domain background, he dove deep into the business logic, mastered the required modules, and consistently shipped production-ready code with great quality. He is proactive, quick to learn, and a solid engineer to work with.",
  },
  {
    name: "Vaibhav Navaghare",
    title: "Managing People | Process Excellence | Technologist",
    relationship: "Managed Vijay directly",
    date: "August 31, 2026",
    photo: "/photos/recommenders/vaibhav-navaghare.jpeg",
    quote:
      "Vijay worked alongside me on a system modernization effort, and I was thoroughly impressed by his contribution. He possesses excellent technical skills and approaches every challenge with strong ownership and high professional integrity. Whether it was refactoring complex legacy code or troubleshooting critical issues, Vijay always delivered exceptional results. He would be a strong technical addition to any engineering team!",
  },
];

export type Photo = {
  /** Path under /public, e.g. "/photos/acuver-team.jpg". */
  src: string;
  /** Required. Describes the image for screen readers and when it fails to load. */
  alt: string;
  caption?: string;
  portrait?: boolean;
};

/**
 * Portraits and places supplied by Vijay. Portrait backgrounds and lighting
 * were edited at his request; workplace photos retain their original context.
 *
 * Captions describe the location only. They never assert that a given
 * building is where a specific project shipped, because that is not
 * something a photograph establishes.
 *
 * The Gallery section renders nothing while this array is empty.
 */
export const photos: Photo[] = [
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
  /** Org line as text runs; a run carrying an href renders as a link. */
  orgLine?: { text: string; href?: string }[];
  /** Work stops render as two labelled lines instead of a single org line. */
  company?: { label: string; href?: string };
  clients?: { label: string; href?: string }[];
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
    marker: "Undergraduate",
    title: "Bachelor of Electrical and Electronics Engineering",
    org: "National Institute of Engineering, India",
    orgLine: [
      { text: "National Institute of Engineering", href: "https://nie.ac.in" },
      { text: ", India" },
    ],
    period: "Aug 2015 — Jul 2019",
    summary:
      "Received a full-tuition scholarship from the Government of Karnataka for four years.",
  },
  {
    year: "2026",
    kind: "now",
    brand: "dalhousie",
    marker: "Now",
    title: "Master of Applied Computer Science",
    org: "Dalhousie University, Halifax",
    orgLine: [
      { text: "Dalhousie University", href: "https://www.dal.ca" },
      { text: ", Halifax" },
    ],
    period: "Jan 2026 — Apr 2027 · GPA 3.88 / 4.30 (current)",
    summary:
      "Back to school after five years in industry, this time for the computer science foundations. Coursework and projects have pushed deeper into cloud architecture, distributed systems, and building with LLMs.",
  },
];

/**
 * PROFESSIONAL TRACK. Each stop is described by what the work actually was —
 * Amazon reads as the SQL fraud and risk analysis it was, stated plainly rather
 * than qualified against engineering. The title and the summary carry that on
 * their own, so no disclaimer is needed.
 */
export const professionalJourney: JourneyStop[] = [
  {
    year: "2020",
    kind: "work",
    brand: "amazon",
    marker: "Transaction Risk Investigator",
    title: "Transaction Risk Investigator",
    org: "Amazon",
    company: { label: "Amazon", href: "https://www.amazon.com" },
    period: "Sep 2020 — Apr 2022",
    summary:
      "The check on fraudulent transactions reaching Amazon's A to Z Claims programme, using SQL to find the patterns investigators acted on.",
  },
  {
    year: "2022",
    kind: "work",
    brand: "wipro",
    marker: "Software Engineer",
    title: "Software Engineer",
    org: "Wipro · client: Oracle Cerner",
    company: { label: "Wipro Limited", href: "https://www.wipro.com" },
    clients: [{ label: "Oracle Cerner", href: "https://www.oracle.com/health/" }],
    period: "Apr 2022 — Jul 2024",
    summary:
      "The switch into software. Moved a real-time healthcare claims platform off legacy IBM BPM onto containerized Spring Boot services, cutting infrastructure cost 20% and post-release defects 25%.",
  },
  {
    year: "2025",
    kind: "work",
    brand: "acuver",
    marker: "Software Engineer",
    title: "Software Engineer",
    org: "Acuver Consulting · clients: BJ's Wholesale, Titan",
    company: { label: "Acuver Consulting", href: "https://acuverconsulting.com" },
    clients: [
      { label: "BJ's Wholesale", href: "https://www.bjs.com" },
      { label: "Titan", href: "https://www.titan.co.in" },
    ],
    period: "Jan 2025 — Dec 2025",
    summary:
      "Order rerouting between DoorDash and Roadie that cut affected orders from ~10% to under 1%. Carrier integrations and an ETL pipeline spanning eight logistics providers.",
  },
];

export const navItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
] as const;

/** Folded behind "Other" at the end of the bar to keep the tab row short. */
export const navMore = [
  { id: "involvement", label: "Beyond work" },
  { id: "recommendations", label: "Recommendations" },
] as const;
