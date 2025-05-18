import axios from 'axios'
import React, { useState, useEffect } from 'react'

const StockIn = () => {
  const [product, setProduct] = useState([])
  const [editId, setEditId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')

  // Fetch all products
  useEffect(() => {
    axios.get('http://localhost:3200/get/product')
      .then(res => {
        setProduct(res.data)
      })
      .catch(err => {
        alert('Error fetching products')
      })
  }, [])

  // Fetch stock details when editId changes
  useEffect(() => {
    if (!editId) {
      setQuantity('')
      setPrice('')
      return
    }

    axios.get('http://localhost:3200/productIn', { params: { code: editId } })
      .then(res => {
        if (res.data.success && res.data.stock) {
          setQuantity(res.data.stock.quantity ?? '')
          setPrice(res.data.stock.price ?? '')
        } else {
          setQuantity('')
          setPrice('')
          alert("Failed to fetch stock details.")
        }
      })
      .catch(err => {
        console.error("Error fetching stock details:", err)
        alert("Something went wrong. Please try again.")
      })
  }, [editId])

  const handleIn = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3200/insert/stockIn', { productCode: editId, quantity, price })
      .then(res => {
        if (res.data.success) {
          alert("Stock updated successfully")
          window.location.href = "/admin"
        } else {
          alert(res.data.error || "Failed to update stock.")
        }
      })
      .catch(err => {
        console.error("Error updating stock:", err)
        alert("Something went wrong. Please try again.")
      })
  }

  return (
    <div>
      <h1>Stock In Page</h1>
      <form onSubmit={handleIn}>
        <select value={editId} onChange={e => setEditId(e.target.value)}>
          <option value="">Select Product</option>
          {product.map((item) => (
            <option key={item.productCode} value={item.productCode}>
              {item.productName}
            </option>
          ))}
        </select>

        {editId && (
          <div>
            <input
              type="number"
              value={quantity}
              placeholder='Enter Quantity'
              onChange={e => setQuantity(e.target.value)}
            />
            <input
              type="number"
              placeholder='Enter Price'
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
            <button type="submit">Update</button>
          </div>
        )}
      </form>
      <a href="/admin">Home</a>
    </div>
  )
}

export default StockIn
