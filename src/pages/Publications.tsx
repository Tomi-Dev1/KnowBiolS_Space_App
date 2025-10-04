import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import publicationsData from "@/data/publications.json";
import { Publication, fetchPublications } from "@/api.ts";

const Publications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch data on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPublications();
        setPublications(data);
      } catch (err) {
        console.error("Failed to fetch publications:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);


  const filteredPublications = publications.filter((pub) => {
    const query = searchQuery.toLowerCase();
    return (
      pub.title.toLowerCase().includes(query) ||
      pub.abstract.toLowerCase().includes(query) ||
      pub.authors.some((author) => author.toLowerCase().includes(query)) ||
      pub.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Search Publications
          </h1>
          <p className="text-muted-foreground mb-6">
            Search through our collection of bioscience research papers
          </p>

          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by title, author, keyword, or abstract..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredPublications.map((publication) => (
            <Link key={publication.id} to={`/publications/${publication.id}`}>
              <Card className="hover:border-accent/50 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 hover:text-accent transition-colors">
                        {publication.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {publication.authors.join(", ")} • {publication.year}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {publication.abstract}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {publication.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/20 text-accent"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredPublications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No publications found matching your search.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Publications;