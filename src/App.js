import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import RoutesConfig from './routes/route';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <RoutesConfig />
      </BrowserRouter>
    </div>
  );
}

export default App;
