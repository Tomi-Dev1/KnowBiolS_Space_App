import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2, ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
// import publicationsData from "@/data/publications.json";
import { Publication, fetchPublication} from "@/api.ts";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

const PublicationDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [publication, setPublication] = useState<Publication | null>(null);

  // const publication = publicationsData.find((pub) => pub.id === id);

  useEffect(() => {
    if (!id) return;
    fetchPublication(id)
      .then(setPublication)
      .catch(() => setPublication(null));
  }, [id]);

  if (!publication) {
     return (
       <div className="min-h-screen bg-background">
         <Navigation />
         <div className="container mx-auto px-4 py-8">
           <p className="text-center text-muted-foreground">
             Publication not found
           </p>
         </div>
       </div>
     );
   }

  // if (!pseudoRandomBytes) {
  //   return (
  //     <div className="min-h-screen bg-background">
  //       <Navigation />
  //       <div className="container mx-auto px-4 py-8">
  //         <p className="text-center text-muted-foreground">Publication not found</p>
  //       </div>
  //     </div>
  //   );
  // }

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/summarize?title=${encodeURIComponent(publication.title)}&abstract=${encodeURIComponent(publication.abstract)}`,
        {
        method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const summaryText = await response.text();
      setSummary(summaryText); // Set the state to the raw string
      toast({
        title: "Summary Generated",
        description: "AI has successfully summarized the publication.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/publications" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Publications
          </Link>
        </Button>

        <Card className="bg-gradient-to-br from-card to-card/50 border-accent/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-3xl mb-4">
                  {publication.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mb-4">
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
                <p className="text-muted-foreground">
                  {publication.authors.join(", ")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Published: {publication.year}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-accent">
                Abstract
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {publication.abstract}
              </p>
            </div>

            {/* 👇 INSERT URLS HERE 👇 */}
            {publication.urls && publication.urls.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-accent">
                  Reference Sources
                </h3>
                <div className="flex flex-col space-y-2">
                  {publication.urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:text-accent transition-colors duration-200 truncate"
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4">
              <Button
                onClick={handleSummarize}
                disabled={loading}
                className="bg-accent hover:bg-accent/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Summarize with AI
                  </>
                )}
              </Button>
            </div>

            {summary && (
              <Card className="bg-primary/10 border-accent/30">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    AI-Generated Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose dark:prose-invert max-w-none"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                      {summary}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PublicationDetail;