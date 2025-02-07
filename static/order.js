
// $(document).ready(()=>{

//     $.ajax({
//         method: "POST",
//         url: "http://localhost:3000/calculate-price", // ✅ ใช้ URL ที่ถูกต้อง
//         contentType: "application/json", // ✅ แจ้งว่าเป็น JSON
//         data: JSON.stringify({

//         }),
//         success: function(response) {
//             console.log("Response:", response);
//             if(response.RespCode == 200){
//                     html: 
//                             `<h3 id="product-name"><strong>${response.orderlist} </strong></h3><br>
//                             <p class="price">ราคารวม : ${response.NetAmount} บาท</p></br>`,
//             }$("#productlist").html(html);
//         }
//     })
// })


document.getElementById("cancel-btn").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "indexbackup1.html"; // เปลี่ยนไปหน้า payment.html
});

const user = JSON.parse(localStorage.getItem("user"));
console.log(user.id);
const user_id = user.id;

document.getElementById('pay-btn').addEventListener('click', function(event) {
    event.preventDefault(); // ป้องกันการกดปุ่มโดยตรง
    window.location.href = "payment.html"; // เปลี่ยนไปหน้า payment.html
    const fullname = document.getElementById('fullname').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const zipcode = document.getElementById('zipcode').value;

    // ตรวจสอบว่าไม่มีช่องใดว่าง
    if (!fullname || !phone || !address || !zipcode) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
        return;  // หยุดการทำงานหากมีช่องที่ว่าง
    }

    // ข้อมูลไม่ว่างแล้ว ให้ส่งข้อมูลไปยังเซิร์ฟเวอร์
    const data = { user_id, fullname, phone, address, zipcode };
    
    console.log("ส่งข้อมูลไปยังเซิร์ฟเวอร์:", data); // ตรวจสอบว่าเราได้รับข้อมูลถูกต้อง

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/order", // ตรวจสอบ URL ให้ตรง
        contentType: "application/json",
        data: JSON.stringify(data),
        
        success: function(response) {
            
            alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
            console.log(response);
            // เมื่อข้อมูลถูกบันทึกสำเร็จให้ไปหน้า payment.html
           
        },
        error: function(error) {
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            console.log(error);
        }
    });
});



 