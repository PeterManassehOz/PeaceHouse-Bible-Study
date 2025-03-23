import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useLoginUserMutation } from '../../redux/userAuthApi/userAuthApi'

const Login = () => {
  const schema = yup.object().shape({
    phcode: yup.string().required("PH code is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    term: yup.boolean().oneOf([true], "You must agree to the terms"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  
  const [loginUser, { isLoading }] = useLoginUserMutation();

  
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data).unwrap();
      localStorage.setItem('token', response.token);
      localStorage.setItem('phcode', data.phcode); // Store email in localStorage

      if (!response.user.profileCompleted) {
        navigate('/user-dashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-md p-8 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Log in</h2>
        
        <input 
          className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none" 
          type="text" 
          placeholder="PH code" 
          {...register("phcode")}
        />
        {errors.phcode && <p className="text-red-500 text-sm">{errors.phcode.message}</p>}

        <input 
          className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none" 
          type="password" 
          placeholder="Password" 
          {...register("password")} 
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <div className="flex items-center mb-4">
          <input className="mr-2 cursor-pointer" type="checkbox" {...register("term")} />
          <span className="text-gray-700 text-sm">Agree to terms and conditions</span>
        </div>
        {errors.term && <p className="text-red-500 text-sm">{errors.term.message}</p>}

        <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-400 transition duration-200 cursor-pointer" type="submit">
           {isLoading ? "Logging in..." : "Log in"}
        </button>

        <div className="text-center mt-4 text-gray-600">
          <p>Don&apos;t have an account? <Link to="/" className="text-green-500">Sign up</Link></p>
          <p>Forgot password? <Link to="/forgot-password" className="text-green-500">Reset</Link></p>
        </div>
      </form>
    </div>
  )
}

export default Login;
