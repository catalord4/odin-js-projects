let books = [];
const bookCard = document.querySelector(".book-card:first-of-type");

const bookShelf = document.querySelector("#main");

function Book(title, author, pageCount, read) {
  this.title = title;
  this.author = author;
  this.pageCount = pageCount;
  this.read = read;

  books.push(this);
}

function createBookCard(book) {
  let newBookCard = bookCard.cloneNode(true);
  newBookCard.style = "display: flex;";

  newBookCard.querySelector(".title").textContent = book.title;
  newBookCard.querySelector(".author").textContent = book.author;
  newBookCard.querySelector(".pages").textContent = book.pageCount;

  newBookCard.querySelector(".removeButton").addEventListener("click", () => {
    newBookCard.remove();
  });

  createReadButton(newBookCard, book.read);
  readButton = newBookCard.querySelector(".readButton");

  readButton.addEventListener("click", () => {
    if (readButton.classList.contains("read")) {
      readButton.classList.replace("read", "unread");
      readButton.textContent = "To Be Read";
    } else {
      readButton.classList.replace("unread", "read");
      readButton.textContent = "Read";
    }
  });

  bookShelf.append(newBookCard);
}

function createReadButton(newBookCard, read) {
  readButton = newBookCard.querySelector(".readButton");

  readButton.classList.add(read ? "read" : "unread");
  readButton.textContent = read ? "read" : "To Be Read";
}

const titleInput = document.querySelector("#book-title-input");
const authorInput = document.querySelector("#book-author-input");
const pageInput = document.querySelector("#book-page-input");
const readInput = document.querySelector('input[name="book-status"]:checked');
const addBookButton = document.querySelector("#addBookButton");

function createBookFromInput() {
  let read = false;
  if (readInput.id === "read") read = true;
  else read = false;
  return new Book(titleInput.value, authorInput.value, pageInput.value, read);
}

addBookButton.addEventListener("click", () => {
  createBookCard(createBookFromInput());
  titleInput.value = "";
  authorInput.value = "";
  pageInput.value = 2;
});
