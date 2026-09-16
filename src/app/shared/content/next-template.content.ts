import { BlogPostSummary, ChangelogEntry, EmployeeRecord, Locale } from '../models/content.models';

export const LOCALES: readonly Locale[] = ['en', 'de'];

export interface LocalizedPageCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
}

export interface NavigationEntry {
  readonly label: string;
  readonly path: string;
  readonly hotkey: string;
}

export interface NavigationGroup {
  readonly label: string;
  readonly entries: readonly NavigationEntry[];
}

export const NAVIGATION: Record<Locale, readonly NavigationGroup[]> = {
  en: [
    {
      label: 'Discover',
      entries: [
        { label: 'Home', path: '', hotkey: 'H' },
        { label: 'About', path: 'about', hotkey: 'A' },
        { label: 'remocn', path: 'remocn', hotkey: 'V' },
        { label: 'Story Demo', path: 'examples/story', hotkey: 'S' },
        { label: 'Communication', path: 'examples/communication', hotkey: 'C' },
        { label: 'Blog', path: 'blog', hotkey: 'G' },
        { label: 'Changelog', path: 'changelog', hotkey: 'K' },
        { label: 'Report a problem', path: 'report-problem', hotkey: 'B' },
      ],
    },
    {
      label: 'Workspace',
      entries: [
        { label: 'Form Demo', path: 'examples/forms', hotkey: 'F' },
        { label: 'Table', path: 'table', hotkey: 'T' },
        { label: 'Uploads', path: 'examples/uploads', hotkey: 'U' },
      ],
    },
    {
      label: 'Account',
      entries: [
        { label: 'Log in', path: 'login', hotkey: 'L' },
        { label: 'Register', path: 'register', hotkey: 'R' },
      ],
    },
  ],
  de: [
    {
      label: 'Entdecken',
      entries: [
        { label: 'Start', path: '', hotkey: 'H' },
        { label: 'Ueber uns', path: 'about', hotkey: 'A' },
        { label: 'remocn', path: 'remocn', hotkey: 'V' },
        { label: 'Story-Demo', path: 'examples/story', hotkey: 'S' },
        { label: 'Kommunikation', path: 'examples/communication', hotkey: 'C' },
        { label: 'Blog', path: 'blog', hotkey: 'G' },
        { label: 'Changelog', path: 'changelog', hotkey: 'K' },
        { label: 'Problem melden', path: 'report-problem', hotkey: 'B' },
      ],
    },
    {
      label: 'Arbeitsbereich',
      entries: [
        { label: 'Formular-Demo', path: 'examples/forms', hotkey: 'F' },
        { label: 'Tabelle', path: 'table', hotkey: 'T' },
        { label: 'Uploads', path: 'examples/uploads', hotkey: 'U' },
      ],
    },
    {
      label: 'Konto',
      entries: [
        { label: 'Anmelden', path: 'login', hotkey: 'L' },
        { label: 'Registrieren', path: 'register', hotkey: 'R' },
      ],
    },
  ],
};

export const HOME_COPY: Record<Locale, LocalizedPageCopy> = {
  en: {
    eyebrow: 'Start',
    title: 'One template, multiple production-ready starting points.',
    lead: 'The merged starter combines localized navigation, auth, forms, data views, storytelling, communication notes, and upload scaffolding in one Angular base.',
  },
  de: {
    eyebrow: 'Start',
    title: 'Eine Vorlage mit mehreren produktionsnahen Ausgangspunkten.',
    lead: 'Der zusammengefuehrte Starter vereint lokalisierte Navigation, Auth, Formulare, Datenansichten, Storytelling, Kommunikationsleitlinien und Upload-Grundlagen in einer Angular-Basis.',
  },
};

export const HOME_FEATURES: Record<Locale, readonly LocalizedPageCopy[]> = {
  en: [
    {
      eyebrow: 'Application foundation',
      title: 'Authentication, locale routing, profile management, admin controls, and typed service boundaries.',
      lead: 'Use the static app immediately and switch selected repositories to API-backed behavior later.',
    },
    {
      eyebrow: 'Interaction demos',
      title: 'Form state, scroll-driven storytelling, data tables, and richer UI patterns for future features.',
      lead: 'Each demo has real state and accessible controls instead of placeholder copy.',
    },
    {
      eyebrow: 'Delivery scaffolding',
      title: 'Upload handling rules, communication guidance, and lanes for realtime work.',
      lead: 'Server endpoints stay optional so GitHub Pages remains a first-class target.',
    },
  ],
  de: [
    {
      eyebrow: 'Anwendungsfundament',
      title: 'Authentifizierung, Locale-Routing, Profilverwaltung, Admin-Steuerung und typisierte Service-Grenzen.',
      lead: 'Nutze die statische App sofort und schalte einzelne Repositories spaeter auf API-Betrieb um.',
    },
    {
      eyebrow: 'Interaktionsdemos',
      title: 'Formularzustand, scrollgesteuertes Storytelling, Datentabellen und staerkere UI-Muster.',
      lead: 'Jede Demo enthaelt echten Zustand und zugaengliche Controls statt Platzhaltertext.',
    },
    {
      eyebrow: 'Auslieferungsgrundlagen',
      title: 'Upload-Regeln, Kommunikationsleitlinien und Bereiche fuer Echtzeit-Arbeit.',
      lead: 'Server-Endpunkte bleiben optional, damit GitHub Pages ein vollwertiges Ziel bleibt.',
    },
  ],
};

export const ABOUT_COPY: Record<Locale, LocalizedPageCopy> = {
  en: {
    eyebrow: 'About this project',
    title: 'Locale routing and reusable building blocks inside one app shell.',
    lead: 'The language lives in the URL, page copy is typed, and each feature route can move from static data to backend services without changing the shell.',
  },
  de: {
    eyebrow: 'Ueber dieses Projekt',
    title: 'Locale-Routing und wiederverwendbare Bausteine in einer App-Shell.',
    lead: 'Die Sprache lebt in der URL, Seitentexte sind typisiert, und jede Feature-Route kann von statischen Daten zu Backend-Services wechseln.',
  },
};

export const BLOG_POSTS: Record<Locale, readonly BlogPostSummary[]> = {
  en: [
    {
      date: '2026-04-13',
      title: 'Building Hybrid Sites',
      summary: 'Repo-managed content and DB-backed operational data can coexist cleanly.',
    },
    {
      date: '2026-04-12',
      title: 'Template Launch',
      summary: 'Canonical marketing content now lives in typed source files.',
    },
  ],
  de: [
    {
      date: '2026-04-13',
      title: 'Hybride Sites bauen',
      summary: 'Repo-verwaltete Inhalte und operative Daten aus APIs koennen sauber nebeneinander existieren.',
    },
    {
      date: '2026-04-12',
      title: 'Template Launch',
      summary: 'Kanonische Marketing-Inhalte liegen jetzt typisiert im Quellcode.',
    },
  ],
};

export const CHANGELOG_ENTRIES: Record<Locale, readonly ChangelogEntry[]> = {
  en: [
    {
      date: '2026-04-12',
      title: 'Foundation Hardening',
      summary: 'Environment, routing, observability, and job foundations were standardized.',
    },
  ],
  de: [
    {
      date: '2026-04-12',
      title: 'Fundament gehaertet',
      summary: 'Environment, Routing, Beobachtbarkeit und Job-Grundlagen wurden standardisiert.',
    },
  ],
};

export const EMPLOYEES: readonly EmployeeRecord[] = [
  { id: 1, name: 'Alex Johnson', department: 'Engineering', role: 'Frontend Lead', status: 'Active', location: 'Berlin' },
  { id: 2, name: 'Mina Keller', department: 'Product', role: 'Product Manager', status: 'Onboarding', location: 'Hamburg' },
  { id: 3, name: 'Sam Rivera', department: 'Design', role: 'UX Designer', status: 'Active', location: 'Remote' },
  { id: 4, name: 'Lena Roth', department: 'People Ops', role: 'Operations Partner', status: 'Paused', location: 'Munich' },
];

export const FORM_STATE_NOTES: Record<Locale, readonly LocalizedPageCopy[]> = {
  en: [
    { eyebrow: 'FormGroup', title: 'Creates the form API, default values, validators, and state object that everything else reads from.', lead: 'The Angular equivalent of the form controller lives in a typed reactive form.' },
    { eyebrow: 'formControlName', title: 'Connects native controls to the form without extra wrappers.', lead: 'Validation and value updates stay inside the same form tree.' },
    { eyebrow: 'Custom controls', title: 'Use ControlValueAccessor when a direct formControlName binding is not enough.', lead: 'The same validation and touched state still flow through the parent form.' },
    { eyebrow: 'reset', title: 'Restores defaults, clears errors, and can optionally rebase the clean snapshot.', lead: 'The demo uses reset after a successful submission.' },
  ],
  de: [
    { eyebrow: 'FormGroup', title: 'Erzeugt Formular-API, Default-Werte, Validatoren und den State, aus dem alles andere liest.', lead: 'Das Angular-Gegenstueck zum Form Controller lebt in einem typisierten Reactive Form.' },
    { eyebrow: 'formControlName', title: 'Verbindet native Controls ohne zusaetzliche Wrapper mit dem Formular.', lead: 'Validierung und Werte bleiben im selben Formularbaum.' },
    { eyebrow: 'Custom Controls', title: 'Nutze ControlValueAccessor, wenn formControlName allein nicht reicht.', lead: 'Validierung und touched state laufen weiter durch das Parent-Formular.' },
    { eyebrow: 'reset', title: 'Stellt Defaults wieder her, loescht Fehler und kann den sauberen Snapshot neu setzen.', lead: 'Die Demo nutzt reset nach erfolgreichem Senden.' },
  ],
};

export const STORY_STEPS: readonly LocalizedPageCopy[] = [
  {
    eyebrow: 'Scene 1',
    title: 'Foundation',
    lead: 'Start with a broad system view before narrowing the camera onto the first interaction.',
  },
  {
    eyebrow: 'Scene 2',
    title: 'Handoff',
    lead: 'Transition between narrative beats with enough motion to show continuity without losing context.',
  },
  {
    eyebrow: 'Scene 3',
    title: 'Resolution',
    lead: 'Land the final scene with a calmer pace so the content can carry the end of the sequence.',
  },
];
