const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlstore = require('express-mysql-session');
const passport = require('passport');

const {database} = require('./keys');
//iniciar express
const app = express();
require('./lib/passport');
//Settings

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main', 
    layoutsDir: path.join(app.get('views'), 'layout'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs');

//Middlewares-> morgan para ver las peticiones por consola
app.use(session({
    secret: 'aztfirespellnodesesion',
    resave: false,
    saveUninitialized: false,
    store: new mysqlstore(database)
}))
app.use(flash());
app.use(morgan('dev'));
//Para no enviar imagenes y json
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());


//Global variables
app.use((req, res, next)=>{ 
    app.locals.success = req.flash('success');
    app.locals.success = req.flash('message');
    app.locals.user = req.user;
    //next ejecuta el siguiente fragmento de codigo
    next();
})

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));


//Public
app.use(express.static(path.join(__dirname, 'public')));
//Starting the server

app.listen(app.get('port'), ()=> {
    console.log('Server iniciado en puerto', app.get('port'));
});
