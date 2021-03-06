const express = require('express');
// Сайт сможет взаимодействовать с другими сайтами по API (например, для регистрации через ВК)
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
const account = require('./routes/account');
const Post = require('./models/post');

const app = express();

const port = 3000;

app.use(passport.initialize());
app.use(passport.session());

// Вызовется функция, для которой в config/passport указан module.exports
require('./config/passport')(passport);

app.use(cors());
// Будем получать данные в формате json
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 1000000
}));

mongoose.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Обработчики событий подключения к БД
mongoose.connection.on('connected', () => {
    console.log("Successful connection");
});
mongoose.connection.on('error', (err) => {
    console.log("Not successful connection" + err);
});

app.listen(port, function () {
    console.log("The server was running on the port: " + port);
});

app.get('/', (request, response) => {
    Post.find().then(posts => response.json(posts));
});

app.get('/post/:id', (request, response) => {
    let url = request.url.split('/');
    let id = url[2];
    Post.findById(id).then(post => response.json(post));
});

app.delete('/post/:id', (request, response) => {
    let url = request.url.split('/');
    let id = url[2];
    Post.deleteOne({_id: id}).then(() => response.json({success: true}));
});

// Если адрес начинается на /account, то вызываем модуль account
app.use('/account', account);