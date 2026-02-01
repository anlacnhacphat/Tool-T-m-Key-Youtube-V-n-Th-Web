export interface KeywordResult {
  keyword: string;
  vietnameseTranslation?: string;
}

export interface SearchOptions {
  language: string;
  topic: string;
  mainKeyword?: string;
  audience: 'viet' | 'foreign';
  competitorUrl: string;
  keywordCount: number;
}
