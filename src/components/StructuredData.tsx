import { projects, services } from "../constants";

/**
 * Emits JSON-LD for the dynamic, data-driven content (projects + services).
 * Identity schema (Person, WebSite) lives statically in index.html; these nodes
 * reference the Person by @id. Rendered into the DOM so the build-time
 * prerender captures it into static HTML.
 */
const SITE = "https://mohamedsamy911.github.io";

const StructuredData: React.FC = () => {
  const graph = [
    {
      "@type": "ItemList",
      "@id": `${SITE}/#projects`,
      name: "Projects by Mohamed Samy",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareSourceCode",
          name: p.title,
          description: p.summary,
          ...(p.repo ? { codeRepository: p.repo, url: p.repo } : {}),
          keywords: p.stack.join(", "),
          author: { "@id": `${SITE}/#person` },
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${SITE}/#services`,
      name: "Services offered by Mohamed Samy",
      itemListElement: services.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: s.title,
          description: s.description,
          serviceType: s.title,
          provider: { "@id": `${SITE}/#person` },
          areaServed: "Worldwide",
        },
      })),
    },
  ];

  const json = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
};

export default StructuredData;
