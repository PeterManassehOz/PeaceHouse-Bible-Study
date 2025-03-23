import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Reading from "../../components/Reading/Reading";
import Completed from "../../components/Completed/Completed";
import Downloaded from "../../components/Downloaded/Downloaded";
import ResetPassword from "../../components/ResetPassword/ResetPassword";
import Profile from "../Profile/Profile";
import { IoArrowBack, IoLogOut, IoHome, IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaReadme } from "react-icons/fa6";
import { GrAggregate } from "react-icons/gr";
import { MdDownload, MdLockReset } from "react-icons/md";
import { IoIosPerson } from "react-icons/io";
import useUserProfile from "../../hooks/useUserProfile";
import UserAggregator from "../../components/UserAggregator/UserAggregator";

const UserDashboard = () => {
  const { userProfile, profileImageUrl } = useUserProfile();
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  const goBack = () => {
    setSelectedComponent(null);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar - Always visible on larger screens, hidden on mobile when a component is selected */}
      <div className={`fixed inset-0 bg-green-900 text-white p-6 md:w-64 md:h-full md:relative flex flex-col justify-between h-full 
          ${selectedComponent ? "hidden md:flex" : "flex"}`}> 
        <div>
          <div onClick={() => navigate("/home")} className="flex items-center gap-2 text-lg font-bold cursor-pointer">
            <IoHome className="text-xl" />
            <span>PHouse Studies</span>
          </div>
          <hr className="my-4 border-white" />
          <ul className="space-y-3">
            <li onClick={() => handleComponentChange("profile")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <IoIosPerson className="text-xl" /> Profile
            </li>
            <li onClick={() => handleComponentChange("aggregator")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <GrAggregate className="text-xl" /> Aggregator
            </li>
            <li onClick={() => handleComponentChange("reading")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <FaReadme className="text-xl" /> Reading
            </li>
            <li onClick={() => handleComponentChange("completed")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <IoCheckmarkDoneCircle className="text-xl" /> Completed
            </li>
            <li onClick={() => handleComponentChange("downloaded")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <MdDownload className="text-xl" /> Downloaded
            </li>
            <li onClick={() => handleComponentChange("reset-password")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <MdLockReset className="text-xl" /> Reset Password
            </li>
          </ul>
        </div>

        {/* Logout & Profile Section */}
        <div className="mt-auto">
          <button onClick={logOut} className="w-full flex items-center gap-2 py-4 px-4 bg-red-700 rounded-md hover:bg-red-600 cursor-pointer">
            <IoLogOut className="text-xl" /> Log out
          </button>

          {/* Profile Image & Name */}
          <div className="flex flex-row items-center gap-2 mt-6">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-10 h-10 md:w-13 md:h-13 lg:w-13 lg:h-13 object-cover rounded-full shadow-md"
            />
            <span className="flex flex-wrap gap-1 text-sm md:text-sm lg:text-sm font-semibold text-center">
              {userProfile?.firstname} {userProfile?.lastname}
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 p-6 bg-gray-100 transition-all duration-300 w-full overflow-hidden ${selectedComponent ? "block" : "hidden md:block"} overflow-y-auto`}
       style={{ height: "100vh" }}
      >
        {/* Back Button for Mobile */}
        {selectedComponent && (
          <button onClick={goBack} className="md:hidden flex items-center gap-2 mb-4 py-4 px-4 text-white bg-green-600 rounded-full hover:bg-green-500">
            <IoArrowBack className="text-lg" />
          </button>
        )}

        {/* Render Selected Component */}
        {!selectedComponent && <Profile />}
        {selectedComponent === "profile" && <Profile />}
        {selectedComponent === "aggregator" && <UserAggregator />}
        {selectedComponent === "reading" && <Reading />}
        {selectedComponent === "completed" && <Completed />}
        {selectedComponent === "downloaded" && <Downloaded />}
        {selectedComponent === "reset-password" && <ResetPassword />}
      </div>
    </div>
  );
};

export default UserDashboard;
