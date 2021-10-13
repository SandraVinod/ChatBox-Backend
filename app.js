const express=require('express');
const app=new express();
const cors=require('cors');
const msgData=require('./src/model/message');
const userData=require('./src/model/userdata');
const conData=require('./src/model/conversation');
const authRouter=require('./src/routes/authRoutes');
var users=[]
const msgRouter=require('./src/routes/messageRoutes')(users);
const conRouter=require('./src/routes/conversationRoutes');
const path=require('path');
/*const http = require('http');*/
const http = require('http').createServer(app);


/*const server = http.Server(app);
const socketIO = require('socket.io');*/

/*const io = socketIO(server);
port=3000;
const server = app.listen(port, () => {
  console.log("Server started on port " + port + "...");
});
const io = socketIO.listen(server);*/

const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});
const multer=require('multer');

var storage=multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'./public/images/message/')
    },
    filename:function(req,file,cb){
      cb(null,file.originalname)
    }
  })
  var storage2=multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'././public/images/profilepics')
    },
    filename:function(req,file,cb){
      cb(null,file.originalname)
    }
  })

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/',authRouter)
app.use('/messages',msgRouter);
app.use('/conversations',conRouter);

let count;
let chatRooms;
let messagesArray = [];


function addUser(userid,socketid){
  users.push(userid)
}
var members=  [];
function getList(conid){
  conData.find({members:{$in:conid}}).then( async (data)=>{
    console.log(conid);
    
       for( i=0;i<data.length;i++){
        for(j=0;j<2;j++){
            if(data[i].members[j]!=conid){
                userData.findOne({_id:data[i].members[j]}).then((data)=>{
                    members.push(data);
                    console.log(data);
                   
                })
               
            }
           
        }
           }
     
})
return members;
}
io.on('connection', (socket) => {
  
  console.log('a user connected');
  
   socket.on('joinuser',(data)=>{
    
    socket.join(data);
   })
 
    socket.on('addUser',(userid)=>{
      if(!users.includes(userid)){
     addUser(userid);
    // socket.emit('get online',users)
      }
    // console.log(users);
    io.emit('get online',users);
   })
   socket.on('join',(data=>{
    
     socket.join(data.room);
    /* console.log(data.room);*/
     msgData.findOne({conid:data.room}).then((room)=>{
     /* console.log(room);*/
      // if(room.blocked[0]==data.receiver || room.blocked[1]==data.receiver){
      //   io.in(data.room).emit('block',{blocked:true});
      // }
      // else{
      //   io.to(data.receiver).emit('block',{blocked:false})
      // }
       if(!room){
        
        item={
          conid:data.room,
          messages:[]
        }
        var newroom=msgData(item);
         newroom.save();
        
                      //  var contact;
                      //  var msg;
                      //    userData.findOne({_id:data.user}).then((dat)=>{
                      //      contact=dat.user;
                      //    })
                       
                      //      msgData.findOne({conid:data.room}).then((item)=>{
                      //        //console.log(item.messages.pop());
                      //         msg=item.messages.pop();
                      //         io.to(data.sendto).emit('new conversation',{contact:contact,msg:msg})
                              //res.send(members);
                         //  })
                           
                         //  console.log(item);
                      
              
         
        
         
      }
     
       
      /* if(err){
         console.log(err);
         return false;
       }
       count=0;
       rooms.forEach((room)=>{
         if(room.conid==data.room){
           count++;
         }
         
       });
      if(count==0){
        item={
          conid:data.room,
          messages:[]
        }
      }
      var newroom=msgData(item);
      newroom.save();*/
     })
   }))
  /* socket.on('getlist',async (conid)=>{
     
    var memb=await getList(conid);
     
    console.log(memb);
   io.in(socket.id).emit('fetchlist',memb);


   })*/
   socket.on('removeUser',(data)=>{
     console.log('dataaaaa',data);
     users=users.filter((item)=>{
       return item!=data;
     })
     console.log(users);
    setTimeout(function(){io.emit('get online',users)},200);
   })
   socket.on('message', (data) => {
    /*console.log("hi");*/
    // emitting the 'new message' event to the clients in that room
    
   console.log('dataaa',data)
    // save the message in the 'messages' array of that chat-room
    var d=new Date();
    var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var date=d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();
    // var t;
    // var ap;
    // if(d.getHours>12){
    //    t=d.getHours%12;
       
    // }
    // else{s
    //    t=d.getHours();
    // }
    var time=d.getHours()+':'+d.getMinutes()
    //console.log(date);
    //console.log('rrrrrrr',data.room);
    
    if(data.type=='file'){
      console.log('File detected!!');
      
    }
    msgData.updateOne({conid: data.room}, { $push: { messages: { user: data.user, message:[ data.message,date,time ],type:data.type,filename:data.fileName} } }, (err, res) => {
        if(err) {
            console.log(err);
            return false;
        }
    });
    var sender;
    var muted;
    var contact;
    var datauser=data.user.slice(1,-1);
    console.log(datauser);
    userData.findOne({_id:datauser}).then((dat)=>{
     sender=dat.username;
     contact=dat;
     console.log('datarooom',data.room);
     io.to(data.room).to(data.sendto).emit('new message', {user: data.user, message:[ data.message,date,time ],type:data.type,filename:data.fileName,room:data.room,contact:contact});
    })
    console.log(contact);
    
    msgData.findOne({conid:data.room}).then((d)=>{
      
      if(d.muted){
        muted=d.muted;
      }
      else{
        muted='';
      }
      console.log('data',muted);
      io.to(data.sendto).emit('notification',{user:data.username,message:data.message,room:data.room,muted:muted});
     })
    
    //console.log('hiiiiiiiii',data.sendto);
    
});
  
  socket.on('disconnect', () => {
    io.emit('get online',users);
    console.log('user disconnected');

  });
});
  
app.post('/images',(req,res)=>{
  var upload = multer({ storage: storage }).single('image');
  var mute;
 // console.log('reqqq',req.body.room);
  upload(req, res, (err) => {
    if(err){
        console.log(err);
    }
    if (req.file) {
      console.log('body',req.body.sendto);
      var d=new Date();
      var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      var date=d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();
      var time=d.getHours()+':'+d.getMinutes()
      io.to(req.body.room).emit('new message', {user: req.body.user, message:[ req.file.filename,date,time ],type:'file',filename:req.file.fileName,room:req.body.room});
      msgData.updateOne({conid: req.body.room}, { $push: { messages: { user: req.body.user, message:[ req.file.filename,date,time ],type:'file',filename:req.file.fileName} } }, (err, res) => {
        if(err) {
            console.log(err);
            return false;
        }
    });
    msgData.findOne({conid:req.body.room}).then((d)=>{
      
      if(d.muted){
        muted=d.muted;
      }
      else{
        muted='';
      }
      console.log('data',muted);
      //io.to(data.sendto).emit('notification',{user:data.username,message:data.message,room:data.room,muted:muted});
      io.to(req.body.sendto).emit('notification',{user:req.body.username,message:req.file.filename,room:req.body.room,muted:muted});
     })
    //io.to(req.body.sendto).emit('notification',{user:req.body.username,message:req.file.filename,room:req.body.room});
    }
  })
})
app.post('/messages/block',(req,res)=>{
  var chatroom=req.body.chatroom;
  var user=req.body.user;
  console.log('chaaaaat',chatroom);
  var receiver=req.body.receiver;
  //io.emit('block',{blocked:'no'});
  msgData.updateOne({conid:chatroom},{ $push: { blocked: {user} } },(err,res)=>{
      if(err){
          console.log(err);
      }
      else{
          console.log('yessss');
      }
  })
  io.to(receiver).emit('block',{blocked:true,user:user});
  //    msgData.findOne({conid:chatroom}).then((data)=>{
  //        console.log(data);
  //    })
    
})
app.post("/messages/unblock",(req,res)=>{
  var chatroom=req.body.chatroom;
  var user=req.body.user;
  var receiver=req.body.receiver;
  console.log(receiver);
  
  msgData.updateOne({conid:chatroom},{ $pull: { blocked : {user: user} }},(err,res)=>{
      if(err){
          console.log(err);
      }
      else{
          console.log('success!');
            
      }
      io.to(receiver).emit('block',{blocked:false,user:user});
  })
})
app.post('/conversations/editprofile',(req,res)=>{
  var upload = multer({ storage: storage2 }).single('img');
  upload(req, res, (err) => {
      if(err){
          console.log(err);
      }
      else{
          var username=req.body.username;
          var id=req.body.id;
          console.log(id);
         // console.log('userrr',req.file.filename);
         if(req.file){
  userData.updateOne({_id:id},{$set: {username: username,img:req.file.filename}},(err,res)=>{
      if(err){
          console.log(err);
      }
      else{
        io.emit('profile update',{username:username,img:req.file.filename,_id:id})
      }
  })
}
else{
  userData.updateOne({_id:id},{$set: {username: username}},(err,res)=>{
    if(err){
        console.log(err);
    }
    else{
      io.emit('profile update',{username:username,img:req.file.filename,_id:id})
    }
})
}
      }
  })
})

http.listen(3000, () => {
  console.log('listeninghttp on *:3000');
});

/*app.listen(3000, function () {
    console.log("listening to port number: 3000");
  
  });
  */