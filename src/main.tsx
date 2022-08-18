import ReactDOM from 'react-dom';

import { worker } from './mocks/browser';
import App from './App';
import './index.css';

if (process.env.NODE_ENV === 'development') {
  worker.start();
}

ReactDOM.render(<App />, document.getElementById('root'));
