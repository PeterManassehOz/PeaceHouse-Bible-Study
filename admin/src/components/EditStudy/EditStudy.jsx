import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useGetStudyByIdQuery, useUpdateStudyMutation } from '../../redux/adminStudyAuthApi/adminStudyAuthApi';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';
import ReactMarkdown from 'react-markdown';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineClose } from 'react-icons/ai';

// Validation Schema using Yup
const studySchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  author: yup.string().required('Author is required'),
  date: yup.date().required('Date is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
  outline: yup.string().required('Outline is required'),
});

const EditStudy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: study, isLoading, refetch } = useGetStudyByIdQuery(id);
  const [updateStudy] = useUpdateStudyMutation();
  const imageRef = useRef();

  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [outlinePreview, setOutlinePreview] = useState('');



  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studySchema),
  });

  // Watch outline field and update preview
  useEffect(() => {
    const subscription = watch((value) => setOutlinePreview(value.outline || ''));
    return () => subscription.unsubscribe();
  }, [watch]);

  // Format date to 'YYYY-MM-DD'
  const formatDate = (dateString) => (dateString ? dateString.split('T')[0] : '');

  useEffect(() => {
    if (study) {
      reset({
        title: study.title || '',
        author: study.author || '',
        date: formatDate(study.date),
        category: study.category || '',
        description: study.description || '',
        outline: study.outline || '',
      });
      setImage(study.image);
    }
  }, [study, reset]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImage(URL.createObjectURL(file)); // Preview selected image
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setSelectedFile(null);
    if (imageRef.current) {
      imageRef.current.value = ''; // Reset file input
    }
  };


  const onSubmit = async (data) => {
    try {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
  
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }
  
      await updateStudy({ id, studyData: formDataToSend }).unwrap();
      
      toast.success('Study updated successfully'); // Single success toast
  
      refetch();
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error?.data?.message || 'Failed to update study'); // Single error toast
    }
  };
  
  if (isLoading) return <Loader />;


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">

      {/* Back Button */}
      <button 
        onClick={() => navigate('/admin-dashboard')}
        className="flex items-center gap-2 text-white bg-green-900 hover:bg-green-300 py-4 px-4 rounded-full cursor-pointer"
      >
        <IoIosArrowBack className="text-xl" />
      </button>
      
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Study</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input {...register('title')} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
          <p className="text-red-500">{errors.title?.message}</p>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Author</label>
          <input {...register('author')} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
          <p className="text-red-500">{errors.author?.message}</p>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Date</label>
          <input type="date" {...register('date')} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
          <p className="text-red-500">{errors.date?.message}</p>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Category</label>
          <input {...register('category')} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
          <p className="text-red-500">{errors.category?.message}</p>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea {...register('description')} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 h-32" />
          <p className="text-red-500">{errors.description?.message}</p>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Outline</label>
          <textarea
            {...register('outline')}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
            rows={5}
          />
          <p className="text-red-500">{errors.outline?.message}</p>
        </div>

      
      {/* Choose Image Button */}
        <label className="block w-full cursor-pointer">
          <span className="w-28 md:w-32 text-white bg-orange-700 hover:bg-orange-400 px-4 py-2 rounded-md text-xs md:text-sm text-center block transition">
            Choose File
          </span>
          <input
            type="file"
            className="hidden"
            accept=".jpg, .jpeg, .png"
            ref={imageRef}
            onChange={handleImageChange}
          />
        </label>
  
        {/* Image Preview (Only shows inside the form before submission) */}
        {image && (
          <div className="relative w-20 h-20 mt-2">
            <img
              src={image}
              alt="Selected"
              className="w-full h-full rounded-md border"
            />
            {/* Remove Image Icon */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full cursor-pointer p-1"
            >
              <AiOutlineClose size={12} />
            </button>
          </div>
        )}
  

        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
          >
            Update Study
          </button>
        </div>
      </form>


        {/* Markdown Preview for Outline */}
        <div>
          <h3 className="font-medium text-gray-700">Outline Preview</h3>
          <div className="p-4 border rounded-lg bg-gray-100">
            <ReactMarkdown>{outlinePreview}</ReactMarkdown>
          </div>
        </div>
    </div>
  );
};

export default EditStudy;
