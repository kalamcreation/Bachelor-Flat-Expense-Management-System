const tableBody = document.getElementById("tableBody");
const grandExpense = document.getElementById("grandExpense");
const grandDeposit = document.getElementById("grandDeposit");
const grandBalance = document.getElementById("grandBalance");

const addRowBtn = document.getElementById("addRow");
const clearBtn = document.getElementById("clearBtn");
const printBtn = document.getElementById("printBtn");

const totalMarket = document.getElementById("totalMarket");
const totalMeal = document.getElementById("totalMeal");
const mealRate = document.getElementById("mealRate");
const totalSetup = document.getElementById("totalSetup");
const setupPerPerson = document.getElementById("setupPerPerson");

//==============================
// LocalStorage Save & Load
//==============================
function saveData() {
  const rows = [];
  tableBody.querySelectorAll("tr").forEach((row) => {
    rows.push({
      name: row.querySelector(".name").value,
      mealQty: row.querySelector(".mealQty").value,
      rent: row.querySelector(".rent").value,
      setup: row.querySelector(".setup").value,
      market: row.querySelector(".market").value,
      others: row.querySelector(".others").value,
    });
  });

  const appData = {
    totalMarket: totalMarket.value,
    totalMeal: totalMeal.value,
    totalSetup: totalSetup.value,
    rows: rows,
  };

  localStorage.setItem("bachelorExpenseData", JSON.stringify(appData));
}

function loadData() {
  const saved = localStorage.getItem("bachelorExpenseData");
  if (saved) {
    const data = JSON.parse(saved);
    totalMarket.value = data.totalMarket || "";
    totalMeal.value = data.totalMeal || "";
    totalSetup.value = data.totalSetup || "";

    calculateSummary();

    tableBody.innerHTML = "";
    if (data.rows && data.rows.length > 0) {
      data.rows.forEach((rowData) => {
        addRow(rowData);
      });
    } else {
      addRow();
    }
  } else {
    addRow();
  }
  calculateGrandTotal();
}

//==============================
// Attach Events to Row
//==============================
function attachEvents(row) {
  const inputs = row.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      calculateRow(row);
      calculateGrandTotal();
      saveData();
    });
  });

  row.querySelector(".deleteRow").addEventListener("click", () => {
    if (tableBody.rows.length > 1) {
      row.remove();
      updateSetupPerPerson();
      calculateGrandTotal();
      saveData();
    } else {
      alert("কমপক্ষে একজন সদস্য থাকা আবশ্যক!");
    }
  });
}

//==============================
// Row Calculation
//==============================
function calculateRow(row) {
  const rate = Number(mealRate.value) || 0;
  const mealQty = Number(row.querySelector(".mealQty").value) || 0;
  
  const mealCost = mealQty * rate;
  row.querySelector(".mealCost").value = mealCost.toFixed(2);

  const rent = Number(row.querySelector(".rent").value) || 0;
  const setup = Number(row.querySelector(".setup").value) || 0;
  const market = Number(row.querySelector(".market").value) || 0;
  const others = Number(row.querySelector(".others").value) || 0;

  const totalExpense = mealCost + rent + setup;
  const totalDeposit = market + others;
  
  // মূল ব্যালেন্স হিসাব
  let rawBalance = totalDeposit - totalExpense;
  
  // আপনার শর্ত অনুযায়ী দশমিক .৫ বা তার বেশি হলে পরের পূর্ণসংখ্যা, কম হলে আগের পূর্ণসংখ্যা
  let balance = Math.round(rawBalance);

  row.querySelector(".totalExpense").textContent = totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  row.querySelector(".totalDeposit").textContent = totalDeposit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

  const balanceCell = row.querySelector(".balance");
  // ব্যালেন্স এখন পূর্ণসংখ্যা হিসেবে দেখাবে
  balanceCell.textContent = balance.toLocaleString();

  if (balance >= 0) {
    balanceCell.classList.remove("text-red-600");
    balanceCell.classList.add("text-green-600");
  } else {
    balanceCell.classList.remove("text-green-600");
    balanceCell.classList.add("text-red-600");
  }
}

//==============================
// Grand Total Calculation
//==============================
function calculateGrandTotal() {
  let expense = 0;
  let deposit = 0;
  let balance = 0;

  tableBody.querySelectorAll("tr").forEach((row) => {
    expense += Number(row.querySelector(".totalExpense").textContent.replace(/,/g, "")) || 0;
    deposit += Number(row.querySelector(".totalDeposit").textContent.replace(/,/g, "")) || 0;
    balance += Number(row.querySelector(".balance").textContent.replace(/,/g, "")) || 0;
  });

  grandExpense.textContent = expense.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  grandDeposit.textContent = deposit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  grandBalance.textContent = balance.toLocaleString();

  if (balance >= 0) {
    grandBalance.classList.remove("text-red-600");
    grandBalance.classList.add("text-green-600");
  } else {
    grandBalance.classList.remove("text-green-600");
    grandBalance.classList.add("text-red-600");
  }
}

//==============================
// Add Row Function
//==============================
function addRow(data = {}) {
  const row = document.createElement("tr");
  row.className = "border";

  row.innerHTML = `
    <td class="border p-2">
      <input type="text" placeholder="নাম" value="${data.name || ''}" class="name w-32 border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
    </td>
    <td class="border p-2">
      <input type="number" min="0" placeholder="0" value="${data.mealQty || ''}" class="mealQty w-20 border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
    </td>
    <td class="border p-2">
      <input type="text" readonly placeholder="0" class="mealCost w-24 bg-gray-100 border rounded px-2 py-1 font-semibold text-gray-700">
    </td>
    <td class="border p-2">
      <input type="number" min="0" placeholder="0" value="${data.rent || ''}" class="rent w-24 border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
    </td>
    <td class="border p-2">
      <input type="number" min="0" placeholder="0" value="${data.setup || ''}" class="setup w-24 border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
    </td>
    <td class="border p-2">
      <input type="number" min="0" placeholder="0" value="${data.market || ''}" class="market w-24 border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
    </td>
    <td class="border p-2">
      <input type="number" min="0" placeholder="0" value="${data.others || ''}" class="others w-24 border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
    </td>
    <td class="border p-2 font-bold totalExpense">0</td>
    <td class="border p-2 font-bold totalDeposit">0</td>
    <td class="border p-2 font-bold balance text-green-600">0</td>
    <td class="border p-2 no-print">
      <button class="deleteRow bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">Delete</button>
    </td>
  `;

  tableBody.appendChild(row);
  attachEvents(row);
  updateSetupPerPerson();
  calculateRow(row);
  calculateGrandTotal();
}

//==============================
// Monthly Summary Calculation
//==============================
function calculateSummary() {
  let market = Number(totalMarket.value) || 0;
  let meal = Number(totalMeal.value) || 0;

  if (meal > 0) {
    mealRate.value = (market / meal).toFixed(2);
  } else {
    mealRate.value = "0.00";
  }

  updateSetupPerPerson();
  
  tableBody.querySelectorAll("tr").forEach((row) => {
    calculateRow(row);
  });
  calculateGrandTotal();
}

function updateSetupPerPerson() {
  let setupTotal = Number(totalSetup.value) || 0;
  let perPersonSetup = setupTotal / 7; 
  setupPerPerson.value = perPersonSetup.toFixed(2);

  tableBody.querySelectorAll("tr").forEach((row) => {
    row.querySelector(".setup").value = perPersonSetup.toFixed(2);
    calculateRow(row);
  });
}

// Event Listeners for Summary Inputs
totalMarket.addEventListener("input", () => { calculateSummary(); saveData(); });
totalMeal.addEventListener("input", () => { calculateSummary(); saveData(); });
totalSetup.addEventListener("input", () => { calculateSummary(); saveData(); });

addRowBtn.addEventListener("click", () => {
  addRow();
  saveData();
});

clearBtn.addEventListener("click", () => {
  if (confirm("সব তথ্য মুছে ফেলতে চান?")) {
    localStorage.removeItem("bachelorExpenseData");
    tableBody.innerHTML = "";
    totalMarket.value = "";
    totalMeal.value = "";
    totalSetup.value = "";
    mealRate.value = "";
    setupPerPerson.value = "";
    addRow();
    calculateGrandTotal();
  }
});

printBtn.addEventListener("click", () => {
  window.print();
});

loadData();