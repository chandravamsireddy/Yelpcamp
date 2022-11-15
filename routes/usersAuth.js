const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../Utilities/catchAsync');
const userController = require('../controllers/users')

router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync(userController.register))

router.route('/login')
    .get(userController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), userController.login)

router.get('/logout', userController.logout);

module.exports = router;
