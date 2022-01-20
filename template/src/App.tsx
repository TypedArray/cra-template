import axios from 'axios';
import consolev from 'consolev';
import { format } from 'date-fns';
import preval from 'preval.macro';
import { useRoutes } from 'react-router-dom';
import './App.css';
import routes from './routes';

// Start the mocking conditionally.
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./__mocks__/browser');
  worker.start();
}
/**
 * 打印项目信息
 */
consolev(
  `${process.env.REACT_APP_NAME}@${process.env.REACT_APP_VERSION}`,
  process.env.REACT_APP_SHA,
  format(preval`module.exports = Date.now();`, 'yyyy/MM/dd HH:mm:ss')
);

axios.defaults.withCredentials = true;

function App() {
  const element = useRoutes(routes);
  return element;
}

export default App;
