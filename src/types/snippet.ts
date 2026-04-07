export interface SnippetVariantMeta {
  id: string;
  label: string;
  file: string;
  moduleFormat: string;
  language: string;
  distributionKind: string;
  runtimeTargets?: string[];
  normalizations?: string[];
  note?: string;
}

export interface SnippetSupportLink {
  label: string;
  url: string;
}

export interface SnippetVariant extends SnippetVariantMeta {
  code: string;
}

export interface SnippetMeta {
  name: string;
  slug: string;
  status: string;
  description: string;
  tagline: string;
  sourcePackage: string;
  sourceVersion: string;
  sourcePublishedAt?: string;
  sourceRef: string;
  license: string;
  publishedUrl: string;
  repositoryUrl: string;
  suggestedFilename: string;
  copiedAt: string;
  summary: string;
  nativeAlternative: string;
  supportLinks?: SnippetSupportLink[];
  defaultVariant: string;
  variants: SnippetVariantMeta[];
  sourceEntry?: string;
  extractedHelpers?: string[];
  extractedHelpersCount?: number;
  note?: string;
}

export interface Snippet extends SnippetMeta {
  variants: SnippetVariant[];
}
