import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoLogOut, IoHome,} from "react-icons/io5";
import CreateStudy from "../../components/CreateStudy/CreateStudy";
import Aggregator from "../../components/Aggregator/Aggregator";
import ManageStudy from "../../components/ManageStudy/ManageStudy";
import AssignAdminRole from "../../components/AssignAdminRole/AssignAdminRole";
import CheckUserActivities from "../../components/CheckUserActivities/CheckUserActivities";
import { MdAddShoppingCart, MdOutlineManageHistory, MdSubscriptions } from "react-icons/md";
import { GrAggregate } from "react-icons/gr";
import { MdAssignmentInd } from "react-icons/md";
import { FiActivity } from "react-icons/fi";
import NewsletterSubscribers from "../../components/NewsletterSubscribers/NewsletterSubscribers";






const AdminDashboard = () => {
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
    navigate("/admin-login");
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
            <li onClick={() => handleComponentChange("aggregator")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <GrAggregate className="text-xl" /> Aggregator
            </li>
            <li onClick={() => handleComponentChange("createstudy")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <MdAddShoppingCart className="text-xl" /> Create Study
            </li>
            <li onClick={() => handleComponentChange("managestudy")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <MdOutlineManageHistory className="text-xl" /> Manage Study
            </li>
            <li onClick={() => handleComponentChange("assignadminrole")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <MdAssignmentInd className="text-xl" /> Assign Admin Role
            </li>
            <li onClick={() => handleComponentChange("subscribers")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <MdSubscriptions className="text-xl" />
              Subscribers
            </li>
            <li onClick={() => handleComponentChange("checkuseractivities")} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-green-700 rounded">
              <FiActivity  className="text-xl" /> Check user's activities
            </li>
          </ul>
        </div>

        {/* Logout & Profile Section */}
        <div className="mt-auto">
          <button onClick={logOut} className="w-full flex items-center gap-2 py-4 px-4 bg-red-700 rounded-md hover:bg-red-600 cursor-pointer">
            <IoLogOut className="text-xl" /> Log out
          </button>

   
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
        {!selectedComponent && <Aggregator />}
        {selectedComponent === "aggregator" && <Aggregator />}
        {selectedComponent === "createstudy" && <CreateStudy />}
        {selectedComponent === "managestudy" && <ManageStudy />}
        {selectedComponent === "assignadminrole" && <AssignAdminRole />}
        {selectedComponent === "subscribers" && <NewsletterSubscribers />}
        {selectedComponent === "checkuseractivities" && <CheckUserActivities />}
      </div>
    </div>
  );
};

export default AdminDashboard;
