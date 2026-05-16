const bucket = require("../config/googleStorage");

const uploadToGCS = async (file, folder = "general") => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file uploaded");
    }

    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.on("finish", async () => {
      await blob.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = uploadToGCS;