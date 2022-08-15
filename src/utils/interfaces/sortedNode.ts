import Node from './node';

interface SortedNode extends Node {
  grid: [column: number, row: number];
  coords: {
    x: number;
    y: number;
  };
  lineCoords: {
    edge: number[];
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }[];
}

export default SortedNode;
