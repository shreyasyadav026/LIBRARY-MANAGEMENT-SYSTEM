# Library Management System

A beginner-friendly Library Management System made with **HTML, CSS and JavaScript**. It is a front-end project and does not require a server or database.

## Features

- Dashboard with total, available and issued book counts
- Add a book with title, author, category and optional Book ID
- Search books by title, author or ID
- Filter books by availability status
- Issue and return books
- Delete a book
- Saves changes in the browser using `localStorage`
- Responsive layout for desktop and mobile

## Run locally

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Open `index.html` in a browser, or use the VS Code Live Server extension.
4. Add and manage books from the interface.

No npm install or build step is needed.

## Files

- `index.html` — page structure
- `style.css` — layout, colors and responsive design
- `script.js` — book data and interactive features

## How it works

JavaScript stores the books in an array. When a book is added, issued, returned or deleted, the page is updated and the latest data is saved in `localStorage`. The browser keeps this data on the same device until its site data is cleared.

## Limitations

This is a demonstration project. It has no user login, shared online database or multi-user access. For a real library, a backend and database would be needed.

## Built with

HTML5 · CSS3 · JavaScript · Browser localStorage
