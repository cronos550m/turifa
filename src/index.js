const express = require('express')
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash')
const session = require('express-session')
const MySQLStore = require('express-mysql-session');
const passport = require('passport');


const { database } = require('./keys');

// Initilizations
const app = express();
require('./lib/passport');


// Settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
/* Tuve que agregarle .engine a exphbs para que no de error */
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname:'.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs')


// Public
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(session({
    secret: 'paginadelinks',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
   //Se hace disponible el mensaje success en todas las vistas
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));
app.use('/numbers', require('./routes/numbers'));
app.use('/listNumbers', require('./routes/numbers'));
app.use('/rewards', require('./routes/rewards'));
app.use('/public', require('./routes/public'));



// Starting the server
app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
});

