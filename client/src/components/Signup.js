import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
    const history = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [fname, setFname] = useState('');
    const [minit, setMinit] = useState('');
    const [lname, setLname] = useState('');
    const [location, setLocation] = useState('');

    async function submit(e) {
        e.preventDefault();
        try {
            // Separate the form data
            const mongoData = { email, password };
            const sqlData = { email, contactNo, fname, minit, lname }; // Send all necessary fields to the SQL server endpoint
    
            // Send data to respective backend endpoints
            await axios.post("http://localhost:5000/signup-mongodb", mongoData)
                .then(async (res) => {
                    if (res.data === "exist") {
                        alert("User already exists");
                    } else if (res.data === "notexist") {
                        await axios.post("http://localhost:5000/signup-sqlserver", sqlData)
                            .then(() => {
                                history("/login", { state: { id: email } });
                            })
                            .catch((error) => {
                                alert("Error signing up. Please try again later.");
                                console.error("Error signing up to SQL Server:", error);
                            });
                    }
                })
                .catch((error) => {
                    alert("Error signing up. Please try again later.");
                    console.error("Error signing up to MongoDB:", error);
                });
        } catch (error) {
            console.error("Error:", error);
            alert("Error signing up. Please try again later.");
        }
    }
    

    return (
        <div className="signup">
            <h1>Signup</h1>
            <form action="POST" method="post">
                <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <input type="text" onChange={(e) => setContactNo(e.target.value)} placeholder="Contact Number" />
                <input type="text" onChange={(e) => setFname(e.target.value)} placeholder="First Name" />
                <input type="text" onChange={(e) => setMinit(e.target.value)} placeholder="Middle Initial" />
                <input type="text" onChange={(e) => setLname(e.target.value)} placeholder="Last Name" />
                {/* <input type="text" onChange={(e) => setLocation(e.target.value)} placeholder="Location" /> */}
                <input type="submit" onClick={submit} />
            </form>
            <br />
            <br />
            <p>Already have an Account?<Link to="/login">Login</Link></p>
            
        </div>
    );
}

export default Signup;
