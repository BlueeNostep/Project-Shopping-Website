
let timeLeft = 3600;
function startCountdown() {
    const countdownElement = document.getElementById("countdown");
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            countdownElement.textContent = "หมดเวลา";
            alert("เวลาหมด! กรุณาดำเนินการใหม่");
        }
    }, 1000);
}

startCountdown();

const user = JSON.parse(localStorage.getItem("user"));
console.log(user.id);
const user_id = user.id;

document.querySelector("#btn-pay").addEventListener("click", function(event) {
    event.preventDefault();

    Swal.fire({
        title: "ยืนยันการชำระเงิน?",
        text: "โปรดยืนยันว่าคุณต้องการดำเนินการชำระเงิน",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "ชำระเงิน",
        cancelButtonText: "ยกเลิก"
    }).then((result) => {
        if (result.isConfirmed) {
            // 📌 ดึง transid จากหน้าเว็บ
            const transid = document.getElementById("transid").textContent;

            // ✅ อัปเดต operation เป็น "WAIT"
            fetch(`http://localhost:3000/update-transaction-status/${transid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.RespCode === 200) {
                    Swal.fire({
                        title: "สำเร็จ!",
                        text: "คุณได้ทำการชำระเงินเรียบร้อยแล้ว",
                        icon: "success",
                        confirmButtonColor: "#28a745",
                        confirmButtonText: "ตกลง"
                    }).then(() => {
                        window.location.href = "indexbackup1.html";
                    });
                } else {
                    Swal.fire("เกิดข้อผิดพลาด", data.RespMessage, "error");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง", "error");
            });
        }
    });
});

document.getElementById("back").addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "order.html";
});

document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user.id;

    fetch(`http://localhost:3000/get-latest-transaction1/${user_id}`)
        .then(response => response.json())
        .then(data => {
            if (data.RespCode === 200) {
                console.warn(data.TransID,data.NetAmount);
                document.getElementById("transid").textContent = data.TransID;
                document.getElementById("total-amount").textContent = `${numberWithCommas(data.NetAmount)} บาท`;
            } else {
                console.warn("ไม่พบคำสั่งซื้อ");
            }
        })
        .catch(error => console.error("เกิดข้อผิดพลาด:", error));
});

// 📌 ฟังก์ชันจัดรูปแบบตัวเลขให้มี `,`
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
