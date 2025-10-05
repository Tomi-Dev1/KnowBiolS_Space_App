import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import publicationsData from "@/data/publications.json";
import { Publication, fetchPublications } from "@/api.ts";

// src/components/Publications.tsx
// Assuming Publication, Navigation, Search, Input, Link, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button are imported
// NOTE: We need to import 'Button' for the pagination controls!
import { Button } from "@/components/ui/button"; // <--- Assuming you use a Button component

// ... (other imports)

// Define the page limit as a constant
const LIMIT = 10; // Use 10 for a smaller page size, or 20 to match your initial backend limit

const Publications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // 👈 New state for current page
  const [hasMore, setHasMore] = useState(false); // 👈 New state to track if there's a next page

  // 1. Fetch data on mount AND when the page changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Calculate the 'skip' offset based on the current page
        const skip = (page - 1) * LIMIT; 
        
        // Request LIMIT + 1 item to check if there is a next page
        const data = await fetchPublications(skip, LIMIT + 1); 
        
        // The actual publications to display on the current page
        const currentPageData = data.slice(0, LIMIT); 
        
        setPublications(currentPageData);
        // Check if we received more than LIMIT items, meaning a next page exists
        setHasMore(data.length > LIMIT); 

      } catch (err) {
        console.error("Failed to fetch publications:", err);
        setPublications([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };
    load();
    
    // 👇 Rerun the effect when the page state changes
  }, [page]); 


  // 2. Navigation Handlers
  const goToNextPage = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
      window.scrollTo(0, 0); // Scroll to top for better UX
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      window.scrollTo(0, 0); // Scroll to top for better UX
    }
  };
  
  // Use useMemo for filtering to avoid unnecessary recalculations
  const filteredPublications = useMemo(() => {
    // NOTE: Filtering is now done only on the current page's data.
    // If you need global search across all data, you'd need a backend search endpoint.
    if (!searchQuery) return publications; // No search query, return all publications on the current page
    
    const query = searchQuery.toLowerCase();
    return publications.filter((pub) => {
      return (
        pub.title.toLowerCase().includes(query) ||
        pub.abstract.toLowerCase().includes(query) ||
        pub.authors.some((author) => author.toLowerCase().includes(query)) ||
        pub.keywords.some((keyword) => keyword.toLowerCase().includes(query))
      );
    });
  }, [publications, searchQuery]);
  
  // NOTE: When loading, you might want to show a spinner/skeleton. 
  // For brevity, I've skipped adding a dedicated loading state UI.
  if (loading && publications.length === 0) {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8 text-center">Loading publications...</main>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* ... (Search input and Header section remains the same) ... */}
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
          {/* ... (Publication Card mapping remains the same, using filteredPublications) ... */}
          {filteredPublications.map((publication) => (
            <Link key={publication.id} to={`/publications/${publication.id}`}>
                {/* ... Card content ... */}
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

        {/* 3. Pagination Controls */}
        {(filteredPublications.length > 0 && searchQuery === "") && (
            <div className="flex justify-center space-x-4 mt-12">
                <Button 
                    onClick={goToPrevPage}
                    disabled={page === 1 || loading} // Disable on first page or while loading
                    variant="outline"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Page
                </Button>
                
                <span className="self-center text-foreground">
                    Page {page}
                </span>

                <Button 
                    onClick={goToNextPage}
                    disabled={!hasMore || loading} // Disable if no more data or while loading
                    variant="outline"
                >
                    Next Page
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        )}


        {/* ... (No publications found message) ... */}
        {filteredPublications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No publications found matching your search{searchQuery ? " on this page" : ""}.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Publications;