const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//se llama a la base de datos
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
 
   const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('sucess', 'Bienvenido ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El usuario no existe'));
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    emailField: 'email',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]); //Busca en la base de datos si hay un usuario igual al ingresado
    if (rows.length > 0) { //Si encuentra alguno
       return done(null, false, req.flash('message', 'El usuario ya existe')); //Envia el mensaje de error y cancela el proceso de registro
    }

    if (password.length < 0) {
        return done(null, false, req.flash('message', 'Debe ingresar una contraseña'))
    }

    const { fullname } = req.body;

    if (fullname.length < 0) {
        return done(null, false, req.flash('message', 'Debe ingresar su nombre completo'))
    }
    
    var verificacionVariasPalabras= /\w+\s+\w+/; //codigo de verificacion de mas de una palabra
    
    if (!verificacionVariasPalabras.test(fullname)){ //verifica si el nombre tiene por lo menos dos palabras
        return done(null, false, req.flash('message', 'Favor de ingresar nombre y apellido')) //si no tiene dos palabras da error
    }    

    const { password2 } = req.body;

    if (password2.length < 0) {
        return done(null, false, req.flash('message', 'Debe ingresar repetir la contraseña'))
    }

    if (password !== password2 ) {//verifica si las contraseñas ingresadas no son iguales
        return done(null, false, req.flash('message', 'Las contraseñas no coinciden')) //si son distintas da error
        
    } 

    const { userEmail } = req.body;

    if (userEmail.length < 0){
        return done(null, false, req.flash('message', 'Debe ingresar un email')) //si son distintas da error
    }

    var verificacionEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //codigo de verificacion de correo

    if (!verificacionEmail.test(userEmail)){ //verifica si el email es correcto
        return done(null, false, req.flash('message', 'Favor de ingresar un correo válido')) //si el correo esta mal da error
    }
    
    const newUser = {
        username,
        password,
        fullname,
        userEmail
    };
    newUser.password = await helpers.encryptPassword(password)
    const result = await pool.query('INSERT INTO users SET ?', [newUser])
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users where id = ?', [id]);
    done(null, rows[0]);
});