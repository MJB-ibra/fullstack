import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import Product from './pages/Product'
import StockIn from './pages/StockIn'
import StockOut from './pages/StockOut'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path='/product' element={<Product/>}/>
        <Route path='/productIn' element={<StockIn/>}/>
        <Route path='/productOut' element={<StockOut/>}/>
      </Routes>
    </div>
  )
}

export default App