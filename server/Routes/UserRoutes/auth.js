const UserAuthRoute = require('express').Router();

const {login, register, genarateOTP, verifyOTP, getProfile} = require('../../Controllers/UserController/auth');
const isLogin = require('../../Configs/islogin');

UserAuthRoute.post('/login',login)
UserAuthRoute.post('/register',register)
UserAuthRoute.post('/genarate-otp', genarateOTP)
UserAuthRoute.post('/verify-otp',verifyOTP)
UserAuthRoute.get('/profile', isLogin, getProfile)



module.exports = UserAuthRoute;