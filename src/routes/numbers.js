const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn , isNotLoggedIn } = require('../lib/auth')


router.get('/add-numbers', (req, res) => {
    res.render('numbers/add-numbers');
});

router.post('/add-numbers', async(req, res) => {
    // const { id } = req.params;
    // const numbers = await pool.query('SELECT * FROM numbers WHERE id = ?', [id]);
    // const clients = await pool.query('SELECT * FROM clients WHERE NumberId = ?', [id]);
    const { numero1, RewardName, RewardDescription, RewardDate, RewardValue } = req.body;
    const NumbersGroup1 = await pool.query('SELECT * FROM numbers WHERE UserId = ? ORDER BY id DESC', [req.user.id]);
    
    // console.log(NumbersGroup1[0].NumbersGroup)
    NumbersGroup1[0].NumbersGroup += 1;
    NumbersNumber = 0;
    for (let i = 0; i < numero1; i++) {
        NumbersNumber+= 1
        // console.log(NumbersNumber)
        const newNumber = {
            NumbersNumber,
            UserId: req.user.id,       
            NumbersGroup: NumbersGroup1[0].NumbersGroup
        };  

        await pool.query('INSERT INTO numbers set ?', [newNumber]);
        const numbers = await pool.query('SELECT * FROM numbers WHERE UserId = ? ORDER BY id DESC', [req.user.id]);
        
        // const clients = await pool.query('SELECT * FROM clients ORDER BY id DESC');
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
            RewardNumbersGroup: NumbersGroup1[0].NumbersGroup
            
        };
        // console.log(newReward)
        // console.log(newNumber)
        
        await pool.query('INSERT INTO rewards set ?', [newReward]);        
    }
    req.flash('success', 'Numero agregado correctamente');
    res.redirect('/listNumbers/listNumbers/'+ req.user.id);
});


 
router.get('/listNumbers/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const rewards = await pool.query('SELECT * FROM rewards WHERE RewardUserId = ?  GROUP BY RewardNumbersGroup ORDER BY RewardRewardId ASC', [req.user.id]);
    const numbers = await pool.query('SELECT C.ClientsCreatedAt, C.ClientsName, C.ClientsNumbers, N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId, N.NumbersGroup, R.RewardName, R.RewardDescription, R.RewardNumberId, R.RewardClientId, R.RewardRewardId, R.RewardNumbersGroup FROM numbers AS N LEFT JOIN clients AS C ON N.id = C.NumberId LEFT JOIN rewards AS R ON N.id = R.RewardNumberId WHERE RewardUserId = ?', [id]);
    // console.log(numbers)
    const clients = await pool.query('SELECT * FROM clients WHERE NumberId = ?', [numbers[0].id]);
    res.render('numbers/listNumbers', { numbers, clients, rewards });
 });


 
 router.get('/numbers/:id', isLoggedIn, async (req, res) => {

        const { id } = req.params;

        const numbers = await pool.query('SELECT C.ClientsCreatedAt, C.ClientsName, C.ClientsNumbers, N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId, N.NumbersGroup, R.RewardName, R.RewardDescription, R.RewardNumberId, R.RewardClientId, R.RewardRewardId, R.RewardNumbersGroup FROM numbers AS N LEFT JOIN clients AS C ON N.id = C.NumberId LEFT JOIN rewards AS R ON N.id = R.RewardNumberId WHERE RewardNumbersGroup = ?', [id]);
        const clients = await pool.query('SELECT * FROM clients WHERE NumberId = ?', [numbers[0].id]);

        res.render('numbers/numbers', { numbers, clients });
 });

 
 

 
 router.get('/edit-clients/:id', isLoggedIn, async (req, res) => {
     const { id } = req.params;
     const numbers = await pool.query('SELECT C.ClientsCreatedAt, C.ClientsName, C.ClientsPhone, C.ClientsEmail, C.ClientsNumbers, C.NumberId, N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId FROM numbers AS N LEFT JOIN clients AS C ON N.id = C.NumberId WHERE N.id = ?', [id]);
    //  const numbers = await pool.query('SELECT * FROM numbers WHERE id = ?', [id]);
    //  const clients = await pool.query('SELECT * FROM clients WHERE number_id = ?', [id], '');
    //  console.log(numbers[0])
    //  console.log(clients[0]) -----------, clients: clients[0]}
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

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM numbers WHERE ID = ?', [id]);
    req.flash('success', 'Numero eliminado correctamente');
    res.redirect('/listNumbers/listNumbers/'+ req.user.id);
});



 module.exports = router;