const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const http = require('http');                 
const { Server } = require('socket.io');     

require('./cron/tripStatusUpdater')

dotenv.config();

const app = express();
const PORT = 3000;
const api_version = "v1";

const UserAuthRoute = require('./Routes/UserRoutes/auth');
const TripRoute = require('./Routes/UserRoutes/trip');
const connectDb = require('./Configs/db');
const botRoutes = require('./Routes/UserRoutes/bot');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

connectDb();

app.use(`/api/${api_version}/user`, UserAuthRoute);
app.use(`/api/${api_version}/trip`, TripRoute);
app.use(`/api/${api_version}/bot`, botRoutes);

app.get('/', (req, res) => {
    res.send('Server is up and running');
});


// ================================
// ✅ CREATE HTTP SERVER
// ================================
const server = http.createServer(app);

// ================================
// ✅ ATTACH SOCKET TO SAME SERVER
// ================================
const io = new Server(server, {
    cors: {
        origin: "*",  
        methods: ["GET", "POST"]
    }
});

// ================================
// ✅ SOCKET CONNECTION
// ================================
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join",(userId) => {
        console.log(`User ${userId} joined with socket ID: ${socket.id}`);
        socket.join(userId); // Join a room named after the user ID
    });
    

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.set("io",io);

// ================================
// ✅ START SERVER (NOT app.listen)
// ================================
server.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(`API endpoints available at http://localhost:${PORT}/api/${api_version}/`);
        console.log(`Socket.IO server running at ws://localhost:${PORT}`);
    }
});