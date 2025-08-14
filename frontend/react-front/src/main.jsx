import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './jsx/App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";  // ou qualquer CSS global

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
