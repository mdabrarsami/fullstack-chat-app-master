import axios from "axios";
import News from "../models/news.model.js";

let cachedNews = {
  data: null,
  lastFetched: null, // Timestamp of last fetch
};

export const fetchNews = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if data is already cached and up-to-date
    if (cachedNews.lastFetched && cachedNews.lastFetched >= startOfDay) {
      console.log("Returning cached news data.");
      return res.status(200).json({ success: true, data: cachedNews.data });
    }

    // Fetch news from Mediastack API
    const { country = "in", category = "general", language = "en" } = req.query;

    const response = await axios.get("https://api.mediastack.com/v1/news", {
      params: {
        access_key: process.env.MEDIASTACK_API_KEY,
        countries: country,
        categories: category,
        languages: language,
      },
    });

    const newsData = response.data.data;

    // Save fetched news to the database
    const newsToSave = newsData.map((newsItem) => ({
      author: newsItem.author,
      title: newsItem.title,
      description: newsItem.description,
      url: newsItem.url,
      source: newsItem.source,
      image: newsItem.image,
      category: newsItem.category,
      language: newsItem.language,
      country: newsItem.country,
      published_at: newsItem.published_at,
    }));

    //await News.insertMany(newsToSave, { ordered: false });

    cachedNews = {
      data: newsData,
      lastFetched: now,
    };

    console.log("Fetched and cached new news data.");
    // res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
    res.setHeader("Allow-Control-Allow-Origin", "*").status(200).json({ success: true, data: newsData });
    //res.status(200).json({ success: true, data: newsData });
  } catch (error) {
    console.error("Error in fetchNews controller: ", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};
