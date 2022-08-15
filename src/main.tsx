import ReactDOM from 'react-dom';

import { worker } from './mocks/browser';
import './index.css';
import App from './App';

// Waiting for the MSW to load
function prepare() {
  if (process.env.NODE_ENV === 'development') {
    return worker.start();
  }
  return Promise.resolve();
}

prepare().then(() => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
