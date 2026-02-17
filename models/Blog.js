const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    title: String,
    content: String,
    author: String,
  },
  {
    timestamps: true,
  },
);

const Blog = model("Blog", blogSchema);
module.exports = Blog;
