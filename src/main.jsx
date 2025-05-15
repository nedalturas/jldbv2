import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import 'fomantic-ui/dist/semantic.min.css';
import 'fomantic-ui/dist/semantic.min.js';
import $ from 'jquery';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
