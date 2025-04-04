<template>
  <div>
    <div ref="chart" class="overview-container"></div>
    <div id="tooltip" class="tooltip" style="display: none;"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'Overview',
  props: ['conversationId'],
  data() {
    return { 
      nodes: [],
      links: [],
      rootNodeId: null
    };
  },
  async mounted() {
    await this.loadNodes();
    this.buildGraph();
  },
  methods: {
    async loadNodes() {
      try {
        const res = await fetch(`http://localhost:3000/api/conversation/${this.conversationId}/nodes`);
        const data = await res.json();
        this.nodes = data.nodes;
        this.rootNodeId = data.rootNodeId;
        
        // Build links array from parent-child relationships
        this.links = this.nodes
          .filter(n => n.parentNodeId !== null)
          .map(n => ({
            source: n.parentNodeId,
            target: n.id
          }));
      } catch (err) {
        console.error('Error loading nodes:', err);
      }
    },
    buildGraph() {
      const width = 800;
      const height = 600;
      
      // Create SVG container
      const svg = d3.select(this.$refs.chart)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // Create force simulation
      const simulation = d3.forceSimulation(this.nodes)
        .force('link', d3.forceLink(this.links)
          .id(d => d.id)
          .distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('y', d3.forceY(d => {
          // Main nodes go down vertically
          if (d.branchType === 'MAIN') {
            return height / 2;
          }
          // Tangents offset to the sides
          return height / 2 + (Math.random() - 0.5) * 200;
        }))
        .force('x', d3.forceX(d => {
          // Main nodes centered
          if (d.branchType === 'MAIN') {
            return width / 2;
          }
          // Tangents to the sides
          return width / 2 + (d.id % 2 ? 200 : -200);
        }));

      // Draw links (lines between nodes)
      const link = svg.append('g')
        .selectAll('line')
        .data(this.links)
        .join('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 2);

      // Draw nodes (circles)
      const node = svg.append('g')
        .selectAll('circle')
        .data(this.nodes)
        .join('circle')
        .attr('r', 30)
        .attr('fill', d => d.branchType === 'MAIN' ? '#4CAF50' : '#2196F3')
        .call(this.drag(simulation))
        .on('mouseover', this.showTooltip)
        .on('mouseout', this.hideTooltip)
        .on('click', (event, d) => this.$emit('nodeClick', d.id));

      // Add short summary text to nodes
      const label = svg.append('g')
        .selectAll('text')
        .data(this.nodes)
        .join('text')
        .text(d => this.truncateText(d.summaryShort, 20))
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '10px');

      // Update positions on each tick
      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);

        label
          .attr('x', d => d.x)
          .attr('y', d => d.y);
      });
    },
    drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    },
    showTooltip(event, d) {
      const tooltip = d3.select('#tooltip');
      tooltip
        .style('display', 'block')
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .html(`<strong>Long Summary:</strong><br>${d.summaryLong}`);
    },
    hideTooltip() {
      d3.select('#tooltip').style('display', 'none');
    },
    truncateText(text, length) {
      return text.length > length ? text.substring(0, length) + '...' : text;
    }
  }
}
</script>

<style scoped>
.overview-container {
  width: 800px;
  height: 600px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden; /* Prevent internal scrolling */
}

.tooltip {
  position: absolute;
  background: white;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-width: 300px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style> 