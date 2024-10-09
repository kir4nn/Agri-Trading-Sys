import Home from "./components/home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import React from 'react';
import FarmerDashboard from './components/FarmerDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import HomeIcon from './images/homee.png'
import CartPage from './components/cart';
import PrivateRoutes from "./utils/PrivateRoutes";
import YieldPredictionForm from "./components/Yield_Predictor.js";

function App() {
  const [token, setToken] = useState(false);
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
            <Route exact path="/login" element={<Login setToken={setToken} />} />
            <Route element={<PrivateRoutes token={token}/>}>
              <Route path="/farmer-dashboard/:fEmail" element={<FarmerDashboard />} />
              <Route path="/buyer-dashboard/:bEmail" element={<BuyerDashboard />} />
            </Route>
            <Route path="/" element={<Home/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/yield-predictor" element={<YieldPredictionForm/>} />
            <Route path="/cart/:bId" element={<CartPage/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
