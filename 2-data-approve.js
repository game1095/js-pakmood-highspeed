(async function () {
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1RM1CowBCkBChaO8Qhv1kUdc-oxVP51LIf_ChYqvobLA/export?format=csv&gid=0";
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

  console.log(`กำลังเริ่มยิงคำสั่งอนุมัติแบบหน่วงเวลาเพื่อป้องกันการโดนบล็อก...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < jobIds.length; i++) {
    const id = jobIds[i];
    const result = await approveJobAPI(id);

    if (result.success) {
      console.log(`[${i + 1}/${jobIds.length}] อนุมัติสำเร็จ: ${id} (Status: ${result.status})`);
      successCount++;
    } else {
      console.error(`[${i + 1}/${jobIds.length}] อนุมัติล้มเหลว: ${id} (Status: ${result.status})`);
      failCount++;
      
      if (result.status === 429) {
          console.warn("เซิร์ฟเวอร์เตือนว่ายิงเร็วเกินไป! พักเบรก 5 วินาที...");
          await new Promise(r => setTimeout(r, 5000));
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500)); 
  }

  console.log("\n ดำเนินการเสร็จสิ้นทั้งหมดแล้ว!");
  console.log(`สรุป: สำเร็จ ${successCount} รายการ, ล้มเหลว ${failCount} รายการ`);
})();
