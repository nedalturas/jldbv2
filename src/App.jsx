import React, { useState, useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import viteLogo from '/vite.svg';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import FAQ from './pages/FAQ.jsx';

function App() {

  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>

      </Router> 
    </>
  )
}

export default App
