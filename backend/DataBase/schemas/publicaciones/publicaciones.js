const {Schema,model} = require("mongoose");

const publicacionSchema = new Schema({
    creator:{
        type:Schema.Types.ObjectId,
        ref:"usuarios",
        required:true
    },
    picture:{
        type:String,
    },
    like:[
        {
            _id:{
                type:Schema.Types.ObjectId,
                ref:"usuarios",
                required:true,
            },
            timestamp: {
                type: String,
                default: Date
            }
        }
    ],
    content:{
        type:String,
        required:true,
    },
    myresponse:[
        {
            _id:{
                type:Schema.Types.ObjectId,
                ref:'publicacion',
            },
            timestamp:{
                type: String,
                default: Date
            }
        }
    ],
    response:[
        {
            _id:{
                type:Schema.Types.ObjectId,
                ref:'publicacion',
            },
            timestamp:{
                type: String,
                default: Date
            }
            
        }
    ],
    categories:[],
    channels:[
        {   
            _id:false,
            name:String,
        }
    ],
    status:{
        type:Boolean,
        default:true,
    },
    timestamp: {
        type: String,
        default: Date
    }
})

publicacionSchema.path('like').validate(function (likes) {
    const uniqueUserIds = new Set();
    for (const like of likes) {
        if (uniqueUserIds.has(like._id.toString())) {
            return false;
        }
        uniqueUserIds.add(like._id.toString());
    }
    return true;
}, 'Likes must be unique within the same publication.');




const Publicacion = model('publicacion',publicacionSchema);
module.exports = Publicacion;