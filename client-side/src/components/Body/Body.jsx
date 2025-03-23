import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import '../../styles.css';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';


const categories = [
  { name: 'Ministers and Leadership Retreat', image: 'uploads/images/arome1.jpeg' },
  { name: 'Ministers and Leadership Training', image: 'uploads/images/blue desert.jpeg' },
  { name: 'Pre-Marital Retreat', image: 'uploads/images/femiLaz1.jpeg' },
  { name: 'Students and Youth Conference', image: 'uploads/images/gbileAkanni1.jpeg' },
  { name: 'Vision retreat', image: 'uploads/images/edu2.jpeg' },
  { name: 'Women of Life and Education Training', image: 'uploads/images/arome2.jpeg' },
  { name: 'International Staff Discipleship', image: 'uploads/images/femiLaz2.jpeg' },
  { name: 'Teachers Development Conference', image: 'uploads/images/femiLaz3.jpeg' },
  { name: 'Leadership Development for the Young', image: 'uploads/images/gbileAkanni5.jpeg' },
]


const Body = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };


  return (
    <>
      <div className="body-container">
         <h2 className="text-start text-xl font-bold mt-40 max-sm:mt-20">Genre</h2>

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
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <div
                  className="cursor-pointer p-4 rounded-lg shadow-lg text-center h-auto md:h-64 lg:h-80"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 md:h-52 lg:h-64 object-cover rounded-md"
                  />
                  <h3 className="mt-2 text-lg font-semibold">{category.name}</h3>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
  </>
  )
}

export default Body