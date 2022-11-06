const express = require('express')
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash')
const session = require('express-session')
const MySQLStore = require('express-mysql-session');

const { database } = require('./keys');

// Initilizations
const app = express();

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


// Global variables
   //Se hace disponible el mensaje success en todas las vistas
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
});