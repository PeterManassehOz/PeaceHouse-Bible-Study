import React, { useState } from "react";
import { useGetUserDashboardDataQuery } from "../../redux/studyAuthApi/studyAuthApi";
import { useNavigate } from "react-router-dom";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";

const UserAggregator = () => {
  const { data, error, isLoading } = useGetUserDashboardDataQuery();
  const navigate = useNavigate();
  const [_showError, setShowError] = useState(false);




  if (isLoading) return <Loader />;
  if (error) return <Error onClose={() => setShowError(false)} />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Study Dashboard</h2>

      {/* Summary Section */}
      <div className="flex justify-around bg-green-900 text-white p-4 rounded-lg shadow-md mb-6">
        <span className="text-lg font-semibold"> Completed: {data.completed.length}</span>
        <span className="text-lg font-semibold"> Reading: {data.inProgress.length}</span>
        <span className="text-lg font-semibold"> Downloaded: {data.downloaded.length}</span>
      </div>

      {/* Downloaded Studies */}
      <section>
        <h3 className="text-2xl font-semibold mb-4 text-start">Downloaded Studies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {data.downloaded.length > 0 ? (
            data.downloaded.map((study) => (
              <div 
                key={study._id} 
                className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition duration-300"
                onClick={() => navigate(`/study/${study._id}`)}
              >
                <h4 className="text-lg font-semibold">{study.title}</h4>
                <p className="text-gray-600">{study.author} - {study.category}</p>
              </div>
            ))
          ) : (
            <p>No downloaded studies yet.</p>
          )}
        </div>
      </section>

      {/* In Progress (Reading) */}
      <section>
        <h3 className="text-2xl font-semibold mb-4 text-start">In Progress (Studying)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 ">
          {data.inProgress.length > 0 ? (
            data.inProgress.map((study) => (
              <div 
                key={study._id} 
                className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition duration-300"
                onClick={() => navigate(`/study/${study._id}`)}
              >
                <h4 className="text-lg font-semibold">{study.title}</h4>
                <p className="text-gray-600 ">{study.author} - {study.category}</p>
              </div>
            ))
          ) : (
            <p>No studies in progress.</p>
          )}
        </div>
      </section>

      {/* Completed Studies */}
      <section>
        <h3 className="text-2xl font-semibold mb-4 text-start">Completed Studies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.completed.length > 0 ? (
            data.completed.map((study) => (
              <div 
                key={study._id} 
                className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition duration-300"
                onClick={() => navigate(`/study/${study._id}`)}
              >
                <h4 className="text-lg font-semibold">{study.title}</h4>
                <p className="text-gray-600">{study.author} - {study.category}</p>
              </div>
            ))
          ) : (
            <p>No completed studies yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserAggregator;
