const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      //required: [true, "SubCategory Name is required"],
      unique: [true, "SubCategory must be unique"],
      minLength: [4, "SubCategory name is too short"],
      maxLength: [20, "SubCategory name is too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to parent Category"],
    },
  },
  { timestamps: true }
);

subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name _id slug",
  });
  next();
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategory;
