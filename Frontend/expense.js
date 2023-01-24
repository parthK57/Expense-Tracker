const submitBtn = document.querySelector("#submit");
const email = sessionStorage.getItem("email");
const password = sessionStorage.getItem("password");

// Submitting Details
submitBtn.addEventListener("click", submitDetails);

function submitDetails(e) {
  e.preventDefault();
  const money = document.querySelector("#money").value;
  const description = document.querySelector("#description").value;
  const category = document.querySelector("#category").value;

  if (email == null || password == null) {
    alert("You need to login first!");
    window.location.href = "http://127.0.0.1:5500/Frontend/login.html";
  }

  const postExpense = async () => {
    try {
      const res = await axios.post("http://localhost:5000/postexpense", {
        email: email,
        password: password,
        money: money,
        description: description,
        category: category,
      });
      const timestamp = res.data[0].timestamp;

      write(money, description, category, timestamp);
    } catch (error) {
      console.log(error);
    }
  };
  postExpense();
}

// CARDS FUNCTION
function write(money, description, category, timestamp) {
  const expenseList = document.querySelector("#expense-list");
  const card = document.createElement("div");
  const cardHeader = document.createElement("div");
  const cardBody = document.createElement("div");
  const amountSpan = document.createElement("span");
  const descriptionSpan = document.createElement("span");
  const categorySpan = document.createElement("span");
  const timestampSpan = document.createElement("span");
  const deleteBtn = document.createElement("button");

  //COMMON STUFF
  deleteBtn.className = "btn btn-danger";
  deleteBtn.setAttribute("id", "delete-btn");
  deleteBtn.innerText = "Delete";
  // Delete Functionality
  deleteBtn.addEventListener("click", deleteExpense);
  function deleteExpense() {
    const deleteCard = async () => {
      const res = await axios.post("http://localhost:5000/deleteexpense", {
        email: email,
        password: password,
        money: money,
        timestamp: timestamp,
        category: category,
      });
      if (res.status == 200) {
        expenseList.removeChild(card);
      }
    };
    deleteCard();
  }

  if (category == "Credit") {
    card.className = "card";
    card.setAttribute("id", "card-credit");
    cardHeader.className = "card-header";
    cardHeader.setAttribute("id", "card-header-credit");
    cardHeader.innerText = "CREDIT";
    cardBody.className = "card-body d-flex flex-column";
    amountSpan.innerText = `Amount = ${money}`;
    descriptionSpan.innerText = `Description = ${description}`;
    categorySpan.innerText = `Category = ${category}`;
    timestampSpan.innerText = `Time Stamp = ${timestamp}`;
    timestampSpan.className = "d-flex justify-content-between";

    // Lexicographic addition of elements
    expenseList.appendChild(card);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    cardBody.appendChild(amountSpan);
    cardBody.appendChild(descriptionSpan);
    cardBody.appendChild(categorySpan);
    cardBody.appendChild(timestampSpan);
    timestampSpan.appendChild(deleteBtn);
  } else if (category == "Debit") {
    card.className = "card";
    card.setAttribute("id", "card-debit");
    cardHeader.className = "card-header";
    cardHeader.setAttribute("id", "card-header-debit");
    cardHeader.innerText = "DEBIT";
    cardBody.className = "card-body d-flex flex-column";
    amountSpan.innerText = `Amount = ${money}`;
    descriptionSpan.innerText = `Description = ${description}`;
    categorySpan.innerText = `Category = ${category}`;
    timestampSpan.innerText = `Time Stamp = ${timestamp}`;
    timestampSpan.className = "d-flex justify-content-between";

    // Lexicographic addition of elements
    expenseList.appendChild(card);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    cardBody.appendChild(amountSpan);
    cardBody.appendChild(descriptionSpan);
    cardBody.appendChild(categorySpan);
    cardBody.appendChild(timestampSpan);
    timestampSpan.appendChild(deleteBtn);
  }
}

// Loading Previous Data
function preload(email, password) {
  const load = async () => {
    try {
      const res = await axios.post("http://localhost:5000/getExpenses", {
        email: email,
        password: password,
      });
      const jsonData = res.data;
      for (let i = 0; i < jsonData.length; i++) {
        write(
          jsonData[i].money,
          jsonData[i].description,
          jsonData[i].category,
          jsonData[i].timestamp
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  load();
}

preload(email, password);