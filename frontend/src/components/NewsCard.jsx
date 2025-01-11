import { useNewsStore } from "../store/useNewsStore";
import { useEffect } from "react";
import { formatTimestamp } from "../lib/utils";


const NewsCard = () => {

  const { news, getNews } = useNewsStore();
  useEffect(() => {
    getNews();
  }, []);

  return (
    <>
      {news?.data && news?.data?.map((item, index) => (
        <div key={index} className={`flex items-center space-x-4 p-4 bg-white shadow-lg rounded-lg mb-2 ${index === 0 ? 'mt-10' : ''}`}>
          {/* <div className="w-1/3">
            <img src="https://via.placeholder.com/150" alt="News" className="w-full h-auto object-cover" />
          </div> */}
          <div className="w-1/1">
            <h2 className="text-xl font-bold">{item?.title}</h2>
            <p className="text-gray-600">{item?.description}</p>
            <div className="text-sm text-gray-500 mt-2">
              <span>Source    : {item?.source || ''}</span><br />
              <span>Author    : {item?.author || ''}</span><br/>
              <span>Post Date : {formatTimestamp(item?.published_at)}</span><br/>
            </div>
            <a href={item?.url}>Read More...</a>
          </div>
        </div>
      ))}
    </>
  );
}

export default NewsCard;