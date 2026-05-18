import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetMarkStudyInProgressQuery } from "../../redux/studyAuthApi/studyAuthApi";
import Loader from "../Loader/Loader";
import {
  MdMenuBook,
  MdArrowForward,
  MdCalendarToday,
  MdDownload,
} from "react-icons/md";

const Reading = () => {
  const navigate = useNavigate();

  const {
    data: studies = [],
    isLoading,
    isError,
  } = useGetMarkStudyInProgressQuery();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="bg-white shadow-xl rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Failed to load studies
          </h2>

          <p className="text-gray-500">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl shadow-lg">
            <MdMenuBook />
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              Currently Reading
            </h2>

            <p className="text-gray-500 text-lg">
              Continue your ongoing study journey.
            </p>
          </div>
        </div>
      </div>

      {studies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {studies.map((study) => {
            const API_URL = import.meta.env.VITE_API_URL;

            const imageUrl = study?.image?.startsWith("http")
              ? study.image
              : `${API_URL}/${study.image}`;

            return (
              <div
                key={study._id}
                onClick={() => navigate(`/study/${study._id}`)}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="inline-block px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold mb-3">
                      {study.category}
                    </span>

                    <h3 className="text-2xl font-bold text-white line-clamp-2">
                      {study.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <MdCalendarToday />
                    <span>
                      {new Date(study.date).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3">
                    By <span className="font-semibold">{study.author}</span>
                  </p>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-5">
                    {study.description}
                  </p>

                  <div className="bg-blue-50 rounded-2xl p-4 mb-5">
                    <p className="text-xs uppercase tracking-wide text-blue-500 mb-2 font-semibold">
                      Study Outline
                    </p>

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {study.outline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MdDownload />
                      <span>{study.downloads || 0} downloads</span>
                    </div>

                    <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
                      Continue
                      <MdArrowForward />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-[2rem] p-12 text-center shadow-xl">
          <div className="w-28 h-28 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-6">
            <MdMenuBook className="text-6xl text-blue-600" />
          </div>

          <h3 className="text-3xl font-bold text-gray-800 mb-3">
            No active reading session
          </h3>

          <p className="text-gray-500 leading-relaxed mb-8">
            Start reading any study material and continue your learning journey
            from here beautifully organized.
          </p>

          <button
            onClick={() => navigate("/studies")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition"
          >
            Browse Studies
          </button>
        </div>
      )}
    </div>
  );
};

export default Reading;