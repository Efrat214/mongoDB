import mongoose from "mongoose";
import books from "./models/books.model.js";
import authors from "./models/authors.model.js";

(async function connectDB() {
  try {
    const connectionString = "mongodb://localhost:27017/Library";
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully");

    const books1 = await books.aggregate([
      {
        $match: {
          numPages: { $gt: 200 },
          publishDate: {
            $gte: new Date(2015, 0, 1),
            $lt: new Date(2020, 0, 1),
          },
        },
      },
      {
        $lookup: {
          from: "authors",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $match: {
          "author.firstName": /^P/,
        },
      },
      {
        $project: {
          _id: 0,
          bookName: 1,
          author: {
            firstName: 1,
            lastName: 1,
          },
        },
      },
      {
        $sort: {
          "author.firstName": 1,
          "author.lastName": 1,
          numPages: 1,
        },
      },
    ]);

    console.log("Books matching the combined criteria:");
    console.log(books1);
  } catch (error) {
    console.error(error);
  }
})();
