const getReportsHandler = async (req, res, next) => {
    const email = req.headers.email;
    console.log(data);
    res.send("OK"); 
}



module.exports = {
    getReportsHandler,
}