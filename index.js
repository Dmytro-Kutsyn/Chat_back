import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from 'http';
import { Server } from 'socket.io';

import chatRouter from "./chat/chatRouter.js";
import addUser, { findUser } from "./chat/users.js";

import authRouter from "./auts/authRouter.js";

const PORT = process.env.PORT || 5000;
const DB_URL = 'mongodb+srv://dimajc9:kCXQiVcwa38QKNZR@cluster0.avyc4ex.mongodb.net/?retryWrites=true&w=majority';
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use('/auth', authRouter);
app.use(chatRouter);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }) => {
        socket.join(room)

        const { user } = addUser({ name, room })


        socket.emit('message', {
            data: {
                user: {
                    name: "Admin"
                },
                message: `Hey ${user.name}`
            }
        })

        socket.broadcast.to(user.room).emit('message', {
            data: {
                user: {
                    name: "Admin"
                },
                message: `${user.name} has joined`
            }
        })
    })

    socket.on("sendMessage", ({ message, params }) => {
        const user = findUser(params);
    
        if (user) {
          io.to(user.room).emit("message", { data: { user, message } });
        }
    });

    io.on('disconnect', () => {
        console.log('Disconnect');
    })
})

const start = async () => {
    try {
        await mongoose.connect(DB_URL)
        server.listen(PORT, () => console.log('server started', PORT))
    } catch (e) {
        console.log(e);
    }
}

start()
