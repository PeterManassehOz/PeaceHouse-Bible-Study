import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useLoginAdminMutation } from '../../redux/adminAuthApi/adminAuthApi';




const AdminLogin = () => {
 const schema = yup.object().shape({
     email: yup.string().email('Invalid email').required('Email is required'),
     password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
   });
 
   const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
 
   
   const [loginAdmin, { isLoading }] = useLoginAdminMutation();
   const navigate = useNavigate();
 
 
   const onSubmit = async (data) => {
     try {
       const response = await loginAdmin(data).unwrap();
       localStorage.setItem('token', response.token);
       localStorage.setItem('email', data.email); // Store email in localStorage

       toast.success('Login successful');
       navigate('/admin-dashboard'); 
     } catch (error) {
       console.error(error);
       toast.error(error?.data?.message || "Login failed");
     }
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-white">
       <form 
         className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg"
         onSubmit={handleSubmit(onSubmit)}
       >
         <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Admin Login</h2>
 

         <input 
           className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none"
           type="email" 
           placeholder="Email" 
           {...register("email")} 
         />
         {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
 
         <input 
           className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none"
           type="password" 
           placeholder="Password" 
           {...register("password")} 
         />
         {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
 
       
 
         <button 
           className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-400 transition duration-200 cursor-pointer" 
           type="submit"
         >
           {isLoading ? 'Loading...' : 'Login'}
         </button>
 

         <div className="text-center mt-4 text-gray-600">
           Don't have an account? <Link to="/admin-signup" className="text-green-500">Admin Sign in</Link>
         </div>
       </form>
     </div>
   );
}

export default AdminLogin