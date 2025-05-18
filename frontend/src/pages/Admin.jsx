import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Admin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState();

    useEffect(() => {
        axios.get('http://localhost:3200/admin', { withCredentials: true })
            .then((res) => {
                if (res.data.success) {
                    setIsAdmin(true);
                    setMessage(res.data.message);
                    setUser(res.data.user);
                } else {
                    setIsAdmin(false);
                    setMessage(res.data.message);
                }
            })
            .catch(() => {
                setIsAdmin(false);
                setMessage("Access denied. Please login.");
            });
    }, []);

    const Logout = () => {
        axios.get('http://localhost:3200/logout', { withCredentials: true })
            .then((res) => {
                if (res.data.success) {
                    setIsAdmin(false);
                    setMessage("Logged out successfully.");
                } else {
                    alert("Error logging out");
                }
            })
            .catch(() => {
                alert("Error logging out");
            });
    };

    return (
        <div>
            {isAdmin ? (
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>{message}</p>
                    {user && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img
                                src={user.image}
                                alt={user.name}
                                style={{ 
                                    width: '80px', 
                                    height: '80px', 
                                    borderRadius: '50%', 
                                    objectFit: 'cover' 
                                }} 
                            />
                            <h3>{user.name}</h3>
                        </div>
                    )}

                    <nav>
                        <ul>
                            <li><a href="/product">product</a></li>
                            <li><a href="/admin/reports">View Reports</a></li>
                            <li><a href="/productIn">Product In</a></li>
                            <li><a href="/productOut">Product Out</a></li>

                        </ul>
                        <button onClick={Logout}>Logout</button>
                    </nav>
                    <div>
            
                        <p>Need help? <a href="/help">Visit Help Center</a></p>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Access Denied</h1>
                    <p>{message}</p>
                    <a href="/login">Login</a>
                </div>
            )}
        </div>
    );
};

export default Admin;
