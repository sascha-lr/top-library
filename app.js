"use strict";

const dataController = (() => {

    const myLibrary = [];

    class Book {
        constructor(title, author, pages, read) {
            this.title = title;
            this.author = author;
            this.pages = pages;
            this.read = read;
            this.id = crypto.randomUUID();
        }

        toggleRead() {
            this.read = !this.read;
        }

    }

    function addBookToLibrary(title, author, pages, read) {
        const newBook = new Book(title, author, pages, read);
        myLibrary.push(newBook);
    }

    const getLibrary = () => [...myLibrary];
    const removeBook = (index) => {
        myLibrary.splice(index, 1);
    }
    const toggleRead = (book) => {
        book.toggleRead();
    }

    return { addBookToLibrary, getLibrary, removeBook, toggleRead };

})();

const displayController = (() => {

    const books = document.querySelector('.books');
    const form = document.querySelector('form');

    function displayBooks() {
        for (let book of dataController.getLibrary()) {

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
            readCheckBox.dataset.action = 'check-read';
            bookCover.appendChild(label);

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove');
            removeBtn.innerText = 'Remove?';
            removeBtn.dataset.action = 'remove';
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

    // --- EVENT LISTENERS --- //

    document.querySelector('main').addEventListener('click', (e) => {

        if (e.target.closest('[data-action="remove"]')) {
            const bookShelves = document.querySelectorAll('.books .shelf');
            const found = dataController.getLibrary().findIndex((book) => {
                return book.id === e.target.parentElement.dataset.id;
            });
            dataController.removeBook(found);
            e.target.closest('.book').remove();
            for (let shelf of bookShelves) {
                if (books.childElementCount > 1 && shelf.childElementCount <= 0) shelf.remove();
            }
        }
        if (e.target.closest('[data-action="check-read"]')) {
            const book = dataController.getLibrary().find((book) => {
                return book.id === e.target.closest('.book').dataset.id;
            });
            dataController.toggleRead(book);

        }
    })

    form.addEventListener('submit', () => {
        const formData = new FormData(form);
        dataController.addBookToLibrary(formData.get('title'), formData.get('author'), formData.get('pages'), formData.get('read') === 'on');
        displayBooks();
        form.reset();
    })
})();

