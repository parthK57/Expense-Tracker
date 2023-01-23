const db = require("../database/db");

exports.postUserHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const username = data.username;
    const email = data.email;
    const password = data.password;

    await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        //console.log(err);
        if (results.length != 0) {
          return res.status(400).send("FAILED");
        } else {
          db.execute(
            "INSERT INTO users (username, email, password) VALUES (?,?,?)",
            [username, email, password],
            (err, results) => {
              //   console.log(err);
              //   console.log(results);
              res.status(201).send("SUCCESS");
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.loginHandler = async (req, res, next) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;

  await db.execute(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (results.length == 0) {
        return res.status(400).send("FAILED");
      } else if (results.length != 0) {
        res.status(200).send("SUCCESS");
      }
    }
  );
};
