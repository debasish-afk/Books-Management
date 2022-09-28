const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require('../controllers/reviewController');
const auth = require("../middleware/auth");
const aws= require("aws-sdk")



//--------------------adding aws---------------------------//
aws.config.update({
   accessKeyId: "AKIAY3L35MCRZNIRGT6N",
   secretAccessKey: "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",
   region: "ap-south-1"
})

//------------------------------//

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    // this function will upload file to aws and return the link
    let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  //HERE
        Key: "abc/" + file.originalname, //HERE 
        Body: file.buffer
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        console.log(data)
        console.log("file uploaded succesfully")
        return resolve(data.Location)
    })

    // let data= await s3.upload( uploadParams)
    // if( data) return data.Location
    // else return "there is an error"

   })
}

router.post("/write-file-aws", async function(req, res){

    try{
        let files= req.files
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
})

//-----------------------post api (user creation)------------------------------->>>
router.post("/register", userController.createUser);

//-----------------------post api for login user ------------------------------->>>
router.post("/login", userController.loginUser);

//-----------------------post api for createBook-------------------------------->>>
router.post("/books",auth.authentication,bookController.createBook)

//----------------------Get API for book details by Query------------------------>>>
router.get("/books",auth.authentication,bookController.getBooks)

//---------------------Get API for all book details by param--------------------->>>
router.get("/books/:bookId",auth.authentication,bookController.bookDetails)

//-----------------------put API for books details update------------------------->>>
router.put("/books/:bookId", auth.authentication,auth.authorization,bookController.updateBook);

//-----------------------delete books---------------------------------------------->>>
router.delete("/books/:bookId", auth.authentication,auth.authorization,bookController.deleteBook);

// -----------------------create reviews------------------------------------------->>>
router.post("/books/:bookId/review",reviewController.bookReview)

// -----------------------update reviews------------------------------------------->>>
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)

//------------------------Delete Book review---------------------------------------->>>
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteBookReview)

//-----------------------API for wrong route-of-API--------------------------------->>>
router.all("/*", function (req, res) {
   return res.status(400).send({status: false,message: "Path Not Found"});
});

module.exports = router;





