import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Review = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
}, {timestamps : true});


export default mongoose.model("Review", Review);
