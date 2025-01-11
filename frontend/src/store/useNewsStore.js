import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useNewsStore = create((set, get) => ({
    news: {},
  isNewsLoading: false,

  getNews: async () => {
    set({ isNewsLoading: true });
    try {
      const res = await axiosInstance.get("/news");
      set({ news: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isNewsLoading: false });
    }
  }

}));
