# 📌 Pakmood Data Scraper & Auto-Approve

สคริปต์สำหรับการดึงข้อมูล (Scraping) และอนุมัติข้อมูล (Approve) บนเว็บไซต์ Pakmood โดยอัตโนมัติผ่าน Browser Console

---

## 🚀 วิธีการใช้งาน (How to Use)

กรุณาทำตามขั้นตอนด้านล่างเพื่อดึง Token และรันสคริปต์

### ส่วนที่ 1: การดึง Authorization Token

**1. เปิดเว็บไซต์ Pakmood**
เข้าไปที่หน้าเว็บเพจของ Pakmood ที่ต้องการดึงข้อมูล
<img width="800" alt="Step 1" src="https://github.com/user-attachments/assets/e6e645b2-0fc8-4547-85f6-6cc21d7ef780" />

**2. เปิด Developer Tools**
กดปุ่ม `F12` บนคีย์บอร์ด เลือกแท็บ **Network** จากนั้นให้กด Refresh (`F5`) หน้าเว็บอีกครั้ง
<img width="800" alt="Step 2" src="https://github.com/user-attachments/assets/c28bfa4f-ef87-44f8-bace-6c03b42e66ea" />

**3. ค้นหา Request**
ในช่องกรองข้อมูล (Filter) ให้พิมพ์หาคำว่า `filter?lang=th`
<img width="800" alt="Step 3" src="https://github.com/user-attachments/assets/7bbd42fd-89c3-4e32-9cd8-f70224573bdf" />

**4. คัดลอก Token**
คลิกที่ Request ที่ค้นเจอ เลื่อนลงมาหาหัวข้อ **Request Headers** > **Authorization** แล้วทำการคัดลอกโค้ด Token ทั้งหมดเอาไว้
<img width="400" alt="Step 4" src="https://github.com/user-attachments/assets/cd160d9d-0bea-479c-a6ec-7a28c2bd4782" />

---

### ส่วนที่ 2: การรันสคริปต์ดึงข้อมูล (Data Scraping)

**5. ใส่ Token ในไฟล์สคริปต์**
เปิดไฟล์ `1-data-scraping.js` แล้วนำ Token ที่คัดลอกมาไปวางไว้ในเครื่องหมายฟันหนูตรง `"-------- ใส่ token --------"`
<img width="800" alt="Step 5" src="https://github.com/user-attachments/assets/39b371f7-0149-45bc-9102-c0635dcf343c" />

**6. เข้าสู่หน้าจัดการข้อมูล**
ไปที่หน้าเว็บสำหรับดึงข้อมูลบน Pakmood
<img width="800" alt="Step 6" src="https://github.com/user-attachments/assets/db3f6f34-ad8c-455d-9df0-39430f22430f" />

**7. รันคำสั่งดึงข้อมูล**
กด `F12` เพื่อเปิด Console นำโค้ดทั้งหมดจากไฟล์ในข้อ 5 มาวางแล้วกด `Enter` จากนั้นรอจนกว่าสคริปต์จะทำงานเสร็จสิ้น
<img width="800" alt="Step 7" src="https://github.com/user-attachments/assets/fb682d57-071d-4df3-b0dd-65ec398b0ee7" />

---

### ส่วนที่ 3: การรันสคริปต์อนุมัติข้อมูล (Data Approve)

**8. เตรียมสคริปต์อนุมัติ**
เปิดไฟล์ `2-data-approve.js` และนำ Token ตัวเดิมมาวางตรง `"-------- ใส่ token --------"` เช่นเดียวกัน
<img width="800" alt="Step 8" src="https://github.com/user-attachments/assets/dec6df3d-bab0-469e-8bed-ef8c93691f44" />

**9. รันคำสั่งอนุมัติข้อมูล**
นำโค้ดจากไฟล์ในข้อ 8 มาวางในหน้า Console แล้วกด `Enter` ระบบจะทำการอนุมัติอย่างรวดเร็ว (ใช้เวลาไม่ถึง 10 วินาที)
<img width="800" alt="Step 9" src="https://github.com/user-attachments/assets/c9730b5d-2768-4b8b-b0ed-c4f4684ca8e2" />
