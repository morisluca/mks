import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, TrendingUp } from "lucide-react";
import { UserLayout } from "@/components/layout/UserLayout";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  source: string;
  url: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Bitcoin Surges Past $100,000 Amid Institutional Adoption",
    summary: "Major financial institutions continue to embrace Bitcoin, driving prices to new highs as adoption grows globally.",
    date: "2026-04-27",
    category: "Cryptocurrency",
    source: "CryptoNews",
    url: "#"
  },
  {
    id: "2",
    title: "Ethereum 2.0 Upgrade Completes Successfully",
    summary: "The long-awaited Ethereum network upgrade has been deployed, promising improved scalability and energy efficiency.",
    date: "2026-04-26",
    category: "Blockchain",
    source: "BlockChain Today",
    url: "#"
  },
  {
    id: "3",
    title: "New Regulatory Framework for Crypto Trading Announced",
    summary: "Government officials unveil comprehensive regulations aimed at protecting investors while fostering innovation in the crypto space.",
    date: "2026-04-25",
    category: "Regulation",
    source: "Financial Times",
    url: "#"
  },
  {
    id: "4",
    title: "DeFi Protocols See Record TVL Growth",
    summary: "Decentralized finance platforms experience unprecedented growth in total value locked as more users discover yield farming opportunities.",
    date: "2026-04-24",
    category: "DeFi",
    source: "DeFi Pulse",
    url: "#"
  },
  {
    id: "5",
    title: "NFT Market Shows Signs of Recovery",
    summary: "After a period of decline, the NFT market begins to rebound with new use cases emerging in gaming and digital art.",
    date: "2026-04-23",
    category: "NFT",
    source: "NFT Insider",
    url: "#"
  }
];

export default function News() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(mockNews.map(item => item.category)))];

  useEffect(() => {
    let filteredNews = mockNews;

    if (searchTerm) {
      filteredNews = filteredNews.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filteredNews = filteredNews.filter(item => item.category === selectedCategory);
    }

    setNews(filteredNews);
  }, [searchTerm, selectedCategory]);

  return (
    <UserLayout>
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-oc-text mb-4 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-oc-accent" />
            Market News
            </h1>
            <p className="text-oc-muted">Stay updated with the latest cryptocurrency and blockchain news</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-oc-muted w-4 h-4" />
            <Input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
            </div>
            <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
                <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-oc-accent hover:bg-oc-accent/80" : ""}
                >
                {category}
                </Button>
            ))}
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                    {item.category}
                    </Badge>
                    <div className="flex items-center text-xs text-oc-muted">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.date).toLocaleDateString()}
                    </div>
                </div>
                <CardTitle className="text-lg leading-tight hover:text-oc-accent transition-colors">
                    <a href={item.url} className="no-underline">
                    {item.title}
                    </a>
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-oc-muted mb-4 line-clamp-3">
                    {item.summary}
                </p>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-oc-muted/60">{item.source}</span>
                    <Button variant="ghost" size="sm" asChild>
                    <a href={item.url}>Read More</a>
                    </Button>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>

        {news.length === 0 && (
            <div className="text-center py-12">
            <p className="text-oc-muted">No news found matching your criteria.</p>
            </div>
        )}
        </div>
    </UserLayout>
  );
}