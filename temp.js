let currentTime = new Date();
let currentOffset = currentTime.getTimezoneOffset();

let ISTOffset = 330;
let ISTTime = new Date(
  currentTime.getTime() + (ISTOffset + currentOffset) * 60000
);
const timestamp = `${ISTTime.getDate()}/${ISTTime.getMonth()}/${ISTTime.getFullYear()} ${ISTTime.getHours()}:${ISTTime.getMinutes()}`;

const str = "true";
const truthValue = "true" === str;
console.log(truthValue);


db.execute(
  "INSERT INTO expensetracker.expenses (money, category, description, email, timestamp) VALUES (?,?,?,?,?)",
  [money, category, description, email, timestamp],
  (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("SERVER IS FUCKED");
    } else {
      db.execute(
        "SELECT * FROM expensetracker.expenses WHERE email = ? ORDER BY id DESC LIMIT 1",
        [email],
        (err, result) => {
          res.status(200).send(result);
        }
      );
    }
  }
);