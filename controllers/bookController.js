const { Pool } = require('pg');
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

exports.book_add = (req, res) => {
    const { author, name, genre, purchase_price, description } = req.body;
    res.status(201).json(bookData);
};

exports.book_filter_detail = (req, res) => {
    const { bookName, authorName } = req.params;

    pool.query('SELECT * FROM public.book', (err, result) => {
        const resultArray = result.rows;
    
        const filtered = resultArray.filter(p => p.author.startsWith(authorName) && p.name.startsWith(bookName));
        
        if (filtered.length === 0) {
            res.status(401).json({ message: "No match" });
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
    const dataArray = req.params.bookName.split("-");
    const data = dataArray.join(" ");

    pool.query('SELECT * FROM public.book WHERE name = $1', [data], (err, result) => {
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
    const bookArray = req.params.bookName.split("-");
    const authorArray = req.params.authorName.split("-");

    const dataBook = bookArray.join(" ");
    const dataAuthor = authorArray.join(" ");

    const deleteBook = await pool.query('DELETE FROM public.book WHERE name = $1', [dataBook]);
    const selectAuthor = await pool.query('SELECT * FROM public.book WHERE author = $1', [dataAuthor]);

    if (selectAuthor.rowCount === 0) {
        const deleteAuthor = await pool.query('DELETE FROM public.author WHERE "fullName" = $1', [dataAuthor]);
        res.status(200).json({ message: "Book and author deleted" });
    } else {
        res.status(200).json({ message: "Book deleted" });
    }
};

exports.author_delete = async (req, res) => {
    const dataArray = req.params.authorName.split("-");
    const data = dataArray.join(" ");

    const deleteBook = await pool.query('DELETE FROM public.book WHERE author = $1', [data]);
    const deleteAuthor = await pool.query('DELETE FROM public.author WHERE "fullName" = $1', [data]);

    if (deleteBook.rowCount == 0 || deleteAuthor == 0) {
        res.status(401).json({ message: "Something went wrong" });
    } else {
        res.status(200).json({ message: "Data deleted" });
    }
};