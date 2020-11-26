const express = require('express');
// Сайт сможет взаимодействовать с другими сайтами по API (например, для регистрации через ВК)
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
const account = require('./routes/account');

const app = express();

const port = 3000;

app.use(cors());
// Будем получать данные в формате json
app.use(bodyParser.json());

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true });

// Обработчики событий подключения к БД
mongoose.connection.on('connected', () => {
    console.log("Successful connection");
});
mongoose.connection.on('error', (err) => {
    console.log("Not successful connection" + err);
});

app.listen(port, function() {
    console.log("The server was running on the port: " + port);
});

app.get('/', (request, response) => {
    response.send("Home page");
});

// Если адрес начинается на /account, то вызываем модуль account
app.use('/account', account);