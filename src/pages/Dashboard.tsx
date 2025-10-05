import { Link } from "react-router-dom";
import { Search, Network, BookOpen, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";

// Utility function to fetch the total count from the new endpoint
const fetchPublicationCount = async (): Promise<number> => {
  // IMPORTANT: Replace the mock URL with your actual backend host
  const apiUrl = `https://knowbiols-backend-d8gcc2beabaafnc7.canadacentral-01.azurewebsites.net/publications/count`; 
  
  try {
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      throw new Error("Failed to fetch publication count from backend.");
    }
    
    // The endpoint returns {"count": N}, so we extract 'count'.
    const data: { count: number } = await res.json();
    return data.count;

  } catch (error) {
    console.error("Error fetching publication count:", error);
    // Return 0 or re-throw the error depending on desired error handling
    return 0; 
  }
};

const Dashboard = () => {
  const [publicationCount, setPublicationCount] = useState<number | string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect hook to fetch data on component mount
  useEffect(() => {
    const fetchCount = async () => {
      setIsLoading(true);
      try {
        const count = await fetchPublicationCount();
        setPublicationCount(count);
      } catch (error) {
        // Use a placeholder on error
        setPublicationCount("—");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            NASA Bioscience Publications
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore cutting-edge research in space bioscience, from microgravity
            effects to life support systems
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-gradient-to-br from-card to-card/50 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Total Publications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Conditional rendering for loading state */}
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              ) : (
                <p className="text-4xl font-bold text-foreground">
                  {publicationCount}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Active research papers
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-accent" />
                Knowledge Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">24</p>
              <p className="text-sm text-muted-foreground mt-2">
                Interconnected concepts
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Research Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">8</p>
              <p className="text-sm text-muted-foreground mt-2">
                Active focus areas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 hover:border-accent/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-6 h-6 text-accent" />
                Search Publications
              </CardTitle>
              <CardDescription>
                Explore our comprehensive database of bioscience research papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link to="/publications">Browse Publications</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-6 h-6 text-accent" />
                Knowledge Graph
              </CardTitle>
              <CardDescription>
                Visualize relationships between research topics and findings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-accent hover:bg-accent/90">
                <Link to="/knowledge-graph">Explore Graph</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;