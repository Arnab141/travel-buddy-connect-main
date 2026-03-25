const botRoutes = require('express').Router();
const { getBotResponse } = require('../../Controllers/UserController/bot');

botRoutes.post('/get-response', getBotResponse);

module.exports = botRoutes;