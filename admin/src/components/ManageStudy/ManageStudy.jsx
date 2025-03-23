import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';
import { useDeleteStudyMutation, useGetAllStudyQuery } from '../../redux/adminStudyAuthApi/adminStudyAuthApi';
import Error from '../Error/Error';
import { useEffect } from 'react';
import { useState } from 'react';

const ManageStudy = () => {
  const { data: studies, refetch, isLoading, error } = useGetAllStudyQuery();
  const [deleteStudy, { isError: isDeleteError, isSuccess: isDeleteSuccess, reset }] = useDeleteStudyMutation();

  const navigate = useNavigate(); // Hook for navigation
  const [showError, setShowError] = useState(false);


  
  // Handle fetching error
  useEffect(() => {
    if (error) {
      console.error('Fetch error:', error);
      toast.error(error?.data?.message || 'Failed to fetch studies'); // Show toast for fetch error
      setShowError(true);
    }
  }, [error]);
    

   useEffect(() => {
    if (isDeleteSuccess) {
      toast.success('Study deleted successfully!');
      reset();
      refetch(); 
    }
    if (isDeleteError) {
      toast.error('Failed to delete study');
    }
  }, [isDeleteSuccess, isDeleteError, reset, refetch]);
  

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sermon?')) {
      try {
        await deleteStudy(id).unwrap();
        refetch(); // Refresh data
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };


  if (isLoading) {
    return <Loader />;
  }
    
  if (showError) {
    return <Error onClose={() => setShowError(false)} />;
  }


  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Manage Sermons</h2>
      {studies?.length === 0 ? (
        <p className="text-gray-500 text-center">No studies found.</p>
      ) : (
        studies?.map((study) => (
          <div key={study._id} className="bg-white shadow-md rounded-lg p-6 mb-4">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-700">{study.title}</h3>
              <p className="text-gray-600">{study.description}</p>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200 cursor-pointer"
                onClick={() => navigate(`/edit-study/${study._id}`)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-200 cursor-pointer"
                onClick={() => handleDelete(study._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageStudy;
