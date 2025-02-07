// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path')

// const app = express();
// const port = 3000;


// let root_path = path.resolve(__dirname, 'static')

// app.use(express.static(root_path));
// require('dotenv').config();

// app.use(bodyParser.urlencoded({ extended: true}));
// app.use(bodyParser.json());
// app.use(express.static(root_path));


// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}/login.html`);
// });






// require('dotenv').config();
// const express = require('express');
// const mysql = require('mysql2');

// const app = express();
// const port = 3000;

// // ตั้งค่าการเชื่อมต่อฐานข้อมูล
// const db = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'root',
//     password: '',
//     database: 'shopping'
// });

// // เชื่อมต่อฐานข้อมูล
// db.connect((err) => {
//     if (err) {
//         console.error('Database connection failed:', err.message);
//     } else {
//         console.log('Database is connected');
//     }
// });

// app.get('/', (req, res) => {
//     res.json({ message: "Database connection is working" });
// });

// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });


const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "shopping",
});

module.exports = db;
