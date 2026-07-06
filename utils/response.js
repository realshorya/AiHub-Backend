import dotenv from 'dotenv';
dotenv.config({path:'../.env'});

async function call(query,model){
    try{
        const response = await fetch("https://api.meshapi.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
            model: model,
            messages: [
            { role: "system", content: "You are a concise assistant." },
            { role: "user", content:query }
            ],
            temperature: 0.2
        }),
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.error?.message || "MeshAPI request failed");
        }
        let message ={
            content:data.choices[0].message.content,
            role:data.choices[0].message.role,
            timestamp:new Date(),
        };
        return message;
    }catch(err){
        throw err;
    }
}

export default call;



