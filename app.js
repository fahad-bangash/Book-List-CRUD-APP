class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");

    //create table column
    row.innerHTML = `
  
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">X</a></td>
  `;
    list.appendChild(row);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
  showAlert(message, className) {
    //Create div
    const div = document.createElement("div");
    //add classes
    div.className = `alert ${className}`;
    //Add text
    div.appendChild(document.createTextNode(message));
    //Get Container
    const container = document.querySelector(".container");
    //Get form
    const form = document.querySelector("#book-form");
    //Insert Alert
    container.insertBefore(div, form);
    //Timeout after 3 second
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}

//Local Storage
class Store {
  //Get Books
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  //Display Books
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      const ui = new UI();
      //add book to UI
      ui.addBookToList(book);
    });
  }

  //Add Books
  static addBooks(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  //Remove Books
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//DOM Load Event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

//Event Listener for add book
document.getElementById("book-form").addEventListener("submit", function (e) {
  //Get form value from textfield
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  //Instantiate Book
  const book = new Book(title, author, isbn);

  //Instantiate UI
  const ui = new UI();

  //Validation
  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Please fill in all fields", "error");
  } else {
    //Add book to list
    ui.addBookToList(book);

    //Add to Local Storage
    Store.addBooks(book);

    //Show alert
    ui.showAlert("Book Added Successfully!", "success");
    //Clear text fields
    ui.clearFields();
  }

  e.preventDefault();
});

//Event listener for delete
document.getElementById("book-list").addEventListener("click", function (e) {
  //Instantiate UI
  const ui = new UI();
  //Delete Book
  ui.deleteBook(e.target);
  //Remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  //Show alert for remove book
  ui.showAlert("Book Removed!", "success");

  e.preventDefault();
});
