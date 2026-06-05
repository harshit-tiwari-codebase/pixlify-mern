const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pixlify-user",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
},
{timestamps : true,}
);

saveSchema.index(
  {
    userId: 1,
    postId: 1,
  },
  {
    unique: true,
  }
);

const saveModel = mongoose.model("saved" , saveSchema);

module.exports = saveModel ;
