import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "Library";

async function insertNewBook(db, book) {
  const result = await db.collection("books").insertOne(book);
  console.log(`Book ${book.bookName} inserted with id: ${result.insertedId}`);
}

async function insertNewAuthor(db, author) {
  const result = await db.collection("authors").insertOne(author);
  console.log(
    `Author ${author.firstName} inserted with id: ${result.insertedId}`
  );
}

async function createBooksIndexses(db) {
  const IndexByNumPages = await db
    .collection("books")
    .createIndex({ numPages: 1 });
  const IndexByAuthor = await db
    .collection("books")
    .createIndex({ authorId: 1 });
  console.log("Indexses created succesfully");
}

async function findBooksByAuthor(db, authorId) {
  const books = await db.collection("books").find({ authorId }).toArray();
  console.log(books);
}

async function searchBooksByTitleOrDescription(db, searchText) {
  const regex = new RegExp(searchText, "i");
  const books = await db
    .collection("books")
    .find({
      $or: [{ bookName: regex }, { description: regex }],
    })
    .toArray();
  console.log(`Books matching '${searchText}':`);
  console.log(books);
}

async function getNumPagesMoreThen250(db) {
  const filteredDocs = await db
    .collection("books")
    .find({ numPages: { $gt: 250 } })
    .toArray();
  console.log(filteredDocs);
}
async function initData() {
  const Author1Document = {
    firstName: "author1",
    lastName: "author1last",
    yearOfBirth: 1980,
  };
  const Author2Document = {
    firstName: "author2",
    lastName: "author2last",
    yearOfBirth: 1991,
  };
  const Author3Document = {
    firstName: "author3",
    lastName: "author3last",
    yearOfBirth: 2003,
  };
  insertNewAuthor(db, Author1Document);
  insertNewAuthor(db, Author2Document);
  insertNewAuthor(db, Author3Document);

  const authorName = [Author1Document, Author2Document, Author3Document];
  for (let i = 1; i < 11; i++) {
    const bookName = "book " + i;
    const description = "book number " + i;
    const publishDate = new Date(2023, 10, i);
    const randomIndex = Math.floor(Math.random() * authorName.length);
    const randomAuthor = authorName[randomIndex]._id;
    const numPages = i * 100;

    const bookDocument = {
      bookName: bookName,
      description: description,
      publishDate: publishDate,
      authorId: randomAuthor,
      numPages: numPages,
    };
    await insertNewBook(db, bookDocument);
  }
}
async function main() {
  await client.connect();
  console.log("Connected successfully to the server");
  const db = client.db(dbName);
  initData();
  await createBooksIndexses(db);
  await getNumPagesMoreThen250(db);
  await findBooksByAuthor(db, Author2Document._id);
  await searchBooksByTitleOrDescription(db, "Book 1");
  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
