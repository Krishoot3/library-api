

exports.default_page = (req, res) => {
    res.status(200).json({ message: "Welcome!" });
};

exports.book_add = (req, res) => {
    const bookData = req.body;
    res.status(201).json(bookData);
};

exports.book_filter_detail = (req, res) => {

    res.send(req.params);
};

exports.book_detail = (req, res) => {
    res.send("Not implemented 3!");
};

exports.book_edit = (req, res) => {
    res.send("Not implemented 4!");
};

exports.book_delete = (req, res) => {
    res.send("Not implemented 5!");
};

exports.author_delete = (req, res) => {
    res.send(req.params);
};