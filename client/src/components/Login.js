import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import '../App.css';

function Login() {
    const history = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState(''); // Define userType state

    async function submit(e) {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/", {
                email,
                password,
                userType,
            });
    
            if (res.data === "exist") {
                // Check if the user exists in the database
                const userRes = await axios.post("http://localhost:5000/check-user", {
                    email
                });
    
                if (userRes.data.exists) {
                    // Verify the userType and credentials before redirecting
                    if (userType === 'farmer' && userRes.data.userType === 'farmer') {async function submit(e) {
                        e.preventDefault();
                        try {
                            const res = await axios.post("http://localhost:5000/", {
                                email,
                                password,
                                userType,
                            });
                
                            if (res.data === "exist") {
                                // Verify the userType before redirecting
                                if (userType === 'farmer') {
                                    // Redirect to farmer dashboard if userType is farmer
                                    history("/farmer-dashboard", { state: { id: email } });
                                } else if (userType === 'buyer') {
                                    // Redirect to buyer dashboard if userType is buyer
                                    history("/buyer-dashboard", { state: { id: email } });
                                } else {
                                    // User type doesn't match, prevent login
                                    alert("Invalid user type");
                                }
                            } else if (res.data === "notexist") {
                                // User has not signed up
                                alert("User has not signed up");
                            }
                        } catch (error) {
                            // Handle login failure
                            alert("Wrong details");
                            console.error("Error:", error);
                        }
                    }
                        // Check if the password matches
                        const loginRes = await axios.post("http://localhost:5000/login-user", {
                            email,
                            password
                        });
    
                        if (loginRes.data === "success") {
                            // Redirect to farmer dashboard if userType is farmer, user exists, and password matches
                            history("/farmer-dashboard", { state: { id: email } });
                        } else {
                            // Password doesn't match
                            alert("Incorrect password");
                        }
                    } else if (userType === 'buyer' && userRes.data.userType === 'buyer') {
                        // Check if the password matches
                        const loginRes = await axios.post("http://localhost:5000/login-user", {
                            email,
                            password
                        });
    
                        if (loginRes.data === "success") {
                            // Redirect to buyer dashboard if userType is buyer, user exists, and password matches
                            history("/buyer-dashboard", { state: { id: email } });
                        } else {
                            // Password doesn't match
                            alert("Incorrect password");
                        }
                    } else {
                        // User type doesn't match or user doesn't exist, prevent login
                        alert("Invalid user type or user does not exist");
                    }
                } else {
                    // User has not signed up
                    alert("User has not signed up");
                }
            } else {
                // User does not exist
                alert("User does not exist");
            }
        } catch (error) {
            // Handle login failure
            alert("Wrong details");
            console.error("Error:", error);
        }
    }
    

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={submit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <select value={userType} onChange={(e) => setUserType(e.target.value)}> {/* Dropdown for user type */}
                    <option value="" disabled>Select user type</option>
                    <option value="farmer">Farmer</option>
                    <option value="buyer">Buyer</option>
                </select>
                <br />
                <input type="submit" value="Login" />
            </form>
            <p>Don't have an Account?<Link to="/signup">Signup</Link></p>
        </div>
    );
}

export default Login;
