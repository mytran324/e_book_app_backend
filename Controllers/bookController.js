const {db, bucket, getDownloadURL} = require('../configs/connectDB');
const Book = require('../models/Book');
const Diacritics = require('diacritic');

class BookController {
    // api/book
    async getAllBook  (req, res, next)  {
        try{
            const bookRef= await db.collection('book');
            const data = await bookRef.get();
            const bookList = [];
            data.docs.forEach((doc) => {
                console.log(doc.data().publishDate);
                const book = new Book(
                    doc.id,
                    doc.data().authodId,
                    doc.data().categoryId,
                    doc.data().description,
                    doc.data().imageUrl,
                    doc.data().language,
                    doc.data().price,
                    doc.data().publishDate,
                    doc.data().status,
                    doc.data().title,
                    doc.data().bookPreview,
                    doc.data().chapters,
                    doc.data().country,

                );
                bookList.push(book);
            });
            res.status(200).json({Headers: {"Content-Type": "application/json"},message:'success', data: bookList});
        } catch (error) {
            res.status(500).json({message: 'fail', error: error.message});
        }
    }
    
    // api/book/add
    async addBook (req, res, next) {
        try{
            const data = req.body;
            const bookReviewReq = req.files['bookReview'];
            const imageUrlReq = req.files['imageUrl'];
            const bookReview = [];
            const imageUrlBook = [];

            const folderName = Diacritics.clean(data.title.split(' ').join(''));

            if (!bookReviewReq || bookReviewReq.length === 0 || !imageUrlReq || imageUrlReq.length === 0) {
            return res.status(400).json({message: 'fail', error: 'Both image fields are required.'});
            }

            const uploadFile = async (file, destinationArray) => {
                const promises = file.map(async (item) => {
                    const fileName = `book_content_images/${folderName}/${Date.now()}_${item.originalname}`;
                    const fileUpload = bucket.file(fileName);
                    const blobStream = fileUpload.createWriteStream({
                    metadata: {
                        contentType: item.mimetype,
                    },
                });

                return new Promise((resolve, reject) => {
                blobStream.on('error', (error) => {
                    console.error(error);
                    reject(`Error uploading file: ${item.originalname}`);
                });

                blobStream.on('finish', async () => {
                    const imageUrl = bucket.file(fileName);
                    const downloadURL = await getDownloadURL(imageUrl);
                    destinationArray.push(downloadURL);
                    resolve(`File ${item.originalname} uploaded successfully.`);
                });

                blobStream.end(item.buffer);
                });
            });

            await Promise.all(promises);
            };


            await Promise.all([
            uploadFile(bookReviewReq, bookReview),
            uploadFile(imageUrlReq, imageUrlBook),
            ]);
            const book = {
                authodId: data.authodId,
                bookReview: bookReview,
                categoryId: data.categoryId,
                chapters: data.chapters,
                country: data.country,
                description: data.description,
                imageUrl: imageUrlBook,
                language: data.language,
                price: data.price,
                publishDate: data.publishDate,
                status: data.status,
                title: data.title,
            }
            await db.collection('book').doc().set(book);

            res.status(201).json({message: 'success'});
        } catch (error){
            res.status(500).json({message: 'fail', error: error.message});
        }
    }

    // api/book/get
    async getBook (req, res, next) {
        try {
            const {bookId} = req.query;
            const bookRef = await db.collection('book').doc(bookId);
            const data = await bookRef.get();
            if (!data.exists) {
                res.status(400).json({message: 'fail', error: 'Bad request'});
            }
            else {
                const book = new Book(
                    bookId,
                    data.data().authodId,
                    data.data().categoryId,
                    data.data().description,
                    data.data().imageUrl,
                    data.data().language,
                    data.data().price,
                    data.data().publishDate,
                    data.data().status,
                    data.data().title,
                    data.data().bookPreview,
                    data.data().chapters,
                    data.data().country,
                )
                res.status(200).json({message: 'success', data: book});
            }
        } 
        catch (error) {
            res.status(500).json({message: 'fail', error:error.message});
        }
    }

    // api/book/update
    async updateBook (req, res, next) {
        try {
            const {bookId} = req.query;
            const data = req.body;
            const bookReview = [];
            const image = [];
            const keys = Object.keys(req.body);
            if (keys.includes('status')){
                if (data.status === 'false') {
                    data.status = false;
                }
                else {
                    data.status = true;
                }

            }
            const uploadFile = async (file, destinationArray) => {
                const promises = file.map(async (item) => {
                    const fileName = `book_content_images/${folderName}/${Date.now()}_${item.originalname}`;
                    const fileUpload = bucket.file(fileName);
                    const blobStream = fileUpload.createWriteStream({
                        metadata: {
                            contentType: item.mimetype,
                        },
                    });

                    return new Promise((resolve, reject) => {
                        blobStream.on('error', (error) => {
                            console.error(error);
                            reject(`Error uploading file: ${item.originalname}`);
                        });

                        blobStream.on('finish', async () => {
                            const imageUrl = bucket.file(fileName);
                            const downloadURL = await getDownloadURL(imageUrl);
                            destinationArray.push(downloadURL);
                            resolve(`File ${item.originalname} uploaded successfully.`);
                        });

                        blobStream.end(item.buffer);
                    });
                });
                await Promise.all(promises);
            };

            const bookRef = await db.collection('book').doc(bookId);
            const book = await bookRef.get();
            if (!book.exists) {
                res.status(400).json({message: 'fail', error: 'Bad request'});
            } else {
                
            }
        } catch (error) {

        }
    }

    // api/book/delete
    async deleteBook(req, res, next) {
        try {
            const bookId = req.query;
            const book = await db.collection('book').doc(bookId).get();
            if (!book.exists) {
                res.status(400).json({message: 'fail', error: "Bad request"});
            }
            else {
                const data = {
                    status: false
                }
                await db.collection('book').doc(bookId).update(data);
                res.status(200).json({message: 'success'});
            }
        } catch { 
            res.status(500).json({message: 'fail', error: error.message});
        }
    }
    
}

module.exports = new BookController;