const mongoose = require("mongoose");

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
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
