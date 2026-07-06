import express from 'express';
import session from "express-session";
import MongoStore from "connect-mongo";
import 'dotenv/config';
const app = express();
const PORT=8080;
import cors from "cors";
import Thread from "./models/thread.js";
import mongoose from 'mongoose';
import threadRouter from "./routes/threads.js";
import chatRouter from "./routes/chats.js";


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin:[
        "http://localhost:5173", // React URL
        "https://ai-hub-backend-swart.vercel.app/",
        "https://aihub-backend-uv4n.onrender.com/",
    ],
    credentials: true
}));

const store = MongoStore.create({
    mongoUrl:process.env.DB_LINK,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure:true,
        sameSite:"none",
        maxAge: 1000 * 60 * 60 * 24// 24 hour
    }
}));

main().then((res)=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(process.env.DB_LINK);
}


app.use("/chats",chatRouter);
app.use("/threads",threadRouter);

app.listen(PORT,()=>{
    console.log("Listening at Port 8080");
})
app.get("/", (req, res) => {
    res.send("Backend is running");
});

