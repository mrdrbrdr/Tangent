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
  watch: {
    // React to conversation changes
    conversationId: {
      async handler(newConversationId, oldConversationId) {
        if (newConversationId !== oldConversationId) {
          console.log('Conversation changed from', oldConversationId, 'to', newConversationId);
          await this.loadNodes();
          this.buildGraph();
        }
      },
      immediate: false
    }
  },
  methods: {
    async loadNodes() {
      try {
        const res = await fetch(`http://localhost:3000/api/conversation/${this.conversationId}/nodes`);
        const data = await res.json();
        this.nodes = data.nodes;
        this.rootNodeId = data.rootNodeId;
        
        console.log('Loaded nodes:', this.nodes.length);
        console.log('Nodes data:', this.nodes);
        
        // Build links array from parent-child relationships
        this.links = this.nodes
          .filter(n => n.parentNodeId !== null)
          .map(n => ({
            source: n.parentNodeId,
            target: n.id
          }));
          
        console.log('Links:', this.links);
      } catch (err) {
        console.error('Error loading nodes:', err);
      }
    },
    buildGraph() {
      // Use full browser dimensions
      const width = window.innerWidth - 288; // Account for sidebar width (18rem = 288px)
      const height = window.innerHeight;
      
      // Clear any existing SVG
      d3.select(this.$refs.chart).selectAll('*').remove();
      
      // Create SVG container
      const svg = d3.select(this.$refs.chart)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // Sort nodes to establish main thread order
      const mainNodes = this.nodes.filter(n => n.branchType === 'MAIN').sort((a, b) => a.id - b.id);
      const tangentNodes = this.nodes.filter(n => n.branchType === 'TANGENT');
      
      // Position nodes manually instead of using force simulation
      const nodeSpacing = 120;
      const startY = 100;
      
      // Position main nodes vertically down the center
      mainNodes.forEach((node, index) => {
        node.x = width / 2;
        node.y = startY + (index * nodeSpacing);
        node.fx = node.x; // Fix position
        node.fy = node.y;
      });
      
      // Position tangent nodes to the sides
      tangentNodes.forEach(node => {
        const parentNode = this.nodes.find(n => n.id === node.parentNodeId);
        if (parentNode) {
          // Alternate left and right sides
          const isLeftSide = node.id % 2 === 0;
          node.x = parentNode.x + (isLeftSide ? -200 : 200);
          node.y = parentNode.y + 60; // Slightly below parent
          node.fx = node.x;
          node.fy = node.y;
        }
      });

      // Create a simple simulation just for the links
      const simulation = d3.forceSimulation(this.nodes)
        .force('link', d3.forceLink(this.links)
          .id(d => d.id)
          .distance(100))
        .stop(); // Stop immediately since we have fixed positions

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

      // Since we have fixed positions, update positions immediately
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
      const longSummary = d.summaryLong || 'No summary available';
      tooltip
        .style('display', 'block')
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .html(`<strong>Long Summary:</strong><br>${longSummary}`);
    },
    hideTooltip() {
      d3.select('#tooltip').style('display', 'none');
    },
    truncateText(text, length) {
      if (!text) return 'No summary';
      return text.length > length ? text.substring(0, length) + '...' : text;
    }
  }
}
</script>

<style scoped>
.overview-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  background-color: #1a1a1a;
  overflow: hidden;
}

.tooltip {
  position: fixed;
  background: #333;
  color: white;
  padding: 12px;
  border: 1px solid #555;
  border-radius: 6px;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 1000;
  font-size: 14px;
  line-height: 1.4;
}
</style> 