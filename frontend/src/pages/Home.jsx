import React from 'react'

const Home = () => {
  return (
    <div>
        <h1>Welcome to the Home Page</h1>
        <p>This is the landing page of our application.</p>
        <p>Use the navigation links to explore the site.</p>
        <nav>
            <ul>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
            <li><a href="/admin">Admin</a></li>
            </ul>
        </nav>
    </div>
  )
}

export default Home