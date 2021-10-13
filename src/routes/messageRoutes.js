const express=require('express');
const msgRouter=express.Router();
const msgData=require('../model/message');

function router(user){
// msgRouter.post('/', async (req,res)=>{
//     const newmsg=req.body;
//     try{
//         const newMsg=await newmsg.save();
//         res.status(200).json(newMsg);
//     }catch(err){
//       res.status(500).json(err);  
//     }
// })
msgRouter.get('/:conversationid',async (req,res)=>{
    console.log(req.params.conversationid)
    try{ 
     msgData.findOne({conid:req.params.conversationid}).then((data)=>{
         //console.log(data.messages);
         //console.log(data);
         res.status(200).json(data);
     })
    }catch(err){
        res.status(500).json(err);
    }
})
msgRouter.get('/online/:id',(req,res)=>{
    console.log("hii" ,user);
    console.log(req.params.id);
    var ans=''
    if(user.includes(req.params.id.slice(1,-1))){
       ans='online'
    
    }
    
        res.send({online:ans})
    
})
msgRouter.post('/mute',(req,res)=>{
   var user=req.body.user;
   console.log(user);
   msgData.updateOne({conid:req.body.chatroom},{ $push: { muted: {user} } },(err,res)=>{
       if(err){
           console.log(error);
       }
       else{3
           console.log('Success!');
       }
   }) 
})
msgRouter.post('/unmute',(req,res)=>{

    var user=req.body.user;
    console.log(user);
    msgData.updateOne({conid:req.body.chatroom},{ $pull: { muted: {user} } },(err,res)=>{
        if(err){
            console.log(error);
        }
        else{
            console.log('Success!');
        }
    }) 
})
return msgRouter;
 }
module.exports=router;