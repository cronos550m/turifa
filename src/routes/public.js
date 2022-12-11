const express = require('express');
const router = express.Router();

const pool = require('../database');



router.get('/listpublic/:id', async (req, res) => {
    const { id } = req.params;
    const numbers = await pool.query('SELECT C.ClientsCreatedAt, C.ClientsName, C.ClientsNumbers, N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId, N.NumbersGroup, R.RewardName, R.RewardDescription, R.RewardNumberId, R.RewardClientId, R.RewardRewardId, R.RewardNumbersGroup FROM numbers AS N LEFT JOIN clients AS C ON N.id = C.NumberId LEFT JOIN rewards AS R ON N.id = R.RewardNumberId WHERE RewardNumbersGroup = ?', [id]);
    // const numbers = await pool.query('SELECT N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId, R.RewardName, R.RewardDescription, R.RewardNumberId, R.RewardClientId FROM numbers AS N LEFT JOIN rewards AS R ON N.id = R.RewardNumberId WHERE N.UserId = ?', [req.user.id]);
    // console.log(numbers[0].id)
    // console.log(numbers)
    const clients = await pool.query('SELECT * FROM clients WHERE NumberId = ?', [numbers[0].id]);
    // const clients = await pool.query('SELECT * FROM clients');
    // console.log(clients)
    // const rewards = await pool.query('SELECT N.id, R.id AS RewardId, R.RewardName, R.RewardNumberId, R.RewardDescription, R.RewardCreatedAt, R.RewardUserId FROM rewards AS R LEFT JOIN numbers AS N ON R.RewardNumberId = N.id WHERE R.RewardUserId = ?', [req.user.id]);
    // console.log(rewards.RewardId)


console.log(numbers)
    res.render('public/listpublic', {numbers, clients});

 });



module.exports = router;