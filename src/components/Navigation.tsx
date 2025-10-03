import { Link, useLocation } from "react-router-dom";
import { Home, Search, Network, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-lg text-foreground">NASA Bioscience</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </Button>
              
              <Button
                variant={isActive("/publications") ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/publications" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Publications
                </Link>
              </Button>
              
              <Button
                variant={isActive("/knowledge-graph") ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/knowledge-graph" className="flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Knowledge Graph
                </Link>
              </Button>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;