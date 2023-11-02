const { Schema, model } = require('mongoose');

const booksSchema = new Schema(
    {
        bookName:{ type: String, minlength: 2,required:true },
        description:String,
        publishDate:Date,
        authorId:{ type: Schema.Types.ObjectId, ref: 'authors' },
        numPages:Number
    }
);

module.exports = model('books', booksSchema); 