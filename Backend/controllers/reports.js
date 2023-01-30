const bcrypt = require("bcrypt");
const db = require("../database/db");
const jsonexport = require("jsonexport");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

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

function uploadToS3(data, fileName) {
  const bucket_name = process.env.BUCKET_NAME;
  const iam_user_key = process.env.IAM_USER_KEY;
  const iam_user_secret = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: iam_user_key,
    secretAccessKey: iam_user_secret,
  });

  let params = {
    Bucket: bucket_name,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve (s3response.Location);
      }
    });
  })
}

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
                    const fileURL = await uploadToS3(csvFile, fileName);
                    res.status(201).json(fileURL);
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

module.exports = {
  getReportsHandler,
  saveReportsHandler,
};
