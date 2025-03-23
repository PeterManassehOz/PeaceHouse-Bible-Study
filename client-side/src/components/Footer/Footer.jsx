import { useState, useEffect } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaSquareYoutube } from "react-icons/fa6";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  useGetSubscriptionStatusQuery, 
  useSubscribeNewsletterMutation 
} from "../../redux/newsLetterAuthApi/newsLetterAuthApi";

const Footer = () => {
  const [email, setEmail] = useState("");
  
  // Get subscription status (only fetch when email is entered)
  const { data, refetch } = useGetSubscriptionStatusQuery(email, { 
    skip: !email 
  });

  // Subscribe/Unsubscribe API mutation
  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();

  useEffect(() => {
    if (email) refetch();
  }, [email, refetch]);

  const handleSubscription = async () => {
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    try {
      const response = await subscribeNewsletter(email).unwrap();
      toast.success(response.message);  // Show either "Subscribed" or "Unsubscribed"
      refetch(); // Update the UI immediately
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-10 px-6 sm:px-20">
      <div className="mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* Left Section */}
        <div className="text-center sm:text-left md:w-[24%]">
          <h3 className="text-xl font-semibold">Living Seed, Gboko</h3>
          <p className="text-sm mt-2">Contact</p>
          <p className="mt-1">+234 80 456 789</p>
          <p className="mt-1">example@example.com</p>
          <div className="flex justify-center sm:justify-start gap-4 mt-3">
            <FaFacebookF className="text-xl cursor-pointer hover:text-blue-500 transition" />
            <FaSquareYoutube className="text-2xl cursor-pointer hover:text-red-500 transition" />
          </div>
        </div>

        {/* Center Section */}
        <div className="text-center md:w-[51%]">
          <h3 className="text-xl font-semibold">Location</h3>
          <p className="text-sm mt-2 leading-6">
            Peace House, P.O Box 971 <br />
            Gboko, Benue State <br />
            Nigeria,<br />
            Tel: +234 703 036 3659, +234 703 768 1198
          </p>
        </div>

        {/* Right Section */}
        <div className="text-center md:text-right md:w-[25%]">
          <h3 className="text-xl font-semibold">Stay Connected</h3>
          <p className="text-sm mt-2 leading-6">Sign up with your email, and we&apos;ll keep you updated</p>
          <div className="flex mt-4">
            <input
              className="w-full p-3 border border-gray-500 bg-transparent rounded-md focus:ring-2 focus:ring-green-300 focus:outline-none focus:border-none"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="bg-green-500 px-4 py-2 rounded-r-md hover:bg-green-400 transition cursor-pointer"
              onClick={handleSubscription}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : data?.subscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-8 border-t border-gray-700 pt-4">
        <p>© {new Date().getFullYear()} Peace House. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
