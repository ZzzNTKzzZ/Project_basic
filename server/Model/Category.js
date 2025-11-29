import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Category = new Schema ({
    name: { type: String, required: true, unique: true },
})

export default mongoose.model("Category", Category);