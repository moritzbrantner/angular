export type DeploymentMode = 'Static' | 'Connected' | 'Server';

export interface SiteAsset {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface TemplateRecord {
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly summary: string;
  readonly category: string;
  readonly audience: string;
  readonly priceModel: string;
  readonly stack: readonly string[];
  readonly capabilities: readonly string[];
  readonly deploymentModes: readonly DeploymentMode[];
  readonly hero: SiteAsset;
  readonly highlight: string;
  readonly relatedShowcases: readonly string[];
}

export interface ShowcaseRecord {
  readonly slug: string;
  readonly name: string;
  readonly sector: string;
  readonly challenge: string;
  readonly summary: string;
  readonly outcome: string;
  readonly stack: readonly string[];
  readonly results: readonly string[];
  readonly hero: SiteAsset;
  readonly linkedTemplateSlug: string;
}

export interface DocumentationSection {
  readonly title: string;
  readonly summary: string;
  readonly bullets: readonly string[];
}

export interface SiteStat {
  readonly label: string;
  readonly value: string;
}

export interface PlatformMode {
  readonly name: string;
  readonly description: string;
  readonly strengths: readonly string[];
}

export interface FrequentlyAskedQuestion {
  readonly question: string;
  readonly answer: string;
}

export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly projectType: string;
  readonly message: string;
}

export interface ContactSubmissionResult {
  readonly ok: boolean;
  readonly message: string;
}
