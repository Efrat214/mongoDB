import mongoose from "mongoose";
import books from "./models/books.model.js";
import authors from "./models/authors.model.js";

(async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/Library", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully");

    const books1 = await books
      .find({
        numPages: { $gt: 200 },
        publishDate: {
          $gte: new Date(2015, 0, 1),
          $lt: new Date(2020, 0, 1),
        },
      })
      .select("bookName -_id")
      .populate({
        path: "authorId",
        match: { firstName: /^P/ },
        select: "firstName lastName -_id",
        options: { sort: [{ firstName: "asc", lastName: "asc" }] },
      })
      .sort({
        numPages: 1,
      })
      .exec();

    console.log("Books matching the combined criteria:");
    console.log(books1);
  } catch (error) {
    console.error(error);
  }
})();
