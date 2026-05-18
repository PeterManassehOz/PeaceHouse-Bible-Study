import React, { useMemo, useState } from "react";
import { useGetUserDashboardDataQuery } from "../../redux/studyAuthApi/studyAuthApi";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import {
  MdDownload,
  MdMenuBook,
  MdCheckCircle,
  MdArrowForward,
  MdCalendarToday,
} from "react-icons/md";

const UserAggregator = () => {
  const { data, error, isLoading } = useGetUserDashboardDataQuery();
  const navigate = useNavigate();

  // Default tab = completed
  const [activeTab, setActiveTab] = useState("completed");

  const tabs = [
  {
    key: "completed",
    title: "Completed",
    count: data?.completed?.length || 0,
    icon: <MdCheckCircle className="text-3xl" />,
    color: "bg-green-600",
    light: "bg-green-50",
    text: "text-green-700",
    studies: data?.completed || [],
    emptyTitle: "No completed studies yet",
    emptyText:
      "Once you complete studies, they’ll appear here beautifully organized for quick access.",
  },
  {
    key: "reading",
    title: "Reading",
    count: data?.inProgress?.length || 0,
    icon: <MdMenuBook className="text-3xl" />,
    color: "bg-blue-600",
    light: "bg-blue-50",
    text: "text-blue-700",
    studies: data?.inProgress || [],
    emptyTitle: "Nothing currently being read",
    emptyText:
      "Start reading any study material and continue your learning journey from here.",
  },
  {
    key: "downloaded",
    title: "Downloaded",
    count: data?.downloaded?.length || 0,
    icon: <MdDownload className="text-3xl" />,
    color: "bg-purple-600",
    light: "bg-purple-50",
    text: "text-purple-700",
    studies: data?.downloaded || [],
    emptyTitle: "No downloaded studies",
    emptyText:
      "Downloaded study materials will appear here for easy offline access.",
  },
];

const currentTab = useMemo(() => {
  return tabs.find((tab) => tab.key === activeTab);
}, [activeTab, tabs]);

if (isLoading) return <Loader />;

if (error) {
  return (
    <div className="flex items-center justify-center h-[70vh] px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg border border-red-100">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-5">
          <span className="text-4xl">⚠️</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Unable to load dashboard
        </h2>

        <p className="text-gray-500 leading-relaxed">
          Something went wrong while loading your study dashboard.
          Please refresh the page or try again later.
        </p>
      </div>
    </div>
  );
}

  const renderEmptyState = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 md:p-16 text-center">
      <div
        className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${currentTab.light}`}
      >
        <div className={`${currentTab.text} text-5xl`}>
          {currentTab.icon}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        {currentTab.emptyTitle}
      </h3>

      <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
        {currentTab.emptyText}
      </p>
    </div>
  );

  const renderStudies = () => {
    if (!currentTab.studies.length) {
      return renderEmptyState();
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-7">
        {currentTab.studies.map((study) => {
          console.log("STUDY DATA:", study);
          console.log("STUDY IMAGE:", study.image);

          const API_URL = import.meta.env.VITE_API_URL;

          const imageUrl = study?.image?.startsWith("http")
            ? study.image
            : `${API_URL}/${study.image}`;

          console.log("STUDY DATA:", study);
          console.log("STUDY IMAGE:", study.image);
          console.log("FINAL IMAGE URL:", imageUrl);

          return (
            <div
            key={study._id}
            onClick={() => navigate(`/study/${study._id}`)}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={imageUrl}
                alt={study.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-1 rounded-full text-xs font-semibold text-white ${currentTab.color}`}
                >
                  {study.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <MdCalendarToday />
                <span>
                  {new Date(study.date).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-gray-700 transition">
                {study.title}
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                By <span className="font-semibold">{study.author}</span>
              </p>

              <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-5">
                {study.description}
              </p>

              {/* Outline */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2 font-semibold">
                  Study Outline
                </p>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {study.outline}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MdDownload />
                  <span>{study.downloads || 0} downloads</span>
                </div>

                <button
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-white text-sm font-medium ${currentTab.color} hover:opacity-90 transition`}
                >
                  Open
                  <MdArrowForward />
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          My Study Dashboard
        </h2>

        <p className="text-gray-500 text-lg">
          Organize your completed, ongoing, and downloaded study materials in one place.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all duration-300 border-2
              ${
                activeTab === tab.key
                  ? `${tab.color} text-white border-transparent shadow-2xl scale-[1.02]`
                  : "bg-white border-gray-100 hover:shadow-lg"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    activeTab === tab.key
                      ? "text-white/80"
                      : "text-gray-500"
                  }`}
                >
                  {tab.title}
                </p>

                <h3 className="text-5xl font-bold mt-3">
                  {tab.count}
                </h3>
              </div>

              <div
                className={`p-4 rounded-2xl ${
                  activeTab === tab.key
                    ? "bg-white/20"
                    : `${tab.light} ${tab.text}`
                }`}
              >
                {tab.icon}
              </div>
            </div>

            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/40" />
            )}
          </div>
        ))}
      </div>

      {/* Active Section Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${currentTab.color}`}
        >
          {currentTab.icon}
        </div>

        <div>
          <h3 className="text-3xl font-bold text-gray-800">
            {currentTab.title} Studies
          </h3>

          <p className="text-gray-500">
            {currentTab.count} study
            {currentTab.count !== 1 ? "ies" : "y"} available
          </p>
        </div>
      </div>

      {/* Render Active Content */}
      {renderStudies()}
    </div>
  );
};

export default UserAggregator;