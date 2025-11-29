import Tag from "../Model/Tag.js";

export default class TagController {
  static async add(tagName) {
    try {
      const tag = await Tag.findOneAndUpdate(
        { name: tagName },
        { name: tagName },
        { upsert: true, new: true } 
      );
      return tag._id;
    } catch (error) {
      console.error("Error in TagController.add:", error);
      throw error;
    }
  }
}
