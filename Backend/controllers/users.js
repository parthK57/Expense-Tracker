const db = require("../database/db");
const bcrpyt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const sgMail = require("@sendgrid/mail");

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
    res.status(500).json(error);
  }
};

exports.loginHandler = async (req, res, next) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.verifyUserHandler = async (req, res, next) => {
  const email = req.body.email;
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.leaderBoardHandler = async (req, res) => {
  const email = req.body.email;
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.resetPasswordRequestHandler = async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  var UUID = uuidv4();
  try {
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
                <h4>Click on the button to reset your password!</h4>
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
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.resetPasswordFormHandler = (req, res, next) => {
  const id = req.query.id;

  // console.log(id);

  const func = async (id) => {
    try {
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
                  <link
                  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
                  rel="stylesheet"
                  integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
                  crossorigin="anonymous"
                  />
                  <style>
                  #navbar {
                    background-color: #f7f5f5;
                  }
                  form {
                    color: #1c2321 !important;
                    border-radius: 20px;
                    background-color: #f7f5f5;
                    box-shadow: 10px 21px 56px -8px rgba(214, 214, 214, 1);
                  }
                  </style>
                  <script>
                      function formsubmitted(e){
                          e.preventDefault();
                          console.log('called')
                      }
                  </script>
                  <nav class="navbar navbar-expand-lg" id="navbar">
                    <div class="container-fluid">
                      <a class="navbar-brand" href="">ExpensePad</a>
                    </div>
                  </div>
                  </nav>
                  <div
                  class="container d-flex flex-column align-items-center justify-content-center mt-5"
                  >
                  <form action="/updatepassworddetails" autocomplete="off" class="p-5" method="get">
                  <div
                  class="mb-3 d-flex justify-content-center align-content-center"
                  style="font-size: 25px; border-bottom: 1px solid black"
                  >
                    Details
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label">Email:</label>
                    <input name="email" type="email" class="form-control" required></input>
                  </div>
                  <div class="mb-3">
                    <label for="newpassword" class="form-label">New Password:</label>
                    <input name="newpassword" type="password" class="form-control" required></input>
                  </div>
                  <button type="submit" class="btn btn-success">
                    Reset Password
                  </button>
                  </form>
                  </div>
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
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };
  func(id);
};

exports.passwordResetExecuteHandler = async (req, res) => {
  const email = req.query.email;
  const password = req.query.newpassword;

  const hashedPassword = await bcrpyt.hash(password, 10);
  try {
    await db.execute(
      `UPDATE expensetracker.users SET password = '${hashedPassword}' WHERE email = '${email}';`,
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send("SERVER ERROR!");
        } else {
          res.status(200).send(`
        <html>
          <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          ntegrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
          crossorigin="anonymous"
          />
          <style>
            #navbar {
              background-color: #f7f5f5;
            }
            h1{
              color: green;
            }
          </style>
          <nav class="navbar navbar-expand-lg" id="navbar">
            <div class="container-fluid">
              <a class="navbar-brand" href="">ExpensePad</a>
            </div>
          </nav>
          <div
          class="container d-flex flex-column align-items-center justify-content-center mt-5"
          >
            <h1>SUCCUESS!</h1>
          </div>
        </html>
        `);
          res.end();
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
