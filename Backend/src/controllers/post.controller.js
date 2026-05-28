const PostModel = require("../models/post.models");
const ImageKit = require("@imagekit/nodejs");
const {toFile} = require("@imagekit/nodejs");


const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});


async function PostCreate(req,res) {
    const data = req.body
   console.log(data , req.file);


    const UploadedFile = await imagekit.files.upload({
      file: await toFile(req.file.buffer, req.file.originalname),
      fileName: req.file.originalname,
    });

    res.status(201).json({
      message: "post created successful",
      UploadedFile,
    });
  
   
}

module.exports = {PostCreate}