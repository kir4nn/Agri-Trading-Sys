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
            await axios.post("http://localhost:5000/", {
                email,
                password,
                userType // Include userType in the request body
            })
            .then(res => {
                if (res.data === "exist") {
                    // Redirect based on userType
                    if (userType === 'farmer') {
                        history("/farmer-dashboard", { state: { id: email } });
                    } else if (userType === 'buyer') {
                        history("/buyer-dashboard", { state: { id: email } });
                    }
                } else if (res.data === "notexist") {
                    alert("User has not signed up");
                }
            })
            .catch(e => {
                alert("Wrong details");
                console.log(e);
            });
        } catch(e) {
            console.log(e);
        }
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <form action="POST">
                <input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" />
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                    <option value="" disabled>Select the login Type</option>
                    <option value="farmer">Farmer</option>
                    <option value="buyer">Buyer</option>
                </select>


                <br />
                <input type="submit" onClick={submit} />
            </form>
           
            <p>Don't have an Account?<Link to="/signup">Signup</Link></p>
        </div>
    );
}

export default Login;
