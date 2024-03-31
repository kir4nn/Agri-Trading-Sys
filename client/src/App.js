import Home from "./components/home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import React from 'react';
import FarmerDashboard from './components/FarmerDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import HomeIcon from './images/home-solid.svg';
import CartPage from './components/cart';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="container">
        
          <nav>
    <ul>
    <li className="home"><Link to="/"><img src={HomeIcon} alt="Home" /> Home</Link></li>
    
    </ul>
    </nav>

          <Routes>
            {/* <Route path="/login" element={<Login/>}/> */}
            <Route path="/" element={<Home/>}/>
            <Route path="/signup" element={<Signup/>}/>
            
            <Route exact path="/login" element={<Login/>} />
            <Route path="/farmer-dashboard/:fEmail" element={<FarmerDashboard />} />
            <Route path="/buyer-dashboard/:bEmail" element={<BuyerDashboard />} />
            <Route path="/cart" element={<CartPage/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
