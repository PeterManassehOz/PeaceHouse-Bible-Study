import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForgotPasswordMutation } from '../../redux/userAuthApi/userAuthApi';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  const { register, handleSubmit, formState: { errors }, isLoading } = useForm({ resolver: yupResolver(schema) });

  const [forgotPassword] = useForgotPasswordMutation(); // ✅ Call the hook correctly

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword({ email: data.email });

      if ("error" in response) {
        toast.error(response.error?.data?.message || response.error?.error || "Something went wrong!");
      } else {
        toast.success(response.data.message || "Check your email for a reset link!");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-md p-8 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Forgot Password</h2>
        
        <input 
          className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none" 
          type="text" 
          placeholder="Email" 
          {...register("email")} 
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <button 
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-400 transition duration-200 cursor-pointer" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
