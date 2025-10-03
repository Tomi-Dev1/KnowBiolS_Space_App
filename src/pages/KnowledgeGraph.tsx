import { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as d3 from "d3";

interface Node {
  id: string;
  name: string;
  group: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

const KnowledgeGraph = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear existing content
    d3.select(svgRef.current).selectAll("*").remove();

    // Mock data for knowledge graph
    const nodes: Node[] = [
      { id: "microgravity", name: "Microgravity", group: 1 },
      { id: "plant-biology", name: "Plant Biology", group: 1 },
      { id: "radiation", name: "Radiation", group: 2 },
      { id: "crew-health", name: "Crew Health", group: 2 },
      { id: "bone-density", name: "Bone Density", group: 2 },
      { id: "circadian", name: "Circadian Rhythm", group: 3 },
      { id: "sleep", name: "Sleep", group: 3 },
      { id: "cardiovascular", name: "Cardiovascular", group: 2 },
      { id: "immune-system", name: "Immune System", group: 2 },
      { id: "life-support", name: "Life Support", group: 4 },
      { id: "agriculture", name: "Space Agriculture", group: 1 },
      { id: "neuroscience", name: "Neuroscience", group: 3 },
    ];

    const links: Link[] = [
      { source: "microgravity", target: "plant-biology", value: 2 },
      { source: "microgravity", target: "bone-density", value: 3 },
      { source: "radiation", target: "crew-health", value: 3 },
      { source: "bone-density", target: "crew-health", value: 2 },
      { source: "circadian", target: "sleep", value: 3 },
      { source: "sleep", target: "crew-health", value: 2 },
      { source: "cardiovascular", target: "crew-health", value: 2 },
      { source: "immune-system", target: "crew-health", value: 2 },
      { source: "life-support", target: "agriculture", value: 2 },
      { source: "plant-biology", target: "agriculture", value: 3 },
      { source: "neuroscience", target: "crew-health", value: 2 },
      { source: "circadian", target: "neuroscience", value: 2 },
    ];

    const width = svgRef.current.clientWidth;
    const height = 600;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3.forceLink(links).id((d: any) => d.id).distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "hsl(195, 90%, 45%)")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 2);

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 12)
      .attr("fill", (d) => {
        const colors = [
          "hsl(214, 85%, 30%)",
          "hsl(0, 84%, 60%)",
          "hsl(195, 90%, 45%)",
          "hsl(280, 70%, 50%)",
        ];
        return colors[d.group - 1];
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .call(
        d3.drag<any, any>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      );

    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.name)
      .attr("font-size", 12)
      .attr("dx", 15)
      .attr("dy", 4)
      .attr("fill", "hsl(210, 40%, 98%)")
      .style("pointer-events", "none");

    node.append("title").text((d) => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Knowledge Graph
          </h1>
          <p className="text-muted-foreground">
            Explore the interconnected web of bioscience research topics
          </p>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/50 border-accent/20">
          <CardHeader>
            <CardTitle>Research Topic Network</CardTitle>
            <CardDescription>
              Click and drag nodes to explore relationships between different research areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <svg ref={svgRef} className="w-full rounded-lg bg-background/50"></svg>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default KnowledgeGraph;