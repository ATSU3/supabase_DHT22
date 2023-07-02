import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chart from './components/Chart'
import Table from './components/Table'
import './scss/app.scss'

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul className='box'>
            <li>
              <Link to="/table">Table</Link>
            </li>
            <li>
              <Link to="/chart">Chart</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/table" element={<Table />} />
          <Route path="/chart" element={<Chart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
