import NewsCard from "../components/NewsCard";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

const NewsPage = () => {


  return (
    <div className="h-screen grid lg:grid-cols-1">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-max space-y-8 h-full">
          {<NewsCard/>}
        </div>
      </div>
    </div>
  );
};
export default NewsPage;
