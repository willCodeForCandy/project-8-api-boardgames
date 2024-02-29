const cloudinary = require('cloudinary').v2;

const deleteFileFromCloudinary = (imgUrl) => {
  if (imgUrl.includes('cloudinary')) {
    const urlSplit = imgUrl.split('/');
    const folderName = urlSplit[urlSplit.length - 2];
    const fileName = urlSplit[urlSplit.length - 1].split('.')[0];

    const finalUrl = `${folderName}/${fileName}`;
    cloudinary.uploader.destroy(finalUrl, () => {
      console.log('Imagen eliminada en Cloudinary');
    });
  }
};

module.exports = deleteFileFromCloudinary;
