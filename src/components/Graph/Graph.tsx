import React, { Component, createRef } from 'react';

import GraphInterface from '../../utils/interfaces/graph';
import Node from '../../utils/interfaces/node';
import SortedNode from '../../utils/interfaces/sortedNode';

import styles from './graph.module.css';

type GraphProps = {
  id: number;
  data: GraphInterface;
};

class Graph extends Component<GraphProps> {
  state: {
    id: number;
    data: GraphInterface | null;
    fullGraphInfo: Partial<SortedNode>[] | null;
    svgGraph: React.ReactElement<SVGSVGElement> | null;
    svgGridCoords: { x: number; y: number };
    draggableNodeCoords: { x: number; y: number };
    isNodeDragging: boolean;
  };
  graphSizes: {
    height: number;
    width: number;
    nodeHeight: number;
    nodeWidth: number;
    nodeGap: number;
  };
  svgGraphRef: React.RefObject<SVGSVGElement>;
  svgGraphContentRef: React.RefObject<SVGSVGElement>;
  svgGridRef: React.RefObject<SVGRectElement>;

  constructor(props: GraphProps) {
    super(props);

    this.state = {
      id: props.id,
      data: props.data,
      fullGraphInfo: null,
      svgGraph: null,
      svgGridCoords: { x: 0, y: 0 },
      draggableNodeCoords: { x: 0, y: 0 },
      isNodeDragging: false,
    };
    this.graphSizes = {
      height: 600,
      width: 1000,
      nodeHeight: 60,
      nodeWidth: 100,
      nodeGap: 50,
    };
    this.svgGraphRef = createRef();
    this.svgGraphContentRef = createRef();
    this.svgGridRef = createRef();
  }

  async componentDidMount() {
<<<<<<< HEAD
    this.getFullGraphInfo();
=======
    await this.getFullGraphInfo();
>>>>>>> fd56d6e (fix app tests)
    this.createGraph();
    this.updateGridPosition();
  }

  getSortedNodesByGridSystem(graph: GraphInterface): Partial<SortedNode>[] {
    let { nodes, edges } = graph;
    let queue: Node[] = nodes.filter(
      (node) => !edges.find((edge) => edge.toId === node.id)
    );
    let sorted: any = [];
    let [col, row] = [0, 0];
    let [maxCol, maxRow] = [0, 0];

    while (queue.length) {
      const currentNode = queue[0];
      const nodeVisited = sorted.find(
        (node: any) => node.id === currentNode.id
      );
      const isCurrentNodeVisited = nodeVisited != undefined;

      const currentNodeEdges = edges.filter(
        (edge) => edge.fromId === currentNode.id
      );

      const currentNodeGrid = currentNode.grid;

      const isCurrentNodeGrid = currentNodeGrid != undefined;

      if (isCurrentNodeGrid) {
        const [fromCol, fromRow] = currentNodeGrid;
        const isSameNodeGrid = fromCol === col && fromRow === row;

        col = fromCol;
        row = isSameNodeGrid ? fromRow + 1 : fromRow;
      }

      if (!isCurrentNodeVisited) {
        sorted.push({
          ...currentNode,
          ...{ grid: [col, row] },
        });

        // Set rows for start tree nodes
        !isCurrentNodeGrid && row++;
      }

      if (col > maxCol) maxCol = col;
      if (row > maxRow) maxRow = row;

      queue.shift(); // Remove 'currentNode' from queue for sorting

      // // Push to queue next Nodes by 'currentNode' edges
      currentNodeEdges.forEach(({ toId }) => {
        const nextNode = nodes.find((node) => node.id === toId);
        const currentNodeSorted = sorted.find(
          (node: any) => node.id === currentNode.id
        );
        const isNextNode = nextNode != undefined;

        let [fromCol, fromRow] = currentNodeSorted.grid;

        if (isNextNode) {
          queue.push({
            ...nextNode,
            ...{
              grid: [fromCol + 1, fromRow],
            },
          });
        }
      });
    }

    return sorted;
  }

  getNodesCoords(graph: Partial<SortedNode>[]): Partial<SortedNode>[] {
    const width = this.graphSizes.nodeWidth;
    const height = this.graphSizes.nodeHeight;
    const gap = this.graphSizes.nodeGap;

    const graphWithNodesCoords = graph.map((node) => {
      const [col, row] = [node.grid?.[0] || 0, node.grid?.[1] || 0];

      return {
        ...node,
        ...{
          coords: {
            x: (width + gap) * col + gap,
            y: (height + gap) * row + gap,
          },
        },
      };
    });

    return graphWithNodesCoords;
  }

  getEdgesCoords(graph: Partial<SortedNode>[]): Partial<SortedNode>[] {
    const { data } = this.state;
    const width = this.graphSizes.nodeWidth;
    const height = this.graphSizes.nodeHeight;
    const isData: boolean = data !== null;

    if (isData) {
      data?.edges.map((edge) => {
        const fromNode = graph?.find(({ id }) => id === edge.fromId);
        const toNode = graph?.find(({ id }) => id === edge.toId);
        const fromCoords = fromNode?.coords;
        const toCoords = toNode?.coords;
        const isBothNodes = fromNode !== undefined && toNode !== undefined;
        const isBothNodesCoords =
          fromCoords !== undefined && toCoords !== undefined;

        if (isBothNodes && isBothNodesCoords) {
          const lineCoords = {
            edge: [edge.fromId, edge.toId],
            x1: fromCoords.x && fromCoords.x + width,
            y1: fromCoords.y && fromCoords.y + height / 2,
            x2: toCoords.x && toCoords.x,
            y2: toCoords.y && toCoords.y + height / 2,
          };

          if (fromNode.lineCoords === undefined) {
            fromNode.lineCoords = [];
          }

          fromNode.lineCoords.push(lineCoords);
        }
      });
    }

    return graph;
  }

  getNodesColors(graph: Partial<SortedNode>[]): Partial<SortedNode>[] {
    return graph.map((n) => ({
      ...n,
      ...{ color: '#' + Math.random().toString(16).substr(-6) },
    }));
  }

  getFullGraphInfo() {
    let info: Partial<SortedNode>[] = [];

    if (this.state.data) {
      info = this.getSortedNodesByGridSystem(this.state.data);
      info = this.getNodesCoords(info);
      info = this.getEdgesCoords(info);
      info = this.getNodesColors(info);
    }

    this.state.fullGraphInfo = info;
  }

  getPointFromEvent(event: React.MouseEvent | MouseEvent) {
    // If even is triggered by a touch event, we get the position of the first finger
    const svgPoint = this.svgGraphRef.current?.createSVGPoint();
    if (svgPoint != null) {
      svgPoint.x = event.clientX;
      svgPoint.y = event.clientY;

      // We get the current transformation matrix of the SVG and we inverse it
      var invertedSVGMatrix = this.svgGraphRef.current
        ?.getScreenCTM()
        ?.inverse();

      return svgPoint.matrixTransform(invertedSVGMatrix);
    }
  }

  handleSvgGridMouseDown(event: React.MouseEvent) {
    event.preventDefault();
    const fromCoords = this.getPointFromEvent(event);

    this.setState({ svgGridCoords: { x: fromCoords?.x, y: fromCoords?.y } });

    const mousemove = (event: MouseEvent) => {
      if (this.state.isNodeDragging) return;

      event.preventDefault();
      var viewBox = this.svgGraphRef.current?.viewBox.baseVal;
      var pointerPosition = this.getPointFromEvent(event);

      if (viewBox && pointerPosition) {
        viewBox.x -= pointerPosition.x - this.state.svgGridCoords.x;
        viewBox.y -= pointerPosition.y - this.state.svgGridCoords.y;
      }
    };

    const mouseup = (event: MouseEvent) => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }

  handleSvgNodeMouseDown(event: React.MouseEvent) {
    this.setState({ isNodeDragging: true });

    event.preventDefault();

    let point = this.svgGraphRef.current?.createSVGPoint();

    if (point !== undefined) {
      point.x = event.clientX;
      point.y = event.clientY;
      point = point.matrixTransform(
        this.svgGraphRef.current?.getScreenCTM()?.inverse()
      );

      this.setState({
        draggableNodeCoords: {
          x: point.x - this.state.draggableNodeCoords.x,
          y: point.y - this.state.draggableNodeCoords.y,
        },
      });
    }

    const nodeWrapper = event?.currentTarget?.parentElement;
    const node = nodeWrapper?.children[0];
    const nodeId = Number(nodeWrapper?.getAttribute('data-node-id'));

    const fromEdgeLines = this.svgGraphRef.current?.querySelectorAll(
      `[data-edge-from-id="${nodeId}"]`
    );
    const toEdgeLines = this.svgGraphRef.current?.querySelectorAll(
      `[data-edge-to-id="${nodeId}"]`
    );
    const hasFromEdgeLines = fromEdgeLines?.length;
    const hasToEdgeLines = toEdgeLines?.length;

    const mousemove = (event: MouseEvent) => {
      event.preventDefault();

      if (point !== undefined) {
        point.x = event.clientX;
        point.y = event.clientY;

        let cursor = point.matrixTransform(
          this.svgGridRef.current?.getScreenCTM()?.inverse()
        );

        this.setState({
          draggableNodeCoords: {
            x: cursor.x - this.graphSizes.nodeWidth / 2,
            y: cursor.y - this.graphSizes.nodeHeight / 2,
          },
        });
      }

      if (hasFromEdgeLines) {
        fromEdgeLines?.forEach((line) => {
          line?.setAttribute(
            'x1',
            `${this.state.draggableNodeCoords.x + this.graphSizes.nodeWidth}`
          );
          line?.setAttribute(
            'y1',
            `${
              this.state.draggableNodeCoords.y + this.graphSizes.nodeHeight / 2
            }`
          );
        });
      }

      if (hasToEdgeLines) {
        toEdgeLines?.forEach((line) => {
          line?.setAttribute('x2', `${this.state.draggableNodeCoords.x}`);
          line?.setAttribute(
            'y2',
            `${
              this.state.draggableNodeCoords.y + this.graphSizes.nodeHeight / 2
            }`
          );
        });
      }

      if (nodeWrapper) {
        nodeWrapper.style.transform = `translate(${this.state.draggableNodeCoords.x}px, ${this.state.draggableNodeCoords.y}px)`;
      }

      if (node) {
        (node as HTMLElement).style.strokeWidth = '3px';
      }
    };

    const mouseup = (event: MouseEvent) => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);

      if (node) {
        (node as HTMLElement).style.strokeWidth = '1px';
      }

      this.setState({ isNodeDragging: false });
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }

  getGraphNodeElement(node: Node): JSX.Element {
    const nodeInfo = this.state.fullGraphInfo?.find(({ id }) => id == node.id);

    return (
      <g
        key={node.id}
        data-node-id={node.id.toString()}
        data-col={nodeInfo?.grid?.[0]}
        className={styles['tooltip-wrapper']}
        transform={`translate(${nodeInfo?.coords?.x}, ${nodeInfo?.coords?.y})`}
      >
        <rect
          className={styles['graph__rect']}
          width={this.graphSizes.nodeWidth}
          height={this.graphSizes.nodeHeight}
          stroke={nodeInfo?.color}
          rx='5'
          onMouseDown={(e) => this.handleSvgNodeMouseDown(e)}
        />
        <text
          className={styles['graph__rect-name']}
          x={this.graphSizes.nodeWidth / 2}
          y={this.graphSizes.nodeHeight / 2}
          fill={nodeInfo?.color}
          onMouseDown={(e) => this.handleSvgNodeMouseDown(e)}
          data-testid={node.name}
        >
          {node.id} - {node.name}
        </text>

        <g className={styles.tooltip}>
          <rect
            className={styles['tooltip__background']}
            width={this.graphSizes.nodeWidth}
            height={this.graphSizes.nodeHeight - 15}
            x='0'
            y={-this.graphSizes.nodeHeight}
            rx='10'
            fill={nodeInfo?.color}
          />
          <text
            className={styles['tooltip__text']}
            x={this.graphSizes.nodeWidth / 2}
            y={(-this.graphSizes.nodeHeight - 15) / 2}
          >
            {node.id} - {node.name}
          </text>
        </g>
      </g>
    );
  }

  getEdgesElements(): (JSX.Element[] | undefined)[] | undefined {
    const linesElements = this.state.fullGraphInfo?.map((node) => {
      return node.lineCoords?.map((line, index) => (
        <line
          key={line.edge[0] + index}
          data-edge-from-id={line.edge[0]}
          data-edge-to-id={line.edge[1]}
          className={styles['graph__rect-line']}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={node.color}
        />
      ));
    });

    return linesElements;
  }

  createGraph() {
    const svg = (
      <svg
        width='100%'
        height={this.graphSizes.height}
        viewBox={`0 0 ${this.graphSizes.width} ${this.graphSizes.height}`}
        preserveAspectRatio='xMidYMid meet'
        xmlns='http://www.w3.org/2000/svg'
        className={styles.graph}
        ref={this.svgGraphRef}
        onMouseDown={(e) => this.handleSvgGridMouseDown(e)}
      >
        <defs>
          <pattern
            id='smallGrid'
            width='8'
            height='8'
            patternUnits='userSpaceOnUse'
          >
            <path
              d='M 8 0 L 0 0 0 8'
              fill='none'
              stroke='#c0c0c088'
              strokeWidth='0.5'
            />
          </pattern>
          <pattern
            id='grid'
            width='80'
            height='80'
            patternUnits='userSpaceOnUse'
          >
            <rect width='80' height='80' fill='url(#smallGrid)' />
            <path
              d='M 80 0 L 0 0 0 80'
              fill='none'
              stroke='#aaaaaa88'
              strokeWidth='1'
            />
          </pattern>
        </defs>

        <rect
          ref={this.svgGridRef}
          width='100%'
          height='100%'
          fill='url(#grid)'
        />

        <g ref={this.svgGraphContentRef}>
          <g>{this.getEdgesElements()}</g>
          {this.state.data?.nodes.map((node) => this.getGraphNodeElement(node))}
        </g>
      </svg>
    );

    this.setState({ svgGraph: svg });
  }

  updateGridPosition() {
    const graph = this.svgGraphRef.current;
    const content = this.svgGraphContentRef.current;
    const grid = this.svgGridRef.current;
    const svgIsCreated = graph !== null && content !== null && grid !== null;

    // Set svgContent by middle + set svgGrid sizes by svgContent
    if (svgIsCreated) {
      const svgSizes = graph.getBoundingClientRect();
      const svgContentSizes = content.getBoundingClientRect();
      const width =
        (svgSizes.width - svgContentSizes.width - this.graphSizes.nodeGap) / 2;
      const height =
        (svgSizes.height - svgContentSizes.height - this.graphSizes.nodeGap) /
        2;
      const svgMiddleTranslateStyle = `translate(${width}px, ${height}px)`;

      content.style.transform = svgMiddleTranslateStyle;
      grid.style.transform = `translate(${width}px, ${height}px)`;
      grid.style.width =
        svgContentSizes.width + this.graphSizes.nodeGap * 2 + 'px';
      grid.style.height =
        svgContentSizes.height + this.graphSizes.nodeGap * 2 + 'px';
    }
  }

  render() {
    return (
      <>
        <div className={styles['graph-title']}>
          Graph {this.props.id} (Nodes: {this.state.data?.nodes.length}; Edges:{' '}
          {this.state.data?.edges.length})
        </div>
        <div className={styles['graph-desc']}>
          <span>
            ViewBox: x{this.svgGraphRef.current?.viewBox?.animVal.x} y
            {this.svgGraphRef.current?.viewBox?.animVal.y}
          </span>
          {` - `}
          <span>
            DraggableNode (relative to the grid): x
            {this.state.draggableNodeCoords.x} y
            {this.state.draggableNodeCoords.y}
          </span>
        </div>

        <div className={styles['graph-wrapper']}>{this.state.svgGraph}</div>
      </>
    );
  }
}

export default Graph;
