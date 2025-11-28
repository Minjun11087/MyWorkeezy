import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';       // ★ 여기에 넣어야 적용됨
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
