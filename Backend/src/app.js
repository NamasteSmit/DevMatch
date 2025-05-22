const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const app = express();
const PORT = 3000;
const connectDB = require('./config/db');
const UserRouter = require('./routes/auth');
const ProfileRouter = require('./routes/profile');
const ConnectionRequestRouter = require('./routes/requests')
const ChatRouter = require('./routes/chat')
const viewRouter = require('./routes/view');
const cookieParser = require('cookie-parser'); 
const cors = require('cors')
//socket establishment
const http = require('http');
const initializeSocket = require('./socket/socket');

require('./utils/cronjob');

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/user' , UserRouter);
app.use('/api/v1/profile', ProfileRouter);
app.use('/api/v1/request' , ConnectionRequestRouter);
app.use('/api/v1/view/user', viewRouter);
app.use('/api/v1/user/chat',ChatRouter)

const server = http.createServer(app);

initializeSocket(server);


connectDB().then(()=>{
    console.log("Database connected Successfully");
    server.listen(PORT,()=>{
        console.log("Server listening on port : " , 3000);
    })
}).catch((err)=>{
    console.log("Error connecting Database")
})
