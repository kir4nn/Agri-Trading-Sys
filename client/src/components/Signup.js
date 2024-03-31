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
    const [userType, setUserType] = useState(''); // Define userType state

    // Validation state
    const [errors, setErrors] = useState({});

    // Validation function
    const validate = () => {
        const errors = {};

        // Email validation
        if (!email || !email.includes('@') || email.split('@').length !== 2) {
            errors.email = "Please enter a valid email address";
        }

        // Password length validation
        if (!password || password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
        }

        // Contact number format validation
        const contactRegex = /^\d{10}$/; // Regular expression for exactly 10 digits
        if (!contactNo || !contactRegex.test(contactNo)) {
            errors.contactNo = "Please enter a valid 10-digit contact number";
        }

        // Other field validations (if needed)

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    async function submit(e) {
        e.preventDefault();
        if (!validate()) return; // If validation fails, return early

        try {
            const mongoData = { email, password, userType };
            const sqlData = { email, contactNo, fname, minit, lname, userType, location }; // Include userType in SQL data

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
                {errors.email && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</p>} {/* Display email error in red */}
                <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                {errors.password && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.password}</p>} {/* Display password error in red */}
                <input type="text" onChange={(e) => setContactNo(e.target.value)} placeholder="Contact Number" />
                {errors.contactNo && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.contactNo}</p>} {/* Display contact number error in red */}
                <input type="text" onChange={(e) => setFname(e.target.value)} placeholder="First Name" />
                <input type="text" onChange={(e) => setMinit(e.target.value)} placeholder="Middle Initial" />
                <input type="text" onChange={(e) => setLname(e.target.value)} placeholder="Last Name" />
                <input type="text" onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
                <select value={userType} onChange={(e) => setUserType(e.target.value)}
                    style={{marginBottom:10}}> {/* Dropdown for user type */}
                    <option value="" disabled>Select user type</option>
                    <option value="farmer">Farmer</option>
                    <option value="buyer">Buyer</option>
                </select>
                <input type="submit" value="Create Account" onClick={submit}/>
            </form>
            {errors.emptyFields && <p>{errors.emptyFields}</p>}
            <br />
            <br />
            <p>Already have an Account?<Link to="/login">Login</Link></p>
        </div>
    );
}

export default Signup;
