const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://sandra:sandrasandra@ictakfiles.jdgip.mongodb.net/ChatApp?retryWrites=true&w=majority',{ useUnifiedTopology: true,useNewUrlParser: true });
const Schema = mongoose.Schema;

const secretCode = new Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires:600
    },
});
/*app.get(
    "/verification/update-user-status",
    authenticateTokenWhilePending,
    async (req, res) => {
        try {
            const user = await User.findById(req.userId);

            if (!user) {
                res.json({ success: false });
            } else {
                const token = jwt.sign(
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

                req.session.token = token;

                res.json({
                    success: true,
                    userRole: user.role,
                    userId: user._id,
                    userStatus: user.status,
                });
            }
        } catch (err) {
            console.log(
                "Error on /api/auth/verification/update-user-status: ",
                err
            );
            res.json({ success: false });
        }
    }
);*/
var Code=mongoose.model('code',secretCode);
module.exports=Code;
//module.exports.Code = mongoose.model("code", secretCode);