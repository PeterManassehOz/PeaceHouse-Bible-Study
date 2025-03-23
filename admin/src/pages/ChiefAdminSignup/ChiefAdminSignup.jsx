import React from 'react'
import { useRegisterChiefAdminMutation } from '../../redux/adminAuthApi/adminAuthApi';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';




const ChiefAdminSignup = () => {
 const schema = yup.object().shape({
     name: yup.string().required('Name is required'),
     email: yup.string().email('Invalid email').required('Email is required'),
     password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
   });
 
   const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
 
   
   const [registerChief, { isLoading }] = useRegisterChiefAdminMutation();
   const navigate = useNavigate();
 
 
   const onSubmit = async (data) => {
     try {
       const response = await registerChief(data).unwrap();
       localStorage.setItem('token', response.token);
       localStorage.setItem('email', data.email); // Store email in localStorage

       toast.success('Registration successful');
       navigate('/admin-dashboard'); 
     } catch (error) {
       console.error(error);
       toast.error(error?.data?.message || "Registration failed");
     }
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-white">
       <form 
         className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg"
         onSubmit={handleSubmit(onSubmit)}
       >
         <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Chief Admin Sign Up</h2>
 
         <input 
           className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none"
           type="text" 
           placeholder="Name" 
           {...register("name")} 
         />
         {errors.firstname && <p className="text-red-500 text-sm">{errors.name.message}</p>}

 
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
           {isLoading ? 'Loading...' : 'Sign Up'}
         </button>
 
         <div className="text-center mt-4 text-gray-600">
           Have an account? <Link to="/admin-login" className="text-green-500">Log in</Link>
         </div>

         <div className="text-center mt-4 text-gray-600">
           Don't have an account? <Link to="/admin-signup" className="text-green-500">Admin Sign in</Link>
         </div>
       </form>
     </div>
   );
}

export default ChiefAdminSignup