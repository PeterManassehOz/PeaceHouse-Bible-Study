import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateStudyMutation } from "../../redux/adminStudyAuthApi/adminStudyAuthApi";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";

// 📌 Define validation schema with Yup
const studySchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  date: yup.string().required("Date is required"),
  outline: yup.string().required("Outline is required"),
  author: yup.string().required("Author is required"),
  category: yup.string().required("Category is required"),
  status: yup.string().required("Status is required"),
  image: yup.mixed().required("Image is required"),
  file: yup.mixed().required("Study file is required"),
});

const CreateStudy = () => {
  const [createStudy, { isLoading, error }] = useCreateStudyMutation();
  const [outlinePreview, setOutlinePreview] = useState("");

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studySchema),
  });

  // Handle Form Submission
  const onSubmit = async (data) => {
    const formData = new FormData();
    
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("author", data.author);
    formData.append("category", data.category);
    formData.append("status", data.status);
    formData.append("outline", data.outline);
  
    if (data.image?.[0]) formData.append("image", data.image[0]);
    if (data.file?.[0]) formData.append("file", data.file[0]);
  
    console.log("Form Data:", Object.fromEntries(formData.entries()));

    console.log("Title:", data.title);
    console.log("Image:", data.image?.[0]); // Should show File object
    console.log("File:", data.file?.[0]); // Should show File object


    try {
      const response = await createStudy(formData).unwrap(); // Ensure we unwrap the response
  
      if (response && response.message === "Study created successfully") {
        toast("Study created successfully!");
      } else {
        console.error("❌ Unexpected response:", response);
        toast("Failed to create study. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error creating study:", err);
      toast("Error creating study. Check console for details.");
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Study</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          {...register("title")}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {/* Description */}
        <textarea
          placeholder="Description"
          {...register("description")}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        {/* Date */}
        <input
          type="date"
          {...register("date")}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.date && <p className="text-red-500">{errors.date.message}</p>}

        {/* Author */}
        <input
          type="text"
          placeholder="Author"
          {...register("author")}
         className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.author && <p className="text-red-500">{errors.author.message}</p>}

        {/* Category */}
        <input
          type="text"
          placeholder="Category"
          {...register("category")}
         className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.category && <p className="text-red-500">{errors.category.message}</p>}

        {/* Status */}
        <select {...register("status")} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">Select Status</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
        {errors.status && <p className="text-red-500">{errors.status.message}</p>}

        {/* Outline (Markdown-enabled) */}
        <textarea
          placeholder="Enter outline (Markdown supported)"
          {...register("outline")}
          onChange={(e) => {
            setValue("outline", e.target.value);
            setOutlinePreview(e.target.value);
          }}
         className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
        ></textarea>
        {errors.outline && <p className="text-red-500">{errors.outline.message}</p>}

        {/* Image Upload */}
        <label className="block w-full p-3 bg-blue-600 text-white text-center rounded cursor-pointer hover:bg-blue-700">
            Upload Image
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="hidden"
            />
        </label>
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}


        {/* Study File Upload */}
        <label className="block w-full p-3 bg-blue-600 text-white text-center rounded cursor-pointer hover:bg-blue-700">
          Upload File
          <input
            type="file"
            accept=".pdf,.docx"
            {...register("file")}
            className="hidden"
          />
        </label>
        {errors.file && <p className="text-red-500">{errors.file.message}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Study"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}

      {/* Live Markdown Preview */}
      <div className="mt-6 p-4 border rounded bg-gray-100">
        <h3 className="font-bold text-lg">Live Outline Preview:</h3>
        <div className="prose">
          <ReactMarkdown>{outlinePreview}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default CreateStudy;
