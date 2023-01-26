const bcrpyt = require("bcrypt");
const db = require("../database/db");

exports.postUserHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const username = data.username;
    const email = data.email;
    const password = data.password;

    // HASHING
    const hashedPassword = await bcrpyt.hash(password, 10);

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
            [username, email, hashedPassword],
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
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (results.length == 0) {
        // EMAIL VERIFICATION
        return res.status(404).send("USER NOT FOUND");
      } else if (results.length != 0) {
        // HASHING
        const hashedPassword = results[0].password;
        bcrpyt.compare(password, hashedPassword, (err, result) => {
          if (err) console.log(err);
          else {
            if (result) res.status(200).send("OK");
            else res.status(401).send("INVALID PASSWORD");
          }
        });
      }
    }
  );
};

exports.verifyUserHandler = async (req, res, next) => {
  const email = req.body.email;

  await db.execute(
    "SELECT premiumStatus, username FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) console.log(err);
      else {
        const isVerified = (1 === results[0].premiumStatus);
        if (isVerified) res.status(200).send(results[0]);
        else res.status(200).send(results[0]);
      }
    }
  );
};

exports.leaderBoardHandler = async (req, res) => {
  const email = req.body.email;

  await db.execute(
    "SELECT premiumStatus, username FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) console.log(err);
      else {
        const isVerified = (1 === results[0].premiumStatus);
        if (isVerified) {
          db.execute("SELECT username, score FROM users ORDER BY score DESC LIMIT 10;", (err, results) => {
            if(err) console.log(err);
            else{
              //console.log(results);
              res.status(200).send(results);
            }
          })
        }
        else res.status(200).send(results[0]);
      }
    }
  );
}