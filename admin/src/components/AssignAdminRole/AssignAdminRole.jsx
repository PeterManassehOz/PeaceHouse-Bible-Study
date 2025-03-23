import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAssignAdminRoleMutation } from '../../redux/adminAuthApi/adminAuthApi';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';
import { useState } from 'react';





// Validation Schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
});





const AssignAdminRole = () => {
  const [assignAdminRole, { isLoading, isError, error, isSuccess }] = useAssignAdminRoleMutation();
  const [showError, setShowError] = useState(false);
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Admin role assigned successfully!');
      reset();
    }
    if (isError) {
      toast.error(error?.data?.message || 'Failed to assign admin role');
    }
  }, [isSuccess, isError, error, reset]);

  const onSubmit = async (data) => {
        await assignAdminRole(data);
  };

  if (isLoading) {
    return <Loader />;
  }
    
    
  if (showError) {
    return <Error onClose={() => setShowError(false)} />;
  }


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Assign Admin Role</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              {...register('email')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter admin email"
            />
            <p className="text-red-500">{errors.email?.message}</p>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Assigning...' : 'Assign Admin Role'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignAdminRole;
