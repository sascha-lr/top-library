"use strict";

const myLibrary = [];
const bookShelf = document.querySelector('.books');

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

        if (document.querySelector(`.book[data-id="${book.id}"]`)) continue;

        const div = document.createElement('div');
        div.classList.add('book');
        div.dataset.id = book.id;

        const button = document.createElement('button');
        button.classList.add('remove');

        let size = 2;
        for (const property in book) {
            if (property === 'id' || property === 'toggleRead') continue;
            if (property === 'read') {
                const readCheckBox = document.createElement('input');
                readCheckBox.type = 'checkbox';
                readCheckBox.classList.add('read-check-box');
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

bookShelf.addEventListener('click', (e) => {
    switch (true) {
        case e.target.id === 'add-book-dialog':
            e.target.close();
            break;
        case e.target.id === 'add':
            e.preventDefault();
            document.querySelector('#add-book-dialog').close();
            const form = new FormData(document.querySelector('form'));
            addBookToLibrary(form.get('title'), form.get('author'), form.get('pages'), form.get('read') === 'on');
            displayBooks();
            break;
        case e.target.classList.contains('remove'):
            const found = myLibrary.findIndex((book) => {
                return book.id === e.target.parentElement.dataset.id;
            });
            myLibrary.splice(found, 1);
            e.target.closest('.book').remove();
            break;
        case e.target.classList.contains('read-check-box'):
            const book = myLibrary.find((book) => {
                return book.id === e.target.parentElement.dataset.id;
            });
            book.toggleRead();
        default:
            break;
    }
})
