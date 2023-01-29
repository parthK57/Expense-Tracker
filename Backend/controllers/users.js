const path = require("path");
const db = require("../database/db");
const bcrpyt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const sgMail = require("@sendgrid/mail");
const e = require("express");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
              if (err) {
                console.log(err);
                res.send(500).send("FAILED");
              } else {
                db.execute(
                  "INSERT INTO passwordrecovery (email) VALUES (?)",
                  [email],
                  (err, results) => {
                    if (err) {
                      res.status(500).send("SERVER ERROR");
                      console.log(err);
                    } else {
                      res.status(201).send("OK");
                    }
                  }
                );
              }
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
        const isVerified = 1 === results[0].premiumStatus;
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
        const isVerified = 1 === results[0].premiumStatus;
        if (isVerified) {
          db.execute(
            "SELECT username, score FROM users ORDER BY score DESC LIMIT 10;",
            (err, results) => {
              if (err) console.log(err);
              else {
                //console.log(results);
                res.status(200).send(results);
              }
            }
          );
        } else res.status(200).send(results[0]);
      }
    }
  );
};

exports.resetPasswordRequestHandler = async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  var UUID = uuidv4();
  await db.execute(
    `UPDATE expensetracker.passwordrecovery SET uuid = '${UUID}', isActive = 1 WHERE email = '${email}'`,
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("SERVER ERROR");
      } else {
        db.execute(
          `SELECT id from passwordrecovery WHERE email = '${email}'`,
          (err, results) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Server Error");
            } else {
              //console.log(results);
              const id = results[0].id;
              var msg = {
                to: email,
                from: "parth.dev5757@gmail.com",
                subject: "Reset your password.",
                html: `
                <h1>Hello ${username}!</h1>
                <p>Click on the button to reset your password!</p>
                <button id="reset-password"><a href="http://localhost:5000/resetpasswordform/reset?id=${id}">Reset Password</a></button>
              `,
              };

              const sendEmail = async () => {
                try {
                  const response = await sgMail.send(msg);
                  if (
                    response[0].statusCode == 200 ||
                    response[0].statusCode == 201 ||
                    response[0].statusCode == 202
                  ) {
                    res.send("OK");
                  }
                } catch (error) {
                  console.log(error);
                }
              };
              sendEmail();
            }
          }
        );
      }
    }
  );
};

exports.resetPasswordFormHandler = (req, res, next) => {
  const id = req.query.id;

  // console.log(id);

  const func = async (id) => {
    await db.execute(
      "SELECT uuid, isActive FROM passwordrecovery WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send("SERVER ERROR");
        } else {
          // console.log(
          //   "Inside the select statement - SELECT uuid, isActive FROM passwordrecovery WHERE id = ?"
          // );
          // console.log(results);
          const response = results[0];
          const isActive = parseInt(response.isActive);

          if (isActive == 1) {
            db.execute(
              "UPDATE passwordrecovery SET uuid = ?, isActive = 0 WHERE id = ?",
              [null, id],
              (err, results) => {
                if (err) {
                  console.log(err);
                  return res.status(500).send("SERVER ERROR");
                } else {
                  // console.log(results);
                  res.send(`<html>
                  <script>
                      function formsubmitted(e){
                          e.preventDefault();
                          console.log('called')
                      }
                  </script>
                  <form action="/updatepassworddetails" method="get">
                      <label for="email">Email:</label>
                      <br />
                      <input name="email" type="email" required></input>
                      <br />
                      <label for="">Enter New password:</label>
                      <br />
                      <input name="newpassword" type="password" required></input>
                      <br />
                      <button>reset password</button>
                  </form>
              </html>`);
                  res.end();
                }
              }
            );
          } else {
            res.status(408).send("SESSION EXPIRED");
          }
        }
      }
    );
  };
  func(id);
};

exports.passwordResetExecuteHandler = async (req, res) => {
  const email = req.query.email;
  const password = req.query.newpassword;
  
  const hashedPassword = await bcrpyt.hash(password, 10);

  await db.execute(
    `UPDATE expensetracker.users SET password = '${hashedPassword}' WHERE email = '${email}';`,
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("SERVER ERROR!");
      } else {
        res.status(200).send(results);
      }
    }
  );
};
