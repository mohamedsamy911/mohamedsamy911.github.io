import {
  Cable,
  Code,
  Code2,
  Container,
  Database,
  Layers,
  Zap,
} from "lucide-react";
import hms from "../assets/hms.webp";
import ras from "../assets/ras.webp";
import ecommerce from "../assets/e-commerce.webp";

// AI
export const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// EmailJS
export const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";
export const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
export const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";

// Projects
export const projects = [
  {
    title: "Allocation Management App",
    description:
      "A full-stack allocation system with a sleek dashboard to manage resources and projects efficiently.",
    tags: [
      { label: "React", icon: <Code className="w-3.5 h-3.5" /> },
      { label: "TypeScript", icon: <Code2 className="w-3.5 h-3.5" /> },
      { label: "Tailwind CSS", icon: <Layers className="w-3.5 h-3.5" /> },
      { label: "PostgreSQL", icon: <Database className="w-3.5 h-3.5" /> },
      { label: "Docker", icon: <Container className="w-3.5 h-3.5" /> },
      { label: "NestJS", icon: <Cable className="w-3.5 h-3.5" /> },
    ],
    pic: ras,
  },
  {
    title: "E-commerce Platform",
    description:
      "Full-stack e-commerce platform with secure payment integration and admin dashboard.",
    tags: [
      { label: "Node.js", icon: <Code className="w-3.5 h-3.5" /> },
      { label: "Next.js", icon: <Code2 className="w-3.5 h-3.5" /> },
      { label: "Express.js", icon: <Cable className="w-3.5 h-3.5" /> },
      { label: "PostgreSQL", icon: <Database className="w-3.5 h-3.5" /> },
      { label: "Tailwind CSS", icon: <Layers className="w-3.5 h-3.5" /> },
      { label: "Docker", icon: <Container className="w-3.5 h-3.5" /> },
    ],
    pic: ecommerce,
  },
  {
    title: "Hospital Management System Backend",
    description:
      "Backend system for hospital management with real-time support.",
    tags: [
      { label: "Node.js", icon: <Code className="w-3.5 h-3.5" /> },
      { label: "NestJS", icon: <Cable className="w-3.5 h-3.5" /> },
      { label: "PostgreSQL", icon: <Database className="w-3.5 h-3.5" /> },
      { label: "Docker", icon: <Container className="w-3.5 h-3.5" /> },
      { label: "WebSockets", icon: <Zap className="w-3.5 h-3.5" /> },
    ],
    pic: hms,
  },
];

// Resume Content
export const RESUME_CONTENT = `
  Name: Mohamed Adel Samy
  Title: SOFTWARE ENGINEER
  Contact: mohamedadel74@gmail.com | (+20)1101021996

  PROFESSIONAL SUMMARY:
  Results-driven Software Engineer with over 5 years of experience building scalable, secure web applications using React.js, Node.js, Java, NestJS, and JavaScript. Expertise in developing RESTful APIs, implementing microservices architecture, and managing DevOps pipelines using Docker, NGINX, and Linux. Proven success in automating business processes, enhancing performance, and delivering reliable solutions in agile environments.

  TECHNICAL SKILLS:
  Languages: JavaScript, TypeScript, Java, SQL, HTML, CSS
  Frontend: React.js, Next.js, JavaScript ES6+, Redux, HTML5, CSS3
  Backend: Node.js, NestJS, Express.js, Java (Spring Boot), REST APIs, Microservices
  DevOps & Tools: Docker, Docker Swarm, NGINX, Linux, Git, GitHub, CI/CD, Agile
  Databases: PostgreSQL, MySQL, SQL Server, Database Design, Query Optimization
  Workflow Automation: Camunda BPM, BPMN, DMN, CMMN
  GIS Tools: PostGIS, Apache Superset, ERDAS IMAGINE
  Soft Skills: Problem Solving, Communication, Collaboration, Agile Methodologies

  PROFESSIONAL EXPERIENCE:
  January 2022 - Current: Senior Software Engineer, Penta-b
    - Built and maintained scalable full-stack applications using React.js (frontend) and NestJS/Java (backend).
    - Designed and implemented RESTful APIs and microservices architecture, improving response times by 40%.
    - Deployed and managed services using Docker and Docker Swarm, reducing system downtime by 30%.
    - Configured NGINX as a reverse proxy and load balancer to enhance performance and request routing.
    - Automated workflows using Camunda BPM, reducing manual processing by 50%.
    - Led backend integration of smart asset tracking systems using GIS and IoT platforms.
    - Performed routine database maintenance, backups, and tuning for PostgreSQL, ensuring high availability.

  July 2020 - January 2022: GIS Developer, Edge-Pro for Information Systems
    - Customized web-based GIS dashboards using JavaScript, HTML, and CSS, improving visual reporting.
    - Developed form-based workflows and notification systems, enhancing communication efficiency.
    - Conducted satellite image analysis and remote sensing for environmental research projects.
    - Delivered product training and demos for clients using Skyline and ERDAS IMAGINE.
    - Created technical documentation and user guides to streamline onboarding and support.

  Freelancing Projects (Full-Stack Developer):
    - Developed NextJS, PostgreSQL full stack E-commerce Application with Role Based Authentication.
    - Designed and developed a complete Hospital Management System using ReactJS, NestJS, PostgreSQL and Redis.
    - Designed and developed a POS system using React Electron, NestJs and PostgreSQL.

  PROJECTS:
  - Internal Process Automation Tools: Developed full-stack tools to automate repetitive tasks and optimize work process for over 30%. (Tech: ReactJS, NestJS, Docker)
  - Full-stack Development for Water & Wastewater Management (Egypt): Led design and deployment of resource management application across Cairo, Giza, and Alexandria Governorates. (Tech: ReactJS, Java, Docker, Camunda BPM)
  - Geo-Enabled E-Services for Oman's Ministry of Tourism (MOT): Developed geo-aware features for MOT's tourism portal. (Tech: ReactJS, PostGIS, Docker Swarm)
  - GIS Dashboards for Egypt's Ministry of Interior: Built interactive dashboards with geo-analytics for crime pattern visualization. (Tech: ReactJS, Apache Superset, NGINX)
  - BPM Workflow Automation for Alexandria Governorate: Designed Camunda-based workflows for licensing and public complaint systems. (Tech: Camunda BPM, Java, Docker, PostgreSQL)
  - Emaar Egypt City Smart System: Built an asset management system integrated with GIS and IoT platforms. (Tech: ReactJS, Java, Docker, NGINX, NestJS RESTful APIs, n8n)
  - Olympic City Smart System: Built an asset management system integrated with GIS and IoT platforms. (Tech: ReactJS, Java, Docker Swarm, NGINX, RESTful APIs)
  - Mapp Enterprise Dashboard Customization: Customized dashboards using JavaScript API and CSS. (Tech: JavaScript, CSS, Mapp Enterprise)
  - Full-Stack E-Commerce Application: Created a fully customizable E-Commerce Application with Role based Authentication. (Tech: NextJs, PostgreSQL)
  - Backend for POS System: Designed and Developed the backend for a Point of Sale (POS) for a cafeteria. (Tech: NestJS, PostgreSQL)
  - Backend for a Hospital Management System: Designed and developed the backend for a Hospital Management System. (Tech: NextJs, PostgreSQL, Redis)

  EDUCATION:
  2024-Current: Master of Business Administration, Brooklen Business School
  2021-2022: Full Stack Web Development Diploma, Route Academy
  2013-2018: Bachelor's degree in civil engineering, German University in Cairo (GUC)

  LANGUAGES:
  Arabic, English, German
`;
