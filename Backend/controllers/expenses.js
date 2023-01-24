const db = require("../database/db");
const bcrpyt = require("bcrypt");

exports.postExpenseHandler = async (req, res, next) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;
  const money = data.money;
  const description = data.description;
  const category = data.category;
  const currentTime = new Date();
  const currentOffset = currentTime.getTimezoneOffset();
  const ISTOffset = 330;
  const ISTTime = new Date(
    currentTime.getTime() + (ISTOffset + currentOffset) * 60000
  );
  const timestamp = `${ISTTime.getDate()}/${ISTTime.getMonth()}/${ISTTime.getFullYear()} ${ISTTime.getHours()}:${ISTTime.getMinutes()}:${ISTTime.getSeconds()}:${ISTTime.getMilliseconds()}`;

  await db.execute(
    "SELECT * FROM expensetracker.users WHERE email = ?",
    [email],
    (err, results) => {
      const hashedPassword = results[0].password;
      bcrpyt.compare(password, hashedPassword, (err, result) => {
        if (err) console.log(err);
        else {
          if (result) {
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
          } else res.status(401).send("INVALID PASSWORD");
        }
      });
    }
  );
};

exports.getExpensesHandler = async (req, res, next) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;

  await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) res.status(500).send("SERVER FUCKED");
      else {
        const hashedPassword = results[0].password;
        bcrpyt.compare(password, hashedPassword, (err, result) => {
          if (err) console.log(err);
          else {
            if (result) {
              db.execute(
                "SELECT * FROM expenses WHERE email = ?",
                [email],
                (err, results) => {
                  res.status(200).send(results);
                }
              );
            }
          }
        });
      }
    }
  );
};

exports.deleteExpensesHandler = async (req, res, next) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;
  const timestamp = data.timestamp;

  await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).send("SERVER FUCKED");
      else {
        const hashedPassword = results[0].password;
        bcrpyt.compare(password, hashedPassword, (err, result) => {
          if (err) console.log(err);
          else {
            if (result) {
              db.execute(
                "DELETE FROM expenses WHERE email = ? AND timestamp = ?",
                [email, timestamp],
                (err, results) => {
                  // console.log(err);
                  // console.log(results);
                  if (err) return res.status(500).send("SERVER FUCKED");
                  else return res.status(200).send("OK");
                }
              );
            }
          }
        });
      }
    }
  );
};
