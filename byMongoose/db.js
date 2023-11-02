const authorsModel = require("./models/authors");
const booksModel = require("./models/books");
const mongoose = require("mongoose");

(async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/library", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully");

    const books = await booksModel.aggregate([
      {
        $match: {
          numBooks: { $gt: 200 },
          publishDate: {
            $gte: new Date(2015, 0, 1),
            $lt: new Date(2020, 0, 1),
          },
        },
      },
      {
        $lookup: {
          from: "authorsModel",
          localField: "authorName",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $match: {
          "author.FirstName": /^P/,
        },
      },
      {
        $project: {
          _id: 0,
          description: 0,
          publishDate: 0,
          bookName: "$bookName",
          authorName: {
            $concat: ["$author.FirstName", " ", "$author.lastName"],
          },
        },
      },
      {
        $sort: {
          "$author.FirstName": 1,
          numBooks: 1,
        },
      },
    ]);

    console.log("Books matching the criteria:");
    console.log(books);
  } catch (error) {
    console.error(error);
  }
})();
