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
              "SELECT score, networth, creditAmount, debitAmount, balance FROM users WHERE email = ?",
              [email],
              (err, results) => {
                if (err) console.log(err);
                else {
                  //console.log(results);
                  let networth;
                  let creditAmount;
                  let debitAmount;
                  let balance;
                  let score;
                  if (results[0].networth == null) {
                    networth = parseInt(money);
                    creditAmount = 0;
                    debitAmount = 0;
                    balance = 0;
                    if (category == "Credit") {
                      creditAmount = creditAmount + parseInt(money);
                      balance = balance + parseInt(money);
                    } else if (category == "Debit") {
                      balance = balance - parseInt(money);
                      debitAmount = debitAmount + parseInt(money);
                    }
                    if (debitAmount != 0) score = networth / debitAmount;
                    else score = Number.MAX_SAFE_INTEGER;
                    balance = balance - debitAmount;
                  } else {
                    networth = parseInt(money) + parseInt(results[0].networth);
                    creditAmount = parseInt(results[0].creditAmount);
                    debitAmount = parseInt(results[0].debitAmount);
                    balance = parseInt(results[0].balance);
                    if (category == "Credit") {
                      balance = balance + parseInt(money);
                      creditAmount = creditAmount + parseInt(money);
                    } else if (category == "Debit") {
                      balance = balance - parseInt(money);
                      debitAmount = debitAmount + parseInt(money);
                    }
                    if (debitAmount != 0) score = networth / debitAmount;
                    else score = Number.MAX_SAFE_INTEGER;
                  }
                  //console.log(networth, creditAmount, debitAmount, score);
                  db.execute(
                    "UPDATE users SET score = ?, networth = ?, creditAmount = ?, debitAmount = ?, balance = ? WHERE email = ?",
                    [
                      score,
                      networth,
                      creditAmount,
                      debitAmount,
                      balance,
                      email,
                    ],
                    (err, results) => {
                      if (err) {
                        console.log(err);
                        return res.status(500).send("SERVER ERROR");
                      } else {
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
                      }
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
      if (err) res.status(500).send("INTERNAL SERVER ERROR");
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
  const category = data.category;
  const money = data.money;

  await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).send("INTERNAL SERVER ERROR");
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
                  if (err) return res.status(500).send("INTERNAL SERVER ERROR");
                  else {
                    if (category == "Credit") {
                      db.execute(
                        "SELECT creditAmount, debitAmount, balance, networth FROM users WHERE email = ?",
                        [email],
                        (err, results) => {
                          if (err) {
                            console.log(err);
                            res.status(500).send("Server Error");
                          } else {
                            const data = results[0];
                            let creditAmount = data.creditAmount;
                            let balance = data.balance;
                            let networth = data.networth;
                            let debitAmount = data.debitAmount;

                            creditAmount = creditAmount - money;
                            balance = balance - money;
                            networth = networth - money;
                            if (
                              networth <= 0 ||
                              debitAmount == 0 ||
                              debitAmount == null
                            )
                              score = 0;
                            else score = networth / debitAmount;
                            db.execute(
                              "UPDATE users SET creditAmount = ?, debitAmount = ?, balence = ?, networth = ? WHERE email = ?",
                              [
                                creditAmount,
                                debitAmount,
                                balance,
                                networth,
                                email,
                              ],
                              (err, results) => {
                                if (err) {
                                  console.log(err);
                                  res.status(500).send("SERVER ERROR");
                                } else {
                                  return res.status(200).send("OK");
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          }
        });
      }
    }
  );
};

exports.getUserDataHandler = async (req, res) => {
  const email = req.body.email;
  //console.log(email);

  await db.execute(
    "SELECT premiumStatus FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) console.log(err);
      else {
        const isVerified = 1 === results[0].premiumStatus;
        if (isVerified) {
          db.execute(
            "SELECT score, networth, creditAmount, debitAmount, balance FROM users WHERE email = ?",
            [email],
            (err, results) => {
              if (err) console.log(err);
              else {
                //console.log(results);
                res.send(results);
              }
            }
          );
        }
      }
    }
  );
};
