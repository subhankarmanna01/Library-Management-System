import { useEffect, useState } from "react";
import Login from "./Login";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("libraryAdminLoggedIn") === "true";
  });

  const [activePage, setActivePage] = useState("dashboard");

  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);

  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [issueForm, setIssueForm] = useState({
    studentName: "",
    studentId: "",
    bookId: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    quantity: "",
    available: "",
  });

  // LOAD DATA AFTER LOGIN
  useEffect(() => {
    if (loggedIn) {
      loadDashboardData();
    }
  }, [loggedIn]);

  // LOAD DASHBOARD DATA
  const loadDashboardData = async () => {
    try {
      const bookResponse = await fetch(
        "http://localhost:5000/api/books"
      );

      const bookData = await bookResponse.json();

      const issueResponse = await fetch(
        "http://localhost:5000/api/issues"
      );

      const issueData = await issueResponse.json();

      if (bookResponse.ok) {
        setBooks(bookData);
      }

      if (issueResponse.ok) {
        setIssues(issueData);
      }
    } catch (error) {
      console.log("Dashboard data loading failed");
    }
  };

  // FORM CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD BOOK
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/books",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            quantity: Number(formData.quantity),
            available: Number(formData.available),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Book added successfully!");

        setFormData({
          title: "",
          author: "",
          category: "",
          isbn: "",
          quantity: "",
          available: "",
        });

        setEditingBook(null);
        setActivePage("books");

        await fetchBooks();
      } else {
        alert(data.message || "Failed to add book");
      }
    } catch (error) {
      alert("Backend server is not running!");
    }
  };

  // GET BOOKS
  const fetchBooks = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/books"
      );

      const data = await response.json();

      if (response.ok) {
        setBooks(data);
      }
    } catch (error) {
      alert("Failed to load books!");
    }
  };

  // DELETE BOOK
  const deleteBook = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Book deleted successfully!");
        await fetchBooks();
      } else {
        alert(data.message || "Failed to delete book");
      }
    } catch (error) {
      alert("Failed to delete book!");
    }
  };

  // START EDIT
  const startEdit = (book) => {
    setEditingBook(book);

    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      quantity: book.quantity,
      available: book.available,
    });

    setActivePage("add-book");
  };

  // UPDATE BOOK
  const updateBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${editingBook._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            quantity: Number(formData.quantity),
            available: Number(formData.available),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Book updated successfully!");

        setEditingBook(null);

        setFormData({
          title: "",
          author: "",
          category: "",
          isbn: "",
          quantity: "",
          available: "",
        });

        setActivePage("books");

        await fetchBooks();
      } else {
        alert(data.message || "Failed to update book");
      }
    } catch (error) {
      alert("Failed to update book!");
    }
  };

  // SEARCH
  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();

    return (
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      book.category.toLowerCase().includes(search) ||
      book.isbn.toLowerCase().includes(search)
    );
  });

  // DASHBOARD CALCULATIONS
  const totalBooks = books.length;

  const totalQuantity = books.reduce(
    (total, book) => total + Number(book.quantity),
    0
  );

  const availableBooks = books.reduce(
    (total, book) => total + Number(book.available),
    0
  );

  const issuedBooks = issues.filter(
    (issue) => issue.status === "Issued"
  ).length;

  const returnedBooks = issues.filter(
    (issue) => issue.status === "Returned"
  ).length;

  // ISSUE FORM CHANGE
  const handleIssueChange = (e) => {
    setIssueForm({
      ...issueForm,
      [e.target.name]: e.target.value,
    });
  };

  // ISSUE BOOK
  const issueBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/issues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(issueForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Book issued successfully!");

        setIssueForm({
          studentName: "",
          studentId: "",
          bookId: "",
        });

        await fetchIssues();
      } else {
        alert(data.message || "Failed to issue book");
      }
    } catch (error) {
      alert("Failed to issue book!");
    }
  };

  // GET ISSUES
  const fetchIssues = async () => {
    try {
      const issueResponse = await fetch(
        "http://localhost:5000/api/issues"
      );

      const issueData = await issueResponse.json();

      const bookResponse = await fetch(
        "http://localhost:5000/api/books"
      );

      const bookData = await bookResponse.json();

      if (issueResponse.ok && bookResponse.ok) {
        setIssues(issueData);
        setBooks(bookData);
      }
    } catch (error) {
      alert("Failed to load issue and book data!");
    }
  };

  // RETURN BOOK
  const returnBook = async (id) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmReturn) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/issues/return/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Book returned successfully!");

        await fetchIssues();
      } else {
        alert(data.message || "Failed to return book");
      }
    } catch (error) {
      alert("Failed to return book!");
    }
  };

  // DELETE ISSUE
  const deleteIssue = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this issue record?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/issues/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Issue record deleted successfully!");

        await fetchIssues();
      } else {
        alert(data.message || "Failed to delete issue record");
      }
    } catch (error) {
      alert("Failed to delete issue record!");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("libraryAdminLoggedIn");
    setLoggedIn(false);
  };

  // LOGIN PAGE
  if (!loggedIn) {
    return (
      <Login
        onLogin={() => {
          localStorage.setItem(
            "libraryAdminLoggedIn",
            "true"
          );

          setLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">📚</div>
          <div>
            <h2>Library</h2>
            <span>Management System</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {
              setActivePage("dashboard");
              loadDashboardData();
            }}
          >
            🏠
            <span>Dashboard</span>
          </button>

          <button
            className={
              activePage === "books"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={async () => {
              await fetchBooks();
              setActivePage("books");
            }}
          >
            📚
            <span>All Books</span>
          </button>

          <button
            className={
              activePage === "add-book"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {
              setEditingBook(null);

              setFormData({
                title: "",
                author: "",
                category: "",
                isbn: "",
                quantity: "",
                available: "",
              });

              setActivePage("add-book");
            }}
          >
            ➕
            <span>Add Book</span>
          </button>

          <button
            className={
              activePage === "issues"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={async () => {
              await fetchIssues();
              setActivePage("issues");
            }}
          >
            📋
            <span>Issue / Return</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="admin-profile">
            <div className="admin-avatar">A</div>

            <div>
              <strong>Administrator</strong>
              <small>Library Admin</small>
            </div>
          </div>

          <button
            className="logout-sidebar-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </aside>

      {/* MAIN AREA */}
      <div className="main-area">

        {/* TOP BAR */}
        <header className="topbar">

          <div>
            <h1>
              {activePage === "dashboard" && "Dashboard"}
              {activePage === "books" && "All Books"}
              {activePage === "add-book" &&
                (editingBook
                  ? "Edit Book"
                  : "Add New Book")}
              {activePage === "issues" &&
                "Issue / Return"}
            </h1>

            <p>
              Welcome back, Administrator
            </p>
          </div>

          <div className="topbar-user">
            <span>🔐</span>
            <div>
              <strong>Admin</strong>
              <small>Online</small>
            </div>
          </div>

        </header>

        {/* CONTENT */}
        <main className="main-content">

          {/* DASHBOARD */}
          {activePage === "dashboard" && (
            <>

              <div className="stats-grid">

                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    📚
                  </div>

                  <div>
                    <span>Total Books</span>
                    <h2>{totalBooks}</h2>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    📦
                  </div>

                  <div>
                    <span>Total Quantity</span>
                    <h2>{totalQuantity}</h2>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    ✅
                  </div>

                  <div>
                    <span>Available Books</span>
                    <h2>{availableBooks}</h2>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    📖
                  </div>

                  <div>
                    <span>Issued Books</span>
                    <h2>{issuedBooks}</h2>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    🔄
                  </div>

                  <div>
                    <span>Returned Books</span>
                    <h2>{returnedBooks}</h2>
                  </div>
                </div>

              </div>

              <div className="welcome-card">

                <div>
                  <h2>
                    Welcome to Library Management System 📚
                  </h2>

                  <p>
                    Manage books, issue records and
                    returns from one place.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingBook(null);

                    setFormData({
                      title: "",
                      author: "",
                      category: "",
                      isbn: "",
                      quantity: "",
                      available: "",
                    });

                    setActivePage("add-book");
                  }}
                >
                  ➕ Add New Book
                </button>

              </div>

              <div className="quick-actions">

                <h2>Quick Actions</h2>

                <div className="quick-action-grid">

                  <button
                    onClick={async () => {
                      await fetchBooks();
                      setActivePage("books");
                    }}
                  >
                    📚
                    <span>View Books</span>
                    <small>Manage all books</small>
                  </button>

                  <button
                    onClick={() => {
                      setEditingBook(null);

                      setFormData({
                        title: "",
                        author: "",
                        category: "",
                        isbn: "",
                        quantity: "",
                        available: "",
                      });

                      setActivePage("add-book");
                    }}
                  >
                    ➕
                    <span>Add Book</span>
                    <small>Add a new book</small>
                  </button>

                  <button
                    onClick={async () => {
                      await fetchIssues();
                      setActivePage("issues");
                    }}
                  >
                    📋
                    <span>Issue / Return</span>
                    <small>Manage book issues</small>
                  </button>

                </div>

              </div>

            </>
          )}

          {/* ADD / EDIT BOOK */}
          {activePage === "add-book" && (
            <div className="content-card form-card-new">

              <div className="page-title">

                <div>
                  <h2>
                    {editingBook
                      ? "✏️ Edit Book"
                      : "📖 Add New Book"}
                  </h2>

                  <p>
                    {editingBook
                      ? "Update book information"
                      : "Enter details to add a new book"}
                  </p>
                </div>

              </div>

              <form
                onSubmit={
                  editingBook
                    ? updateBook
                    : handleSubmit
                }
                className="book-form"
              >

                <div className="form-group">
                  <label>Book Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    name="author"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Programming"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    placeholder="Enter ISBN"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Available Quantity</label>
                  <input
                    type="number"
                    name="available"
                    placeholder="Enter available quantity"
                    value={formData.available}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-actions">

                  <button type="submit">
                    {editingBook
                      ? "✏️ Update Book"
                      : "➕ Add Book"}
                  </button>

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      setEditingBook(null);

                      setFormData({
                        title: "",
                        author: "",
                        category: "",
                        isbn: "",
                        quantity: "",
                        available: "",
                      });

                      setActivePage("dashboard");
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* BOOKS */}
          {activePage === "books" && (
            <div className="content-card">

              <div className="page-title">

                <div>
                  <h2>📚 All Books</h2>
                  <p>
                    Manage all books available in the library
                  </p>
                </div>

                <button
                  className="primary-action-btn"
                  onClick={() => {
                    setEditingBook(null);

                    setFormData({
                      title: "",
                      author: "",
                      category: "",
                      isbn: "",
                      quantity: "",
                      available: "",
                    });

                    setActivePage("add-book");
                  }}
                >
                  ➕ Add Book
                </button>

              </div>

              <input
                className="search-box-new"
                type="text"
                placeholder="🔍 Search by title, author, category or ISBN..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

              {filteredBooks.length === 0 ? (
                <p className="empty-message">
                  No books found.
                </p>
              ) : (
                <div className="table-wrapper">

                  <table className="modern-table">

                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>ISBN</th>
                        <th>Quantity</th>
                        <th>Available</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredBooks.map((book) => (
                        <tr key={book._id}>

                          <td>
                            <strong>{book.title}</strong>
                          </td>

                          <td>{book.author}</td>

                          <td>
                            <span className="category-badge">
                              {book.category}
                            </span>
                          </td>

                          <td>{book.isbn}</td>

                          <td>{book.quantity}</td>

                          <td>
                            <span className="available-badge">
                              {book.available}
                            </span>
                          </td>

                          <td>

                            <div className="table-actions">

                              <button
                                className="edit-action"
                                onClick={() =>
                                  startEdit(book)
                                }
                              >
                                ✏️ Edit
                              </button>

                              <button
                                className="delete-action"
                                onClick={() =>
                                  deleteBook(book._id)
                                }
                              >
                                🗑️ Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              )}

            </div>
          )}

          {/* ISSUE / RETURN */}
          {activePage === "issues" && (
            <div className="content-card">

              <div className="page-title">

                <div>
                  <h2>📋 Issue / Return Book</h2>

                  <p>
                    Issue books to students and manage returns
                  </p>
                </div>

              </div>

              <form
                className="issue-form-new"
                onSubmit={issueBook}
              >

                <div className="form-group">
                  <label>Student Name</label>

                  <input
                    type="text"
                    name="studentName"
                    placeholder="Enter student name"
                    value={issueForm.studentName}
                    onChange={handleIssueChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Student ID</label>

                  <input
                    type="text"
                    name="studentId"
                    placeholder="Enter student ID"
                    value={issueForm.studentId}
                    onChange={handleIssueChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Book</label>

                  <select
                    name="bookId"
                    value={issueForm.bookId}
                    onChange={handleIssueChange}
                    required
                  >

                    <option value="">
                      Select Book
                    </option>

                    {books
                      .filter(
                        (book) => book.available > 0
                      )
                      .map((book) => (
                        <option
                          key={book._id}
                          value={book._id}
                        >
                          {book.title} - Available:{" "}
                          {book.available}
                        </option>
                      ))}

                  </select>
                </div>

                <button type="submit">
                  📖 Issue Book
                </button>

              </form>

              <div className="section-heading">
                <h3>📚 Issue Records</h3>
              </div>

              {issues.length === 0 ? (
                <p className="empty-message">
                  No issue records found.
                </p>
              ) : (
                <div className="table-wrapper">

                  <table className="modern-table">

                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Book</th>
                        <th>Issue Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>

                      {issues.map((issue) => (
                        <tr key={issue._id}>

                          <td>
                            <strong>
                              {issue.studentName}
                            </strong>
                          </td>

                          <td>{issue.studentId}</td>

                          <td>
                            {issue.bookId
                              ? issue.bookId.title
                              : "Book unavailable"}
                          </td>

                          <td>
                            {new Date(
                              issue.issueDate
                            ).toLocaleDateString()}
                          </td>

                          <td>

                            <span
                              className={
                                issue.status === "Issued"
                                  ? "status-issued"
                                  : "status-returned"
                              }
                            >
                              {issue.status}
                            </span>

                          </td>

                          <td>

                            <div className="table-actions">

                              {issue.status === "Issued" ? (
                                <button
                                  className="return-action"
                                  onClick={() =>
                                    returnBook(
                                      issue._id
                                    )
                                  }
                                >
                                  🔄 Return
                                </button>
                              ) : (
                                <span className="returned-label">
                                  ✓ Returned
                                </span>
                              )}

                              <button
                                className="delete-action"
                                onClick={() =>
                                  deleteIssue(
                                    issue._id
                                  )
                                }
                              >
                                🗑️ Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              )}

            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;