import axios from 'axios'
import React, { useState } from 'react'

const Product = () => {
    const [name,setName] = useState('')
const [sms,setSms] = useState('')
const handleInsert=(e)=>{
    e.preventDefault();
axios.post('http://localhost:3200/insert/product', { name })
.then(res=>{
    if (res.data.success) {
        alert("Product added successfully");
        window.location.href = "/admin";
    } else {
        setSms(res.data.error || "Failed to add product.");
    }
})
 .catch((err)=>{
    console.error("Error adding product:", err);
    })
  .then((res) => {
    if (res.data.success) {
      alert("Product added successfully");
      window.location.href = "/admin";
    } else {
      setSms(res.data.error || "Failed to add product.");
    }
  })
  .catch((err) => {
    console.error("Error adding product:", err);
    setSms("Something went wrong. Please try again.");
  });
}
  return (
    <div>
<form action="" onSubmit={handleInsert}>
    <input type="text" placeholder='Enter NAme of Product' value={name} onChange={(e)=>setName(e.target.value)}/>
    <button type="submit">Add Product</button>
</form>

    </div>
  )
}

export default Product