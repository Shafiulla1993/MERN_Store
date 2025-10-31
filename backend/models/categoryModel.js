import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  sizeOptions: { type: [String], default: [] },
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    subCategories: { type: [subCategorySchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
