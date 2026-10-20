(async function () {

  console.log(
  "%c ✝ S a i n t  S e b a s t i a n ✝ ", 
  "color: #FFFFFF; background-color: #000000; font-family: 'Georgia', serif; font-size: 26px; font-weight: bold; font-style: italic; text-shadow: 0 0 5px #FFFFFF, 0 0 15px #FFD700, 0 0 25px #FFD700, 0 0 40px #FF8C00; padding: 15px; border-top: 2px solid #FFD700; border-bottom: 2px solid #FFD700;"
);
  const sheetUrl = "-------------------------------------/export?format=csv&gid=0";
  let jobIds = [];
  try {
    const response = await fetch(sheetUrl);
    const text = await response.text();

    jobIds = text
      .split("\n")
      .map((row) => row.split(",")[0].trim())
      .filter((val) => val);
    console.log(`ดึงข้อมูลสำเร็จ! พบเลขงานทั้งหมด ${jobIds.length} รายการ`);
  } catch (e) {
    console.error("ดึงข้อมูลจาก Sheet ไม่สำเร็จ", e);
    return;
  }

  if (jobIds.length === 0) return;

  const approveJobAPI = async (jobId) => {
    const url = `https://ddd.thailandpost.co.th/api/backend/orders/${jobId}/approved-survey?lang=th`;

    const myToken = "-------- ใส่ token --------";

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          authorization: myToken,
          accept: "application/json, text/plain, */*",
          origin: "https://ddd.thailandpost.co.th",
          "content-type": "application/json",
        },
      });

      if (res.ok) {
        return { success: true, status: res.status, id: jobId };
      } else {
        return { success: false, status: res.status, id: jobId };
      }
    } catch (err) {
      return { success: false, status: 'Error', id: jobId, error: err };
    }
  };

  console.log(`🚀 กำลังเริ่มยิงคำสั่งอนุมัติแบบจัดกลุ่ม (Batching)...`);

  let successCount = 0;
  let failCount = 0;
  
  // ตั้งค่าความเร็วตรงนี้
  const BATCH_SIZE = 10; 
  const DELAY_BETWEEN_BATCHS = 1000; 

  for (let i = 0; i < jobIds.length; i += BATCH_SIZE) {
    // หั่นข้อมูลมาทีละชุดตาม BATCH_SIZE
    const batch = jobIds.slice(i, i + BATCH_SIZE);
    console.log(`\n กำลังประมวลผลกลุ่มที่ ${Math.floor(i / BATCH_SIZE) + 1} (งานที่ ${i + 1} ถึง ${Math.min(i + BATCH_SIZE, jobIds.length)})...`);

    // ส่งคำสั่งพร้อมกันเฉพาะในกลุ่มนี้
    const promises = batch.map(id => approveJobAPI(id));
    const results = await Promise.all(promises);

    let hasRateLimit = false;

    // เช็คผลลัพธ์ของแต่ละงานในกลุ่ม
    results.forEach((result, index) => {
      const globalIndex = i + index + 1;
      if (result.success) {
        console.log(`[${globalIndex}/${jobIds.length}] อนุมัติสำเร็จ: ${result.id} (Status: ${result.status})`);
        successCount++;
      } else {
        console.error(`[${globalIndex}/${jobIds.length}] อนุมัติล้มเหลว: ${result.id} (Status: ${result.status})`);
        failCount++;
        
        if (result.status === 429) {
          hasRateLimit = true;
        }
      }
    });

    if (hasRateLimit) {
      console.warn("⚠️ เซิร์ฟเวอร์เตือนว่ายิงเร็วเกินไป (429)! พักเบรก 5 วินาที...");
      await new Promise(r => setTimeout(r, 5000));
    } else {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_BATCHS));
    }
  }

  console.log("ดำเนินการเสร็จสิ้นทั้งหมดแล้ว!");
  console.log(`สรุป: สำเร็จ ${successCount} รายการ, ล้มเหลว ${failCount} รายการ`);
})();
