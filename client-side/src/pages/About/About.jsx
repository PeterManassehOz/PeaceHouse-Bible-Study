import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdSchool,
  MdMenuBook,
  MdCloudDownload,
  MdPeople,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const testimonials = [
  {
    name: "Sarah A.",
    text: "This platform helped me stay consistent in my spiritual studies. The structure is clean and very easy to follow.",
  },
  {
    name: "Michael T.",
    text: "I love how I can continue my reading exactly where I stopped. It feels intentional, organized, and deeply helpful.",
  },
  {
    name: "Grace E.",
    text: "The download feature is a game changer. I can study even without internet access anytime.",
  },
];

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  const next = () =>
    setIndex((prev) => (prev + 1) % testimonials.length);

  const prev = () =>
    setIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );

  // AUTO SLIDE (with pause support)
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      next();
    }, 4500);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* HERO */}
      <div className="relative bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white overflow-hidden">

        {/* glowing background effect */}
        <div className="absolute inset-0 opacity-30 animate-pulse bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_60%)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative px-6 py-28 md:py-36 text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            A Place to Grow Spiritually & Intellectually
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-6">
            “Study to show thyself approved unto God…” — 2 Timothy 2:15
          </p>

          <p className="text-white/80 max-w-2xl mx-auto">
            A modern study platform built to help you deepen understanding,
            track spiritual growth, and remain consistent in your walk and learning journey.
          </p>

          <button
            onClick={() => navigate("/home")}
            className="mt-10 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition cursor-pointer"
          >
            Get Started
          </button>
        </motion.div>
      </div>

      {/* FEATURES */}
      <div className="px-6 md:px-16 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {[
            {
              icon: <MdSchool />,
              title: "Structured Learning",
              text: "Organized study paths for clarity and consistency.",
              color: "text-blue-600",
            },
            {
              icon: <MdMenuBook />,
              title: "Progress Tracking",
              text: "Continue exactly where you left off.",
              color: "text-green-600",
            },
            {
              icon: <MdCloudDownload />,
              title: "Offline Access",
              text: "Download and study anytime, anywhere.",
              color: "text-purple-600",
            },
            {
              icon: <MdPeople />,
              title: "Community Growth",
              text: "Learn and grow alongside others.",
              color: "text-orange-600",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className={`text-4xl mb-3 ${f.color}`}>{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* MISSION */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-6 md:px-16"
      >
        <div className="bg-white rounded-3xl shadow-sm p-10 md:p-14">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Our Mission
          </h2>

          <p className="text-gray-600 leading-relaxed mb-4">
            We exist to make structured spiritual and educational materials
            accessible to everyone. Growth should be intentional, trackable,
            and spiritually grounded.
          </p>

          <p className="text-gray-600 italic mb-4">
            “Thy word is a lamp unto my feet, and a light unto my path.”
            — Psalm 119:105
          </p>

          <p className="text-gray-600 leading-relaxed">
            This platform is designed to guide your journey step by step,
            helping you remain rooted, focused, and consistent in your studies.
          </p>
        </div>
      </motion.div>

      {/* TESTIMONIALS */}
      <div
        className="max-w-4xl mx-auto px-6 md:px-16 py-24 text-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <h2 className="text-3xl font-bold mb-10 text-gray-800">
          What Users Are Saying
        </h2>

        <div className="relative bg-white rounded-3xl shadow-md p-10 min-h-[180px]">

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-600 text-lg italic mb-6">
                "{testimonials[index].text}"
              </p>

              <h4 className="font-semibold text-gray-800">
                — {testimonials[index].name}
              </h4>
            </motion.div>
          </AnimatePresence>

          {/* dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === index ? "bg-blue-600 scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DEVELOPER */}
      <div className="bg-gray-900 text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Developed With Purpose</h2>

        <p className="text-gray-300 max-w-2xl mx-auto mb-6">
          Built with intention, discipline, and a vision to support meaningful
          spiritual and educational growth.
        </p>

        <div className="text-xl font-semibold">
          Built by{" "}
          <span className="text-blue-400">
            Peter Manasseh Oz
          </span>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="text-center py-24 px-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Ready to Begin Your Journey?
        </h3>

        <p className="text-gray-500 mb-6">
          Explore studies, track progress, and stay consistent daily.
        </p>

        <button
          onClick={() => navigate("/home")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md transition hover:scale-105 cursor-pointer"
        >
          Browse Studies
        </button>
      </div>
    </div>
  );
};

export default About;