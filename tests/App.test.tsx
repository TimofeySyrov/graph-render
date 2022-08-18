import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import graphs from '../src/mocks/graphs';
import App from '../src/App';

beforeEach(async () => {
  render(<App />);

  // Waitinig for render option elements
  await screen.findAllByRole('option');
});

test('App renders', () => {
  render(<App />);
});

test('There is a dropdown with all the available graphs', async () => {
  const graphList = await screen.findByRole('combobox');
  const graphListOptions = await screen.findAllByRole('option');

  expect(graphList).not.toBeUndefined();
  expect(graphListOptions.length).toBe(graphs.length);
});

test('Graph selected by dropdown is rendered', async () => {
  const selectedGraph = 2;

  await userEvent.selectOptions(
    await screen.findByRole('combobox'),
    `${selectedGraph}`
  );

  for (let node of graphs[selectedGraph].nodes) {
    expect(await screen.findByTestId(node.name)).not.toBeUndefined();
  }
});

test('Nodes in simple graph are organized into columns', async () => {
  const selectedGraph = 1;
  const correctColumns = [['start'], ['foo', 'bar'], ['end1', 'end2']];

  await userEvent.selectOptions(
    await screen.findByRole('combobox'),
    `${selectedGraph}`
  );

  // Check node column index is correct
  for (const [i, col] of correctColumns.entries()) {
    for (const nodeName of col) {
      const nodeEl = await screen.findByTestId(nodeName);
      const colEl = nodeEl.parentElement;
      const colNum = colEl?.getAttribute('data-col');

      expect(colNum).toEqual(i.toString());
    }
  }
});
