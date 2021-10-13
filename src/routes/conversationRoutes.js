const express=require('express');
const conRouter=express.Router();
const conData=require('../model/conversation');
const userData=require('../model/userdata');
const msgData=require('../model/message');
const conversation = require('../model/conversation');
const multer=require('multer');

var storage=multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'././public/images/profilepics')
    },
    filename:function(req,file,cb){
      cb(null,file.originalname)
    }
  })
conRouter.post('/',async(req,res)=>{
     var senderId=req.body.senderId.slice(1,-1);
     var recieverId=req.body.recieverId.slice(1,-1);
     conData.findOne({$and:[{members:{$in:senderId}},{members:{$in:recieverId}}]}).then((data)=>{
        
         if(!data){
var item={
        members:[senderId,recieverId]
    }
    const conversation=conData(item);
    
     const savedconversation= conversation.save();
     res.status(200).json(savedconversation);
}
    
})
})
var conv;

conRouter.get('/:username',async (req,res)=>{
try{
    conid=req.params.username.slice(1,-1);
 conData.find({members:{$in:conid}}).then( async (dat)=>{
    //console.log(conid);
     
         
        for(var i=0;i<dat.length;i++){
            var members=  [];
         for(var j=0;j<2;j++){
             
            var id=dat[i].members[j];
             if(dat[i].members[j]!=conid){
                 
               
                 userData.findOne({_id:dat[i].members[j]}).then((data)=>{
                //console.log(id);
                     if(conid<data._id){
                        conv='"'+conid+'""'+data._id+'"';
                     }
                     else{
                        conv='"'+data._id+'""'+conid+'"';
                     }
                     msgData.findOne({conid:conv}).then((item)=>{
                       //console.log(item.messages.pop());
                        var item=JSON.parse(JSON.stringify(item));
                        members.push({user:conid,contact:data,msg:item.messages.pop()});
                        //res.send(members);
                     })
                     
                   //  console.log(item);
                   
                 })
                 
             }
            
         }
            }
            setTimeout(function(){
                 res.send(members);
            },500)
         
   
 })
}catch{
    res.status(500).json(err);
}
})
conRouter.get('/profile/:user',(req,res)=>{
    var id=req.params.user;
    console.log(id);
    userData.findOne({_id:id}).then((data)=>{
        console.log(data);
        res.send(data);
    })
})
// conRouter.post('/editprofile',(req,res)=>{
//     var upload = multer({ storage: storage }).single('img');
//     upload(req, res, (err) => {
//         if(err){
//             console.log(err);
//         }
//         else{
//             var username=req.body.username;
//             var id=req.body.id;
//             console.log('userrr',req.file.filename);
//     userData.updateOne({_id:id},{$set: {username: username,img:req.file.filename}},(err,res)=>{
//         if(err){
//             console.log(err);
//         }
//     })
//         }
//     })
//})
module.exports=conRouter;
