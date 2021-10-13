const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://sandra:sandrasandra@ictakfiles.jdgip.mongodb.net/ChatApp?retryWrites=true&w=majority',{ useUnifiedTopology: true,useNewUrlParser: true });
const Schema=mongoose.Schema;
const MessageSchema=new Schema({
   conid:String,
   sender:String,
   messages:Array,
   muted:Array,
   blocked:Array
},
)
var message=mongoose.model('msgData',MessageSchema);
module.exports=message;