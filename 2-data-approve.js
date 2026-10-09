(async function () {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1RM1CowBCkBChaO8Qhv1kUdc-oxVP51LIf_ChYqvobLA/export?format=csv&gid=0";
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

    // ใส่ token
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
        console.log(
          `✅ อนุมัติงาน ID: ${jobId} สำเร็จ (Status: ${res.status})`,
        );
      } else {
        console.error(
          `❌ อนุมัติงาน ID: ${jobId} ไม่สำเร็จ! (Status: ${res.status})`,
        );
      }
    } catch (err) {
      console.error(`Error ยิง API งาน ${jobId}:`, err);
    }
  };

  console.log(`กำลังส่งคำสั่งอนุมัติพร้อมกัน...`);

  await Promise.all(jobIds.map((id) => approveJobAPI(id)));

  console.log("🎉 ดำเนินการเสร็จสิ้นทั้งหมดแล้ว! ลองรีเฟรชหน้าเว็บดูครับ");
})();
