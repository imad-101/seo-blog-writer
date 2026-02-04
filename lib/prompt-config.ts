// Site configuration with type-safe site rules
// These rules are appended to the base prompt based on site selection

export type SiteType = "tool-directory" | "json-tools" | "domnest";

export interface SiteConfig {
  value: SiteType;
  label: string;
  description: string;
  rules: string;
}

export const SITE_RULES: Record<SiteType, string> = {
  "tool-directory": `SITE-SPECIFIC RULES (Tool Site)
- Optimize content for commercial and problem-solving intent
- Prefer shorter paragraphs and scannable sections
- Encourage neutral mention of tools as solutions
- Emphasize comparisons, use cases, and practical outcomes
- Favor CTAs inside "How to" or "Best tools" style sections
- Internal links should prioritize tool pages and category pages`,

  "json-tools": `SITE-SPECIFIC RULES (JSON Site)
- Focus on working with JSON files, APIs, and data structures
- Include practical, real-world examples where relevant
- Encourage use of code blocks for JSON snippets
- Prefer problem–solution explanations over theory
- Reference browser-based JSON tools naturally
- Internal links should prioritize JSON-related tools and tutorials`,

  "domnest": `SITE-SPECIFIC RULES (Domnest)
- Maintain an authoritative, editorial tone
- Prioritize data-backed insights and recent statistics
- Enforce strong internal linking between related articles
- Use SEO-first headings and structured sections
- Be aware of monetization and conversion intent
- Favor long-term evergreen content over short trends`,
};

export const SITES: SiteConfig[] = [
  {
    value: "json-tools",
    label: "JSON Tools",
    description: "JSON files, APIs, and data structure content",
    rules: SITE_RULES["json-tools"],
  },
  {
    value: "tool-directory",
    label: "Tool Directory",
    description: "Tool comparisons and commercial content",
    rules: SITE_RULES["tool-directory"],
  },
  {
    value: "domnest",
    label: "Domnest",
    description: "Authoritative editorial content",
    rules: SITE_RULES["domnest"],
  },
];

export const ARTICLE_TYPES = [
  {
    value: "pillar",
    label: "Pillar",
    description: "Comprehensive, long-form content (1200–1500 words)",
  },
  {
    value: "supporting",
    label: "Supporting",
    description: "Focused content linking to pillar (800–1000 words)",
  },
] as const;

export type ArticleType = (typeof ARTICLE_TYPES)[number]["value"];

// Base prompt that is always included - users cannot modify this directly
export const BASE_PROMPT = `You are a senior SEO content strategist and expert writer.

Write a high-quality, original, and search-optimized article for a professional audience.`;

export const CONTENT_OBJECTIVE = `CONTENT OBJECTIVE
- Match the target audience's search intent exactly
- Provide clear, practical, and accurate information
- Prioritize usefulness over word count`;

export const STRUCTURE_RULES = `STRUCTURE RULES
- Use proper heading hierarchy (H2, H3)
- Include 4–6 H2 sections
- Each H2 must have 1–2 H3s where appropriate
- Include a concise introduction (no generic AI openings)
- End with a clear conclusion and next steps`;

export const ARTICLE_TYPE_RULES = `ARTICLE TYPE RULES
If type is "pillar":
- Write a comprehensive, evergreen guide (1200–1500 words)
- Cover strategy, concepts, frameworks, and examples
- Link to relevant supporting articles

If type is "supporting":
- Focus on a specific sub-topic or long-tail query (800–1000 words)
- Provide focused explanations, tools, and examples
- Link back to the pillar article`;

export const STYLE_GUIDE = `STYLE GUIDE
- Clear, direct, and conversational
- Short sentences, simple words
- Active voice
- Address the reader as "you"
- No hype, clichés, jargon, emojis, hashtags, or filler
- Avoid vague or conditional language when certainty is possible`;

export const SEO_REQUIREMENTS = `SEO REQUIREMENTS
- Natural keyword placement
- Optimize sections for featured snippets where applicable
- Include 2024–2025 statistics or trends where relevant
- Include 1–2 expert quotes
- Add 3–8 internal links and 2–5 relevant external links
- Include a 5–6 question FAQ section
- Optimize title tag and meta description
- Include JSON-LD Article schema (https://schema.org/Article)`;

export const OUTPUT_FORMAT = `OUTPUT FORMAT
Return valid JSON only with the following structure:
{
  "title": "<same as input title>",
  "content": "<full markdown article>",
  "outline": [...],
  "keywords": [...],
  "type": "<pillar or supporting>",
  "group_title": "<same as input group_title>"
}`;

// Helper function to get site rules by value
export function getSiteRules(siteValue: string): string | null {
  if (siteValue in SITE_RULES) {
    return SITE_RULES[siteValue as SiteType];
  }
  return null;
}

// Helper function to get site config by value
export function getSiteConfig(siteValue: string): SiteConfig | undefined {
  return SITES.find((site) => site.value === siteValue);
}
