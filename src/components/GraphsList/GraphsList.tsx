import React, { Component, createRef } from 'react';

import GraphInterface from '../../utils/interfaces/graph';
import Graph from '../Graph/Graph';

import styles from './graphList.module.css';

type GraphsListProps = {};

class GraphsList extends Component<GraphsListProps> {
  state: {
    graphs: number[];
    activeGraphId: number | null;
    graphData: GraphInterface | null;
  };
  graphsDropdownRef: React.RefObject<HTMLSelectElement>;

  constructor(props: GraphsListProps) {
    super(props);
    this.state = {
      graphs: [],
      activeGraphId: null,
      graphData: null,
    };
    this.graphsDropdownRef = createRef();
  }

<<<<<<< HEAD
  async handleGraphsDropdownChange(event: React.FormEvent<HTMLSelectElement>) {
    this.setState({
      activeGraphId: event.currentTarget.value,
    });

    await fetch('/api/graphs/' + event.currentTarget.value)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ graphData: data });
      });
=======
  async fetchActiveGraphData(id: string) {
    await fetch(`/api/graphs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          activeGraphId: id,
          graphData: data,
        });
      });
  }

  async handleGraphsDropdownChange(event: React.FormEvent<HTMLSelectElement>) {
    await this.fetchActiveGraphData(event.currentTarget.value);
>>>>>>> fd56d6e (fix app tests)
  }

  async componentDidMount() {
    await fetch('/api/graphs')
      .then((res) => res.json())
      .then((data) => {
        this.setState({ graphs: data });
      });

    this.setState({ activeGraphId: this.graphsDropdownRef.current?.value });

    if (this.state.activeGraphId) {
<<<<<<< HEAD
      await fetch(`/api/graphs/${this.state.activeGraphId}`)
        .then((res) => res.json())
        .then((data) => {
          this.setState({ graphData: data });
        });
=======
      await this.fetchActiveGraphData(this.state.activeGraphId.toString());
>>>>>>> fd56d6e (fix app tests)
    }
  }

  render() {
    return (
      <div className={styles['graphList-wrapper']}>
        <span className={styles['graphList-title']}>
          Graphs List ({this.state.graphs.length} available)
        </span>
        <select
          name='graphsListDropdown'
          id='graphsListDropdown'
          ref={this.graphsDropdownRef}
          onChange={this.handleGraphsDropdownChange.bind(this)}
          className={styles.graphList}
          role='combobox'
        >
          {this.state.graphs.map((id) => (
            <option key={id} value={id} role='option'>
              Graph {id}
            </option>
          ))}
        </select>
        {this.state.activeGraphId && this.state.graphData && (
          <Graph
            key={this.state.activeGraphId}
            id={this.state.activeGraphId}
            data={this.state.graphData}
          />
        )}
      </div>
    );
  }
}

export default GraphsList;
