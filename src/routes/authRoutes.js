const express=require('express');
const authRouter=express.Router();
const userData=require('../model/userdata');
const Code=require('../model/secretcode');

const jwt = require("jsonwebtoken");
const cryptoRandomString = require('crypto-random-string');
//const cryptoRandomString = require("crypto-random-string");
/*const { Code } = require("../model/secretcode");*/
const { hash, compare } = require("../utils/bcrypt");
const emailService = require("../utils/nodemailer");
const { response } = require('express');

authRouter.post('/signup',async (req,res)=>{
    res.header("Access-Control-Allow-Orgin", "*");
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
    console.log(req.body.user);
    var user1=req.body.user;
    var item={
        name:user1.name,
        username:user1.username,
        email:user1.email,
        pwd:user1.pwd
    }
    var newuser= userData(item);
    //newuser.save();
    //const hashedPw = await hash(password);
     user = await newuser.save();
               /* const token = jwt.sign(
                    {
                        userId: user._id,
                        userRole: user.role,
                        userStatus: user.status,
                    },
                    res.locals.secrets.JWT_SECRET,
                    {
                        expiresIn: 60 * 60 * 24 * 14,
                    }
                );
                req.session.token = token;*/

                const baseUrl = req.protocol + "://" + req.get("host");
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                var newCode ={
                    code: secretCode,
                    email: user.email,
                };
                var newCodeready=Code(newCode)
                await newCodeready.save();
                const data = {
                    from: 'Chat Box',
                    to: user.email,
                    subject: "Your Activation Link for ChatBox",
                    text: `Please use the following link within the next 10 minutes to activate your account on ChatBox: ${baseUrl}/verification/verify-account/${user._id}/${secretCode}`,
                    html: `<p>Please use the following link within the next 10 minutes to activate your account on ChatBox: <strong><a href="${baseUrl}/verification/verify-account/${user._id}/${secretCode}" target="_blank">click here</a></strong></p>`,
                };
                await emailService.sendMail(data);

                res.json({
                    success: true,
                    userRole: user.role,
                    userId: user._id,
                    userStatus: user.status,
                });
            

});
authRouter.get(
    "/verification/verify-account/:userId/:secretCode",
    async (req, res) => {
        try {
            const user = await userData.findById(req.params.userId);
            const response = await Code.findOne({
                email: user.email,
                code: req.params.secretCode,
            });
            console.log(user);
            if (!response || !user) {
                res.sendStatus(401);
            } else {
                await userData.updateMany(
                    { email: user.email },
                    { status: "active" }
                );
                await Code.deleteMany({ email: user.email }).then((data)=>{
                    res.send("<h1 style='margin-left:40%;margin-top:15%;'>✓Account Verified</h1>");
                });

               
               
                
                   

                

                
            }
        } catch (err) {
            // console.log(
            //     "Error on /api/auth/verification/verify-account: ",
            //     err
            // );
            // res.sendStatus(500);
        }
    }
);
authRouter.get('/search/:username',(req,res)=>{
    res.header("Access-Control-Allow-Orgin", "*");
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
    var regex = new RegExp(req.params.username, 'i');
    userData.find({ username: regex }).then((data) => {
      res.send(data);
    })
})
authRouter.post('/login',(req,res)=>{
    res.header("Access-Control-Allow-Orgin", "*");
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
    user=req.body.user;   
    console.log(user); 
    userData.findOne({$and:[{username:user.username},{pwd:user.pwd}]}).then((data)=>{
        if(data){
            if(data.status!='pending'){
           
                res.status(200).send({error:'none',id:data._id,username:data.username});
            
        }
         else{
                res.status(401).send("Please verify your email id!");
            }
        
    
}
else{
    res.status(401).send("Password or Username incorrect!");
}
    })
})
authRouter.get('/resendmail/:email',(req,res)=>{
    console.log(req.params.email);
   
    userData.findOne({email:req.params.email}).then((data)=>{
        console.log(data);
        if(data){
            const baseUrl = req.protocol + "://" + req.get("host");
            const secretCode = cryptoRandomString({
                length: 6,
            });
            var newCode ={
                code: secretCode,
                email: data.email,
            };
            var newCodeready=Code(newCode)
            newCodeready.save();
            const dat = {
                from: 'Chat Box',
                to: data.email,
                subject: "Your Activation Link for ChatBox",
                text: `Please use the following link within the next 10 minutes to activate your account on ChatBox: ${baseUrl}/verification/verify-account/${data._id}/${secretCode}`,
                html: `<p>Please use the following link within the next 10 minutes to activate your account on ChatBox: <strong><a href="${baseUrl}/verification/verify-account/${data._id}/${secretCode}" target="_blank">click here</a></strong></p>`,
            };
            emailService.sendMail(dat);

            res.json({
                success: true,
               
            });
        }
        if(data==null){
            res.send({success:false});
        }
    })
    
            


               
                
                   

                

})
authRouter.get('/check/:username',(req,res)=>{
    res.header("Access-Control-Allow-Orgin", "*");
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
    var username=req.params.username;
    console.log(username);
    userData.findOne({username:username}).then((data)=>{
        if(data){
          res.send({error:'yes'})
        }
        else{
            res.send({error:'no'});
        }
    })
})
module.exports=authRouter;
