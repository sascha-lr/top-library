"use strict";

const books = document.querySelector('.books');

const myLibrary = [];

function Book(title, author, pages, read) {
    if (!new.target) {
        throw Error("Use the 'new' operator to create the object!")
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
}

Book.prototype.toggleRead = function() {
    this.read = !this.read;
}

function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
}

function displayBooks() {
    for (let book of myLibrary) {

        const bookShelves = document.querySelectorAll('.books .shelf');

        if (document.querySelector(`.book[data-id="${book.id}"]`)) continue;

        const bookCover = document.createElement('div');
        bookCover.classList.add('book');
        bookCover.dataset.id = book.id;

        const title = document.createElement('h2');
        title.innerText = book.title;
        title.classList.add('title');
        bookCover.appendChild(title);

        const author = document.createElement('h3');
        author.innerText = book.author;
        author.classList.add('author');
        bookCover.appendChild(author);

        const pages = document.createElement('p');
        pages.innerText = `Pages: ${book.pages}`;
        pages.classList.add('pages');
        bookCover.appendChild(pages);

        const label = document.createElement('label');
        label.innerText = 'Read? ';

        const readCheckBox = document.createElement('input');
        readCheckBox.type = 'checkbox';
        readCheckBox.classList.add('read-checkbox');
        if (book.read) readCheckBox.checked = true;
        label.appendChild(readCheckBox);
        bookCover.appendChild(label);

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove');
        removeBtn.innerText = 'Remove?';
        bookCover.appendChild(removeBtn);

        const bookShelvesArr = Array.from(bookShelves);
        const sorted = bookShelvesArr.sort((a, b) => {
            return a.childElementCount - b.childElementCount;
        });

        if (sorted[0].childElementCount >= 3) {
            const newShelf = document.createElement('div');
            newShelf.classList.add('shelf');
            newShelf.appendChild(bookCover);
            books.appendChild(newShelf);
        } else {
            sorted[0].appendChild(bookCover);
        }
    }
}

document.querySelector('main').addEventListener('click', (e) => {
    switch (true) {
        case e.target.id === 'add-book-dialog':
            e.target.close();
            break;
        case e.target.classList.contains('remove'):
            const bookShelves = document.querySelectorAll('.books .shelf');
            const found = myLibrary.findIndex((book) => {
                return book.id === e.target.parentElement.dataset.id;
            });
            myLibrary.splice(found, 1);
            e.target.closest('.book').remove();
            for (let shelf of bookShelves) {
                if (books.childElementCount > 1 && shelf.childElementCount <= 0) shelf.remove();
            }
            break;
        case e.target.classList.contains('read-checkbox'):
            const book = myLibrary.find((book) => {
                return book.id === e.target.closest('.book').dataset.id;
            });
            book.toggleRead();
            break;
    }
})

document.querySelector('form').addEventListener('submit', () => {
    const form = new FormData(document.querySelector('form'));
    addBookToLibrary(form.get('title'), form.get('author'), form.get('pages'), form.get('read') === 'on');
    displayBooks();
})
