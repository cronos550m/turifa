
const multer = require('multer');
const {v4: uuidv4 } = require('uuid')
const fs = require('fs');
const path = require('path');

function uploadFile() {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {

      try {
        if (!fs.existsSync(path.join(__dirname, `../public/uploads/`+ req.user.id))) {
          fs.mkdirSync(path.join(__dirname, `../public/uploads/`+ req.user.id));
        }
      } catch (err) {
        console.error(err);
      }
      console.log("finaliza el directorio")
      
      cb(null, path.join(__dirname, `../public/uploads/`+ req.user.id))
    },
    filename: function(req, file, cb) {
      cb(null, uuidv4() + "_" + Date.now() + "_" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage }).fields([
    { name: "RewardImage1", maxCount: 1 },
    { name: "RewardImage2", maxCount: 1 },
    { name: "RewardImage3", maxCount: 1 },
    { name: "RewardImage4", maxCount: 1 }
  ]);

  return upload;
}

module.exports = uploadFile;