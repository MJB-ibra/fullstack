import React from 'react'
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [sms, setSms] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!name || !password) {
            setSms("All fields are required.");
            return;
        }

        try {
            const res = await axios.post('http://localhost:3200/login', {name,password});

            if (res.data.success) {
                alert("Login successful");
                window.location.href = "/admin";
            } else {
               setSms(res.data.error || res.data.message || "Login failed.");

            }
        } catch (err) {
            console.error("Registration error:", err);
            setSms("Something went wrong. Please try again.");
        }
    };

  return (
    <div>
        <form action="" onSubmit={handleLogin} encType='multipart/form-data'>
        <h2>Login</h2>
        {sms && <p style={{ color: 'red', marginTop: '10px' }}>{sms}</p>}
        <div>
            <label htmlFor="name">Username:</label>
            <input type="name" id="name" name="name" value={name} onChange={(e)=>setName(e.target.value)} required />
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password"  value={password} onChange={(e)=>setPassword(e.target.value)}required />
        </div>
        <div>
            <button type="submit">Login</button>
        </div>
        <div>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
        <div>
            <p>Forgot your password? <a href="/reset-password">Reset Password</a></p>
        </div>
        <div>
            <p>Admin? <a href="/admin">Go to Admin</a></p>
        </div>
        <div>
            <p>Back to <a href="/">Home</a></p>
        </div>
        </form>
    </div>
  )
}

export default Login