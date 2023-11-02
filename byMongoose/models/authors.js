const { Schema, model } = require('mongoose');

const authorsSchema = new Schema(
    {
        firstName: { type: String, minlength: 2, required: true },
        lastName: String,
        yearOfBirth: Number,
    }
);

module.exports = model('authors', authorsSchema); 