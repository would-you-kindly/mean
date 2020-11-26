const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

router.post('/reg', (request, response) => {
    let newUser = new User({
        name: request.body.name,
        email: request.body.email,
        login: request.body.login,
        password: request.body.password,
    });
    User.addUser(newUser, (err, user) => {
        if (err) {
            response.json({
                success: false,
                message: "User has not been added"
            });
        } else {
            response.json({
                success: true,
                message: "User has been added"
            });
        }
        console.log('New user registered: ' + newUser);
    });
});

router.post('/auth', (request, response) => {
    const login = request.body.login;
    const password = request.body.password;
    User.getUserByLogin(login, (err, user) => {
        if (err)
            throw err;
        if (!user)
            return response.json({
                success: false,
                message: "This user was not found"
            });

        User.comparePass(password, user.password, (err, isMatch) => {
            if (err)
                throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 3600 * 24 // Количество секунд, в течение которого длится сессия (после ее окончания нужно авторизироваться снова)
                });

                response.json({
                    success: true,
                    token: 'JWT' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        login: user.login,
                        email: user.email,
                    }
                });
            } else {
                return response.json({
                    success: false,
                    message: "Password mismatch"
                });
            }
        });
    });
});

// Запрещаем входить пользователю в кабинет, пока он не авторизирован (пока сессия = false)
router.get('/dashboard', passport.authenticate('jwt', {
    session: false
}), (request, response) => {
    response.send("Dashboard page");
});

module.exports = router;