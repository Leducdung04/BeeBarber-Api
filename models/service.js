const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    id_category : {
        type : mongoose.Types.ObjectId,
        ref: "Category",
        required : true
    },
    description:{
        type : String,
        default : ""
    },
    price:{
        type : Number,
        required : true,
        min : 0,
    },
    duration:{
        type : Number,
        required : true
    },
    images:{
        type : String,
        required : true,
    },
    name:{
        type:String,
        required : true
    }
})

const Service = mongoose.model('Service',serviceSchema);

module.exports = Service
