// const app = require("../app");
const express = require("express");
// const router = express.Router();
const router = express();
const { getBlogs, createBlogs, updateBlogs, deleteBlogs } = require("../controllers/blogController");

router.get(
  "/getblogs",
  getBlogs,
);

router.post(
  "/postblogs",
  createBlogs,
);

router.put(
  "/updateblogs/:id",
  updateBlogs,
);

router.delete(
  "/deleteblogs/:id",
  deleteBlogs,
);

module.exports = {
  router,
};
