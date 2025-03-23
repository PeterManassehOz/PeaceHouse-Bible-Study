import React, { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { useGetAllStudyQuery } from '../../redux/studyAuthApi/studyAuthApi';

const Studies = () => {

  //const [studies, setStudies] = useState([]);
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);

  const { data: getAllStudies = [], isLoading } = useGetAllStudyQuery();

  if (isLoading) return <Loader />;
  
 if (showError) return <Error onClose={() => setShowError(false)} />;

 /* useEffect(() => {
    fetch("http://localhost:5000/studies/")
      .then(response => response.json())
      .then(data => setStudies(data))
      .catch(error => console.error("Error loading studies:", error));
  }, []);*/

  if (getAllStudies.length === 0) return <div className="text-center mt-20"><Loader /></div>;

  return (
    <div className="p-6">
           {/* Back Button */}
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-white bg-green-400 hover:bg-green-300 py-4 px-4 rounded-full cursor-pointer"
                >
                  <IoIosArrowBack className="text-xl" />
                </button>
    
          <h2 className="text-2xl font-semibold mt-4 text-center">Studies</h2>
    
          {getAllStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {getAllStudies.map((study) => (
                <div 
                  key={study._id} 
                  className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition duration-300"
                  onClick={() => navigate(`/study/${study._id}`)}
                >
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Image */}
                    <img
                      src={`http://localhost:5000/${study.image}`}
                      alt={study.title}
                      className="w-full md:w-1/3 lg:w-1/2 object-cover rounded-lg"
                    />
    
                    {/* Study Info */}
                    <div className="text-center md:text-left">
                      <h3 className="text-lg font-semibold">{study.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{study.author}</p>
                      <p className="text-sm text-gray-400">{study.date}</p>
                      <p className="mt-2 text-gray-700">{study.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mt-4">No studies available in this category.</p>
          )}
        </div>
  )
}

export default Studies