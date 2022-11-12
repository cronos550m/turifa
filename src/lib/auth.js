module.exports = {
//sirve para verificar si esta logeado un usuario y asi proteger la ruta
    isLoggedIn(req, res, next){
        if (req.isAuthenticated()) { //si esta el usuario auntenticado
            return next(); //continua con el codigo de la ruta
        }
        return res.redirect('/signin'); //si no, redirecciona a "signin"
    } ,
//Sirve para que el usuario que este logeado no pueda ingresar a la ruta a la que se le asigne esta logica
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/profile');
    }

}