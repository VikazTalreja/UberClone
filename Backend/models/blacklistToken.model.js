const mongoose = require('mongoose')

const blackListTokenSchema = new mongoose.Schema({

    token:{
        type: String , 
        required: true ,
        unique : true 
    },
    CreatedAt:{
        type:Date,
        default:Date.now , 
        expires : 86400 
    }
})

module.exports = mongoose.model('BlacklistToken' , blackListTokenSchema);