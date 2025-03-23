import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from "react-icons/io";

// Pagination Helpers
const WORDS_PER_PAGE = 250; // Limit words per page

const SingleBook = () => {
  const { id } = useParams(); // Get clicked study ID
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Study ID from URL:", id);
    fetch("/books.json")
      .then(response => response.json())
      .then(data => {
        const selectedBook = data.find(book => book.id.toString() === id);
        setBook(selectedBook);
      })
      .catch(error => console.error("Error loading studies:", error));
  }, [id]);

  if (!book) return <p className="text-center mt-20">Loading...</p>;

  // Paginate the outline
  const outlineWords = book.outline.split(" ");
  const totalPages = Math.ceil(outlineWords.length / WORDS_PER_PAGE);
  const currentWords = outlineWords.slice(currentPage * WORDS_PER_PAGE, (currentPage + 1) * WORDS_PER_PAGE).join(" ");


  return (
    <div className="p-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white bg-green-400 hover:bg-green-300 py-4 px-4 rounded-full cursor-pointer"
      >
        <IoIosArrowBack className="text-xl" />
      </button>

      {/* Study Title */}
      <h2 className="text-2xl font-semibold mt-6 text-center">{book.title}</h2>

      {/* Study Image */}
      {currentPage === 0 && (
        <div className="flex justify-center mt-4">
          <img 
            src={`/${book.image}`} 
            alt={book.title} 
            className="w-full max-w-lg object-cover rounded-lg shadow-md" 
          />
        </div>
      )}

      {/* Study Details */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">{book.author} | {book.date}</p>
      </div>

      {/* Study Outline with Pagination */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
        {currentPage === 0 && <h3 className="text-lg font-semibold">Outline</h3>}
        <p className="mt-2 text-gray-700">{currentWords}</p>
        

        {/* Show "Buy Now" only on the final page */}
        {currentPage === totalPages - 1 && (
          <div className="mt-4 text-center">
            Continue reading... <button 
              className="text-green-400 hover:text-green-300 cursor-pointer"
              onClick={() => window.open(`https://www.amazon.com/dp/${book.asin}`, "_blank")}
            >
              Buy Now
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === 0 ? 'bg-gray-300' : 'bg-green-400 hover:bg-green-300 text-white'}`}
          >
            <IoIosArrowBack className="text-xl" />
          </button>
          
          <span className="text-sm text-gray-600">Page {currentPage + 1} of {totalPages}</span>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === totalPages - 1 ? 'bg-gray-300' : 'bg-green-400 hover:bg-green-300 text-white'}`}
          >
            <IoIosArrowForward className="text-xl"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
