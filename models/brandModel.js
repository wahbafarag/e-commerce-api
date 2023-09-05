const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      minlength: [3, "Brand name is too short"],
      maxlength: [30, "Brand name is too long"],
      unique: [true, "Brand name is unique"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },

  { timestamps: true }
);

brandSchema.post("init", function (doc) {
  //return image base url + image name
  if (doc.image) doc.image = `${process.env.BASE_URL}/brands/${doc.image}`;
});

brandSchema.post("save", function (doc) {
  //return image base url + image name
  if (doc.image) doc.image = `${process.env.BASE_URL}/brands/${doc.image}`;
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
