import Node from './node';
import Edge from './edge';

interface Graph {
  nodes: Node[]; // List of available nodes in current graph
  edges: Edge[]; // List of connections between nodes in current graph
}

export default Graph;
