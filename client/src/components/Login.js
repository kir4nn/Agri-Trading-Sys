import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import '../App.css';

function Login() {
    const history = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');

    async function submit(e) {
        e.preventDefault();

        try {
            // Check if the user exists in the database
            const userRes = await axios.post("http://localhost:5000/check-user", {
                email
            });

            if (userRes.data.exists) {
                // Verify the userType before redirecting
                if (userType === userRes.data.userType) {
                    // Check if the password matches
                    const loginRes = await axios.post("http://localhost:5000/login-user", {
                        email,
                        password
                    });

                    if (loginRes.data === "success") {
                        // Redirect to dashboard based on userType
                        if (userType === 'farmer') {
                            history(`/farmer-dashboard/${email}`);
                        } else if (userType === 'buyer') {
                            history(`/buyer-dashboard/${email}`);
                        } else {
                            alert("Invalid user type");
                        }
                    } else {
                        alert("Incorrect password");
                    }
                } else {
                    alert("Invalid user type");
                }
            } else {
                alert("User does not exist");
            }
        } catch (error) {
            alert("Error occurred during login");
            console.error("Error:", error);
        }
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={submit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
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
