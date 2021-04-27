const { Pool } = require('pg');
const helpers = require('../validators/helpers');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'LibraryDB',
    password: 'otam313',
    port: 5432,
});


exports.default_page = (req, res) => {
    res.status(200).json({ message: "Welcome!" });
};

exports.book_add = async (req, res) => {
    const { author } = req.body;

    const authorSelect = await pool.query('SELECT * FROM public.author WHERE "fullName" = $1', [author])
    .catch(error => res.status(500).json({ message: "Internal server error"}));
    
    if (authorSelect.rowCount === 0) {
        const authorInsert = await pool.query('INSERT INTO public.author("fullName") VALUES ($1);', [author])
        .catch(error => res.status(500).json({ message: "Internal server error"}));

        let msg = "Book and author added";
        helpers.bookInsert(req, res, pool, msg);

    } else {
        let msg = "Book added";
        helpers.bookInsert(req, res, pool, msg);
    }
};

exports.book_filter_detail = (req, res) => {
    const { bookName, authorName } = req.params;

    const book = helpers.splitName(bookName);
    const author = helpers.splitName(authorName);
    
    pool.query('SELECT * FROM public.book', (err, result) => {
        const resultArray = result.rows;
    
        const filtered = resultArray.filter(p => p.author.startsWith(author) && p.name.startsWith(book));
        
        if (filtered.length === 0) {
            res.status(400).json({ message: "No match" });
        } else {
            const filtered2 = filtered.filter((p) => {
                delete p.description;
                delete p.purchase_price;
                return true;
            });
            res.status(200).json(filtered2);
        }
    });
};

exports.book_detail = (req, res) => {
    const { bookName } = req.params;
    
    const book = helpers.splitName(bookName);

    pool.query('SELECT * FROM public.book WHERE name = $1', [book], (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error"});
        } else if(result. rowCount === 0) {
            res.status(400).json({ message: "Not found"});
        } else {
            res.status(200).json(result.rows);
        }
    });
};

exports.book_edit = (req, res) => {
    const { author, name, genre, purchase_price, description } = req.body;

    pool.query('UPDATE public.book SET author = $1, name = $2, genre = $3, purchase_price = $4, description = $5 WHERE name = $6', 
    [author, name, genre, purchase_price, description, name], (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error"});
        } else if(result. rowCount === 0) {
            res.status(400).json({ message: "Not updated"});
        } else {
            res.status(200).json({ message: "Successfully updated"});
        }
    });
};

exports.book_delete = async (req, res) => {
    const { bookName, authorName } = req.params;

    const book = helpers.splitName(bookName);
    const author = helpers.splitName(authorName);

    const deleteBook = await pool.query('DELETE FROM public.book WHERE name = $1 AND author = $2', [book, author]);

    if (deleteBook.rowCount === 0 ) {
        res.status(400).json({ message: "Something went wrong" });
    } else {
        const selectAuthor = await pool.query('SELECT * FROM public.book WHERE author = $1', [author]);

        if (selectAuthor.rowCount === 0) {
            const deleteAuthor = await pool.query('DELETE FROM public.author WHERE "fullName" = $1', [author]);
            res.status(200).json({ message: "Book and author deleted" });
        } else {
            res.status(200).json({ message: "Book deleted" });
        }
  } 
};

exports.author_delete = async (req, res) => {
    const { authorName } = req.params;
    
    const author = helpers.splitName(authorName);

    const deleteBook = await pool.query('DELETE FROM public.book WHERE author = $1', [author]);
    const deleteAuthor = await pool.query('DELETE FROM public.author WHERE "fullName" = $1', [author]);

    if (deleteBook.rowCount == 0 || deleteAuthor == 0) {
        res.status(400).json({ message: "Something went wrong" });
    } else {
        res.status(200).json({ message: "Data deleted" });
    }
};