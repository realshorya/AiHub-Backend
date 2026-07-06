import express from 'express';
const router = express.Router();
import Thread from "../models/thread.js";

router.post("/",async(req,res)=>{
    try{
        const threads = await Thread.find({emailID:req.body.email}).sort({ updatedAt: -1});
        if(!threads){
            return res.status(404).json({error: "Thread not found"});
        }
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Not Found"})
    }
});

router.delete("/:id",async(req,res)=>{
    try{
        let id = req.params.id;
        let response = await Thread.findOneAndDelete({threadId:id});
        if (!response) {
            return res.status(404).json({error: "Thread not found"});
        }
        return res.status(200).json({success: "Thread deleted sucessfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Not able to Delete Thread"})
    }
})

export default router;