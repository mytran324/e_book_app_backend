const {db, bucket, getDownloadURL, Timestamp} = require('../configs/connectDB');
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
            const timestampValue = Timestamp.now();
            const author = data.authodId;
            let authorId;
            const authorRef = await db.collection('author').where('fullName','==', author).get();
            if (authorRef.empty){
                const newAuthor = await db.collection('author').add({fullName: author, status: true});
                authorId = newAuthor.id;
            } else {
                authorRef.forEach((doc) => authorId = doc.id);
            }
            const book = {
                authodId: authorId,
                bookReview: bookReview,
                categoryId: data.categoryId.split(','),
                chapters: parseInt(data.chapters, 10),
                country: data.country,
                description: data.description,
                imageUrl: imageUrlBook,
                language: data.language,
                price: 0,
                publishDate: timestampValue,
                status: false,
                title: data.title,
            }
            const newBook = await db.collection('book').add(book);

            res.status(201).json({message: 'success', data: {id: newBook.id,...book}});
        } catch (error){
            res.status(500).json({message: 'fail', error: error.message});
            console.log(error);
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
            const {bookId} = req.query;
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
        } catch (error){ 
            res.status(500).json({message: 'fail', error: error.message});
        }
    }

    // api/book/remove
    async removeBook(req, res, next) {
        try {
            const {bookId} = req.query;
            const book = await db.collection('book').doc(bookId).get();
            if (!book.exists) {
                res.status(400).json({message: 'fail', error: "Bad request"});
            }
            else {
                await db.collection('book').doc(bookId).delete();
                res.status(200).json({message: 'success'});
            }
        } catch (error) {
            res.status(500).json({message: 'fail', error: error.message});
        }
    }
    // api/book/topBook
    async viewBooks (req, res, next) {
        try {
            const booksSnapshot = await db.collection('book').get();
            const bookViews = [];

            for (const bookDoc of booksSnapshot.docs) {
                const bookViewSnapshot = await db.collection('histories').where('chapters', '==', bookDoc.id).get();
                const bookView = {
                    bookId: bookDoc.id,
                    views: bookViewSnapshot.size,
                }
                bookViews.push(bookView);
            }
            res.status(200).json({message: 'success', data: bookViews});
        } catch (error) {
            res.status(500).json({message: 'fail', error: error.message});
        }
    }

    // api/book/totalView
    async totalViews (req, res, next) {
        try {
            const histories = await db.collection('histories').get();
            console.log(histories);
            res.status(200).json({message: 'success', data:{totalViews: histories.size}});
        } catch (error) {
            res.status(500).json({message: 'fail', error: error.message});
        }
    }
    
}

module.exports = new BookController;