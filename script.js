const tableBody = document.getElementById("tableBody");

const grandExpense = document.getElementById("grandExpense");
const grandDeposit = document.getElementById("grandDeposit");
const grandBalance = document.getElementById("grandBalance");

const addRowBtn = document.getElementById("addRow");
const clearBtn = document.getElementById("clearBtn");
const printBtn = document.getElementById("printBtn");

//==============================
// Attach Events
//==============================

function attachEvents(row) {
  const inputs = row.querySelectorAll(".amount");

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      calculateRow(row);
      calculateGrandTotal();
    });
  });

  row.querySelector(".deleteRow").addEventListener("click", () => {
    if (tableBody.rows.length > 1) {
      row.remove();
      calculateGrandTotal();
    }
  });
}

attachEvents(tableBody.rows[0]);

//==============================
// Row Calculation
//==============================

function calculateRow(row) {
  const meal = Number(row.querySelector(".meal").value) || 0;

  const rent = Number(row.querySelector(".rent").value) || 0;

  const setup = Number(row.querySelector(".setup").value) || 0;

  const market = Number(row.querySelector(".market").value) || 0;

  const others = Number(row.querySelector(".others").value) || 0;

  const totalExpense = meal + rent + setup;

  const totalDeposit = market + others;

  const balance = totalDeposit - totalExpense;

  row.querySelector(".totalExpense").textContent =
    totalExpense.toLocaleString();

  row.querySelector(".totalDeposit").textContent =
    totalDeposit.toLocaleString();

  const balanceCell = row.querySelector(".balance");

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
// Grand Total
//==============================

function calculateGrandTotal() {
  let expense = 0;
  let deposit = 0;
  let balance = 0;

  tableBody.querySelectorAll("tr").forEach((row) => {
    expense +=
      Number(
        row.querySelector(".totalExpense").textContent.replace(/,/g, ""),
      ) || 0;

    deposit +=
      Number(
        row.querySelector(".totalDeposit").textContent.replace(/,/g, ""),
      ) || 0;

    balance +=
      Number(row.querySelector(".balance").textContent.replace(/,/g, "")) || 0;
  });

  grandExpense.textContent = expense.toLocaleString();

  grandDeposit.textContent = deposit.toLocaleString();

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
// Add Row
//==============================

addRowBtn.addEventListener("click", () => {
  const row = document.createElement("tr");

  row.innerHTML = `

<td class="border p-2">
<input
type="text"
placeholder="নাম"
class="name w-32 border rounded px-2 py-1">
</td>

<td class="border p-2">
<input
type="number"
min="0"
class="meal amount w-24 border rounded px-2 py-1">
</td>

<td class="border p-2">
<input
type="number"
min="0"
class="rent amount w-24 border rounded px-2 py-1">
</td>

<td class="border p-2">
<input
type="number"
min="0"
class="setup amount w-24 border rounded px-2 py-1">
</td>

<td class="border p-2">
<input
type="number"
min="0"
class="market amount w-24 border rounded px-2 py-1">
</td>

<td class="border p-2">
<input
type="number"
min="0"
class="others amount w-24 border rounded px-2 py-1">
</td>

<td class="border p-2 font-bold totalExpense">0</td>

<td class="border p-2 font-bold totalDeposit">0</td>

<td class="border p-2 font-bold balance text-green-600">0</td>

<td class="border p-2">

<button
class="deleteRow bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
Delete
</button>

</td>

`;

  tableBody.appendChild(row);

  attachEvents(row);
});

//==============================
// Clear
//==============================

clearBtn.addEventListener("click", () => {
  if (confirm("সব তথ্য মুছে ফেলতে চান?")) {
    tableBody.innerHTML = "";

    addRowBtn.click();

    calculateGrandTotal();
  }
});

//==============================
// Print
//==============================

printBtn.addEventListener("click", () => {
  window.print();
});

//==============================
// Initial
//==============================

calculateGrandTotal();
