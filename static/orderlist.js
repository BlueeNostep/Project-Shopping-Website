function selectBox(element) {
    // ลบคลาส selected จากทุกกล่อง
    const boxes = document.querySelectorAll('.box1');
    boxes.forEach(box => box.classList.remove('selected'));

    // เพิ่มคลาส selected ให้กับกล่องที่ถูกคลิก
    element.classList.add('selected');
}

function numberWithCommas(x){
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern,"$1,$2");
    return x;
}



document.addEventListener("DOMContentLoaded", function () {
    // เลือกปุ่ม "ที่ต้องชำระ"
    const boxes = document.querySelectorAll(".box1");
    const orderedProduct = document.querySelector(".ordered-product");
    const deliveredorder = document.querySelector(".delivered-order");
    const againorder = document.querySelector(".buyagain-order");
    const canelorder = document.querySelector(".cancel-order");

    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user.id);
    const user_id = user.id;

    boxes.forEach(box => {
        box.addEventListener("click", function () {
            // ซ่อนทุกกล่องก่อน
            document.querySelectorAll('.ordered-product, .delivered-order, .buyagain-order , .cancel-order').forEach(div => {
                div.style.display = "none";
            });

            // ถ้ากดที่ "ที่ต้องชำระ" ให้แสดง ordered-product
            if (this.innerText === "ที่ต้องชำระ") {
                const orderedProduct = document.querySelector(".ordered-product");
                orderedProduct.style.display = "flex";
                orderedProduct.style.flexDirection = "column"; // จัดเรียงแนวตั้ง
                    $.ajax({
                        method: "GET",
                        url: `http://localhost:3000/get-latest-order/${user_id}`,
                        success: function(response) {
                            if (response.TransactionID) {
                                const transid = response.TransactionID;
                                console.log("Latest Transaction ID:", transid);
                                
                                // 🔥 เรียก API ดึง Order List โดยใช้ transid ที่ได้มา
                                $.ajax({
                                    method: "GET",
                                    url: `http://localhost:3000/get-order/${user_id}/${transid}`,
                                    success: function(response) {
                                        if (response.RespCode === 200) {
                                            const orderlist = response.OrderList;
                                            let html = '';
    
                                            orderlist.forEach(product => {
                                                html += `
                                                    <div class="product">
                                                        <img class="product-img" src="./imgs/${product.img}" alt="${product.name}">
                                                        <div class="name-des">
                                                            <p style="font-size: 1.2vw; font-weight: bold;">${product.name}</p>
                                                            <p style="color: gray;">ราคา : ${numberWithCommas(product.price)} บาท</p>
                                                            <p>จำนวน : ${product.count} ชิ้น</p>
                                                        </div>
                                                        <div class="name-des">
 
                                                        </div>
                                                        <div class="container-pay-price">
                                                        <div class="pay-cancle">
                                                                <button onclick="closeModal()" class="btn">
                                                                    ยกเลิกการสั่งซื้อ
                                                                </button>
                                                                <button class="btn btn-buy">
                                                                    <a href="order.html" style="color: white;">ชำระเงิน</a>
                                                                </button>
                                                            </div>
                                                            <p class="price" style="font-size: 1.5vw;">ราคารวม[-vat]: ${numberWithCommas(product.price * product.count)} บาท</p>
                                                        </div> 
                                                    </div>
                                                `;
                                            });
    
                                            $(".ordered-product").html(html).show(); // ✅ แสดงข้อมูลสินค้า
                                        } else {
                                            alert("Order not found");
                                        }
                                    },
                                    error: function(err) {
                                        console.error("Error:", err);
                                    }
                                });
                            } else {
                                console.warn("No latest transaction found.");
                            }
                        },
                        error: function(err) {
                            console.error("Error fetching latest transaction ID:", err);
                        }
                    });
            }
            else if(this.innerText === "ที่ต้องจัดส่ง") {
                deliveredorder.style.display = "flex";
                deliveredorder.style.flexDirection = "column"; // จัดเรียงแนวตั้ง
                ///
                $.ajax({
                    method: "GET",
                    url: `http://localhost:3000/get-orders-to-deliver/${user_id}`,
                    success: function(response) {
                        if (response.RespCode === 200) {
                            let html = '';
                            response.Orders.forEach(order => {
                                let statusText = order.operation === "SHIPPING" ? "กำลังจัดส่ง" : "รอการตรวจสอบ";
                                let statusColor = order.operation === "SHIPPING" ? "rgb(255, 49, 49)" : "orange";
            
                                order.orderlist.forEach(product => {
                                    html += `
                                        <div class="product">
                                            <img class="product-img" src="./imgs/${product.img}" alt="${product.name}">
                                            <div class="name-des">
                                                <p style="font-size: 1.2vw; font-weight: bold;">${product.name}</p>
                                                <p style="color: gray;">ราคา : ${numberWithCommas(product.price)} บาท</p>
                                                <p>จำนวน : ${product.count} ชิ้น</p>
                                                <p style="color: ${statusColor}; font-weight: bold; font-size: 1.2vw;">สถานะ : ${statusText}</p>
                                            </div>
                                            <div class="name-des">
                                             </div>
                                            <div class="container-pay-price">
                                                <div class="pay-cancle">
                                                    <button class="btn paid-buy">ชำระแล้ว</button>
                                                </div>
                                                <p class="price" style="font-size: 1.5vw;">ราคารวม[-vat]: ${numberWithCommas(product.price * product.count)} บาท</p>
                                            </div> 
                                        </div>
                                    `;
                                });
                            });
            
                            $(".delivered-order").html(html).show(); // ✅ แสดงข้อมูลสินค้า
                        } else {
                            alert("No orders found");
                        }
                    },
                    error: function(err) {
                        console.error("Error:", err);
                    }
                });
                // $.ajax({
                //     method: "GET",
                //     url: `http://localhost:3000/get-orders-to-deliver/${user_id}`,
                //     success: function(response) {
                //         if (response.RespCode === 200) {
                //             let html = '';
                //             response.Orders.forEach(order => {
                //                 order.orderlist.forEach(product => {
                //                     html += `
                //                         <div class="product">
                //                             <img class="product-img" src="./imgs/${product.img}" alt="${product.name}">
                //                             <div class="name-des">
                //                                 <p style="font-size: 1.2vw; font-weight: bold;">${product.name}</p>
                //                                 <p style="color: gray;">ราคา : ${numberWithCommas(product.price)} บาท</p>
                //                                 <p>จำนวน : ${product.count} ชิ้น</p>
                //                                 <p style="color: rgb(255, 49, 49); font-weight: bold;">สถานะ : กำลังจัดส่ง</p>
                //                             </div>
                //                             <div class="name-des">
                //                             </div>
                //                             <div class="container-pay-price">
                //                                 <div class="pay-cancle">
                //                                 <button class="btn paid-buy">ชำระแล้ว</button>
                //                                 </div>
                //                                 <p class="price" style="font-size: 1.5vw;">ราคารวม[-vat]: ${numberWithCommas(product.price * product.count)} บาท</p>
                //                             </div> 
                //                         </div>
                //                     `;
                //                 });
                //             });
            
                //             $(".delivered-order").html(html).show(); // ✅ แสดงข้อมูลสินค้า
                //         } else {
                //             alert("No shipping orders found");
                //         }
                //     },
                //     error: function(err) {
                //         console.error("Error:", err);
                //     }
                // });
                ////
            }
            else if(this.innerText === "สำเร็จ") {
                againorder.style.display = "flex";
                againorder.style.flexDirection = "column"; // จัดเรียงแนวตั้ง

                $.ajax({
                    method: "GET",
                    url: `http://localhost:3000/get-orders-to-finish/${user_id}`,
                    success: function(response) {
                        if (response.RespCode === 200) {
                            let html = '';
                            response.Orders.forEach(order => {
                                order.orderlist.forEach(product => {
                                    html += `
                                        <div class="product">
                                            <img class="product-img" src="./imgs/${product.img}" alt="${product.name}">
                                            <div class="name-des">
                                                <p style="font-size: 1.2vw; font-weight: bold;">${product.name}</p>
                                                <p style="color: gray;">ราคา : ${numberWithCommas(product.price)} บาท</p>
                                                <p>จำนวน : ${product.count} ชิ้น</p>
                                                <p style="color: rgb(33, 192, 44);font-size: 1.2vw; font-weight: bold;">สถานะ : จัดส่งสำเร็จ</p>
                                            </div>
                                            <div class="name-des">
                                            </div>
                                            <div class="container-pay-price">
                                                <div class="pay-cancle">
                                                <button class="btn paid-buyagian">ซื้ออีกครั้ง</button>
                                                </div>
                                                <p class="price" style="font-size: 1.5vw;">ราคารวม[-vat]: ${numberWithCommas(product.price * product.count)} บาท</p>
                                            </div> 
                                        </div>
                                    `;
                                });
                            });
            
                            $(".buyagain-order").html(html).show(); // ✅ แสดงข้อมูลสินค้า
                        } else {
                            alert("No finish orders found");
                        }
                    },
                    error: function(err) {
                        console.error("Error:", err);
                    }
                });
            }
            else if(this.innerText === "ยกเลิกแล้ว") {
                canelorder.style.display = "flex";
                canelorder.style.flexDirection = "column"; // จัดเรียงแนวตั้ง

                $.ajax({
                    method: "GET",
                    url: `http://localhost:3000/get-orders-to-cancel/${user_id}`,
                    success: function(response) {
                        if (response.RespCode === 200) {
                            let html = '';
                            response.Orders.forEach(order => {
                                order.orderlist.forEach(product => {
                                    html += `
                                        <div class="product">
                                            <img class="product-img" src="./imgs/${product.img}" alt="${product.name}">
                                            <div class="name-des">
                                                <p style="font-size: 1.2vw; font-weight: bold;">${product.name}</p>
                                                <p style="color: gray;">ราคา : ${numberWithCommas(product.price)} บาท</p>
                                                <p>จำนวน : ${product.count} ชิ้น</p>
                                                <p style="color: rgb(48, 13, 84);font-size: 1.2vw; font-weight: bold;">สถานะ : ยกเลิกแล้ว</p>
                                            </div>
                                            <div class="name-des">
                                            </div>
                                            <div class="container-pay-price">
                                                <div class="pay-cancle">
                                                <button class="btn paid-cancel">สินค้าถูกยกเลิก</button>
                                                </div>
                                                <p class="price" style="font-size: 1.5vw;text-decoration: line-through;">ราคารวม[-vat]: ${numberWithCommas(product.price * product.count)} บาท</p>
                                            </div> 
                                        </div>
                                    `;
                                });
                            });
            
                            $(".cancel-order").html(html).show(); // ✅ แสดงข้อมูลสินค้า
                        } else {
                            alert("No cancel orders found");
                        }
                    },
                    error: function(err) {
                        console.error("Error:", err);
                    }
                });
            }
        });
    });
});
//
document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
        alert("Please login first!");
        window.location.href = "login.html"; // ✅ ถ้าไม่ได้ Login ให้กลับไปหน้า Login
    } else {
        console.log("User Logged In:", user);
        document.getElementById("welcomeMessage").innerText = `Welcome, ${user.username}!`;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const userDisplay = document.getElementById("userDisplay");
    const userData = localStorage.getItem("user");
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user && user.username) {
                console.log("✅ User Logged In:", user.username);
                userDisplay.innerText = user.username; // ✅ แสดงชื่อผู้ใช้
            } else {
                console.log("❌ Username is missing in user data.");
                userDisplay.innerText = "Guest"; // ❌ ถ้าไม่มี username ให้แสดง "Guest"
            }
        } catch (error) {
            console.error("❌ Error parsing user data:", error);
            userDisplay.innerText = "Guest"; // ❌ ถ้า JSON ผิดพลาด ให้แสดง "Guest"
        }
    } else {
        console.log("❌ No user logged in");
        userDisplay.innerText = "Login"; // ❌ ถ้ายังไม่ได้ Login ให้แสดง "Login"
    }
});