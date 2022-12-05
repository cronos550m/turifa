const express = require('express');
const router = express.Router();
const pool = require('../database');

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth'); //sirve para proteger las rutas viendo si esta logeado

//Si el usuario ya esta autenticado, no va a mostrar el formulario de signup por la logica de "isNotLoggedIn"
router.get('/signup', isNotLoggedIn , (req, res) => {
    res.render('auth/signup', )
})
//El enrutador tambien se puede crear de la siguiente forma sin poner el req, res.
router.post('/signup', isNotLoggedIn , passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));

router.get('/signin', isNotLoggedIn , (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn , (req, res, next) => {


    passport.authenticate('local.signin', {
        successRedirect: 'profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

//agregando la logica "isLoggedIn" dentro de la ruta, el sistema verifica que el usuario este logeado para poder 
// habilitar el ingreso al perfil, antes de continuar con el resto de la logica
router.get('/profile', isLoggedIn, async (req, res) => { 

    const numbers = await pool.query('SELECT * FROM numbers WHERE UserId = ? ORDER BY id DESC', [req.user.id]);
    const rewards = await pool.query('SELECT * FROM rewards WHERE RewardUserId = ?  GROUP BY RewardNumbersGroup ORDER BY RewardRewardId ASC', [req.user.id]);
    const user = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    console.log(rewards)
    fullname = user[0].fullname.toLowerCase().replace(/\b[a-z]/g, function(letter) { //se muestra el nombre con la primer letra en mayuscula
        return letter.toUpperCase();
    });
    
    res.render('profile', {fullname, numbers, rewards})
});

router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logOut(req.user, err => {
        if(err) return next(err);
        res.redirect("/signin");  
    });
});

module.exports = router;