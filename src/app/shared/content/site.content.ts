import {
  DocumentationSection,
  FrequentlyAskedQuestion,
  PlatformMode,
  ShowcaseRecord,
  SiteStat,
  TemplateRecord,
} from '../models/content.models';

export const SITE_STATS: readonly SiteStat[] = [
  { value: '3 launch modes', label: 'Static, connected, and server-backed delivery' },
  { value: '6 core routes', label: 'Catalog, showcase, docs, and conversion pages' },
  { value: '< 1 swap', label: 'Repository provider switch between local and API data' },
];

export const PLATFORM_MODES: readonly PlatformMode[] = [
  {
    name: 'Static',
    description: 'Best for GitHub Pages, marketing launches, and content that should never depend on a server.',
    strengths: ['Static browser bundle', 'Local typed content', 'GitHub Pages friendly routing'],
  },
  {
    name: 'Connected',
    description: 'Use the same Angular frontend with REST services for forms, search, or authenticated dashboards.',
    strengths: ['Same UI code', 'Repository abstraction', 'Environment-based API switching'],
  },
  {
    name: 'Server',
    description: 'Add a Node deployment when you need protected logic, server endpoints, or runtime composition.',
    strengths: ['Express API layer', 'SSR-capable build path', 'Same route map and content types'],
  },
];

export const TEMPLATES: readonly TemplateRecord[] = [
  {
    slug: 'atlas-launch-kit',
    name: 'Atlas Launch Kit',
    tagline: 'A high-clarity product launch template for SaaS teams.',
    summary: 'Ships with marketing sections, release notes, proof blocks, and a deployment story that works equally well from static export or live APIs.',
    category: 'Launch',
    audience: 'SaaS',
    priceModel: 'Commercial',
    stack: ['Angular', 'Signals', 'GitHub Pages', 'REST-ready'],
    capabilities: ['Feature launch pages', 'Announcement rails', 'Release documentation', 'Lead capture CTA'],
    deploymentModes: ['Static', 'Connected', 'Server'],
    hero: {
      src: 'images/template-atlas.svg',
      alt: 'Abstract launch page composition for the Atlas Launch Kit template.',
      width: 960,
      height: 720,
    },
    highlight: 'Prebuilt sections for launch week, onboarding, and proof.',
    relatedShowcases: ['northstar-ops'],
  },
  {
    slug: 'loom-docs-system',
    name: 'Loom Docs System',
    tagline: 'Documentation and education surface for teams that need structure fast.',
    summary: 'Focuses on information architecture, docs landing pages, comparison tables, and accessible navigation for large content sets.',
    category: 'Documentation',
    audience: 'Platform Teams',
    priceModel: 'Commercial',
    stack: ['Angular Router', 'Standalone components', 'Prerendering'],
    capabilities: ['Knowledge base landing', 'How-to guides', 'API references', 'Change logs'],
    deploymentModes: ['Static', 'Connected'],
    hero: {
      src: 'images/template-loom.svg',
      alt: 'Abstract documentation interface for the Loom Docs System template.',
      width: 960,
      height: 720,
    },
    highlight: 'A docs-first shell with a content model that can later move into a CMS.',
    relatedShowcases: ['quarry-cloud'],
  },
  {
    slug: 'quarry-showcase-grid',
    name: 'Quarry Showcase Grid',
    tagline: 'Case-study and portfolio format for agencies and product studios.',
    summary: 'Built around proof, metrics, and implementation detail so each project page can act as both marketing asset and technical summary.',
    category: 'Showcase',
    audience: 'Agencies',
    priceModel: 'Commercial',
    stack: ['Angular', 'Typed content', 'A11y-first UI'],
    capabilities: ['Case study index', 'Project detail pages', 'Metrics storytelling', 'Reusable proof sections'],
    deploymentModes: ['Static', 'Connected', 'Server'],
    hero: {
      src: 'images/template-quarry.svg',
      alt: 'Abstract portfolio grid for the Quarry Showcase Grid template.',
      width: 960,
      height: 720,
    },
    highlight: 'Turns project work into reusable sales collateral with minimal authoring effort.',
    relatedShowcases: ['ridgecare-studio', 'signal-partners'],
  },
];

export const SHOWCASES: readonly ShowcaseRecord[] = [
  {
    slug: 'northstar-ops',
    name: 'Northstar Ops',
    sector: 'B2B SaaS',
    challenge: 'Turn fragmented release notes and sales decks into one launch surface.',
    summary: 'Northstar Ops needed a launch site with reusable modules, changelog continuity, and a clean path from announcement to demo request.',
    outcome: 'The team shipped a static-first launch site with API-backed forms in two phases.',
    stack: ['Angular', 'GitHub Pages', 'Express API', 'HubSpot sync'],
    results: ['Single source of launch messaging', 'Reusable release-page sections', 'Connected contact workflow for inbound leads'],
    hero: {
      src: 'images/showcase-northstar.svg',
      alt: 'Abstract operating dashboard for the Northstar Ops showcase.',
      width: 960,
      height: 720,
    },
    linkedTemplateSlug: 'atlas-launch-kit',
  },
  {
    slug: 'quarry-cloud',
    name: 'Quarry Cloud',
    sector: 'Developer Platform',
    challenge: 'Replace scattered docs with a structured education and rollout site.',
    summary: 'The platform team needed docs, migration guides, and release content that could publish from git today and move to a CMS later.',
    outcome: 'A typed documentation site with lazy feature routes and a future-proof repository layer.',
    stack: ['Angular', 'Signals', 'Prerendering', 'Search-ready content model'],
    results: ['Structured docs IA', 'Cleaner release communication', 'Static deployment with no runtime dependencies'],
    hero: {
      src: 'images/showcase-quarry.svg',
      alt: 'Abstract documentation and architecture panels for the Quarry Cloud showcase.',
      width: 960,
      height: 720,
    },
    linkedTemplateSlug: 'loom-docs-system',
  },
  {
    slug: 'ridgecare-studio',
    name: 'Ridgecare Studio',
    sector: 'Agency',
    challenge: 'Show outcomes without a bloated CMS or a generic portfolio layout.',
    summary: 'Ridgecare wanted project pages that combined narrative, outcomes, stack details, and calls to action in a format that felt credible to technical buyers.',
    outcome: 'A showcase grid and case-study system designed for reuse, speed, and better proof density.',
    stack: ['Angular', 'Typed content', 'Reusable UI primitives'],
    results: ['Faster publishing workflow', 'Higher-quality proof on each case study', 'Consistent project storytelling'],
    hero: {
      src: 'images/showcase-ridgecare.svg',
      alt: 'Abstract portfolio case study composition for the Ridgecare Studio showcase.',
      width: 960,
      height: 720,
    },
    linkedTemplateSlug: 'quarry-showcase-grid',
  },
  {
    slug: 'signal-partners',
    name: 'Signal Partners',
    sector: 'Consulting',
    challenge: 'Unify services, case studies, and intake into one maintainable site surface.',
    summary: 'Signal Partners wanted a site that looked sharp on static hosting but could connect to backend services once forms and lead routing matured.',
    outcome: 'A roadmap-friendly site that started static and later added APIs without reworking page components.',
    stack: ['Angular', 'Repository pattern', 'Optional backend services'],
    results: ['Static launch path', 'Backend-ready data layer', 'Lower refactor cost when adding services'],
    hero: {
      src: 'images/showcase-signal.svg',
      alt: 'Abstract consulting site composition for the Signal Partners showcase.',
      width: 960,
      height: 720,
    },
    linkedTemplateSlug: 'quarry-showcase-grid',
  },
];

export const DOCUMENTATION_SECTIONS: readonly DocumentationSection[] = [
  {
    title: 'Deployment Modes',
    summary: 'Treat static hosting as the baseline and opt into backend services only where they add real value.',
    bullets: [
      'Build a static browser bundle for GitHub Pages with a 404 fallback file.',
      'Switch to API-backed repositories with an environment change, not a UI rewrite.',
      'Keep a separate server build path for protected logic or runtime rendering.',
    ],
  },
  {
    title: 'Content Model',
    summary: 'Start with typed in-repo content so every page works without network dependencies.',
    bullets: [
      'Templates and showcases share stable record shapes.',
      'The same shapes can later come from a CMS or REST endpoint.',
      'Known content slugs remain stable whether records live in source files or behind APIs.',
    ],
  },
  {
    title: 'Quality Gates',
    summary: 'The site should hold up as a real product surface rather than a demo shell.',
    bullets: [
      'Accessible navigation, focus states, and form semantics.',
      'Lazy feature routes and bundle budgets.',
      'Repository tests and smoke tests around routing and shell rendering.',
    ],
  },
];

export const FAQS: readonly FrequentlyAskedQuestion[] = [
  {
    question: 'Can this site run entirely from GitHub Pages?',
    answer: 'Yes. The default production build is static-first and uses local typed content, so the public site works without a backend.',
  },
  {
    question: 'What changes when backend services are added?',
    answer: 'Only the provider wiring and environment configuration. The page components continue consuming the same repository contracts.',
  },
  {
    question: 'Why keep the optional server build?',
    answer: 'It provides a place for protected endpoints, authenticated workflows, or runtime-specific features that static hosting should not own.',
  },
];
