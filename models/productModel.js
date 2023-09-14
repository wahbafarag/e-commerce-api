const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product Title is required"],
      minLength: [5, "Title is too short"],
      maxLength: [200, "Title is too long"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product Slug is required"],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minLength: [20, "Too short description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [20000, "Too long Product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    images: [String],

    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "Product Category is required"],
    },
    subcategories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating have to be above or equal to 1.0 "],
      max: [5, "Rating have to be less than or equal to 5.0 "],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

productSchema.post("init", function (doc) {
  if (doc.imageCover)
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;

  if (doc.images)
    doc.images = doc.images.map(
      (image) => `${process.env.BASE_URL}/products/${image}`
    );
});

productSchema.post("save", function (doc) {
  if (doc.imageCover)
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;

  if (doc.images)
    doc.images = doc.images.map(
      (image) => `${process.env.BASE_URL}/products/${image}`
    );
});

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
