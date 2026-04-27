import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  group: number;
}
interface Link {
  source: string;
  target: string;
  value: number;
}

export default function VisualizationEngine({ 
  nodes = [
    { id: 'Merge', group: 1 },
    { id: 'Quick', group: 1 },
    { id: 'Dijkstra', group: 2 },
    { id: 'Knapsack', group: 3 }
  ],
  links = [
    { source: 'Merge', target: 'Quick', value: 1 },
    { source: 'Dijkstra', target: 'Knapsack', value: 2 },
    { source: 'Merge', target: 'Dijkstra', value: 1 }
  ]
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear previous if any
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('width', '100%')
      .style('height', '100%');

    // Force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Links
    const link = svg.append('g')
      .attr('stroke', '#475569')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .selectAll('line')
      .data(links)
      .join('line');

    // Nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g');

    node.append('circle')
      .attr('r', 25)
      .attr('fill', d => d.group === 1 ? '#6366f1' : d.group === 2 ? '#10b981' : '#f43f5e')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', 'shadow-2xl');

    node.append('text')
      .text(d => d.id)
      .attr('x', 0)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '12px');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return (
    <div className="w-full h-[400px] glass-panel rounded-2xl border border-slate-700/50 bg-slate-900 overflow-hidden relative">
      <div className="absolute top-4 left-4 flex gap-2">
         <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 font-semibold border border-slate-700">D3.js Visualization</span>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
}
