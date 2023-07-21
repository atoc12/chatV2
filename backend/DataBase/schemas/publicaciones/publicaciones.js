const {Schema,model} = require("mongoose");

const publicacionSchema = new Schema({
    creator:{
        type:Schema.Types.ObjectId,
        ref:"usuarios",
        require:true
    },
    picture:{
        type:String,
    },
    like:[
        {
            _id:{
                type:Schema.Types.ObjectId,
                ref:"usuarios",
            },
            timestamp: {
                type: String,
                default: Date
            }
        }
    ],
    content:{
        type:String,
        require:true
    },
    categories:[
        {
            _id:false,
            name:String,          
        }
    ],
    channels:[
        {   
            _id:false,
            name:String,
        }
    ],
    timestamp: {
        type: String,
        default: Date
    }
})
const Publicacion = model('publicacion',publicacionSchema);
module.exports = Publicacion;