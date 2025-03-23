import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const Hero = () => {
  const [studies, setStudies] = useState([]); // Store the full studies list
  const [selectedStudy, setSelectedStudy] = useState(null); // Default study
  const navigate = useNavigate();

  /*useEffect(() => {
    fetch("/studies.json") // Ensure correct path
      .then(response => response.json())
      .then(data => {
        setStudies(data);
        setSelectedStudy(data[5]); // Set the 5th study as default
      })
      .catch(error => console.error("Error loading studies:", error));
  }, []);
  */
  
  useEffect(() => {
    fetch("http://localhost:5000/studies") // Fetch from backend
      .then(response => response.json())
      .then(data => {
        setStudies(data);
        setSelectedStudy(data[5]); // Default study
      })
      .catch(error => console.error("Error loading studies:", error));
  }, []);
  

  if (!selectedStudy) return <Loader />; 

  return (
    <section className="flex flex-col md:flex-row items-center justify-center bg-white">
      {/* LEFT - TEXT SECTION */}
      <div className="w-1/2 max-sm:w-full bg-white p-6 px-20 max-sm:px-10 flex flex-col justify-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight w-full">
          Get into the wholeness of God's word
        </h2>
        <p className="text-lg text-gray-600 mt-3 w-full">
          As you go through the studies specifically designed for your spiritual growth, development, and edification, you will be able to understand the word of God better and apply it to your life. Our studies are designed to help you grow in your relationship with God and others.
        </p>

        <button
          className="bg-green-500 hover:bg-green-400 text-white font-semibold w-[150px] py-4 px-4 rounded-lg mt-6 cursor-pointer"
          onClick={() => navigate(`/study/${selectedStudy._id}`)}
        >
          Start Reading
        </button>
      </div>

      {/* RIGHT - IMAGE SECTION */}
      <div className="w-1/2 bg-green-300 max-sm:w-full flex items-center justify-center p-6 relative">
      {/* LARGE IMAGE */}
      <div className="relative w-[70%] h-64 md:h-[350px] cursor-pointer mb-6 mt-6" onClick={() => navigate(`/study/${selectedStudy._id}`)}>
          <img
            src={`http://localhost:5000/${selectedStudy.image}`}
            alt={selectedStudy.title}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
      </div>

      {/* SMALLER OVERLAY IMAGES (Limited to studies 4-7) */}
      <div className="absolute bottom-[-70px] md:bottom-[-100px] flex gap-4">
        {studies.slice(5, 8).map((study, index) => ( // Show only studies 5 to 6
        <div
            key={study._id}
        className={`w-20 h-20 md:w-24 md:h-24 cursor-pointer rounded-lg shadow-md transition-all ${
          selectedStudy._id === study._id ? "border-4 border-green-500" : ""
        }`}
        onClick={() => setSelectedStudy(study)}
        style={{ transform: `translateY(${index % 2 === 0 ? "-30px" : "-20px"})` }} // Adjust position for staggered effect
      >
        <img
                src={`http://localhost:5000/${study.image}`}
                alt={study.title}
                className="w-full h-full object-cover rounded-lg"
              />
          </div>
        ))}
       </div>
      </div>

    </section>
  );
};

export default Hero;
