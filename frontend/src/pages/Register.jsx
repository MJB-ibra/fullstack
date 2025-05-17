import axios from 'axios';
import React, { useState } from 'react';

const Register = () => {
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");
    const [sms, setSms] = useState('');

    const handleInsert = async (e) => {
        e.preventDefault();

        if (!name || !password || !file) {
            setSms("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('password', password);
        formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:3200/insert/user', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                alert("Registration successful");
                window.location.href = "/login";
            } else {
                setSms(res.data.error || "Registration failed.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setSms("Something went wrong. Please try again.");
        }
    };

    return (
        <div>
            <form onSubmit={handleInsert} encType='multipart/form-data'>
                <h2>Register</h2>
                {sms && <p style={{ color: 'red', marginTop: '10px' }}>{sms}</p>}
                <div>
                    <label htmlFor="name">Username:</label>
                    <input type="text" id="name" value={name} name="name" required onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} name="password" required onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="file">Image:</label>
                    <input type="file" id="file" name="file" required onChange={(e) => setFile(e.target.files[0])} />
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
                <div>
                    <p>Already have an account? <a href="/login">Login</a></p>
                </div>
            </form>
        </div>
    );
};

export default Register;
