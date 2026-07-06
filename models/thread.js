import mongoose from 'mongoose';

const messageSchema = mongoose.Schema([{
    content:{
        type:String,
        require:true,
    },
    role:{
        type:String,
        enum:["user","assistant"],
        required:true,
    },
    timestamp:{
        type:Date,
        required:true,
    },
}]);

const threadSchema = mongoose.Schema({
    threadId:{
        type:String,
        required:true,
        unique:true,
    },
    emailID:{
        type:String,
        default:"no",
    },
    title:{
        type:String,
        required:true,
    },
    model:{
        type:String,
        enum:["ChatGPT","Gemini","Deepseek","Claude"],
        required:true,
    },
    messages:[messageSchema],
    createdAt:{
        type:Date,
        required:true,
    },
    updatedAt:{
        type:Date,
    }
});

const Thread = mongoose.model("Thread",threadSchema);
export default Thread;