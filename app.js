"use strict";

function Book(title, author, pages, read) {
    if (!new.target) {
        throw Error("Use the 'new' operator to create the object!")
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
}

