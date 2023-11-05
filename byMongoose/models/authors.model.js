import { Schema, model } from "mongoose";

const authorsSchema = new Schema({
  firstName: { type: String, minlength: 2, required: true },
  lastName: String,
  yearOfBirth: Number,
});

const authors = model("authors", authorsSchema);
export default authors;
