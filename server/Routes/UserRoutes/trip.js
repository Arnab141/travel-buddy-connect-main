const tripRouter = require('express').Router();

const  isLogin = require('../../Configs/islogin')

const { sheareTrip,getTrips, joinRequest, getNotifications, getJoinRequestById, markNotificationRead,updateJoinRequest,
  addUserInTrip,removeUserFromTrip, getMyTrips, getTripTracking,
  startTrip} = require('../../Controllers/UserController/trip');    



tripRouter.post('/share', isLogin, sheareTrip);
tripRouter.get('/all', isLogin, getTrips)
tripRouter.get('/join/:requestId', isLogin, getJoinRequestById);
tripRouter.post('/join-request', isLogin, joinRequest)
tripRouter.get('/notifications', isLogin, getNotifications)
tripRouter.put('/notifications/:notificationId', isLogin, markNotificationRead)
tripRouter.put('/join/:requestId',isLogin,updateJoinRequest)
tripRouter.get('/get-my-trips',isLogin, getMyTrips)
tripRouter.get('/tracking/:tripId', isLogin, getTripTracking);
tripRouter.post('/start/:tripId',isLogin, startTrip);


module.exports = tripRouter;