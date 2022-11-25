const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth')



router.get('/rewards-details/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const rewardList = await pool.query('SELECT R.RewardRewardId, R.RewardDate, R.RewardName, R.RewardDescription, R.RewardCreatedAt FROM rewards AS R WHERE R.RewardRewardId = ?', [id]);
    // const numbers = await pool.query('SELECT N.id, N.NumbersCreatedAt, N.NumbersNumber, N.NumbersReward, N.UserId FROM numbers AS N LEFT JOIN clients AS C ON N.id = C.NumberId WHERE UserId = ?', [req.user.id]);
    // console.log(numbers[0].id)
    // console.log(numbers)
    // const clients = await pool.query('SELECT * FROM clients WHERE number_id = ?', [numbers[0].id]);
    // const clients = await pool.query('SELECT * FROM clients');

     console.log(rewardList[0])
    res.render('rewards/rewards-details', {rewardList: rewardList[0]});
 });

 



module.exports = router;