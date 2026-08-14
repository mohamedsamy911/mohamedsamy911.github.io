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

/** Systems delivered for clients and employers. These lead the section: they
 *  are the largest, and the rarest, work in the portfolio. Not linkable, since
 *  they are client-owned. Content is drawn from the resume; expand any entry
 *  with the detail you are free to share. */
export type ClientSystem = {
  title: string;
  client: string;
  summary: string;
  stack: string[];
  outcome?: string;
};

export const clientSystems: ClientSystem[] = [
  {
    title: "Water and wastewater resource management",
    client: "Cairo, Giza and Alexandria Governorates",
    summary:
      "A resource management application for water and wastewater operations, running across three governorates. I led the design and the deployment.",
    stack: ["React", "Java", "Camunda BPM", "Docker"],
  },
  {
    title: "Licensing and public complaint workflows",
    client: "Alexandria Governorate",
    summary:
      "Camunda-modelled processes for licence applications and public complaints, replacing manual routing between departments. The routing rules are policy, so they live in the process model rather than in application code.",
    stack: ["Camunda BPM", "Java", "PostgreSQL", "Docker"],
    outcome: "Cut manual processing effort by around 50%",
  },
  {
    title: "Smart asset management, GIS and IoT",
    client: "Emaar Egypt City and Olympic City",
    summary:
      "Asset tracking for two developments, integrating GIS and IoT platforms behind REST services, with automated flows between the systems that feed them.",
    stack: ["React", "Java", "NestJS", "n8n", "Docker Swarm", "NGINX"],
  },
  {
    title: "Geo-enabled e-services portal",
    client: "Ministry of Tourism, Oman",
    summary:
      "Geo-aware features for the ministry's public tourism portal, with PostGIS answering the spatial queries and the services deployed on Docker Swarm.",
    stack: ["React", "PostGIS", "Docker Swarm"],
  },
  {
    title: "Crime-pattern analytics dashboards",
    client: "Ministry of Interior, Egypt",
    summary:
      "Interactive dashboards with geo-analytics for visualising crime patterns across regions, served behind NGINX.",
    stack: ["React", "Apache Superset", "NGINX"],
  },
  {
    title: "Internal process automation",
    client: "Penta-b",
    summary:
      "Full-stack tools that took repetitive internal tasks off the team, from request intake through to completion.",
    stack: ["React", "NestJS", "Docker"],
    outcome: "Optimised the affected processes by over 30%",
  },
];

/** Things built outside client work. A compact index: they are smaller than the
 *  systems above and, apart from the Design Lab, not inspectable. */
export type PersonalProject = {
  title: string;
  summary: string;
  stack: string;
  /** Only where a genuinely public repository exists. */
  repo?: string;
};

export const personalProjects: PersonalProject[] = [
  {
    title: "Design Lab",
    summary:
      "The system designer in section 02 of this site. Schema-constrained generation, validated and compiled by hand-written TypeScript.",
    stack: "TypeScript · React · Gemini API · Cloudflare Workers",
    repo: `${PROFILE.github}/mohamedsamy911.github.io`,
  },
  {
    title: "Hospital Management System",
    summary:
      "Backend for hospital operations: role-based access, real-time ward events over WebSockets, Redis in front of the read-heavy paths.",
    stack: "NestJS · PostgreSQL · Redis · WebSockets",
  },
  {
    title: "Allocation Management",
    summary:
      "Resource and project allocation with capacity conflicts caught at write time rather than surfaced later in reporting.",
    stack: "React · TypeScript · NestJS · PostgreSQL",
  },
  {
    title: "E-commerce Platform",
    summary:
      "Storefront and admin back office with payment integration and role-gated staff access.",
    stack: "Next.js · Node.js · Express · PostgreSQL",
  },
  {
    title: "Point-of-sale system",
    summary:
      "Desktop POS for a cafeteria, built on React Electron over a NestJS API.",
    stack: "React Electron · NestJS · PostgreSQL",
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
