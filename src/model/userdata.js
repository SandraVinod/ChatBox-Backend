const mongoose=require("mongoose");
mongoose.connect('mongodb+srv://sandra:sandrasandra@ictakfiles.jdgip.mongodb.net/ChatApp?retryWrites=true&w=majority',{ useUnifiedTopology: true,useNewUrlParser: true });
const Schema=mongoose.Schema;
const UserSchema=new Schema({
    name:String,
    username:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        //unique:true
    },
    pwd:String,
    status: {
        type: String,
        default: "pending",
    },
    img:{
      type:String,
      default:'User.png'
    }
})
var userdata=mongoose.model('userdata',UserSchema);
module.exports=userdata;
