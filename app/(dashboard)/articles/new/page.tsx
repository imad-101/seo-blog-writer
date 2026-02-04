"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, FileText, Eye, Loader2 } from "lucide-react";
import {
  SITES,
  ARTICLE_TYPES,
  BASE_PROMPT,
  CONTENT_OBJECTIVE,
  STRUCTURE_RULES,
  ARTICLE_TYPE_RULES,
  STYLE_GUIDE,
  SEO_REQUIREMENTS,
  OUTPUT_FORMAT,
  getSiteRules,
  getSiteConfig,
} from "@/lib/prompt-config";

interface FormData {
  site: string;
  articleType: string;
  title: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  audienceIntent: string;
  internalLinks: string;
  customInstructions: string;
}

export default function NewArticlePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [formData, setFormData] = useState<FormData>({
    site: "",
    articleType: "",
    title: "",
    primaryKeyword: "",
    secondaryKeywords: "",
    audienceIntent: "",
    internalLinks: "",
    customInstructions: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Assemble the prompt following the rules:
  // 1. Start with shared base prompt
  // 2. Append site-specific rules
  // 3. Append user-defined instructions last
  const promptPreview = useMemo(() => {
    const siteConfig = getSiteConfig(formData.site);
    const siteName = siteConfig?.label || "{{group_title}}";
    const siteRules = getSiteRules(formData.site);
    
    const articleTypeConfig = ARTICLE_TYPES.find((t) => t.value === formData.articleType);
    const typeName = articleTypeConfig?.label?.toLowerCase() || "{{type}}";
    
    const secondaryList = formData.secondaryKeywords
      ? formData.secondaryKeywords.split(",").map((k) => k.trim()).filter(Boolean).join(", ")
      : "{{secondary_keywords}}";

    // Build content brief section
    const contentBrief = `CONTENT BRIEF
Title: ${formData.title || "{{title}}"}
Primary keyword: ${formData.primaryKeyword || "{{primary_keyword}}"}
Secondary keywords: ${secondaryList}
Audience intent: ${formData.audienceIntent || "{{audience_intent}}"}
Recommended internal links: ${formData.internalLinks || "{{internal_links}}"}
Geo focus: {{geo}}`;

    // Assemble prompt in order: base → content brief → structure → site rules → style → seo → custom → output
    const promptParts = [
      BASE_PROMPT,
      `This article belongs to the content cluster: ${siteName}
Article type: ${typeName} (pillar or supporting)`,
      CONTENT_OBJECTIVE,
      contentBrief,
      STRUCTURE_RULES,
      ARTICLE_TYPE_RULES,
      // Site-specific rules are appended here based on selection
      siteRules || "{{site_specific_rules}}",
      STYLE_GUIDE,
      SEO_REQUIREMENTS,
      // User-defined instructions are always appended last
      formData.customInstructions ? `ADDITIONAL INSTRUCTIONS\n${formData.customInstructions}` : null,
      OUTPUT_FORMAT,
    ].filter(Boolean);

    return promptParts.join("\n\n");
  }, [formData]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptPreview }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate article");
      }

      // Extract content from the response
      if (result.data?.content) {
        // If content is a string (markdown), use it directly
        if (typeof result.data.content === "string") {
          setGeneratedContent(result.data.content);
        } else {
          // If it's the full JSON response, stringify it nicely
          setGeneratedContent(JSON.stringify(result.data, null, 2));
        }
      } else {
        // Fallback to raw response
        setGeneratedContent(result.raw || "No content generated");
      }
    } catch (error) {
      console.error("Generation error:", error);
      setGeneratedContent(
        `Error generating article: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = formData.site && formData.articleType && formData.title && formData.primaryKeyword;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Article</h1>
        <p className="text-muted-foreground">
          Configure your article parameters and generate SEO-optimized content
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Article Configuration
              </CardTitle>
              <CardDescription>
                Define the parameters for your SEO article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Site Selector */}
              <div className="space-y-2">
                <Label htmlFor="site">Target Site</Label>
                <Select
                  value={formData.site}
                  onValueChange={(value) => updateField("site", value)}
                >
                  <SelectTrigger id="site">
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {SITES.map((site) => (
                      <SelectItem key={site.value} value={site.value}>
                        <div>
                          <div className="font-medium">{site.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {site.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Article Type */}
              <div className="space-y-2">
                <Label htmlFor="articleType">Article Type</Label>
                <Select
                  value={formData.articleType}
                  onValueChange={(value) => updateField("articleType", value)}
                >
                  <SelectTrigger id="articleType">
                    <SelectValue placeholder="Select article type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ARTICLE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {type.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Best JSON Formatting Tools for Developers in 2026"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>

              {/* Primary Keyword */}
              <div className="space-y-2">
                <Label htmlFor="primaryKeyword">Primary Keyword</Label>
                <Input
                  id="primaryKeyword"
                  placeholder="e.g., json formatting tools"
                  value={formData.primaryKeyword}
                  onChange={(e) => updateField("primaryKeyword", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The main keyword you want to rank for
                </p>
              </div>

              {/* Secondary Keywords */}
              <div className="space-y-2">
                <Label htmlFor="secondaryKeywords">Secondary Keywords</Label>
                <Input
                  id="secondaryKeywords"
                  placeholder="e.g., json formatter, json beautifier, json validator"
                  value={formData.secondaryKeywords}
                  onChange={(e) =>
                    updateField("secondaryKeywords", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of related keywords
                </p>
              </div>

              <Separator />

              {/* Audience Intent */}
              <div className="space-y-2">
                <Label htmlFor="audienceIntent">Audience Intent</Label>
                <Textarea
                  id="audienceIntent"
                  placeholder="Describe your target audience and what they're looking for...&#10;&#10;e.g., Developers searching for tools to format and validate JSON data. They want quick comparisons, feature lists, and practical recommendations."
                  className="min-h-[100px] resize-none"
                  value={formData.audienceIntent}
                  onChange={(e) => updateField("audienceIntent", e.target.value)}
                />
              </div>

              {/* Internal Links */}
              <div className="space-y-2">
                <Label htmlFor="internalLinks">Internal Links</Label>
                <Textarea
                  id="internalLinks"
                  placeholder="List internal links to include...&#10;&#10;e.g.,&#10;- /json-validator - JSON Validator Tool&#10;- /json-beautifier - JSON Beautifier"
                  className="min-h-[80px] resize-none"
                  value={formData.internalLinks}
                  onChange={(e) => updateField("internalLinks", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  URLs and anchor text for internal linking
                </p>
              </div>

              {/* Custom Instructions */}
              <div className="space-y-2">
                <Label htmlFor="customInstructions">
                  Custom Instructions{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Textarea
                  id="customInstructions"
                  placeholder="Any additional instructions for the AI...&#10;&#10;e.g., Include a comparison table, focus on free tools, mention pricing details"
                  className="min-h-[80px] resize-none"
                  value={formData.customInstructions}
                  onChange={(e) =>
                    updateField("customInstructions", e.target.value)
                  }
                />
              </div>

              {/* Generate Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerate}
                disabled={!isFormValid || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Article...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Article
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <Tabs defaultValue="prompt" className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="prompt" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Prompt Preview
                    </TabsTrigger>
                    <TabsTrigger value="output" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Generated Output
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="prompt" className="mt-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80 font-mono">
                      {promptPreview}
                    </pre>
                  </div>
                </TabsContent>
                <TabsContent value="output" className="mt-4">
                  <div className="rounded-lg border bg-muted/30 p-4 min-h-[400px]">
                    {generatedContent ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <MarkdownPreview content={generatedContent} />
                      </div>
                    ) : (
                      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <FileText className="mx-auto h-12 w-12 opacity-20" />
                          <p className="mt-2">
                            Generated content will appear here
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Simple Markdown Preview Component
function MarkdownPreview({ content }: { content: string }) {
  // Basic markdown parsing for preview
  const lines = content.split("\n");
  
  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-2xl font-bold mt-6 first:mt-0">
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-xl font-semibold mt-5">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-lg font-medium mt-4">
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li key={index} className="ml-4">
              {line.slice(2)}
            </li>
          );
        }
        if (line.match(/^\d+\.\s/)) {
          return (
            <li key={index} className="ml-4 list-decimal">
              <span dangerouslySetInnerHTML={{ 
                __html: line.slice(line.indexOf(" ") + 1).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
              }} />
            </li>
          );
        }
        if (line.trim() === "") {
          return <div key={index} className="h-2" />;
        }
        return (
          <p key={index} className="text-foreground/80 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}
