import express from 'express';
const router = express.Router();
import Thread from "../models/thread.js";
import call from '../utils/response.js';

router.post("/",async(req,res)=>{
    let {query,threadID,model} = req.body;
    if(!threadID || !query || model==="Select a model" ){
        return res.status(400).json({error: "missing required fields"});
    }
    const modelMap = {
        ChatGPT: "openai/gpt-4o-mini",
        Gemini: "google/gemini-3.1-flash-lite",
        Claude: "anthropic/claude-sonnet-4.5",
        Deepseek: "deepseek/deepseek-v4-flash",
    };
    
    if (!req.session.chatCount) {
        req.session.chatCount = 0;
    }

    try{
        const thread = await Thread.findOne({threadId:threadID});
        if(!thread){
            let thread= new Thread({
                threadId:threadID,
                emailID:req.body.email,
                title:req.body.query,
                model:model,
                messages:[
                    {
                        content:req.body.query,
                        role:"user",
                        timestamp:new Date(),
                    }
                ],
                createdAt:new Date(),
                updatedAt:new Date(),
            })
            if(req.body.email==="Guest"){
                if (req.session.chatCount >= 5) {
                    return res.status(403).json({error: "Limit exceed. Please login to continue."});
                }
                let response = await call(query,modelMap[model]);
                req.session.chatCount++;
                return res.status(200).json(response);
                console.log("User not logged in");
            }else{
                if (req.session.chatCount >= 15) {
                    return res.status(403).json({error: "Limit reached comeback tomorrow."});
                }
                let response = await call(query,modelMap[model]);
                thread.messages.push(response);
                let res2 = await thread.save();
                req.session.chatCount++;
                return res.status(200).json(response);
            }
        }else{
            let response = await call(query,modelMap[model]);
            thread.messages.push({
                content:req.body.query,
                role:"user",
                timestamp:new Date(),
            })
            thread.messages.push(response);
            thread.updatedAt = new Date();
            let res2 = await thread.save();
            return res.status(200).json(response);
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message || "Something went wrong"});
    }
})

export default router;