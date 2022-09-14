const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({

    title: String,
    img:{
        data:Buffer,
        contentType:String
    },
    about:String,
    text:String,
    category:String,
    lastDate: String

});

const blogModel = mongoose.model("BLOGS",blogSchema);

module.exports = blogModel;