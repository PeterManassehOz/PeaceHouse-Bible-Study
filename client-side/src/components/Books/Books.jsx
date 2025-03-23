import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

const Books = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/books.json")
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error("Error loading books:", error));
  }, []);

  if (books.length === 0) return <p>Loading...</p>;

  return (
    <div className="body-container">
      <h2 className="text-start text-xl font-bold mt-20">
        Get books
      </h2>

      <Swiper
        modules={[Autoplay, Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={true}
                    autoplay={{
                      delay: 3000, // 3 seconds before sliding to the next
                      disableOnInteraction: false, // Keeps autoplay running even when users interact
                    }}
                    breakpoints={{
                      640: { slidesPerView: 1 },
                      1024: { slidesPerView: 2 },
                    }}
      >
        {books.map((book, index) => (
          <SwiperSlide key={index}>
            <div
              className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg shadow-lg h-auto cursor-pointer"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              {/* Image */}
              <img
                src={book.image}
                alt={book.title}
                className="w-40 h-52 object-cover rounded-md"
              />

              {/* Description */}
              <div className="text-center md:text-left md:w-2/3">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-gray-600 mt-2 text-sm md:text-base">
                  {book.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Books;
