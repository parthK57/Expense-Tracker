const db = require("../database/db");
const bcrpyt = require("bcrypt");

exports.postExpenseHandler = async (req, res, next) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;
  const money = data.money;
  const description = data.description;
  const category = data.category;

  await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      const hashedPassword = results[0].password;
      bcrpyt.compare(password, hashedPassword, (err, result) => {
        if (err) console.log(err);
        else {
          if (result) {
            db.execute(
              "INSERT INTO expenses (money, category, description, email) VALUES (?,?,?,?)",
              [money, category, description, email],
              (err, results) => {
                if (err) {
                  console.log(err);
                  res.status(500).send("SERVER IS FUCKED");
                } else {
                  db.execute(
                    "SELECT * FROM expenses WHERE email = ?",
                    [email],
                    (err, result) => {
                      const timestamp = result[result.length - 1].timestamp;
                      res.status(201).send(timestamp);
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
