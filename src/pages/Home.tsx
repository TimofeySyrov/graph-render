import React from 'react';

import GraphsList from '../components/GraphsList/GraphsList';

const Home = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1
        style={{
          backgroundImage:
            'linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          filter: 'brightness(50%)',
        }}
      >
        Interactive Graphs
      </h1>
      <GraphsList />
    </div>
  );
};

export default Home;
