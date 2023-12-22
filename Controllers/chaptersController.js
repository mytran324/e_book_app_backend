const {db} = require('../configs/connectDB');
const Chapters = require('../models/Chapters');

class ChaptersController {
    // api/chapters/get
    async getChapters (req, res, next) {
        try {
            const chaptersRef = await db.collection('chapters').get();
            const listChapters = [];
            chaptersRef.docs.forEach((doc) => {
                const chapters = new Chapters(
                    doc.id,
                    doc.data().bookId,
                    doc.data().chapterList,
                );
                listChapters.push(chapters);
            });
            res.status(200).json({message: 'success', data: listChapters});
        } catch (error) {
            res.status(500).json({message: 'fail', error: error.message});
        }
    }
    // api/chapters/add 
    async addChapters (req, res, next) {
        try {
            const bookId = req.body.bookId;
            const data = req.body;
            const book = await db.collection('book').doc(bookId).get();
            if (!book) {
                return res.status(400).json({ message: 'fail', error: 'Bad Request' });
            } else {
                const chapters = {
                    bookId: bookId,
                    chapterList: data.chapterList,
                }
                await db.collection('chapters').add(chapters);
                await db.collection('book').doc(bookId).update({status: true});
                res.status(201).json({message: 'success'});
            }
        } catch (error) {
            res.status(500).json({message: 'fail', error: error.message});
        }
    }
}

module.exports = new ChaptersController;
