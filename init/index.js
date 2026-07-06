import mongoose from 'mongoose';
import Message from '../models/message.js';
import Thread from '../models/thread.js';

main().then((res)=>{
    console.log("Connection Successful");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/aihub")
}