const path = require("path");
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

exports.resetPasswordHandler = async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;

  const UUID = uuidv4();
  const msg = {
    to: email,
    from: "parth.dev5757@gmail.com",
    subject: "Reset your password.",
    text: `Hello ${username}!,Click on that link to reset your password!
      <p>http://localhost:5000/resetpassword/generatepassword?uuid=${UUID}&email=${email}</p>
    `,
  };

  const sendEmail = async () => {
    try {
      const response = await sgMail.send(msg);
      if (
        response[0].statusCode == 200 ||
        response[0].statusCode == 201 ||
        response[0].statusCode == 202
      )
        db.execute(
          "INSERT INTO passwordrecovery (uuid, isActive) VALUES (?,?)",
          [UUID, 1],
          (err, results) => {
            if (err) {
              console.log(err);
              res.status(500).send("SERVER ERROR");
            } else res.status(200).send("OK");
          }
        );
    } catch (error) {
      console.log(error);
    }
  };
  sendEmail();
};

exports.passwordGenerator = async (req, res, next) => {
  const data = req._parsedUrl.query.split("&");
  const UUID = data[0].split("=")[1];
  const email = data[1].split("=")[1];
  let flag = false;

  await db.execute(
    "SELECT uuid, isActive FROM passwordrecovery WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("SERVER ERROR");
      } else {
        const response = results[0];
        const UUID_DB = response.uuid;
        const isActive = response.isActive;

        if ((isActive == 1) & (UUID_DB == UUID)) {
          flag = true;
        }
      }
    }
  );

  if (flag) {
    await db.execute(
      "INSERT INTO passwordrecovery (uuid, isActive) VALUES (?,?)",
      [null, 0],
      (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send("SERVER ERROR");
        } else {
          res
            .status(200)
            .sendFile(
              path.join(__dirname, "..", "views", "password-reset-form.html")
            );
        }
      }
    );
  } else {
    res.status(408).send("SESSION EXPIRED");
  }
};

exports.updateDetailsHandler = async (req, res) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;
  const hashedPassword = await bcrpyt.hash(password, 10);

  await db.execute(
    "UPDATE users SET password = ? WHERE email = ?;",
    [hashedPassword, email],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("SERVER ERROR!");
      } else {
        res.status(200).send("OK!");
      }
    }
  );
};
