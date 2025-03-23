import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useResetUserPasswordMutation } from '../../redux/userAuthApi/userAuthApi';





const ResetPassword = () => {
    const schema = yup.object().shape({
        phcode: yup.string().required('phcode is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password'), null], 'Passwords must match')
          .required('Please confirm your password'),
      });
    
      const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({ resolver: yupResolver(schema) });
      const [resetPassword, { isLoading }] = useResetUserPasswordMutation();
    
      
        useEffect(() => {
          const storedPHCode = localStorage.getItem('phcode'); // Get email from localStorage
          console.log("Stored PHCode from localStorage:", storedPHCode);
          if (storedPHCode) {
            setValue('phcode', storedPHCode); // Set the email field
            console.log('Retrieved PHCode from localStorage:', storedPHCode);
          }
        }, [setValue]);
      
    
      const onSubmit = async (data) => {
        try {
          const response = await resetPassword(data).unwrap();
          localStorage.setItem('token', response.token);
          reset();
          toast.success('Password reset successful');
        } catch (error) {
          console.error(error);
          toast.error('Password reset failed');
        }
      };
    
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
         
          <form onSubmit={handleSubmit(onSubmit)}   className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
            <h2  className="text-2xl font-semibold text-center text-gray-700 mb-6">Reset Password</h2>
            
            <input 
              type="text" 
              className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none" 
              placeholder="PH Code" 
              {...register('phcode')}
              readOnly
            />
            {errors.phcode && <p className="text-red-500 text-sm">{errors.phcode.message}</p>}
    
            <input
              className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none" 
              type="password"
              placeholder="New Password"
              {...register('password')}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
    
            <input
             className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none" 
              type="password"
              placeholder="Confirm Password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
    
            <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-400 transition duration-200 cursor-pointer"  type="submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Reset Password'}
            </button>
          </form>
        </div>
      );
    };

export default ResetPassword