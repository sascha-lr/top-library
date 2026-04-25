"use strict";

const myLibrary = [];

function Book(title, author, pages, read) {
    if (!new.target) {
        throw Error("Use the 'new' operator to create the object!")
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    newBook.id = crypto.randomUUID();
    myLibrary.push(newBook);
}

function displayBooks() {
    const bookShelf = document.querySelector('.books');
    for (let book of myLibrary) {

        if (document.querySelector(`.book[data-id="${book.id}"]`)) continue;

        const div = document.createElement('div');
        div.classList.add('book');
        div.dataset.id = book.id;

        const button = document.createElement('button');
        button.id = 'remove';

        let size = 2;
        for (const property in book) {
            if (property === 'id') continue;
            if (property === 'read') {
                const readCheckBox = document.createElement('input');
                readCheckBox.type = 'checkbox';
                readCheckBox.id = 'read-check-box';
                if (book.read === true) readCheckBox.checked = true;
                div.appendChild(readCheckBox);
                continue;
            }
            const text = document.createElement(`h${size}`);
            text.innerText = book[property];
            div.appendChild(text);
            size++;
        }
        div.appendChild(button);
        bookShelf.appendChild(div);
    }
}

window.addEventListener('click', (e) => {
    switch (e.target.id) {
        case 'add-book-dialog':
            e.target.close();
            break;
        case 'add':
            const title = document.querySelector('#title');
            const author = document.querySelector('#author');
            const pages = document.querySelector('#pages');
            const read = document.querySelector('#read');
            addBookToLibrary(title.value, author.value, pages.value, read.checked);
            displayBooks();
            break;
        case 'remove':
            const found = myLibrary.find((book) => {
                return book.id === e.target.parentElement.dataset.id;
            });
            const index = myLibrary.indexOf(found);
            myLibrary.splice(index, 1);
            e.target.parentElement.remove();
            break;
        case 'read-check-box':
            const book = myLibrary.find((book) => {
                return book.id === e.target.parentElement.dataset.id;
            });
            book.read = !book.read;
        default:
            break;
    }
})
