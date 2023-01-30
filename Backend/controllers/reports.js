const bcrypt = require("bcrypt");
const db = require("../database/db");
const jsonexport = require("jsonexport");
const S3Services = require("../services/S3Services");
const { v4: uuidv4 } = require("uuid");

const currentTime = new Date();
const currentOffset = currentTime.getTimezoneOffset();
const ISTOffset = 330;
const ISTTime = new Date(
  currentTime.getTime() + (ISTOffset + currentOffset) * 60000
);
const timestamp = `${ISTTime.getDate()}/${ISTTime.getMonth()}/${ISTTime.getFullYear()} ${ISTTime.getHours()}:${ISTTime.getMinutes()}:${ISTTime.getSeconds()}:${ISTTime.getMilliseconds()}`;

const getReportsHandler = (req, res) => {
  const headers = req.headers;
  const email = headers.email;
  const password = headers.password;

  const accountVerifier = async () => {
    try {
      await db.execute(
        "SELECT password FROM users WHERE email = ?",
        [email],
        (err, results) => {
          const hashedPassword = results[0].password;

          bcrypt.compare(password, hashedPassword, (err, result) => {
            if (result) {
              db.execute(
                "SELECT money, category, description, timestamp FROM expenses WHERE email = ?",
                [email],
                (err, results) => {
                  res.send(results);
                }
              );
            }
          });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };
  accountVerifier();
};

const saveReportsHandler = (req, res) => {
  const headers = req.headers;
  const email = headers.email;
  const password = headers.password;

  const accountVerifier = async () => {
    try {
      await db.execute(
        "SELECT password FROM users WHERE email = ?",
        [email],
        (err, results) => {
          const hashedPassword = results[0].password;

          bcrypt.compare(password, hashedPassword, (err, result) => {
            if (result) {
              db.execute(
                "SELECT money, category, description, timestamp FROM expenses WHERE email = ?",
                [email],
                (err, results) => {
                  jsonexport(results, async (err, csv) => {
                    const csvFile = csv;
                    const fileName = `${email}/${new Date()}<>${uuidv4()}.csv`;
                    const fileURL = await S3Services.uploadToS3(
                      csvFile,
                      fileName
                    );
                    db.execute(
                      "INSERT INTO reporthistory (date,email ,link) VALUES (?,?,?)",
                      [timestamp, email, fileURL],
                      (err, results) => {
                        res.status(201).json(fileURL);
                      }
                    );
                  });
                }
              );
            }
          });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  };
  accountVerifier();
};

const reportHistoryHandler = (req,res) => {
  const headers = req.headers;
  const email = headers.email;
  const password = headers.password;
  
  const accountVerifier = async () => {
    try {
      await db.execute(
        "SELECT password FROM users WHERE email = ?",
        [email],
        (err, results) => {
          const hashedPassword = results[0].password;

          bcrypt.compare(password, hashedPassword, (err, result) => {
            if (result) {
              db.execute(
                "SELECT date, link FROM reporthistory WHERE email = ?",
                [email],
                (err, results) => {
                  res.status(200).send(results);
                }
              );
            }
          });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  };
  accountVerifier();
}

module.exports = {
  getReportsHandler,
  saveReportsHandler,
  reportHistoryHandler
};
