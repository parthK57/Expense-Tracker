const db = require("../database/db");
const bcrpyt = require("bcrypt");
const Razorpay = require("razorpay");

exports.getOrderHandler = async (req, res, next) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;
  try {
    await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) console.log(err);
        const hashedPassword = results[0].password;
        bcrpyt.compare(password, hashedPassword, (err, result) => {
          if (err) {
            if (err) console.log(err);
            res.send(401).send("INVALID CREDENTIALS");
          } else if (result) {
            const instance = new Razorpay({
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
            instance.orders
              .create({
                amount: 10000,
                currency: "INR",
                receipt: "receipt#1",
                notes: {
                  key1: "value3",
                  key2: "value2",
                },
              })
              .then((result) => {
                res.send(result);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.postTransactionStatusHandler = async (req, res, next) => {
  const data = req.body;
  const headers = req.headers;
  const email = headers.email;
  const password = headers.password;
  const order_id = data.order_id;
  const payment_id = data.payment_id;
  try {
    await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) console.log(err);
        const hashedPassword = results[0].password;
        bcrpyt.compare(password, hashedPassword, (err, result) => {
          if (err) {
            if (err) console.log(err);
            res.send(401).send("INVALID CREDENTIALS");
          } else if (result) {
            db.execute(
              "UPDATE users SET orderId = ?, paymentId = ?, premiumStatus = ? WHERE email = ?",
              [order_id, payment_id, 1, email],
              (err, results) => {
                if (err) {
                  console.log(err);
                  res.status(500).send("INTERNAL SERVER ERROR");
                } else {
                  // console.log(results);
                  res.status(201).send("OK");
                }
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
