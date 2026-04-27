import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Play, RotateCcw } from 'lucide-react';

export default function TreeVisualizer({ algoName = "Backtracking", dataSize = 7, generationTrigger = 0 }: { algoName?: string, dataSize?: number, generationTrigger?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (generationTrigger > 0) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 200);
    }
  }, [generationTrigger]);

  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 400;

    const numNodes = Math.max(3, Math.min(31, dataSize)); // Limit max nodes to 31 (depth 5)
    
    const generateTree = (id: number): any => {
      if (id > numNodes) return null;
      const left = generateTree(2 * id);
      const right = generateTree(2 * id + 1);
      
      const children = [];
      if (left) children.push(left);
      if (right) children.push(right);
      
      let nameStr = 'Node ' + id;
      if (!left && !right) {
        nameStr = (id % 3 === 0) ? 'Goal State' : 'Dead End (Pruned)';
      }

      return {
        name: id === 1 ? 'Root' : nameStr,
        ...(children.length > 0 ? { children } : {})
      };
    };

    const data = generateTree(1);

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('width', '100%').style('height', '100%');

    const g = svg.append('g').attr('transform', `translate(0, 40)`);
    const treeMap = d3.tree().size([width - 100, height - 100]);
    const root = d3.hierarchy(data);
    treeMap(root);

    // Links
    g.selectAll('.link')
      .data(root.descendants().slice(1))
      .join('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#334155')
      .attr('stroke-width', 2)
      .attr('d', (d: any) => {
        return `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${d.parent.y}`;
      });

    // Nodes
    const node = g.selectAll('.node')
      .data(root.descendants())
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', 20)
      .attr('fill', '#1e293b')
      .attr('stroke', (d: any) => d.data.name.includes('Pruned') ? '#f43f5e' : d.data.name.includes('Goal') ? '#10b981' : '#6366f1')
      .attr('stroke-width', 3);

    node.append('text')
      .text((d: any) => d.data.name)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '12px');

    // Simple Animation Mock
    if (isPlaying) {
      node.selectAll('circle')
        .transition().duration(800)
        .delay((d, i) => i * 600)
        .attr('fill', (d: any) => d.data.name.includes('Pruned') ? '#f43f5e' : '#6366f1')
        .attr('r', 25)
        .transition().duration(400)
        .attr('r', 20);
    }
  }, [isPlaying, dataSize]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between glass-panel p-4">
         <h3 className="text-xl font-bold text-white mb-1">{algoName} State Space</h3>
      </div>
      <div className="flex-1 glass-panel flex justify-center p-4 relative min-h-[400px]">
        <svg ref={svgRef}></svg>
      </div>
      <div className="glass-panel p-4 flex justify-center gap-6">
        <button onClick={() => setIsPlaying(false)} className="w-12 h-12 flex rounded-full bg-slate-800 text-slate-300 justify-center items-center"><RotateCcw className="w-5 h-5"/></button>
        <button onClick={() => setIsPlaying(true)} className="w-16 h-16 flex rounded-full bg-amber-500 text-white justify-center items-center"><Play className="fill-current w-6 h-6 ml-1"/></button>
      </div>
    </div>
  );
}
