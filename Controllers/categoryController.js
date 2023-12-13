const {db, bucket, getDownloadURL} = require('../configs/connectDB');
const Category = require('../models/Category');

class CategoryController {
    // api/category
    async getAllCategory (req, res, next) {
        try {
            const categoryRef = await db.collection('category');
            const data = await categoryRef.get();
            const categoryList = [];
            data.docs.forEach((doc) => {
                const category = new Category(
                    doc.id,
                    doc.data().name,
                    doc.data().status,
                    doc.data().imageUrl,
                )
                categoryList.push(category);
            });
            res.status(200).json({message: 'success', data: categoryList});
        } catch (error) {
            res.status(500).json({message: 'fail', error: error.message});
        }
    }

    //api/category/add
    async addCategory (req, res, next) {
        try {
            const data = req.body;
            const imageUrlReq = req.file;
            const uploadFile = async (file, destinationArray) => {
                return new Promise((resolve, reject) => {
                  const fileName = `${file.originalname}`;
                  const fileUpload = bucket.file(fileName);
                  const blobStream = fileUpload.createWriteStream({
                    metadata: {
                      contentType: file.mimetype,
                    },
                  });
              
                  blobStream.on('error', (error) => {
                    console.error(error);
                    reject(`Error uploading file: ${file.originalname}`);
                  });
              
                  blobStream.on('finish', async () => {
                    const imageUrl = bucket.file(fileName);
                    const downloadURL = await getDownloadURL(imageUrl);
                    destinationArray.push(downloadURL);
                    resolve();
                  });
              
                  blobStream.end(file.buffer);
                });
            };

            const imageUrl = [];
            await uploadFile(imageUrlReq, imageUrl);
            const category  = {
                imageUrl: imageUrl,
                name: data.name,
                status: data.status,
            }
            await db.collection('category').doc().set(category);
            res.status(201).json({message: 'success'});
        } catch (error) {
            res.status(500).json({message: 'fail', error: error.message});
        }
    }

    // api/category/get
    async getCategory(req, res, next) {
        try {
                const {categoryId} = req.query;
                const categoryRef = await db.collection('category').doc(categoryId);
                const data = await categoryRef.get();
                if (!data.exists) {
                    res.status(400).json({message: 'fail', error: 'Bad request'});
                }
                else {
                    const category = new Category(
                        data.id,
                        data.data().name,
                        data.data().status,
                        data.data().imageUrl
                    );
                    res.status(200).json({message: 'success', data: category});
                }
        } catch (error) {
            res.status(500).json({message: 'fail', error:error.message});
        }
    }

    async updateCategory(req, res, next) {
        try {
            const {categoryId} = req.query;
            const data = req.body;
            const categoryRef = await db.collection('category').doc(categoryId);
            const category = await categoryRef.get();
            const keys = Object.keys(req.body);
            if (keys.includes('status')){
                if (data.status === 'false') {
                    data.status = false;
                }
                else {
                    data.status = true;
                }

            }
            if (!category.exists) {
                res.status(400).json({message: 'fail', error: 'Bad request'});
            }
            else {
                if (req.file) {
                    await new Promise((resolve, reject) => {
                        const fileName = `${req.file.originalname}`;
                        const fileUpload = bucket.file(fileName);
                        const blobStream = fileUpload.createWriteStream({
                        metadata: {
                                contentType: req.file.mimetype,
                            },
                        });
                    
                        blobStream.on('error', (error) => {
                            console.error(error);
                            reject(`Error uploading file: ${req.file.originalname}`);
                        });
                    
                        blobStream.on('finish', async () => {
                            const imageUrl = bucket.file(fileName);
                            const downloadURL = await getDownloadURL(imageUrl);
                            data.imageUrl = downloadURL;
                            resolve();
                        });
                        blobStream.end(req.file.buffer);
                    });
                }
                await db.collection('category').doc(categoryId).update(data);
                res.status(200).json({message: 'success'});
            }
        } catch (error) {
            res.status(500).json({message: 'fail', error:error.message});
        }
    }

    // api/category/delete 
    async deleteCategory (req, res, next) {
        try {
            const {categoryId} = req.query;
            const categoryRef = await db.collection('category').doc(categoryId);
            const category = await categoryRef.get();
            if (!category.exists) {
                res.status(400).json({message: 'fail', error: 'Bad request'});
            }
            else {
                await db.collection('category').doc(categoryId).update({status: false});
                res.status(200).json({message: 'success'});
            }
        } catch (error) {
            res.status(500).json({message: 'fail', error: error.message});
        }
    }
}

module.exports = new CategoryController;
