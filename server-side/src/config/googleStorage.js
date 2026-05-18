const { Storage } = require("@google-cloud/storage");

let storage;

if (process.env.GOOGLE_CLOUD_KEY_JSON) {
  storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: JSON.parse(
      process.env.GOOGLE_CLOUD_KEY_JSON
    ),
  });
} else {
  storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename:
      process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
}

const bucket = storage.bucket(
  process.env.GOOGLE_CLOUD_BUCKET_NAME
);

module.exports = bucket;