const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// 📌 เสิร์ฟไฟล์ HTML, CSS, JS จากโฟลเดอร์ "public"
app.use(express.static(path.join(__dirname, "static")));

// 📌 เปิดหน้าเว็บหลัก index.html เมื่อเข้า "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "indexbackup1.html"));
});

// 📌 API ดึงข้อมูลสินค้า
app.get("/products", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM sp_product ORDER BY id DESC");
        if (rows.length > 0) {
            res.status(200).json({
                RespCode: 200,
                RespMessage: "success",
                Result: rows,
            });
        } else {
            res.status(400).json({
                RespCode: 400,
                Log: 0,
                RespMessage: "bad : Not found data",
            });
        }
    } catch (error) {
        res.status(500).json({
            RespCode: 500,
            Log: 1,
            RespMessage: "bad : bad sql",
            Error: error.message,
        });
    }
});

app.post("/calculate-price", async (req, res) => {
    try {
        const { user_id, product } = req.body;

        // ตรวจสอบว่า user_id และ product ถูกต้อง
        if (!user_id) {
            return res.status(400).json({ RespCode: 400, RespMessage: "Missing user_id" });
        }
        if (!Array.isArray(product) || product.length === 0) {
            return res.status(400).json({ RespCode: 400, RespMessage: "Invalid product data" });
        }

        // ดึงราคาสินค้าจากฐานข้อมูล
        const [rows] = await db.query("SELECT id, price FROM sp_product ORDER BY id DESC");
        let queryProduct = rows.map(row => ({ id: row.id, price: row.price }));

        // คำนวณราคาสินค้าทั้งหมด
        let amount = 0;
        product.forEach(p => {
            const foundProduct = queryProduct.find(qp => qp.id === parseInt(p.id));
            if (foundProduct) {
                amount += parseInt(p.count) * parseInt(foundProduct.price);
            }
        });

        // คำนวณค่าขนส่ง, VAT, และยอดสุทธิ
        const shipping = amount + 60;
        const vat = (shipping * 7) / 100;
        const netAmount = shipping + vat;
        const transid = Date.now(); // ใช้ Timestamp เป็น Transaction ID
        const productJson = JSON.stringify(product);
        const updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");

        // 📌 บันทึกลงฐานข้อมูล พร้อม user_id
        const [result] = await db.query(
            "INSERT INTO sp_transaction (transid, user_id, orderlist, amount, shipping, vat, netamount, operation, mil, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [transid, user_id, productJson, amount, shipping, vat, netAmount, "PENDING", Date.now(), updatedAt]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                RespCode: 200,
                RespMessage: "success",
                TransactionID: transid,
                UserID: user_id,
                Amount: amount,
                Shipping: shipping,
                VAT: vat,
                NetAmount: netAmount
            });
        } else {
            res.status(500).json({
                RespCode: 300,
                RespMessage: "bad : insert transaction fail"
            });
        }
    } catch (error) {
        res.status(500).json({
            RespCode: 500,
            RespMessage: "bad : server error",
            Error: error.message
        });
    }
});


// app.post("/calculate-price", async (req, res) => {
//     try {
//         const { product } = req.body;
//         if (!Array.isArray(product) || product.length === 0) {
//             return res.status(400).json({ RespCode: 400, RespMessage: "Invalid product data" });
//         }

//         const [rows] = await db.query("SELECT id, price FROM sp_product ORDER BY id DESC");
//         let queryProduct = rows.map(row => ({ id: row.id, price: row.price }));

//         let amount = 0;
//         product.forEach(p => {
//             const foundProduct = queryProduct.find(qp => qp.id === parseInt(p.id));
//             if (foundProduct) {
//                 amount += parseInt(p.count) * parseInt(foundProduct.price);
//             }
//         });

//         // 📌 คำนวณค่าขนส่ง, VAT, และยอดสุทธิ
//         const shipping = amount + 60;
//         const vat = (shipping * 7) / 100;
//         const netAmount = shipping + vat;
//         const transid = Date.now(); // ใช้ Timestamp เป็น Transaction ID
//         const productJson = JSON.stringify(product);
//         const updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
        

//         // 📌 บันทึกลงฐานข้อมูล
//         const [result] = await db.query(
//             "INSERT INTO sp_transaction (transid, orderlist, amount, shipping, vat, netamount, operation, mil, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
//             [transid, productJson, amount, shipping, vat, netAmount, "PENDING", Date.now(), updatedAt]
//         );

//         if (result.affectedRows > 0) {
//             res.status(200).json({
//                 RespCode: 200,
//                 RespMessage: "success",
//                 TransactionID: transid,
//                 // Orderlist: JSON.stringify(product),
//                 Amount: amount,
//                 Shipping: shipping,
//                 VAT: vat,
//                 NetAmount: netAmount
//             });
//         } else {
//             res.status(500).json({
//                 RespCode: 300,
//                 RespMessage: "bad : insert transaction fail"
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             RespCode: 500,
//             RespMessage: "bad : server error",
//             Error: error.message
//         });
//     }
// });

app.delete("/cancel-transaction/:transid", async (req, res) => {
    try {
        const { transid } = req.params;
        const [result] = await db.query(
            "UPDATE sp_transaction SET operation = 'CANCEL' WHERE transid = ?",
            [transid]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                RespCode: 200,
                RespMessage: "Transaction canceled successfully"
            });
        } else {
            res.status(400).json({
                RespCode: 400,
                RespMessage: "Transaction not found or already canceled"
            });
        }
    } catch (error) {
        res.status(500).json({
            RespCode: 500,
            RespMessage: "Error canceling transaction",
            Error: error.message
        });
    }
});
        // 📌 ลบ Transaction จากฐานข้อมูล
//         const [result] = await db.query("DELETE FROM sp_transaction WHERE transid = ?", [transid]);

//         if (result.affectedRows > 0) {
//             res.status(200).json({
//                 RespCode: 200,
//                 RespMessage: "Transaction deleted successfully"
//             });
//         } else {
//             res.status(400).json({
//                 RespCode: 400,
//                 RespMessage: "Transaction not found or already deleted"
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             RespCode: 500,
//             RespMessage: "Error deleting transaction",
//             Error: error.message
//         });
//     }
// });

////////////////////////////

app.get("/get-order/:user_id/:transid", async (req, res) => {
    try {
        const { user_id, transid } = req.params;

        const [rows] = await db.query(
            "SELECT orderlist FROM sp_transaction WHERE transid = ? AND user_id = ?",
            [transid, user_id]
        );

        if (rows.length > 0) {
            res.status(200).json({ RespCode: 200, OrderList: JSON.parse(rows[0].orderlist) });
        } else {
            res.status(404).json({ RespCode: 404, RespMessage: "Order not found or unauthorized" });
        }
    } catch (error) {
        res.status(500).json({ RespCode: 500, RespMessage: "Server error", Error: error.message });
    }
});

// app.get("/get-order/:transid", async (req, res) => {
//     try {
//         const { transid } = req.params;

//         // 📌 ดึงข้อมูลจาก sp_transaction โดยใช้ transid
//         const [rows] = await db.query("SELECT orderlist FROM sp_transaction WHERE transid = ?", [transid]);

//         if (rows.length === 0) {
//             return res.status(404).json({ RespCode: 404, RespMessage: "Order not found" });
//         }

//         // 📌 แปลง orderlist จาก JSON string เป็นอาร์เรย์
//         const orderlist = JSON.parse(rows[0].orderlist);

//         res.status(200).json({
//             RespCode: 200,
//             RespMessage: "Success",
//             OrderList: orderlist
//         });

//     } catch (error) {
//         res.status(500).json({
//             RespCode: 500,
//             RespMessage: "Server error",
//             Error: error.message
//         });
//     }
// });

///////


/////
app.get("/get-latest-order/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const [rows] = await db.query(
            "SELECT transid FROM sp_transaction WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
            [user_id]
        );

        if (rows.length > 0) {
            res.status(200).json({ TransactionID: rows[0].transid });
        } else {
            res.status(404).json({ RespCode: 404, RespMessage: "No transactions found" });
        }
    } catch (error) {
        res.status(500).json({ RespCode: 500, RespMessage: "Server error", Error: error.message });
    }
});


// app.get("/get-latest-order", async (req, res) => {
//     try {
//         // 📌 ดึง transid ล่าสุดจากฐานข้อมูล
//         const [rows] = await db.query("SELECT transid FROM sp_transaction ORDER BY updated_at DESC LIMIT 1");

//         if (rows.length === 0) {
//             return res.status(404).json({ RespCode: 404, RespMessage: "No transactions found" });
//         }

//         const latestTransid = rows[0].transid;

//         res.status(200).json({
//             RespCode: 200,
//             RespMessage: "Success",
//             TransactionID: latestTransid
//         });

//     } catch (error) {
//         res.status(500).json({
//             RespCode: 500,
//             RespMessage: "Server error",
//             Error: error.message
//         });
//     }
// });

////

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    console.log("Received Data:", req.body);

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // ✅ ตรวจสอบว่ามี username หรือ email ซ้ำในฐานข้อมูลหรือไม่
        const [existingUser] = await db.query(
            "SELECT * FROM users WHERE username = ? OR email = ?", 
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username or Email already exists" });
        }

        // ✅ บันทึกรหัสผ่านแบบ Plain Text (ไม่เข้ารหัส `bcrypt`)
        const [result] = await db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
            [username, email, password]
        );

        if (result.affectedRows > 0) {
            res.status(201).json({ message: "User registered successfully" });
        } else {
            res.status(500).json({ message: "Failed to register user" });
        }
    } catch (error) {
        console.error("Sign Up Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    console.log("📥 Login Request Received:", email, password);

    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?", 
            [email]
        );

        if (rows.length === 0) {
            console.log("❌ No user found with this email");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = rows[0];

        if (password !== user.password) {
            console.log("❌ Password incorrect for:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("✅ Login Successful for:", user.email, "User ID:", user.id);

        res.status(200).json({ 
            message: "Login successful!", 
            user: { id: user.id, email: user.email, username: user.username } // ✅ ส่ง user_id กลับไปด้วย
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
/////
app.get("/get-orders-to-deliver/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;

        // ดึงรายการที่ต้องจัดส่ง (SHIPPING) และที่กำลังตรวจสอบ (WAIT)
        const [rows] = await db.query(
            "SELECT transid, orderlist, operation FROM sp_transaction WHERE user_id = ? AND operation IN ('SHIPPING', 'WAIT') ORDER BY updated_at DESC",
            [user_id]
        );

        if (rows.length > 0) {
            const orders = rows.map(row => ({
                transid: row.transid,
                operation: row.operation, // 📌 เพิ่ม operation เพื่อตรวจสอบสถานะ
                orderlist: JSON.parse(row.orderlist)
            }));

            res.status(200).json({ RespCode: 200, Orders: orders });
        } else {
            res.status(404).json({ RespCode: 404, RespMessage: "No orders found" });
        }
    } catch (error) {
        res.status(500).json({ RespCode: 500, RespMessage: "Server error", Error: error.message });
    }
});
// app.get("/get-orders-to-deliver/:user_id", async (req, res) => {
//     try {
//         const { user_id } = req.params;

//         // ดึงรายการที่ต้องจัดส่ง (operation = "SHIPPING")
//         const [rows] = await db.query(
//             "SELECT transid, orderlist FROM sp_transaction WHERE user_id = ? AND operation = 'SHIPPING' ORDER BY updated_at DESC",
//             [user_id]
//         );

//         if (rows.length > 0) {
//             const orders = rows.map(row => ({
//                 transid: row.transid,
//                 orderlist: JSON.parse(row.orderlist)
//             }));

//             res.status(200).json({ RespCode: 200, Orders: orders });
//         } else {
//             res.status(404).json({ RespCode: 404, RespMessage: "No shipping orders found" });
//         }
//     } catch (error) {
//         res.status(500).json({ RespCode: 500, RespMessage: "Server error", Error: error.message });
//     }
// });

///

app.get("/get-orders-to-finish/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;

        // ดึงรายการที่ต้องจัดส่ง (operation = "FINISH")
        const [rows] = await db.query(
            "SELECT transid, orderlist FROM sp_transaction WHERE user_id = ? AND operation = 'FINISH' ORDER BY updated_at DESC",
            [user_id]
        );

        if (rows.length > 0) {
            const orders = rows.map(row => ({
                transid: row.transid,
                orderlist: JSON.parse(row.orderlist)
            }));

            res.status(200).json({ RespCode: 200, Orders: orders });
        } else {
            res.status(404).json({ RespCode: 404, RespMessage: "No FINISH orders found" });
        }
    } catch (error) {
        res.status(500).json({ RespCode: 500, RespMessage: "Server error", Error: error.message });
    }
});

///
app.get("/get-orders-to-cancel/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;

        // ดึงรายการที่ต้องจัดส่ง (operation = "CANCEL")
        const [rows] = await db.query(
            "SELECT transid, orderlist FROM sp_transaction WHERE user_id = ? AND operation = 'CANCEL' ORDER BY updated_at DESC",
            [user_id]
        );

        if (rows.length > 0) {
            const orders = rows.map(row => ({
                transid: row.transid,
                orderlist: JSON.parse(row.orderlist)
            }));

            res.status(200).json({ RespCode: 200, Orders: orders });
        } else {
            res.status(404).json({ RespCode: 404, RespMessage: "No CANCEL orders found" });
        }
    } catch (error) {
        res.status(500).json({ RespCode: 500, RespMessage: "Server error", Error: error.message });
    }
});

/////////////////////////

app.post('/order', (req, res) => {
    const { user_id, fullname, phone, address, zipcode } = req.body;

    console.log('Received data:', req.body);  // ✅ ตรวจสอบข้อมูลที่รับมา

    // ✅ SQL เพิ่ม user_id ด้วย
    const sql = 'INSERT INTO sp_order (user_id, fullname, phone, address, zipcode) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [user_id, fullname, phone, address, zipcode], (err, result) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', err);
            return res.status(500).json({ RespCode: 500, RespMessage: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
        }
        console.log('บันทึกข้อมูลสำเร็จ!');
        res.status(200).json({ RespCode: 200, RespMessage: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว' });
    });
});

app.get("/get-sp_transection/:user_id/:transid", async (req, res) => {
    try {
        const { user_id, transid } = req.params;

        const [rows] = await db.query(
            "SELECT transid, netamount FROM sp_transaction WHERE user_id = ? AND transid = ?",
            [user_id, transid]
        );

        if (rows.length > 0) {
            res.status(200).json({
                RespCode: 200,
                TransactionID: rows[0].transid,
                NetAmount: rows[0].netamount
            });
        } else {
            res.status(404).json({ RespCode: 404, RespMessage: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ RespCode: 500, RespMessage: "Server error", Error: error.message });
    }
});


////////////////////////

app.get("/get-latest-transaction1/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;

        // 🔥 ค้นหาข้อมูลคำสั่งซื้อ (transaction) ล่าสุดของ user นั้น
        const [rows] = await db.query(
            "SELECT transid, netamount FROM sp_transaction WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
            [user_id]
        );

        if (rows.length > 0) {
            const transaction = rows[0];
            res.status(200).json({ RespCode: 200, TransID: transaction.transid, NetAmount: transaction.netamount });
        } else {
            res.status(404).json({ RespCode: 404, RespMessage: "No transactions found" });
        }
    } catch (error) {
        res.status(500).json({ RespCode: 500, RespMessage: "Server error", Error: error.message });
    }
});
////

app.put("/update-transaction-status/:transid", async (req, res) => {
    try {
        const { transid } = req.params;

        // ✅ อัปเดตสถานะเป็น WAIT
        const [result] = await db.query(
            "UPDATE sp_transaction SET operation = 'WAIT' WHERE transid = ?",
            [transid]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({
                RespCode: 200,
                RespMessage: "Transaction updated to WAIT"
            });
        } else {
            res.status(400).json({
                RespCode: 400,
                RespMessage: "Transaction not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            RespCode: 500,
            RespMessage: "Server error",
            Error: error.message
        });
    }
});

// 📌 เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
