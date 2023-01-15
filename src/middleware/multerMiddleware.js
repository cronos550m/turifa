
const multer = require('multer');
const {v4: uuidv4 } = require('uuid')
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
  
  const upload = multer({ 
    storage, 
    limits: {fileSize: 200000, files: 4},
    fileFilter: function (req, file, cb){
      let type = file.mimetype.startsWith('image/');
      type?cb(null, true):cb(new Error('No es un archivo de tipo imagen'));
    }
  }).array('RewardImage1');

  return upload;
}

module.exports = uploadFile;