import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Test from './Test'
import AgroMarketplace3D from './components/AgroMarketplace3D'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<Test />} />
        <Route path="/marketplace" element={<AgroMarketplace3D />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
