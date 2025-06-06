import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Updates from './pages/Updates.jsx';
import PageNotFound from './components/PageNotFound.jsx';

function App() {

  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<Updates />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>

      </Router>
    </>
  )
}

export default App
