import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    author: String,
    title: { type: String, required: true },
    description: String,
    url: { type: String, required: true },
    source: String,
    image: String,
    category: String,
    language: String,
    country: String,
    published_at: { type: Date, required: true },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

export default News;
