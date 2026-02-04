import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PenLine, Search, Filter } from "lucide-react";

const articles = [
  {
    id: "1",
    title: "Best JSON Formatting Tools for Developers in 2026",
    site: "JSON Tools",
    type: "Pillar",
    status: "Published",
    primaryKeyword: "json formatting tools",
    wordCount: 3250,
    date: "Feb 3, 2026",
  },
  {
    id: "2",
    title: "How to Validate JSON Schema: A Complete Guide",
    site: "JSON Tools",
    type: "Supporting",
    status: "Draft",
    primaryKeyword: "validate json schema",
    wordCount: 1850,
    date: "Feb 2, 2026",
  },
  {
    id: "3",
    title: "Top 10 Developer Tools Directory Sites",
    site: "Tool Directory",
    type: "Pillar",
    status: "Published",
    primaryKeyword: "developer tools directory",
    wordCount: 2780,
    date: "Feb 1, 2026",
  },
  {
    id: "4",
    title: "JSON vs XML: Which Format Should You Use?",
    site: "JSON Tools",
    type: "Supporting",
    status: "Published",
    primaryKeyword: "json vs xml",
    wordCount: 2100,
    date: "Jan 30, 2026",
  },
  {
    id: "5",
    title: "Domain Management Best Practices for SEO",
    site: "Domnest",
    type: "Pillar",
    status: "Draft",
    primaryKeyword: "domain management seo",
    wordCount: 1200,
    date: "Jan 28, 2026",
  },
  {
    id: "6",
    title: "How to Choose the Right JSON Parser",
    site: "JSON Tools",
    type: "Supporting",
    status: "Published",
    primaryKeyword: "json parser",
    wordCount: 1650,
    date: "Jan 25, 2026",
  },
];

const siteColors: Record<string, string> = {
  "JSON Tools": "bg-blue-100 text-blue-700",
  "Tool Directory": "bg-purple-100 text-purple-700",
  Domnest: "bg-orange-100 text-orange-700",
};

export default function ArticlesPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
          <p className="text-muted-foreground">
            Manage and view all your SEO articles
          </p>
        </div>
        <Button asChild>
          <Link href="/articles/new">
            <PenLine className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-9" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
          <CardDescription>
            {articles.length} articles across all sites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium leading-none">{article.title}</p>
                    <Badge
                      variant="secondary"
                      className={siteColors[article.site]}
                    >
                      {article.site}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                      {article.type}
                    </span>
                    <span>Keyword: {article.primaryKeyword}</span>
                    <span>{article.wordCount.toLocaleString()} words</span>
                    <span>{article.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      article.status === "Published" ? "default" : "secondary"
                    }
                    className={
                      article.status === "Published"
                        ? "bg-green-600 hover:bg-green-600"
                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                    }
                  >
                    {article.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
