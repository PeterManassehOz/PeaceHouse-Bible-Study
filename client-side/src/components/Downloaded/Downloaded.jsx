import React, { useState } from "react";
import { useGetUserDownloadsQuery } from "../../redux/studyAuthApi/studyAuthApi";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import { useNavigate } from "react-router-dom";

const Downloaded = () => {
    const navigate = useNavigate();
  const { data: studies, error, isLoading } = useGetUserDownloadsQuery();
  const [_showError, setShowError] = useState(false);

    if (isLoading) return <Loader />;
    if (error) return <Error onClose={() => setShowError(false)} />;

  

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-center">Downloaded Studies</h2>

      {studies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studies.map((study) => (
            <div
              key={study._id}
              className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition duration-300"
              onClick={() => navigate(`/study/${study._id}`)}
            >
              <h3 className="text-lg font-semibold">{study.title}</h3>
              <p className="text-sm text-gray-500">{study.author}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No studies downloaded.</p>
      )}
    </div>
  );
};

export default Downloaded;
