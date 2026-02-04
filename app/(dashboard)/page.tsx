import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, PenLine, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    title: "Total Articles",
    value: "24",
    description: "Published this month",
    icon: FileText,
  },
  {
    title: "Avg. Word Count",
    value: "2,450",
    description: "Per article",
    icon: TrendingUp,
  },
  {
    title: "Recent Activity",
    value: "3",
    description: "Articles in draft",
    icon: Clock,
  },
];

const recentArticles = [
  {
    id: "1",
    title: "Best JSON Formatting Tools for Developers in 2026",
    site: "JSON Tools",
    type: "Pillar",
    status: "Published",
    date: "Feb 3, 2026",
  },
  {
    id: "2",
    title: "How to Validate JSON Schema: A Complete Guide",
    site: "JSON Tools",
    type: "Supporting",
    status: "Draft",
    date: "Feb 2, 2026",
  },
  {
    id: "3",
    title: "Top 10 Developer Tools Directory Sites",
    site: "Tool Directory",
    type: "Pillar",
    status: "Published",
    date: "Feb 1, 2026",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back. Here&apos;s an overview of your SEO content.
          </p>
        </div>
        <Button asChild>
          <Link href="/articles/new">
            <PenLine className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Articles</CardTitle>
          <CardDescription>
            Your latest SEO content across all sites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium leading-none">{article.title}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{article.site}</span>
                    <span>•</span>
                    <span>{article.type}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                </div>
                <div
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    article.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {article.status}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/articles">View All Articles</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
