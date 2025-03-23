import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify';
import { useResetPasswordWithTokenMutation } from '../../redux/userAuthApi/userAuthApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

const TokenResetPassword = () => {
  const schema = yup.object().shape({
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: yup
          .string()
          .oneOf([yup.ref('password'), null], 'Passwords must match')
          .required('Confirm password is required'),
  });

  const { register, handleSubmit, formState: { errors }, isLoading } = useForm({ resolver: yupResolver(schema) });

  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPasswordWithToken] = useResetPasswordWithTokenMutation();

  const onSubmit = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!token) {
      toast.error(response.error?.data?.message || response.error?.error || "Invalid or missing token!");
      return;
    }

    const response = await resetPasswordWithToken({ token, password, confirmPassword });

    if ("error" in response) {
      toast.error(response.error.data?.message || "Something went wrong!");
    } else {
      toast.success(response.data.message || "Password reset successful!");
      navigate("/login");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-md p-8 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Reset Password</h2>
        
        <input 
          className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none" 
          type="text"
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          {...register("password")}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input 
          className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none" 
          type="text" 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="Confirm Password" 
          {...register("confirmPassword")}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-400 transition duration-200 cursor-pointer" type="submit" disabled={isLoading}>
           {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  )
}

export default TokenResetPassword;
