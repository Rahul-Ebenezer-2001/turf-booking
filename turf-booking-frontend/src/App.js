// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './home/Home';

const App = () => {
  return (
    <Router>
      <Home />
    </Router>
  );
};

export default App;
