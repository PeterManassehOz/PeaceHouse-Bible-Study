import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPending = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Access Pending Approval
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Your account has been successfully created, but you have not yet been
          assigned admin privileges by the Chief Admin.
          <br />
          <br />
          You cannot access the dashboard until approval is granted.
          <br />
          <span className="text-sm text-red-500">Approval takes up to 72 hours.</span>
        </p>

        <button
          onClick={logout}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl w-full cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default AdminPending;