const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validation = require("../validator/validation");
let { isEmpty, isValidName, isValidObjectId, checkISBN } = validation;

//___create blogs__________________________________________________________________________________

const createBook = async function (req, res) {
    try {
        let data = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory } = data;

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide key in request body" });
        }

        if (!isEmpty(userId)) {
            return res.status(400).send({ status: false, msg: "Please provide author ID" });
        }
        if (!isEmpty(title)) {
            return res.status(400).send({ status: false, msg: "Please provide title" });
        }

        if (!isEmpty(excerpt)) {
            return res.status(400).send({ status: false, msg: "Please provide excerpt of blog" });
        }
        if (!isEmpty(category)) {
            return res.status(400).send({ status: false, msg: "Please provide category" });
        }

        if (!isEmpty(subcategory)) {
            return res.status(400).send({ status: false, msg: "Please provide subcategory" });
        }

        if (!isValidName(title)) {
            return res.status(400).send({ status: false, msg: "title should be alphabets only" });
        }

        if (!isValidName(category)) {
            return res.status(400).send({ status: false, msg: "category should be alphabets only" });
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Provide a valid author id" });
        }

        if (!isEmpty(ISBN)) {
            return res.status(400).send({ status: false, msg: "Please provide ISBN" });
        }

        if (!checkISBN(ISBN)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid ISBN" });
        }

        let bookData = await bookModel.create(data)
        res.status(201).send({ status: true, msg: "Blog has been created", data: bookData });

    } catch (err) {
        return res.status(500).send({ Satus: false, msg: err.message });
    }
};

// //_______get api________________________________________________________________________>>>

const getBooks = async (req, res) => {
    try {
        let data = req.query;
        if (!data)
            return res.status(404).send({ status: false, msg: "No data found in query" })

        if (data.userId) {
            if (!isValidObjectId(data.userId))
                return res.status(400).send({ status: false, msg: "please enter a valid userId" })
        }

        let getBook = await bookModel.find({ isDeleted: false, ...data }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
        if (getBook.length == 0)
            return res.status(404).send({ status: false, message: "no documents found with this query" })

        return res.status(200).send({ status: true, message: 'Books list', data: getBook })

    } 
    catch (err) {
       return res.status(500).send({ status: false, msg: err.massage })
    }
}
//--------------------------get book details by params-------------------

const bookDetails = async function (req, res) {
    try {
        let userId = req.params.userId;
        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "user id is not valid" })

        let getBook = await bookModel.find({ isDeleted: false, userId: userId })
        if (getBook.length == 0)
            return res.status(404).send({ status: false, msg: "no documents found " })

        return  res.status(200).send({ status: true, message: 'Books list', data: getBook })

    } catch (err) {
       return res.status(500).send({ status: false, message: err.massage })
    }
}








// //_____update api_______________________________________________________________________>>>

// const updatedBlog = async (req, res) => {
//   try {
//     let alldata = req.body;
//     let blogId = req.params.blogId;

//     if (Object.keys(alldata).length == 0)
//       return res.status(400).send({status: false, msg: "Please Enter Blog Details For Updating" });

//     if (!blogId)
//       return res.status(400).send({ status: false, msg: "Blog Id is required" });

//     let findBlogId = await blogModel.findById(blogId);

//     if (findBlogId.isDeleted == true) {
//       return res.status(404).send({ status: false, msg: "Blogs already deleted" });
//     }

//     let updatedBlog = await blogModel.findOneAndUpdate(
//       { _id: blogId },
//       {
//         $set: {
//           title: alldata.title,
//           body: alldata.body,
//           category: alldata.category,
//           publishedAt: new Date(),
//           isPublished: true,
//         },
//         $push: { tags: req.body.tags, subcategory: req.body.subcategory },
//       },
//       { new: true, upsert: true }
//     );
//     return res.status(200).send({ status: true, msg: updatedBlog });
//   } catch (err) {
//     res.status(500).send({ status: false, msg: err.message });
//   }
// };
// //_______delete blog api 1________________________________________________________>>>

// const deletedBlog = async (req, res) => {
//   try {
//     let blogId = req.params.blogId;
//     let checkBlogId = await blogModel.findById(blogId);

//     if(!checkBlogId || (checkBlogId.isDeleted == true)){
//       return res.status(404).send({status : false,msg : "Blog has been already deleted "})         
//   }
//      let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId },{ $set: { isDeleted: true,deletedAt: Date.now()}},{ new: true });
//     return res.status(200).send({status: true,msg: "Blog has been deleted successfully",data:deletedBlog});
//   } catch (err) {return res.status(500).send({ status: false, msg: err.message })}
// };

// //______delete blogs api 2 by given fields _________________________________________>>>

// const deleteByQueryParams = async function (req, res) {
//   try {
//     let data = req.query;
//       const deleteByQuery = await blogModel.updateMany({ $and: [data ,{authorId : req.id}, { isDeleted: false }] },{ $set: { isDeleted: true ,deletedAt:new Date()} },{ new: true, upsert : true })
//       let count = deleteByQuery.modifiedCount
//       if (deleteByQuery.modifiedCount==0) {
//       return res.status(404).send({ status: false, msg: "No Blog Found"})
//   }
//       res.status(200).send({status : true, msg : "No of blogs deleted:", count })
//   }
//   catch (err) {res.status(500).send({status:false,msg: err.message})}
// };

// //======================module exporting ==================================

module.exports.createBook = createBook;
module.exports.getBooks = getBooks;
module.exports.bookDetails = bookDetails
// module.exports.updatedBlog = updatedBlog;
// module.exports.deletedBlog = deletedBlog;
// module.exports.deleteByQueryParams = deleteByQueryParams;





