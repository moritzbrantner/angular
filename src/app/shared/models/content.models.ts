export type DeploymentMode = 'Static' | 'Connected' | 'Server';
export type Locale = 'en' | 'de';

export type LocalizedContent<T> = Record<Locale, T>;

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

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterRequest extends AuthCredentials {
  readonly name: string;
  readonly confirmPassword: string;
}

export interface PasswordResetRequest {
  readonly email: string;
}

export interface AuthResult {
  readonly ok: boolean;
  readonly message: string;
}

export interface EmployeeProfileForm {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly age: number;
  readonly jobTitle: string;
  readonly startDate: string;
  readonly department: string;
  readonly newsletter: boolean;
  readonly bio: string;
}

export interface EmployeeRecord {
  readonly id: number;
  readonly name: string;
  readonly department: string;
  readonly role: string;
  readonly status: 'Active' | 'Onboarding' | 'Paused';
  readonly location: string;
}

export interface NewsletterSubscription {
  readonly email: string;
}

export interface ProblemReportRequest {
  readonly name: string;
  readonly email: string;
  readonly area: string;
  readonly pageUrl: string;
  readonly subject: string;
  readonly details: string;
}

export interface ProblemReportResult {
  readonly ok: boolean;
  readonly referenceId: string;
  readonly message: string;
}

export type UploadKind = 'Image' | 'Document' | 'Media' | 'Data file' | 'Other';
export type UploadStrategy = 'Preview and optimize' | 'Scan and store' | 'Transcode or chunk' | 'Validate schema' | 'Manual review';

export interface UploadQueueItem {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly kind: UploadKind;
  readonly strategy: UploadStrategy;
}

export interface BlogPostSummary {
  readonly date: string;
  readonly title: string;
  readonly summary: string;
}

export interface ChangelogEntry {
  readonly date: string;
  readonly title: string;
  readonly summary: string;
}

export interface AppSettings {
  readonly theme: 'light' | 'dark';
  readonly background: 'paper' | 'plain';
  readonly dateFormat: 'localized' | 'iso';
  readonly weekStartsOn: 0 | 1;
  readonly showOutsideDays: boolean;
  readonly compactSpacing: boolean;
  readonly reducedMotion: boolean;
  readonly showHotkeyHints: boolean;
  readonly notifications: {
    readonly enabled: boolean;
    readonly type: 'instant' | 'digest';
  };
}

export interface ConsentState {
  readonly decided: boolean;
  readonly analytics: boolean;
}
