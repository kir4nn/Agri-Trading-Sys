import React from "react";
import { useLocation } from "react-router-dom";

function Profile() {
    const location = useLocation();
    const { email, contactNo, fname, minit, lname } = location.state;

    return (
        <div className="profile">
            <h1>Profile</h1>
            <p>Email: {email}</p>
            <p>Contact Number: {contactNo}</p>
            <p>Name: {fname} {minit && minit + '.'} {lname}</p>
            {/* Add other profile details here */}
        </div>
    );
}

export default Profile;
