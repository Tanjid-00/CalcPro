// Format numbers using Bangladeshi comma system
function formatBDT(amount) {
  return Number(amount).toLocaleString("en-IN");
}
// লোকালস্টোরেজ ফাংশন
function getRecords() {
  return JSON.parse(localStorage.getItem("records")) || [];
}
function saveRecords(data) {
  localStorage.setItem("records", JSON.stringify(data));
}

// ক্যালকুলেটর আপডেট
function updateCalculator() {
  const values = [1000, 500, 200, 100, 50, 20, 10];
  let totals = {};
  let grandTotal = 0;

  values.forEach((v) => {
    const count = parseInt(document.getElementById("count" + v).value) || 0;
    const total = count * v;

    document.getElementById("total" + v).innerText = formatBDT(total);

    totals["c" + v] = count;
    grandTotal += total;
  });

  document.getElementById("grandTotal").innerText = formatBDT(grandTotal);

  totals["total"] = grandTotal;
  return totals;
}
// টেবিল রেন্ডার
function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  const records = getRecords();

  records.forEach((rec, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td class="nameCol">${rec.name}</td>
      <td id=typeCol class="${rec.type === "CW" ? "type-cw" : "type-cd"}">
          ${rec.type}
      </td>
      <td>${rec.c1000}</td>
      <td>${rec.c500}</td>
      <td>${rec.c200}</td>
      <td>${rec.c100}</td>
      <td>${rec.c50}</td>
      <td>${rec.c20}</td>
      <td>${rec.c10}</td>
      <td class="totalMoney">${formatBDT(rec.total)}</td>
      <td><button class="deleteBtn" data-index="${index}">✖</button></td>
    `;
    tbody.appendChild(row);
    // <td>${rec.type}</td> this part is changed above after rec.name
  });

  // প্রতিটি delete বাটনের জন্য event listener
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      deleteRecord(idx);
    });
  });
}

// নির্দিষ্ট transaction ডিলিট করার ফাংশন
function deleteRecord(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    const records = getRecords();
    records.splice(index, 1); // index অনুযায়ী মুছে ফেলা
    saveRecords(records);
    renderTable(); // টেবিল রিফ্রেশ
  }
}

// Save
document.getElementById("saveBtn").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim();
  const deposit = document.getElementById("deposit").checked;
  const withdraw = document.getElementById("withdraw").checked;

  if (!name) {
    alert("Please enter a name!");
    return;
  }
  if (!deposit && !withdraw) {
    alert("Please select Deposit or Withdraw!");
    return;
  }

  const type = deposit ? "CD" : "CW";
  const calcData = updateCalculator();

  if (calcData.total === 0) {
    alert("Please enter money counts!");
    return;
  }

  // Bangladesh time (only time)
  const now = new Date();
  const bangladeshTime = now.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const records = getRecords();
  records.push({
    name,
    type,
    ...calcData,
    bdTime: bangladeshTime, // শুধু সময়
  });

  saveRecords(records);
  renderTable();

  // রিসেট
  document.getElementById("nameInput").value = "";
  document.getElementById("deposit").checked = false;
  document.getElementById("withdraw").checked = false;
  [1000, 500, 200, 100, 50, 20, 10].forEach((v) => {
    document.getElementById("count" + v).value = "";
    document.getElementById("total" + v).innerText = "0";
  });
  document.getElementById("grandTotal").innerText = "0";
});

// Delete All
document.getElementById("deleteAllBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all records?")) {
    localStorage.removeItem("records");
    renderTable();
  }
});

// Download PDF (টেবিল ফরম্যাটে + Date + Bangladesh Time)
document.getElementById("downloadBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const records = getRecords();

  // টপে Date (Bangladesh time)
  const todayBD = new Date().toLocaleDateString("en-GB", {
    timeZone: "Asia/Dhaka",
  });

  doc.setFontSize(15); // 16pt font size
  doc.text("Transactions Report", 14, 15);

  doc.setFontSize(12); // 16pt font size
  doc.text("Date: " + todayBD, 14, 22);

  const tableData = records.map((rec, i) => [
    i + 1,
    rec.name,
    rec.type,
    rec.c1000,
    rec.c500,
    rec.c200,
    rec.c100,
    rec.c50,
    rec.c20,
    rec.c10,
    formatBDT(rec.total),
    rec.bdTime || "N/A", // Bangladesh time কলাম
  ]);

  doc.autoTable({
    head: [
      [
        "Index",
        "Name",
        "Type",
        "1000",
        "500",
        "200",
        "100",
        "50",
        "20",
        "10",
        "Grand Total",
        "Time",
      ],
    ],
    body: tableData,
    startY: 35,
    headStyles: {
      fillColor: [52, 152, 219], // green header
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0], // border color
      lineWidth: 0.5, // border thickness
    },
    bodyStyles: {
      textColor: [0, 0, 0], // black text
      lineColor: [0, 0, 0], // black border
      lineWidth: 0.5, // border thickness
    },
    theme: "grid", // ensures borders are shown around cells
  });

  doc.save("transactions.pdf");
});

// ইভেন্ট লিসেনার
[1000, 500, 200, 100, 50, 20, 10].forEach((v) => {
  document
    .getElementById("count" + v)
    .addEventListener("input", updateCalculator);
});

// পেজ লোডে
window.onload = () => {
  renderTable();
  updateCalculator();
};
// telephone
