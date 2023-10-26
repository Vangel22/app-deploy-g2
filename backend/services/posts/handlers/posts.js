const post = require("../../../pkg/posts");
const { BlogPOST, BlogPUT, validate } = require("../../../pkg/posts/validate");

const getAll = async (req, res) => {
  try {
    const data = await post.getAll(req.auth.id);
    return res.status(200).send(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

const getSingle = async (req, res) => {
  try {
    const data = await post.getSingle(req.auth.id, req.params.id);

    if (!data) {
      return res.status(404).send("Post not found!");
    }

    return res.status(200).send(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

const create = async (req, res) => {
  try {
    await validate(req.body, BlogPOST);
    if (!req.auth.id) {
      return res.status(400).send("Unauthorized action!");
    }
    const data = {
      ...req.body,
      account_id: req.auth.id,
    };
    const newPost = await post.create(data);
    return res.status(200).send(newPost);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

const update = async (req, res) => {
  try {
    await validate(req.body, BlogPUT);
    if (!req.auth.id) {
      return res.status(400).send("Unauthorized action!");
    }
    const data = {
      ...req.body,
      account_id: req.auth.id,
    };
    await post.update(req.params.id, data);
    return res.status(204).send("Update successful");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

const remove = async (req, res) => {
  try {
    await post.remove(req.params.id);
    return res.status(200).send("Deleted successful");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

module.exports = {
  getAll,
  getSingle,
  create,
  update,
  remove,
};
