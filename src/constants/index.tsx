// Design Lab. Only the Worker's public URL is client-side; the model key lives
// as a Worker secret. Never reintroduce a VITE_-prefixed model key: everything
// with that prefix is inlined verbatim into the public bundle.
export const DESIGNLAB_ENDPOINT =
  import.meta.env.VITE_DESIGNLAB_ENDPOINT || "";

// EmailJS
export const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";
export const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
export const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";

// Identity: single source of truth for contact details, schema and meta copy.
export const PROFILE = {
  name: "Mohamed Samy",
  role: "Full Stack Engineer",
  location: "Riyadh, Saudi Arabia",
  email: "mohamedadel74@gmail.com",
  phone: "+966 50 655 7963",
  phoneHref: "tel:+966506557963",
  github: "https://github.com/mohamedsamy911",
  linkedin: "https://www.linkedin.com/in/mohamed-samy-ba0107141/",
};

export type Project = {
  title: string;
  category: string;
  period: string;
  summary: string;
  detail: string;
  stack: string[];
  outcome?: string;
  /** Only set where a genuinely public, inspectable repository exists.
   *  Left unset means no link is rendered at all. The previous build showed a
   *  "Source" and a "Demo" button that both pointed at the same profile page. */
  repo?: string;
};

export const projects: Project[] = [
  {
    title: "Design Lab",
    category: "AI engineering",
    period: "2026",
    summary:
      "The system designer running in the Lab section of this site. A plain-English brief goes in; a checked service split, domain model and HTTP surface come out.",
    detail:
      "The model is constrained to a typed graph with a response schema rather than asked for a document. The graph is checked for referential integrity, gets one repair pass with the errors fed back if it fails, and every artefact on screen, including the OpenAPI file, is compiled from it by deterministic TypeScript. The key sits in a Cloudflare Worker behind a rate limit and a daily spend cap.",
    stack: ["TypeScript", "React", "Gemini API", "Cloudflare Workers"],
    outcome: "Compiler, validator and layout covered by 44 offline tests",
    repo: `${PROFILE.github}/mohamedsamy911.github.io`,
  },
  {
    title: "Allocation Management",
    category: "Full stack",
    period: "2023",
    summary:
      "A resource and project allocation system for planning teams, with a dashboard for assigning people to work and tracking capacity.",
    detail:
      "Typed React front end over a NestJS API, containerised for deployment. Allocation state is normalised in PostgreSQL so capacity conflicts are caught at write time rather than surfaced later in reporting.",
    stack: ["React", "TypeScript", "NestJS", "PostgreSQL", "Docker"],
  },
  {
    title: "Hospital Management System",
    category: "Backend",
    period: "2023",
    summary:
      "Backend for a hospital operations platform: scheduling, records and ward state, with live updates to every connected client.",
    detail:
      "Role-based authentication across clinical and administrative users, WebSocket channels for real-time ward and appointment events, and Redis in front of the read-heavy lookup paths.",
    stack: ["NestJS", "PostgreSQL", "Redis", "WebSockets", "Docker"],
    outcome: "Cached lookups cut API response times by ~40%",
  },
  {
    title: "E-commerce Platform",
    category: "Full stack",
    period: "2022",
    summary:
      "A storefront and admin back office with payment integration and role-based access for staff and customers.",
    detail:
      "Next.js rendering the catalogue and checkout, PostgreSQL for orders and inventory, with an admin surface gated behind role checks rather than a separate application.",
    stack: ["Next.js", "Node.js", "Express", "PostgreSQL", "Docker"],
  },
];

/** Client and employer work, from the résumé. Not linkable, so it is listed
 *  as a compact index rather than dressed up as a portfolio card. */
export const clientWork = [
  {
    title: "Water & wastewater resource management",
    client: "Cairo, Giza & Alexandria Governorates",
    stack: "React · Java · Camunda BPM · Docker",
  },
  {
    title: "Geo-enabled e-services portal",
    client: "Ministry of Tourism, Oman",
    stack: "React · PostGIS · Docker Swarm",
  },
  {
    title: "Crime-pattern analytics dashboards",
    client: "Ministry of Interior, Egypt",
    stack: "React · Apache Superset · NGINX",
  },
  {
    title: "Licensing & public complaint workflows",
    client: "Alexandria Governorate",
    stack: "Camunda BPM · Java · PostgreSQL",
  },
  {
    title: "Smart asset management, GIS + IoT",
    client: "Emaar Egypt City",
    stack: "React · Java · NestJS · n8n · NGINX",
  },
  {
    title: "Smart asset management, GIS + IoT",
    client: "Olympic City",
    stack: "React · Java · Docker Swarm · NGINX",
  },
];

export const services = [
  {
    title: "Full-stack web applications",
    description:
      "End-to-end apps from a React or Next.js front end to a NestJS, Node.js or Java back end. Typed throughout, tested, and structured to survive a second team touching it.",
    keywords: ["React", "Next.js", "NestJS", "Node.js", "TypeScript"],
  },
  {
    title: "APIs & microservices",
    description:
      "RESTful services with explicit contracts and a caching layer where the read path justifies one. Response times on the systems above came down by around 40%.",
    keywords: ["REST APIs", "Microservices", "PostgreSQL", "Redis"],
  },
  {
    title: "Deployment & operations",
    description:
      "Containerised delivery with Docker and Docker Swarm behind NGINX on Linux, wired into CI/CD. Downtime on the platforms I run dropped by roughly 30%.",
    keywords: ["Docker", "Docker Swarm", "NGINX", "Linux", "CI/CD"],
  },
  {
    title: "LLM features in production",
    description:
      "Model output constrained to a schema, validated before it reaches a user, and repaired rather than trusted. Keys held server-side, spend capped, and the deterministic parts covered by tests that need no network. The Design Lab on this site is a worked example.",
    keywords: ["Structured output", "Validation", "Evals", "Cloudflare Workers"],
  },
  {
    title: "Workflow automation",
    description:
      "Business-process automation with Camunda BPM (BPMN and DMN), replacing manual routing and approval steps. Typically halves the handling effort on a process.",
    keywords: ["Camunda BPM", "BPMN", "Automation"],
  },
];

export const experienceTimeline = [
  {
    role: "Senior Software Engineer",
    company: "Penta-b",
    period: "Jan 2022 - Present",
    location: "Egypt",
    highlights: [
      "Built and maintained full-stack applications on React with NestJS and Java back ends",
      "Designed REST APIs and a microservices split that improved response times by 40%",
      "Deployed and operated services on Docker and Docker Swarm, reducing downtime by 30%",
      "Configured NGINX as reverse proxy and load balancer for request routing",
      "Automated approval workflows with Camunda BPM, cutting manual processing by 50%",
      "Led backend integration of smart asset tracking across GIS and IoT platforms",
    ],
  },
  {
    role: "GIS Developer",
    company: "Edge-Pro for Information Systems",
    period: "Jul 2020 - Jan 2022",
    location: "Egypt",
    highlights: [
      "Built web-based GIS dashboards in JavaScript, HTML and CSS",
      "Developed form-driven workflows and notification systems",
      "Ran satellite image analysis and remote sensing for environmental research",
      "Delivered client training and product demos on Skyline and ERDAS IMAGINE",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Freelance",
    period: "Ongoing",
    location: "Remote",
    highlights: [
      "E-commerce application with role-based auth on Next.js and PostgreSQL",
      "Hospital management system on React, NestJS, PostgreSQL and Redis",
      "Point-of-sale system on React Electron, NestJS and PostgreSQL",
    ],
  },
];

export const education = [
  {
    degree: "Master of Business Administration",
    school: "Brooklyn Business School",
    period: "2024 - Present",
  },
  {
    degree: "Full Stack Web Development Diploma",
    school: "Route Academy",
    period: "2021 - 2022",
  },
  {
    degree: "B.Sc. Civil Engineering",
    school: "German University in Cairo",
    period: "2013 - 2018",
  },
];

/** Grouped so the skills list reads as an inventory, not a word cloud. */
export const skillGroups = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Java", "SQL", "HTML", "CSS"],
  },
  {
    label: "Front end",
    items: ["React", "Next.js", "Redux", "Tailwind CSS"],
  },
  {
    label: "Back end",
    items: ["Node.js", "NestJS", "Express", "Spring Boot", "REST", "Microservices"],
  },
  {
    label: "Data",
    items: ["PostgreSQL", "MySQL", "SQL Server", "Redis", "PostGIS"],
  },
  {
    label: "Operations",
    items: ["Docker", "Docker Swarm", "NGINX", "Linux", "Git", "CI/CD"],
  },
  {
    label: "Automation",
    items: ["Camunda BPM", "BPMN", "DMN", "CMMN", "n8n"],
  },
  {
    label: "AI",
    items: [
      "Gemini API",
      "Structured output",
      "Schema validation",
      "Evals",
      "Cloudflare Workers",
    ],
  },
];

export const facts = [
  { value: "5+", label: "Years shipping" },
  { value: "40%", label: "Faster API responses" },
  { value: "30%", label: "Less downtime" },
  { value: "50%", label: "Less manual processing" },
];
