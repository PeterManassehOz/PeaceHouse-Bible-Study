import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  useFindUserByEmailQuery,
  useGetUsertActivityByAdminQuery,
} from "../../redux/adminStudyAuthApi/adminStudyAuthApi";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";

// Validation Schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
});

const CheckUserActivities = () => {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);






  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Fetch user ID based on email
  const { data: userData, isError: userError, isFetching: userFetching } = useFindUserByEmailQuery(email, {
    skip: !email, // Skip fetching if email is empty
  });

  // Fetch user activities once we have the user ID
  const { data: activities, isLoading, isError, error, isSuccess } = useGetUsertActivityByAdminQuery(userId, {
    skip: !userId, // Skip if userId is null
  });

  
    useEffect(() => {
      if (isSuccess) {
        toast.success('User activities gotten by admin successfully!');
        reset();
      }
      if (isError) {
        toast.error(error?.data?.message || 'Failed to get user activities');
      }
    }, [isSuccess, isError, error, reset]);
  

  const onSubmit = (data) => {
    setEmail(data.email); // Trigger API call for finding user ID
  };

  // Set user ID when userData is available
  useEffect(() => {
    if (userData?.userId) {
      setUserId(userData.userId);
    } else if (userError) {
      toast.error("User not found");
    }
  }, [userData, userError]);

  if (isLoading) return <Loader />

  if (showError) return <Error onClose={() => setShowError(false)} />;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Check User's Activities</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter admin email"
            />
            <p className="text-red-500">{errors.email?.message}</p>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg w-full cursor-pointer"
            disabled={userFetching || isLoading}
          >
            {userFetching ? "Finding user..." : isLoading ? "Fetching activities..." : "Check user activities"}
          </button>
        </form>

        {activities && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">User Activities:</h3>
            <div className="mt-2">
              <h4 className="font-semibold">In Progress:</h4>
              <ul>{activities.inProgress.map((study) => <li key={study._id}>{study.title}</li>)}</ul>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Completed:</h4>
              <ul>{activities.completed.map((study) => <li key={study._id}>{study.title}</li>)}</ul>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Downloaded:</h4>
              <ul>{activities.downloaded.map((study) => <li key={study._id}>{study.title}</li>)}</ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckUserActivities;
