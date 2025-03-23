import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRegisterUserMutation } from '../../redux/userAuthApi/userAuthApi';
import { toast } from 'react-toastify';

const Signup = () => {
  const schema = yup.object().shape({
    firstname: yup.string().required('First name is required'),
    lastname: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phcode: yup.string().required('PH code is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    terms: yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();


  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data).unwrap();
      localStorage.setItem('token', response.token);
      localStorage.setItem('phcode', data.phcode); // Store email in localStorage

      if (!response.user.profileCompleted) {
        navigate('/user-dashboard');  // Redirect to complete profile
      } else {
        navigate('/home'); // Redirect to home
      }
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
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Sign Up</h2>

        <input 
          className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none"
          type="text" 
          placeholder="First Name" 
          {...register("firstname")} 
        />
        {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}

        <input 
          className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none"
          type="text" 
          placeholder="Last Name" 
          {...register("lastname")} 
        />
        {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}

        <input 
          className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none"
          type="email" 
          placeholder="Email" 
          {...register("email")} 
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input 
          className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none"
          type="text" 
          placeholder="PH Code" 
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

        <input 
          className="w-full p-3 mb-3 bg-gray-100 rounded-md border-none focus:ring-2 focus:ring-green-300 focus:outline-none"
          type="password" 
          placeholder="Confirm Password" 
          {...register("confirmPassword")} 
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

        <div className="flex items-center mb-4">
          <input className="mr-2 accent-blue-500 cursor-pointer" type="checkbox" {...register("terms")} />
          <span className="text-gray-700 text-sm">Agree to terms and conditions</span>
        </div>
        {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}

        <button 
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-400 transition duration-200 cursor-pointer" 
          type="submit"
        >
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>

        <div className="text-center mt-4 text-gray-600">
          Have an account? <Link to="/login" className="text-green-500">Log in</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
