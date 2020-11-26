const express = require('express');
const router = express.Router();
const User = require('../models/user')


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
    });
});

router.get('/auth', (request, response) => {
    response.send("Login page");
});

router.get('/dashboard', (request, response) => {
    response.send("Dashboard page");
});

module.exports = router;