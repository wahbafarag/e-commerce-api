const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      minlength: [3, "Category name is too short"],
      maxlength: [30, "Category name is too long"],
      unique: [true, "Category name is unique"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },

  { timestamps: true }
);

categorySchema.post("init", function (doc) {
  //return image base url + image name
  if (doc.image) doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
});

categorySchema.post("save", function (doc) {
  //return image base url + image name
  if (doc.image) doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
