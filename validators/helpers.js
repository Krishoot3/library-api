

exports.bookInsert = async (req, res, pool, msg) => {
    const { author, name, genre, purchase_price, description } = req.body;
    const insertQuery = "INSERT INTO public.book(author, name, genre, purchase_price, description) VALUES ($1, $2, $3, $4, $5)";

    await pool.query(insertQuery, [author, name, genre, purchase_price, description])
    .then(result => { if (result.rowCount !==  0) res.status(201).json({ message: msg}) })
    .catch(error => res.status(500).json({ message: "Internal server error"}));
};

exports.splitName = (name) => {
    const spliter = name.split("-");
    const resultName = spliter.join(" ");
    return resultName;
};