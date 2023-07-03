import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chart from './components/Chart'
import Table from './components/Table'
import Map from './components/Map'
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
            <li>
              <Link to="/map">Map</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/table" element={<Table />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
