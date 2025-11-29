import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Tag = new Schema({
    name: {type: String, unique: true}
})

Tag.pre("save", function (next) {
  if (this.name) {
    this.name =
      this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }
  next();
});


export default mongoose.model("Tag", Tag)