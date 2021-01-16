const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const addForm = document.getElementById("addForm");
const updateForm = document.getElementById("updateForm");
const addFormContainer = document.getElementById("add-form");
const updateFormContainer = document.getElementById("update-form");

var updateId = 0;

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign (if/else)
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
        ${transaction.text} <span id="value-item">${sign}${Math.abs(
    transaction.amount
  )}</span>
        <button class="delete-btn" onclick="removeTransaction(${
          transaction.id
        })">x</button>
        <button style = "background-color: #e7e7e7; color: black;"
        class="edit-btn" id="edit-btn-${
          transaction.id
        }" onclick="showEditTransaction(${transaction.id})">Edit</button>
    `;

  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts
    .reduce((accumulator, item) => (accumulator += item), 0)
    .toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((accumulator, item) => (accumulator += item), 0)
    .toFixed(2);

  const expense = (
    amounts
      .filter((item) => item < 0)
      .reduce((accumulator, item) => (accumulator += item), 0) * -1
  ).toFixed(2);

  balance.innerText = `£${total}`;
  money_plus.innerText = `£${income}`;
  money_minus.innerText = `£${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id != id);

  updateLocalStorage();

  init();
}

// Edit transaction by ID
function showEditTransaction(id) {
  edit_btn = document.getElementById("edit-btn-" + id);

  // Display edit form on/off & update styling of button
  if (updateFormContainer.style.display == "none") {
    updateFormContainer.style.display = "block";
    addFormContainer.style.display = "none";
    for (i = 0; i < transactions.length; i++) {
      if (transactions[i].id === id) {
        edit_btn.innerText = "Cancel";
        edit_btn.style = "background-color: #c0392b; color: #fff;";
      }
    }
  } else {
    updateFormContainer.style.display = "none";
    addFormContainer.style.display = "block";
    for (i = 0; i < transactions.length; i++) {
      if (transactions[i].id === id) {
        edit_btn.innerText = "Edit";
        edit_btn.style = "background-color: #e7e7e7; color: black;";
      }
    }
  }

  updateId = id;
  return updateId;
}

function updateEditValue() {
  userInputAmount = parseInt(document.getElementById("update-amount").value);
  userInputText = document.getElementById("update-text").value;

  for (i = 0; i < transactions.length; i++) {
    if (transactions[i].id === updateId) {
      transactions[i].amount = userInputAmount;
      transactions[i].text = userInputText;
    }
  }

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

// Event listener
addForm.addEventListener("submit", addTransaction);
updateForm.addEventListener("submit", updateEditValue);
