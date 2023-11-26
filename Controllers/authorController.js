const {db} = require('../configs/connectDB');

const getAllAuthor = async (req, res, next) => {
    try{
        const authorRef= await db.collection('author').get();
        const list = authorRef.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.send(list);
    } catch (error) {
        res.send(error.message);
    }
}

module.exports = {
    getAllAuthor,
}