const AWS = require("aws-sdk");

const uploadToS3 = (data, fileName) => {
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
      } else {
        resolve(s3response.Location);
      }
    });
  });
};

module.exports = {
  uploadToS3,
};
