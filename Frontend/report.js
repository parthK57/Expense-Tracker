const email = sessionStorage.getItem("email");
const password = sessionStorage.getItem("password");
const monthTableBody = document.querySelector("#month-table-body");
const yearTableBody = document.querySelector("#year-table-body");
const logOutBtn = document.querySelector("#logout-btn");
const saveBtn = document.querySelector("#save-report");

// Logout
logOutBtn.addEventListener("click", logoutUser);
function logoutUser() {
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("password");
  location.replace("http://127.0.0.1:5500/Frontend/login.html");
}

const date = new Date();
const currentDate = date.getDate();
const currentMonth = date.getMonth() + 1;
const currentYear = date.getFullYear();
const rules = [
  {
    month: 1,
    maxDays: 31,
    name: "January",
  },
  {
    month: 2,
    maxDays: currentYear % 100 == 0 ? 28 : currentYear % 4 == 0 ? 29 : 28,
    name: "February",
  },
  {
    month: 3,
    maxDays: 31,
    name: "March",
  },
  {
    month: 4,
    maxDays: 30,
    name: "April",
  },
  {
    month: 5,
    maxDays: 31,
    name: "May",
  },
  {
    month: 6,
    maxDays: 30,
    name: "June",
  },
  {
    month: 7,
    maxDays: 31,
    name: "July",
  },
  {
    month: 8,
    maxDays: 31,
    name: "August",
  },
  {
    month: 9,
    maxDays: 30,
    name: "September",
  },
  {
    month: 10,
    maxDays: 31,
    name: "October",
  },
  {
    month: 11,
    maxDays: 30,
    name: "November",
  },
  {
    month: 12,
    maxDays: 31,
    name: "December",
  },
];

const monthTableTile = document.querySelector("#month-table-title");
monthTableTile.innerText = `Month - ${rules[currentMonth].name}`;

function getTableData() {
  const dataFetcher = async () => {
    try {
      const response = await axios.get("http://localhost:5000/reports", {
        headers: {
          email: email,
          password: password,
        },
      });
      const data = response.data;
      if (data != null) {
        const currentMonthData = [];
        for (let i = 0; i < data.length; i++)
          if (data[i] != null)
            if (data[i].timestamp.split(" ")[0].split("/")[1] == currentMonth)
              currentMonthData.push(data[i]);

        monthTableFiller(currentMonthData);

        const currentYearData = [];
        for (let i = 0; i < data.length; i++)
          if (data[i] != null)
            if (data[i].timestamp.split(" ")[0].split("/")[2] == currentYear)
              currentYearData.push(data[i]);

        yearTableFiller(currentYearData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  dataFetcher();
}
getTableData();

function monthTableFiller(data) {
  const firstDay = parseInt(data[0].timestamp.split(" ")[0].split("/")[0]);
  let creditAmount = 0;
  let debitAmount = 0;

  for (let i = firstDay; i <= rules[currentMonth].maxDays; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[j].timestamp.split(" ")[0].split("/")[0] == i) {
        const tableRow = document.createElement("tr");
        const tableHeadDate = document.createElement("th");
        const tableHeadDescription = document.createElement("th");
        const tableHeadCreditAmount = document.createElement("th");
        const tableHeadDebitAmount = document.createElement("th");

        tableHeadDate.setAttribute("scope", "col");
        tableHeadDescription.setAttribute("scope", "col");
        tableHeadCreditAmount.setAttribute("scope", "col");
        tableHeadDebitAmount.setAttribute("scope", "col");

        tableHeadDate.innerText = `${data[j].timestamp.split(" ")[0]}`;
        tableHeadDescription.innerText = `${data[j].description}`;
        if (data[j].category == "Credit") {
          tableHeadCreditAmount.innerText = `${data[j].money}`;
          tableHeadDebitAmount.innerText = `0`;
          creditAmount += parseInt(data[j].money);
        } else {
          tableHeadCreditAmount.innerText = `0`;
          tableHeadDebitAmount.innerText = `${data[j].money}`;
          debitAmount += parseInt(data[j].money);
        }
        monthTableBody.appendChild(tableRow);
        tableRow.appendChild(tableHeadDate);
        tableRow.appendChild(tableHeadDescription);
        tableRow.appendChild(tableHeadCreditAmount);
        tableRow.appendChild(tableHeadDebitAmount);
      }
    }

    if (creditAmount != 0 || debitAmount != 0) {
      const tableRow = document.createElement("tr");
      const tableHeadDate = document.createElement("th");
      const tableHeadDescription = document.createElement("th");
      const tableHeadCreditAmount = document.createElement("th");
      const tableHeadDebitAmount = document.createElement("th");

      tableHeadDate.setAttribute("scope", "col");
      tableHeadDescription.setAttribute("scope", "col");
      tableHeadCreditAmount.setAttribute("scope", "col");
      tableHeadDebitAmount.setAttribute("scope", "col");

      tableHeadDate.innerText = "";
      tableHeadDescription.innerText = "";
      tableHeadCreditAmount.innerText = `Total: ${creditAmount}`;
      tableHeadDebitAmount.innerText = `Total: ${debitAmount}`;

      monthTableBody.appendChild(tableRow);
      tableRow.appendChild(tableHeadDate);
      tableRow.appendChild(tableHeadDescription);
      tableRow.appendChild(tableHeadCreditAmount);
      tableRow.appendChild(tableHeadDebitAmount);

      creditAmount = 0;
      debitAmount = 0;
    }
  }
}

let creditAmount = 0;
let debitAmount = 0;
let balance = 0;
function yearTableFiller(data) {
  const firstMonth = parseInt(data[0].timestamp.split(" ")[0].split("/")[1]);
  for (let i = firstMonth; i <= 12; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[j].timestamp.split(" ")[0].split("/")[1] == i) {
        if (data[j].category == "Credit")
          creditAmount += parseInt(data[j].money);
        else if (data[j].category == "Debit")
          debitAmount += parseInt(data[j].money);
      }
    }

    balance = creditAmount - debitAmount;

    if (creditAmount != 0 || debitAmount != 0) {
      const tableRow = document.createElement("tr");
      const tableHeadMonth = document.createElement("th");
      const tableHeadBalance = document.createElement("th");
      const tableHeadCreditAmount = document.createElement("th");
      const tableHeadDebitAmount = document.createElement("th");

      tableHeadMonth.setAttribute("scope", "col");
      tableHeadBalance.setAttribute("scope", "col");
      tableHeadCreditAmount.setAttribute("scope", "col");
      tableHeadDebitAmount.setAttribute("scope", "col");

      tableHeadMonth.innerText = `${rules[i - 1].name}`;
      tableHeadCreditAmount.innerText = `Total: ${creditAmount}`;
      tableHeadDebitAmount.innerText = `Total: ${debitAmount}`;
      tableHeadBalance.innerText = `Total: ${balance}`;

      yearTableBody.appendChild(tableRow);
      tableRow.appendChild(tableHeadMonth);
      tableRow.appendChild(tableHeadCreditAmount);
      tableRow.appendChild(tableHeadDebitAmount);
      tableRow.appendChild(tableHeadBalance);

      creditAmount = 0;
      debitAmount = 0;
    }
  }
}

saveBtn.addEventListener("click", saveReport);
function saveReport(e) {
  e.preventDefault();
  const requestSave = async () => {
    try {
      const response = await axios.get("http://localhost:5000/savereport", {
        headers: {
          email: email,
          password: password,
        },
      });

      if (response.status == 201) {
        const link = document.createElement("a");
        const tableContainer = document.querySelector("#table-container");
        link.className = "link-info";
        link.setAttribute("href", `${response.data}`);
        link.innerText = "Download Report";
        tableContainer.appendChild(link);
      }
    } catch (error) {
      console.log(error);
      const link = document.createElement("p");
      const tableContainer = document.querySelector("#table-container");
      link.className = "link-dangler";
      link.setAttribute("href", `${response.data}`);
      link.innerText = "Server Error!";
      tableContainer.appendChild(link);
    }
  };
  requestSave();
}

function getReportHistory(email, password) {
  const requestData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/reporthistory", {
        headers: {
          email: email,
          password: password,
        },
      });
      reportHistoryFiller(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  requestData();
}
getReportHistory(email, password);

function reportHistoryFiller(data) {
  const tableBody = document.querySelector("#report-history-table-body");

  for (let i = 0; i < data.length; i++) {
    const thSr = document.createElement("th");
    const thDate = document.createElement("th");
    const thLink = document.createElement("th");
    const tr = document.createElement("tr");
    const anchor = document.createElement("a");

    thSr.setAttribute("scope", "col");
    thDate.setAttribute("scope", "col");
    thLink.setAttribute("scope", "col");
    anchor.className = "link-info";
    thSr.innerText = `${i + 1}`;
    thDate.innerText = `${data[i].date}`;
    anchor.setAttribute("href", `${data[i].link}`);
    anchor.innerText = "Download Link";

    tableBody.appendChild(tr);
    tr.appendChild(thSr);
    tr.appendChild(thDate);
    tr.appendChild(thLink);
    thLink.appendChild(anchor);
  }
}
