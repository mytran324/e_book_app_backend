const {db} = require('../configs/connectDB');
const Chapters = require('../models/Chapters');

class ChaptersController {
    // api/chapters/add 
    async addChapter (req, res, next) {
        try {

        } catch (error) {
            res.status(500).json({message: 'fail', error: error.message});
        }
    }
}
