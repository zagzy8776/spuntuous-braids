const { v2: cloudinary } = require('cloudinary');

const hasCloudinary = () => Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const configureCloudinary = () => {
  if (!hasCloudinary()) return false;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return true;
};

const uploadBufferToCloudinary = (file, folder) => new Promise((resolve, reject) => {
  if (!configureCloudinary()) {
    const error = new Error('Cloudinary is not configured on the server. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on Render, then redeploy.');
    error.code = 'CLOUDINARY_NOT_CONFIGURED';
    return reject(error);
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder, resource_type: 'image' },
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }
  );

  stream.end(file.buffer);
});

module.exports = { cloudinary, hasCloudinary, configureCloudinary, uploadBufferToCloudinary };
