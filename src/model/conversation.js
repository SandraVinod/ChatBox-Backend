const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://sandra:sandrasandra@ictakfiles.jdgip.mongodb.net/ChatApp?retryWrites=true&w=majority',{ useUnifiedTopology: true,useNewUrlParser: true });
const Schema=mongoose.Schema;
const ConversationSchema=new Schema({
    members:{
        type:Array,
    }
    
}
)
var conversation=mongoose.model('conversation',ConversationSchema);
module.exports=conversation;