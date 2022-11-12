const express = require('express');
const router = express.Router();

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
router.get('/profile', isLoggedIn, (req, res) => { 
    res.render('profile')
});

router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logOut(req.user, err => {
        if(err) return next(err);
        res.redirect("/signin");  
    });
});

module.exports = router;