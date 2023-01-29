const bcrypt = require("bcrypt");
const db = require("../database/db");

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
    }
  };
  accountVerifier();
};

module.exports = {
  getReportsHandler,
};
