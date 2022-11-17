const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth')


router.get('/add-numbers', (req, res) => {
    res.render('numbers/add-numbers');
});

router.post('/add-numbers', async(req, res) => {
    const { numero1, nombre } = req.body;
    numero = 0;
    for (let i = 0; i < numero1; i++) {
        numero+= 1
  
        console.log(numero)
        const newNumber = {
            numero,
            nombre,
            user_id: req.user.id
    };
        await pool.query('INSERT INTO numbers set ?', [newNumber]);
    }
    req.flash('success', 'Link agregado correctamente');
    res.redirect('/numbers');
});


// router.get('/numbers', isLoggedIn, async (req, res) => {
//     const numbers = await pool.query('SELECT * FROM numbers WHERE user_id = ?', [req.user.id]);
//     // const clients = await pool.query('SELECT * FROM clients')
//     // console.log(clients)
//     res.render('/numbers', {numbers});
//  });
 
router.get('/', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const numbers = await pool.query('SELECT C.ClientsCreatedAt, C.ClientsName, C.ClientsNumbers, N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId FROM numbers AS N LEFT JOIN clients AS C ON N.id = C.NumberId WHERE UserId = ?', [req.user.id]);
    // console.log(numbers[0].id)
    console.log(numbers)
    // const clients = await pool.query('SELECT * FROM clients WHERE number_id = ?', [numbers[0].id]);
    // const clients = await pool.query('SELECT * FROM clients');

    // console.log(clients)
    res.render('numbers/numbers', {numbers});
 });

 
 
 router.get('/delete/:id', isLoggedIn, async (req, res) => {
     const { id } = req.params;
     await pool.query('DELETE FROM numbers WHERE ID = ?', [id]);
     req.flash('success', 'Numero eliminado correctamente');
     res.redirect('/numbers');
 });
 
 router.get('/edit-clients/:id', isLoggedIn, async (req, res) => {
     const { id } = req.params;
     const numbers = await pool.query('SELECT C.ClientsCreatedAt, C.ClientsName, C.ClientsNumbers, C.NumberId, N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId FROM numbers AS N LEFT JOIN clients AS C ON N.id = C.NumberId WHERE N.id = ?', [id]);
    //  const numbers = await pool.query('SELECT * FROM numbers WHERE id = ?', [id]);
    //  const clients = await pool.query('SELECT * FROM clients WHERE number_id = ?', [id], '');
    //  console.log(numbers[0])
    //  console.log(clients[0]) -----------, clients: clients[0]}
     res.render('numbers/edit-clients', {numbers: numbers[0]})
 });
 
 router.post('/edit-clients/:id', isLoggedIn, async (req, res) => {
     const { id } = req.params;
     console.log(id)
     const { ClientsName } = req.body;
     const newName = {
        ClientsName
     };
     await pool.query('UPDATE clients set ? WHERE NumberId = ?', [newName, id]);
     req.flash('success', 'Cliente editado correctamente');
     res.redirect('/numbers')
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
    const { ClientsName } = req.body;
        // console.log(ClientsName)
        const newClient = {
            ClientsNumbers: numbers[0].NumbersNumber,
            ClientsName,
            NumberId: numbers[0].id
    };
    await pool.query('INSERT INTO clients set ?', [newClient]);
    
    req.flash('success', 'Link agregado correctamente');
    res.redirect('/numbers');
});

router.get('/delete-client/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM clients WHERE NumberId = ?', [id]);
    req.flash('success', 'Cliente eliminado correctamente');
    res.redirect('/numbers');
});



 module.exports = router;