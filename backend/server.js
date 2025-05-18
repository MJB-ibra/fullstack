const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3200;

//connect to mysql

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test-db'
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
})

// Middleware

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images',express.static('images'));

// file upload setup

const storage = multer.diskStorage({
    destination:'images/',
    filename:(req,file,cb)=>cb(null,Date.now()+'-'+file.originalname)
})

const upload = multer({storage})

//router for insert

app.post('/insert/user',upload.single('file'),(req,res)=>{
    const {name,password} = req.body
    const file = req.file
    const image = file ? `http://localhost:3200/images/${file.filename}` : null;
    const sql = "INSERT INTO users(name,password,image) VALUES (?,?,?)"

    if (!name || !password || !image) {
        return res.status(400).json({ error: 'Name, password, and image are required.',success: false });
    }
    db.query(sql,[name,password,image],(err,result)=>{
        if(err){
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' ,success: false });
        }
        res.status(200).json({ message: 'Data inserted successfully', result,success: true });
    })
})

//login router

app.post('/login',(req,res)=>{
    const {name,password} = req.body
    const sql = "SELECT * FROM users WHERE name = ? AND password = ?"
    if (!name || !password) {
        return res.status(400).json({ error: 'Name and password are required.' ,success: false});
    }

    db.query(sql,[name,password],(err,result)=>{
        if(err){
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Database error',success: false });
        }
        if(result.length > 0){
            const token = jwt.sign({name:result[0].name},'jwt-sec-key', {expiresIn:'1h'})
            res.cookie('token',token)
            res.status(200).json({ message: 'Login successful', user: result[0] ,success: true });
        }else{
            res.status(401).json({ message: 'Invalid credentials',success: false });
        }
    })
})

//verify token

const verifyToken =(req,res,next)=>{
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: 'No token provided' ,success: false });
    }
    jwt.verify(token,'jwt-sec-key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' ,success: false });
        }
        req.user = decoded;
        next();
    });
}

//protected router

app.get('/admin',verifyToken,(req,res)=>{
    res.status(200).json({ message: 'Welcome to the admin page', user: req.user ,success: true });
})

//Add product router

app.post('/insert/product', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Product name is required.', success: false });
    }
    const sql = "INSERT INTO products(productName) VALUES (?)";
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.error('Error inserting product:', err);
            return res.status(500).json({ error: 'Database error', success: false });
        }
        res.status(200).json({ message: 'Product added successfully', result, success: true });
    });
}
);

//select product

app.get('/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Database error', success: false });
        }
        res.status(200).json({ products: result, success: true });
    });
});

//get product 

app.get('/get/product', (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Database error', success: false });
        }
        res.status(200).json(result);
    });
}
);

//insert stock in
app.post('/insert/stockIn', (req, res) => {
    const { productCode, quantity, price } = req.body;
    const totalPrice = quantity * price;
    if (!productCode || !quantity || !price) {
        return res.status(400).json({ error: 'Product code, quantity, and price are required.', success: false });
    }
    const sql = "INSERT INTO productIn(productCode, Qauntity, unitPrice,totalPrice) VALUES (?, ?, ?,?)";
    db.query(sql, [productCode, quantity, price,totalPrice], (err, result) => {
        if (err) {
            console.error('Error inserting stock:', err);
            return res.status(500).json({ error: 'Database error', success: false });
        }
        res.status(200).json({ message: 'Stock updated successfully', result, success: true });
    });
});

//select from productIn
app.get('/productIn', (req, res) => {
    const { code } = req.query;
    const sql = "SELECT * FROM productIn WHERE productCode = ?";
    db.query(sql, [code], (err, result) => {
        if (err) {
            console.error('Error fetching stock:', err);
            return res.status(500).json({ error: 'Database error', success: false });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'No stock found for this product code', success: false });
        }
        // Return the first stock record
        res.status(200).json({ stock: result, success: true });
    });
});



//logout router
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully', success: true });
});

//listener for port

app.listen(port, () => {
    console.log(`Server is running`);
});