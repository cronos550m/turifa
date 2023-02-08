
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const multer = require("multer");
const MulterSharpResizer = require("multer-sharp-resizer");
const fs = require('fs');


const pool = require('../database');
const { isLoggedIn , isNotLoggedIn } = require('../lib/auth')
// const uploadFile = require('../middleware/multerMiddleware') // Mid para trabajar con envios de archivos
// const sharpResizer = require('../middleware/sharpResizerMiddleware') // Mid para trabajar con envios de archivos

router.get('/add-numbers', isLoggedIn, (req, res) => {
    res.render('numbers/add-numbers');
});


const multerStorage = multer.memoryStorage();

// Filter files with multer
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Not an image! Please upload only images.", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// *****  Multer .fields() *****
const uploadProductImages = upload.array('RewardImage1', 4);

// *****  Multer .array() *****S
// const uploadProductImages = upload.array("gallery", 4);

// *****  Multer .single() *****
// const uploadProductImages = upload.single("cover");

resizerImages = async (req, res, next) => {
    const user = req.user.id;


  // Used by multer .array() or .single
  const filename =  `RewardImage-${Date.now() + "_" + uuidv4()}`;

  


  const sizes = [
    {
      path: "original",
      width: null,
      height: null,
    },
    {
      path: "large",
      width: 800,
      height: 950,
    },
    {
      path: "medium",
      width: 300,
      height: 450,
    },
    {
      path: "thumbnail",
      width: 100,
      height: 250,
    },
  ];

  const uploadPath = (path.join(__dirname, `../public/uploads/`+ user));
  
  const fileUrl = (`/uploads/`+ user);

  // sharp options
  const sharpOptions = {
    fit: "contain",
    background: { r: 255, g: 255, b: 255 },
  };

  // create a new instance of MulterSharpResizer and pass params
  const resizeObj = new MulterSharpResizer(
    req,
    filename,
    sizes,
    uploadPath,
    fileUrl,
    sharpOptions
  );


  // call resize method for resizing files
  await resizeObj.resize();
  const getDataUploaded = resizeObj.getData();

  // Get details of uploaded files: Used by multer fields
//   req.body.cover = getDataUploaded.cover;
//   req.body.gallery = getDataUploaded.gallery;

  // Get details of uploaded files: Used by multer .array() or .single()
  req.body.RewardImage1 = getDataUploaded;
  // req.body.gallery = getDataUploaded;
  // console.log(getDataUploaded)
  next();


};



router.post('/add-numbers', uploadProductImages, resizerImages, async(req, res) => {

    const { numero1, RewardName, RewardDescription, RewardDate, RewardValue } = req.body;

    let images = req.files;
    // console.log(images);

    // console.log(req.body.RewardImage1)

    let NumbersGroup1 = await pool.query('SELECT * FROM numbers WHERE UserId = ? ORDER BY id DESC', [req.user.id]); //chequea si hay numeros ingresados para el usuario
    // console.log(NumbersGroup1)
    if (NumbersGroup1.length > 0 ) {

        
        let NumbersGroup1 = await pool.query('SELECT * FROM numbers ORDER BY id DESC'); //chequea si hay 
        // console.log(NumbersGroup1[0].NumbersGroup)
NumbersGroup1[0].NumbersGroup += 1;
NumbersNumber = 0;
for (let i = 0; i < numero1; i++) { //itera para agregar la cantidad de numeros del sorteo
    NumbersNumber+= 1
    // console.log(NumbersNumber)
    const newNumber = {
        NumbersNumber,
        UserId: req.user.id,       
        NumbersGroup: NumbersGroup1[0].NumbersGroup
    };  

    await pool.query('INSERT INTO numbers set ?', [newNumber]);
    const numbers = await pool.query('SELECT * FROM numbers WHERE UserId = ? ORDER BY id DESC', [req.user.id]);
    
  
    const newReward = {
        RewardName,
        RewardNumberId: numbers[0].id,
        // RewardClientId: clients[0].id,
        RewardDescription,
        RewardUserId: req.user.id,
        RewardDate,
        RewardValue,
        RewardCreatedAt: new Date(),
        RewardImage: JSON.stringify(req.body.RewardImage1),
        RewardNumbersGroup: NumbersGroup1[0].NumbersGroup
    };
    // console.log(newReward)
    // console.log(newNumber)
    
    await pool.query('INSERT INTO rewards set ?', [newReward]);        
}
    
    } else {


        NumbersNumber = 0;
        for (let i = 0; i < numero1; i++) {
        NumbersNumber+= 1
        // console.log(NumbersNumber)
        const newNumber = {
            NumbersNumber,
            UserId: req.user.id,       
            NumbersGroup: 1
        };  
    
        await pool.query('INSERT INTO numbers set ?', [newNumber]);
        const numbers = await pool.query('SELECT * FROM numbers WHERE UserId = ? ORDER BY id DESC', [req.user.id]);
    
       
        // console.log(numbers)
        const newReward = {
            RewardName,
            RewardNumberId: numbers[0].id,
            // RewardClientId: clients[0].id,
            RewardDescription,
            RewardUserId: req.user.id,
            RewardDate,
            RewardValue,
            RewardCreatedAt: new Date(),
            RewardImage: JSON.stringify(req.body.RewardImage1),
            RewardNumbersGroup: 1
            
        };
        // console.log(newReward)
        // console.log(newNumber)
        
        await pool.query('INSERT INTO rewards set ?', [newReward]);        
    }



    }
    
    req.flash('success', 'Numero agregado correctamente');
    res.redirect('/listNumbers/listNumbers/'+ req.user.id);
});


 
router.get('/listNumbers/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const rewards = await pool.query('SELECT * FROM rewards WHERE RewardUserId = ?  GROUP BY RewardNumbersGroup ORDER BY RewardRewardId ASC', [req.user.id]);
    const numbers = await pool.query('SELECT C.ClientsCreatedAt, C.ClientsName, C.ClientsNumbers, N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId, N.NumbersGroup, R.RewardName, R.RewardDescription, R.RewardNumberId, R.RewardClientId, R.RewardRewardId, R.RewardNumbersGroup FROM numbers AS N LEFT JOIN clients AS C ON N.id = C.NumberId LEFT JOIN rewards AS R ON N.id = R.RewardNumberId WHERE RewardUserId = ?', [id]);
    // console.log(rewards)
    // console.log(numbers)
    const clients = await pool.query('SELECT * FROM clients WHERE NumberId = ?', [numbers[0].id]);
    res.render('numbers/listNumbers', { numbers, clients, rewards });
 });


 
 router.get('/numbers/:id', isLoggedIn, async (req, res) => {
        
        const { id } = req.params;

        const numbers = await pool.query('SELECT C.ClientsCreatedAt, C.ClientsName, C.ClientsNumbers, N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId, N.NumbersGroup, R.RewardName, R.RewardDescription, R.RewardNumberId, R.RewardClientId, R.RewardRewardId, R.RewardNumbersGroup FROM numbers AS N LEFT JOIN clients AS C ON N.id = C.NumberId LEFT JOIN rewards AS R ON N.id = R.RewardNumberId WHERE RewardNumbersGroup = ? AND UserId = ?', [id, req.user.id]);
        const clients = await pool.query('SELECT * FROM clients WHERE NumberId = ?', [numbers[0].id]);

        res.render('numbers/numbers', { numbers, clients, id});
 });

 router.get('/add-mass-clients/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const numbers = await pool.query('SELECT C.ClientsCreatedAt, C.ClientsName, C.ClientsPhone, C.ClientsEmail, C.ClientsNumbers, C.NumberId, N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId, N.NumbersGroup FROM numbers AS N LEFT JOIN clients AS C ON N.id = C.NumberId WHERE N.NumbersGroup = ?', [id]);

  res.render('numbers/add-mass-clients', {numbers: numbers[0]})
});
 
 router.post('/add-mass-clients/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
            
  const numbers = await pool.query('SELECT * FROM numbers WHERE UserId = ? AND NumbersGroup = ?  ORDER BY id DESC', [req.user.id, id]); 
    const { ClientsName, ClientsPhone, ClientsEmail, ClientsNumbers } = req.body;
    
      var partsArray = ClientsNumbers.split(','); // Divide la info ingresada por el usuario por la coma
          for (let i=0; i < partsArray.length; i++) { //Se itera sobre los numeros que ingresa el usuario para agregar uno por uno
            
            
            const numbers = await pool.query('SELECT * FROM numbers WHERE UserId = ? AND NumbersGroup = ? AND NumbersNumber = ? ORDER BY id DESC', [req.user.id, id, partsArray[i]]); 
            

            const newMassClient = {
            ClientsNumbers: partsArray[i],
            ClientsName,
            ClientsPhone,
            ClientsEmail,
            NumberId: numbers[0].id
    };
    await pool.query('INSERT INTO clients set ?', [newMassClient]);
  }
    req.flash('success', 'Comprador agregado correctamente');
    res.redirect('/listNumbers/numbers/'+ numbers[0].NumbersGroup);
});

 router.get('/edit-clients/:id', isLoggedIn, async (req, res) => {
     const { id } = req.params;
     const numbers = await pool.query('SELECT C.ClientsCreatedAt, C.ClientsName, C.ClientsPhone, C.ClientsEmail, C.ClientsNumbers, C.NumberId, N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId FROM numbers AS N LEFT JOIN clients AS C ON N.id = C.NumberId WHERE N.id = ?', [id]);

     res.render('numbers/edit-clients', {numbers: numbers[0]})
 });
 
 router.post('/edit-clients/:id', isLoggedIn, async (req, res) => {
     const { id } = req.params;
    //  console.log(id)
     const { ClientsName, ClientsPhone, ClientsEmail } = req.body;
     const reward = await pool.query('SELECT * FROM rewards WHERE RewardNumberId = ?  GROUP BY RewardNumbersGroup ORDER BY RewardRewardId ASC', [id]);
     const newName = {
        ClientsName,
        ClientsPhone,
        ClientsEmail
     };
     await pool.query('UPDATE clients set ? WHERE NumberId = ?', [newName, id]);
     req.flash('success', 'Comprador editado correctamente');
     res.redirect('/listNumbers/numbers/'+ reward[0].RewardNumbersGroup);
 });

 router.get('/add-clients/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const numbers = await pool.query('SELECT * FROM numbers WHERE id = ?', [id]);
    res.render('numbers/add-clients', {numbers: numbers[0]});
});

 router.post('/add-clients/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    const numbers = await pool.query('SELECT * FROM numbers WHERE id = ?', [id]);
        // console.log(numbers)
        // console.log(numbers[0].NumbersNumber)
    const reward = await pool.query('SELECT * FROM rewards WHERE RewardNumberId = ?  GROUP BY RewardNumbersGroup ORDER BY RewardRewardId ASC', [id]);
    
    const { ClientsName, ClientsPhone, ClientsEmail } = req.body;
        // console.log(ClientsName)
        const newClient = {
            ClientsNumbers: numbers[0].NumbersNumber,
            ClientsName,
            ClientsPhone,
            ClientsEmail,
            NumberId: numbers[0].id
    };
    await pool.query('INSERT INTO clients set ?', [newClient]);
    
    req.flash('success', 'Comprador agregado correctamente');
    res.redirect('/listNumbers/numbers/'+ reward[0].RewardNumbersGroup);
});

router.get('/delete-client/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const reward = await pool.query('SELECT * FROM rewards WHERE RewardNumberId = ?  GROUP BY RewardNumbersGroup ORDER BY RewardRewardId ASC', [id]);
    await pool.query('DELETE FROM clients WHERE NumberId = ?', [id]);
    req.flash('success', 'Comprador eliminado correctamente');
    res.redirect('/listNumbers/numbers/'+ reward[0].RewardNumbersGroup);
});

// router.get('/delete/:id', isLoggedIn, async (req, res) => {
//     const { id } = req.params;
//     await pool.query('DELETE FROM numbers WHERE ID = ?', [id]);
//     req.flash('success', 'Numero eliminado correctamente');
//     res.redirect('/listNumbers/listNumbers/'+ req.user.id);
// });



 module.exports = router;
