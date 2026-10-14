async function fetchAllLongIdsAndSendToSheet() {
  // web url google app script
  const WEB_APP_URL =
    "----------------------------------";

  // api url
  const API_URL =
    "https://ddd.thailandpost.co.th/api/backend/orders/filter?lang=th";

  // Token
  const MY_TOKEN = "-------- ใส่ token --------";

  const groupId = "----------------------------------";

  console.log("🚀 เริ่มกระบวนการดึงข้อมูลรหัสยาวจาก API...");

  let allLongIds = new Set();
  let currentPage = 1;
  const pageSize = 20;
  let hasMoreData = true;

  while (hasMoreData) {
    console.log(`กำลังดึงข้อมูลหน้า ${currentPage}...`);

    const payload = {
      orderGroupObjectIds: [groupId],
      pagination: {
        page: currentPage,
        pageSize: pageSize,
        countMode: "bounded",
      },
      state: ["InReview"],
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          authorization: MY_TOKEN,
          "content-type": "application/json",
          accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error(`API Error Status: ${res.status} หน้า ${currentPage}`);
        break;
      }

      const responseData = await res.json();

      const items = responseData.documents || [];

      let newIdsFound = 0;

      items.forEach((item) => {
        if (item._id && !allLongIds.has(item._id)) {
          allLongIds.add(item._id);
          newIdsFound++;
        }
      });

      console.log(
        `หน้า ${currentPage}: พบรหัสใหม่ ${newIdsFound} รายการ (รวมทั้งหมด ${allLongIds.size})`,
      );

      if (responseData.pageInfo && responseData.pageInfo.hasNextPage) {
        currentPage++;
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        hasMoreData = false;
        console.log("ดึงข้อมูลครบทุกหน้าแล้ว!");
      }
    } catch (error) {
      console.error(`เกิดข้อผิดพลาดในการดึงหน้า ${currentPage}:`, error);
      break;
    }
  }

  const finalIdsArray = Array.from(allLongIds);

  if (finalIdsArray.length > 0) {
    console.log(
      `กำลังส่งรหัสยาวทั้งหมด ${finalIdsArray.length} รายการเข้า Google Sheet...`,
    );
    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ ids: finalIdsArray }),
      });
      console.log("ส่งข้อมูลเข้า Sheet เรียบร้อยแล้ว!");
    } catch (err) {
      console.error("Error sending to sheet:", err);
    }
  } else {
    console.log("ไม่มีรหัสใหม่ที่จะส่งเข้า Sheet");
  }
}

// สั่งรัน
fetchAllLongIdsAndSendToSheet();
