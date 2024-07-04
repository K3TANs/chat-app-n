import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectToMongoDb from "./db/connectToMongoDB.js";
import cors from 'cors'
import { app, server } from './socket/socket.js';
import path from "path";
import { fileURLToPath } from "url";

// const app = express();
dotenv.config({path:"./config/config.env"});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);

app.use(express.static(path.join(__dirname,'/Client/dist')))

app.get('*' , (req,res) => {
    res.sendFile(path.join(__dirname,"/Client/dist/index.html"))
} )

server.listen(process.env.PORT, () => {
    connectToMongoDb();
    console.log(`server running on port ${process.env.PORT}`)
});