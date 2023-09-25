const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    // Implement logic to fetch a book by ID
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the book' });
  }
};

exports.createBook = async (req, res) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
    });
    await newBook.save();
    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create the book' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.bookId,
      {
        title: req.body.title,
        author: req.body.author,
      },
      { new: true }
    );

    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the book' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    // Implement logic to delete a book
    await Book.findByIdAndRemove(req.params.bookId);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the book' });
  }
};
