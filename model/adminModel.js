const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema({

    user_id:String,
    password:String

});

const adminModel = mongoose.model("admin",adminSchema);


module.exports  = adminModel;