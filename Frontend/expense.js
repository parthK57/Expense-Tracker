const submitBtn = document.querySelector("#submit");
const premiumBtn = document.querySelector("#premium-btn");
const logOutBtn = document.querySelector("#logout-btn");
const email = sessionStorage.getItem("email");
const password = sessionStorage.getItem("password");
const setBtn = document.querySelector("#setBtn");

// Dynamic Pagination
let expenseCount =
  localStorage.getItem("expenseCount") == null
    ? 10
    : parseInt(localStorage.getItem("expenseCount"));
// Dynamic Pagination

// Logout
logOutBtn.addEventListener("click", logoutUser);
function logoutUser() {
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("password");
  location.replace("http://127.0.0.1:5500/Frontend/login.html");
}

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
      window.location.href = "http://127.0.0.1:5500/Frontend/expense.html";
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
      console.log(res);
      if (res.status == 200) {
        expenseList.removeChild(card);
        window.location.href = "http://127.0.0.1:5500/Frontend/expense.html";
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
    timestampSpan.innerText = `Time Stamp = ${timestamp}`;
    timestampSpan.className = "d-flex justify-content-between";

    // Lexicographic addition of elements
    expenseList.appendChild(card);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    cardBody.appendChild(amountSpan);
    cardBody.appendChild(descriptionSpan);
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
    timestampSpan.innerText = `Time Stamp = ${timestamp}`;
    timestampSpan.className = "d-flex justify-content-between";

    // Lexicographic addition of elements
    expenseList.appendChild(card);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    cardBody.appendChild(amountSpan);
    cardBody.appendChild(descriptionSpan);
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
      const count = jsonData.length;
      setBtn.addEventListener("click", () => {
        const setInput = document.querySelector("#set-rows").value;
        console.log(setInput);
        localStorage.setItem("expenseCount", `${setInput}`);
        location.href = "http://127.0.0.1:5500/Frontend/expense.html";
      });
      const expenseCountParsed = parseInt(localStorage.getItem("expenseCount"));
      const pages =
        count % parseInt(expenseCountParsed) == 0
          ? count / parseInt(expenseCountParsed)
          : parseInt(count / parseInt(expenseCountParsed)) + 1;

      paginationFunction(jsonData, pages, parseInt(expenseCountParsed));
    } catch (error) {
      console.log(error);
    }
  };
  load();
}

preload(email, password);

function paginationFunction(jsonData, pages, expenseCount) {
  const paginationContainer = document.querySelector(".pagination-container");
  const expenseList = document.querySelector("#expense-list");
  const nav = document.createElement("nav");
  const ul = document.createElement("ul");

  nav.setAttribute("aria-label", "...");
  ul.className = "pagination pagination-sm";

  paginationContainer.appendChild(nav);
  nav.appendChild(ul);

  for (let i = 0; i < pages; i++) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    li.className = "page-item";
    if (i == 0) {
      btn.className = "page-link active";
      btn.setAttribute("id", "active-page");
    } else {
      btn.className = "page-link";
    }
    btn.innerText = `${i + 1}`;
    li.appendChild(btn);
    ul.appendChild(li);

    btn.addEventListener("click", () => {
      // removing previous elements
      const cards = document.querySelectorAll(".card");
      for (let i = 0; i < cards.length; i++) expenseList.removeChild(cards[i]);

      const prevBtn = document.querySelector("#active-page");
      prevBtn.setAttribute("class", "page-link");
      prevBtn.setAttribute("id", "passive-page");
      btn.className = "page-link active";
      btn.setAttribute("id", "active-page");

      for (let j = i * expenseCount; j < (i + 1) * expenseCount; j++) {
        if (jsonData == undefined || null) {
          break;
        } else {
          write(
            jsonData[j].money,
            jsonData[j].description,
            jsonData[j].category,
            jsonData[j].timestamp
          );
        }
      }
    });
    if (i == 0) {
      for (let j = 0; j < expenseCount; j++) {
        write(
          jsonData[j].money,
          jsonData[j].description,
          jsonData[j].category,
          jsonData[j].timestamp
        );
      }
    }
  }
}

// Event Listener for premium button
function premiumVerifier(email) {
  const verify = async () => {
    try {
      const res = await axios.post("http://localhost:5000/verifyUser", {
        email: email,
      });
      const name = res.data.username;
      const parentDiv = document.querySelector("#form-heading");
      if (res.data.premiumStatus == 1) {
        premiumBtn.setAttribute("class", "hide");
        parentDiv.innerText = `Account: ${name}★`;
        premiumStatsFeature(email);
        premiumLeaderBoardFeature(email);
      } else {
        parentDiv.innerText = `Account: ${name}`;
        const premiumRowElement0 = document.querySelector("#premium-row-0");
        const premiumRowElement1 = document.querySelector("#premium-row-1");
        const reportsLink = document.querySelector("#report-link");
        reportsLink.setAttribute("class", "hide");
        premiumRowElement0.setAttribute("class", "hide");
        premiumRowElement1.setAttribute("class", "hide");
      }
    } catch (error) {
      console.log(error);
    }
  };
  verify();
}
premiumVerifier(email);

premiumBtn.addEventListener("click", firePremium);
function firePremium(e) {
  e.preventDefault();
  const reqOrder = async () => {
    try {
      const res = await axios.post("http://localhost:5000/getorderid", {
        email: email,
        password: password,
      });
      console.log(res);
      const data = res.data;
      var options = {
        key: data.key_id, // Enter the Key ID generated from the Dashboard
        // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Expense Tracker",
        description: "Premium Membership",
        order_id: `${data.id}`, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        prefill: {
          email: `${email}`,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
        handler: async function (res) {
          await axios.post(
            "http://localhost:5000/transactionstatus",
            {
              order_id: options.order_id,
              payment_id: res.razorpay_payment_id,
            },
            {
              headers: {
                email: email,
                password: password,
              },
            }
          );
          alert("Transaction successful!");
          window.location.href = "http://127.0.0.1:5500/Frontend/expense.html";
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
    }
  };
  reqOrder();
}

// Premium Feature 1 - Stats
function premiumStatsFeature(email) {
  const requestUserData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/premium/getUserData",
        {
          email: email,
        }
      );
      const data = res.data[0];
      //console.log(data);
      const score = data.score;
      const balance = data.balance;
      const creditAmount = data.creditAmount;
      const debitAmount = data.debitAmount;
      // const networth = data.networth;

      // const networthElement = document.querySelector("#networth-value");
      const debitElement = document.querySelector("#debit-value");
      const creditElement = document.querySelector("#credit-value");
      const balenceElement = document.querySelector("#balance-value");
      const scoreElement = document.querySelector("#score-value");
      // networthElement.innerText = `₹${networth}`;
      debitElement.innerText = `₹${debitAmount}`;
      creditElement.innerText = `₹${creditAmount}`;
      balenceElement.innerText = `₹${balance}`;
      scoreElement.innerText = `${score}`;
    } catch (error) {
      console.log(error);
    }
  };
  requestUserData();
}

function premiumLeaderBoardFeature(email) {
  const requestAllUsersData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/premium/leaderBoard",
        {
          email: email,
        }
      );
      const rawData = res.data;
      for (let i = 0; i < rawData.length; i++) {
        const span = document.querySelector(`#leader-board-${i}`);
        span.innerText = `${i + 1}) ${rawData[i].username} - ${
          rawData[i].score
        }`;
      }
    } catch (error) {
      console.log(error);
    }
  };
  requestAllUsersData();
}
