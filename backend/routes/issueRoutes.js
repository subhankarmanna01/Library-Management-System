const express = require("express");
const Issue = require("../models/Issue");
const Book = require("../models/Book");

const router = express.Router();

// ISSUE A BOOK
router.post("/", async (req, res) => {
  try {
    const { studentName, studentId, bookId } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (book.available <= 0) {
      return res.status(400).json({
        message: "Book is not available",
      });
    }

    const issue = new Issue({
      studentName,
      studentId,
      bookId,
    });

    const savedIssue = await issue.save();

    book.available = book.available - 1;
    await book.save();

    res.status(201).json(savedIssue);
  } catch (error) {
    res.status(400).json({
      message: "Failed to issue book",
      error: error.message,
    });
  }
});

// GET ALL ISSUED BOOKS
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find().populate(
      "bookId",
      "title author isbn"
    );

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch issued books",
      error: error.message,
    });
  }
});

// RETURN BOOK
router.put("/return/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue record not found",
      });
    }

    if (issue.status === "Returned") {
      return res.status(400).json({
        message: "Book already returned",
      });
    }

    const book = await Book.findById(issue.bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    book.available = book.available + 1;
    await book.save();

    issue.status = "Returned";
    issue.returnDate = new Date();

    const updatedIssue = await issue.save();

    res.status(200).json(updatedIssue);
  } catch (error) {
    res.status(400).json({
      message: "Failed to return book",
      error: error.message,
    });
  }
});

// DELETE ISSUE RECORD
router.delete("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue record not found",
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Issue record deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete issue record",
      error: error.message,
    });
  }
});

module.exports = router;