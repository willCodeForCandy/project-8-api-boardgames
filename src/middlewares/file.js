const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'BoardgameApi',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
  }
});

const upload = multer({ storage });

// const deleteImgCloudinary = (imgUrl) => {
//   const imgSplit = imgUrl.split('/');
//   const nameSplit = imgSplit[imgSplit.length - 1].split('.');
//   const folderSplit = imgSplit[imgSplit.length - 2];
//   const public_id = `${folderSplit}/${nameSplit[0]}`;

//   cloudinary.UploadStream.destroy(public_id, () => {
//     console.log('Image deleted in Cloudinary storage');
//   });
// };

module.exports = { upload };
