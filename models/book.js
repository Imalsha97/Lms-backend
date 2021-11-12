const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({

    title: {
        type:String,
        required: true,
    },
    author: {
        type:String,
        required: true,
    },
    isAvailable: {
        type :Boolean,
    },
    burrowedMemberId : {
        type:String,
    },
    burrowedDate: {
        type:String,
    },
    
});

//create mongoose schema
const Book = mongoose.model("Book",bookSchema);
module.exports = Book;