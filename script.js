const expenseContainer = document.querySelector(".expenses");
const createExpenseModal = document.querySelector("#create-expense-modal");
const editBudgetModal = document.querySelector("#add-budget-container");
const updateExpenseModal = document.querySelector("#update-expense-container");
const deleteConfirmationModal = document.querySelector(
  "#delete-confirmation-modal"
);
const addBtn = document.querySelector("#add-btn");
const closeBtn = document.querySelector("#close-btn");
const createBtn = document.querySelector("#create-btn");
const cancelBtn = document.querySelector("#cancel-btn");
const setBudgetBtn = document.querySelector("#set-budget-btn");
const toggleEditBudgetBtn = document.querySelector("#edit-btn");

let budget = 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let setBudget = parseFloat(localStorage.getItem("budget")) || 0;
let expenseTotal = expenses.reduce(
  (acc, expense) => acc + parseFloat(expense.cost),
  0
);

// Render Expenses
const renderExpenses = () => {
  expenseContainer.innerHTML = "";

  expenses.forEach((expense) => {
    const newExpense = document.createElement("div");

    newExpense.innerHTML = `
      <div class="expense">
        <h3 id="name">${expense.name}</h3>
        <h3 id="cost">$${expense.cost}</h3>
        <div class="options">
          <button class="edit-btn" data-id="${expense.id}">Edit</button>
          <button class="delete-btn" data-id="${expense.id}">Delete</button>
        </div>
      </div>`;

    expenseContainer.appendChild(newExpense);
  });

  document.querySelector(
    ".all-expenses"
  ).innerText = `All Expenses (${expenses.length})`;

  console.log("Set Budget", setBudget);
  console.log("Expense", expenseTotal);
  console.log("Budget", budget);

  document.querySelector("#budget").innerText = `${budget}`;

  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (e) => {
      const idToDelete = e.target.getAttribute("data-id");
      handleDelete(idToDelete);
      console.log(idToDelete);
    });
  });

  const editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", (e) => {
      const idToEdit = e.target.getAttribute("data-id");
      handleEdit(idToEdit);
      console.log(idToEdit);
    });
  });
};

// Delete Expense
const handleDelete = (id) => {
  const confirmDelete = document.querySelector("#confirm-delete-btn");

  deleteConfirmationModal.style.display = "block";
  updateExpenseModal.style.display = "none";
  editBudgetModal.style.display = "none";

  confirmDelete.addEventListener("click", () => {
    const expIndex = expenses.findIndex((exp) => exp.id === Number(id));
    if (expIndex !== -1) {
      budget += parseFloat(expenses[expIndex].cost);
      expenses.splice(expIndex, 1);
      deleteConfirmationModal.style.display = "none";
      renderExpenses();
      saveExpensesToLocalStorage();
    }
  });
};

// Edit Expense
const handleEdit = (id) => {
  const updateBtn = document.querySelector("#update-expense-btn");

  updateExpenseModal.style.display = "block";
  deleteConfirmationModal.style.display = "none";
  editBudgetModal.style.display = "none";

  const expIndex = expenses.findIndex((exp) => exp.id === Number(id));

  const nameInput = document.querySelector("#edit-expense-name");
  const costInput = document.querySelector("#edit-expense-cost");

  nameInput.value = expenses[expIndex].name;
  costInput.value = expenses[expIndex].cost;

  updateBtn.addEventListener("click", () => {
    const newName = nameInput.value;
    const newCost = costInput.value;

    if (expIndex !== -1) {
      budget += parseFloat(expenses[expIndex].cost);
      expenses[expIndex].name = newName;
      expenses[expIndex].cost = newCost;
      budget -= parseFloat(newCost);

      saveExpensesToLocalStorage();
      renderExpenses();
    }

    updateExpenseModal.style.display = "none";
  });
};

// Edit Budget
const updateBudget = () => {
  let displayBudget = document.querySelector("#budget");
  let newBudget = document.querySelector("#new-budget");

  displayBudget.innerText = newBudget.value;
  budget = newBudget.value;
  newBudget.value = "";
  editBudgetModal.style.display = "none";
};

// Create Expense
createBtn.addEventListener("click", () => {
  let costInput = document.querySelector("#cost-input").value;
  let nameInput = document.querySelector("#name-input").value;

  if (costInput.length > 0 || nameInput.length > 0) {
    expenses.push({
      id: Math.random() * 100,
      cost: costInput,
      name: nameInput,
    });

    createExpenseModal.style.display = "none";
    budget -= parseFloat(costInput);
    renderExpenses();
    document.querySelector("#cost-input").value = "";
    document.querySelector("#name-input").value = "";
  }
  saveExpensesToLocalStorage();
});

const toggleSetBudgetModal = () => {
  if (editBudgetModal.style.display === "block") {
    editBudgetModal.style.display = "none";
  } else {
    editBudgetModal.style.display = "block";
  }
  updateExpenseModal.style.display = "none";
  deleteConfirmationModal.style.display = "none";
};

// Event Listeners
addBtn.addEventListener("click", () => {
  createExpenseModal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  createExpenseModal.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  deleteConfirmationModal.style.display = "none";
});

setBudgetBtn.addEventListener("click", () => {
  updateBudget();
  saveExpensesToLocalStorage();
});

toggleEditBudgetBtn.addEventListener("click", () => {
  toggleSetBudgetModal();
});

// Save Changes
const saveExpensesToLocalStorage = () => {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("budget", JSON.stringify(budget));
};

window.addEventListener("DOMContentLoaded", () => {
  expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  budget = parseFloat(localStorage.getItem("budget")) || 0;
  renderExpenses();
});
