import { Schema, model } from "mongoose";

const booksSchema = new Schema({
  bookName: { type: String, minlength: 2, required: true },
  description: String,
  publishDate: Date,
  authorId: { type: Schema.Types.ObjectId, ref: "authors" },
  numPages: Number,
});

const books = model("books", booksSchema);
export default books;
