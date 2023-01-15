const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth')



router.get('/rewards-details/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const rewardList = await pool.query('SELECT R.RewardRewardId, R.RewardDate, R.RewardValue, R.RewardName, R.RewardDescription, R.RewardCreatedAt, R.RewardImage FROM rewards AS R WHERE R.RewardRewardId = ?', [id]);
    const images = await pool.query(`SELECT RewardImage FROM rewards WHERE RewardRewardId = ?`, [id]);
    // const images2 = await pool.query(`SELECT JSON_EXTRACT(RewardImage, '$**.filename') AS filename FROM rewards WHERE RewardRewardId = ?`, [id])

let image1 = images.map(function(obj){
    console.log(obj.RewardImage)
   
    return (obj)
    
 });

 let image3 = [];

image1.map(function(obj){
    console.log(obj)

    const splitString = obj.RewardImage.split("\"");
    
        for (let i=23; i < splitString.length; i += 30) {
            image3.push(splitString[i])
           

        console.log(splitString[i]);
            
      }

 });
    
    res.render('rewards/rewards-details', {rewardList: rewardList[0], image3: image3, userId: userId});
 });

 



module.exports = router;