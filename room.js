const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
    {
       seats: {
           type:Number,
           require:true
        },
        ametites:{
            type:String,
            require:true
        },
        priceOneHour:{
            type:Number,
            require:true
        }
    }
)
module.exports = mongoose.model("Room",roomSchema);