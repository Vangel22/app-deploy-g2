const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  account_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "accounts",
  },
  title: String,
  content: String,
});

const Post = mongoose.model("posts", postSchema, "posts");

const getAll = async (account_id) => {
  return await Post.find({ account_id });
};

const getSingle = async (account_id, id) => {
  return await Post.findOne({ account_id: account_id, _id: id });
};

const create = async (data) => {
  const post = new Post(data);
  return await post.save();
};

const update = async (id, data) => {
  return await Post.updateOne({ _id: id }, data);
};
const remove = async (id) => {
  return await Post.deleteOne({ _id: id });
};

module.exports = {
  getAll,
  getSingle,
  create,
  update,
  remove,
};
