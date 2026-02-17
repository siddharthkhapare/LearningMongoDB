const Blog = require("../models/Blog");

exports.getBlogs = async (req, res) => {
  try {
    const list = await Blog.find();
    console.log("list", list);

    return res.status(200).send({ data: list });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error });
  }
};

exports.createBlogs = async (req, res) => {
  try {
    const createdBlog = await Blog.create(req.body);
    console.log("createdBlog", createdBlog);

    return res.status(201).send({ data: createdBlog });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error });
  }
};

exports.updateBlogs = async (req, res) => {
  try {
    console.log("req.query", req.query);
    console.log("req.params", req.params);

    const updatedBlog = await Blog.updateOne(
      { _id: req.params.id },
      { $set: req.body },
    );
    console.log("updatedBlog", updatedBlog);

    return res.status(201).send({ data: updatedBlog });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error });
  }
};

exports.deleteBlogs = async (req, res) => {
  try {
    console.log("req.params", req.params);

    const deletedBlog = await Blog.deleteOne({ _id: req.params.id });
    console.log("deletedBlog", deletedBlog);

    return res.status(200).send({ data: deletedBlog });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error });
  }
};
