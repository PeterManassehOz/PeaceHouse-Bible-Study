import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useGetStudyByIdQuery, useUpdateStudyMutation } from '../../redux/adminStudyAuthApi/adminStudyAuthApi';
import Loader from '../Loader/Loader';
import ReactMarkdown from 'react-markdown';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineClose } from 'react-icons/ai';

// Validation Schema
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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studySchema),
  });

  useEffect(() => {
    const sub = watch((v) => setOutlinePreview(v.outline || ''));
    return () => sub.unsubscribe();
  }, [watch]);

  const formatDate = (d) => (d ? d.split('T')[0] : '');

  useEffect(() => {
    if (!study) return;

    reset({
      title: study.title || '',
      author: study.author || '',
      date: formatDate(study.date),
      category: study.category || '',
      description: study.description || '',
      outline: study.outline || '',
    });

    if (study.image) {
      setImage(study.image);
    }
  }, [study, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setSelectedFile(null);
    if (imageRef.current) imageRef.current.value = '';
  };

  const onSubmit = async (data) => {
    try {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([k, v]) => formDataToSend.append(k, v));

      if (selectedFile) formDataToSend.append('image', selectedFile);

      await updateStudy({ id, studyData: formDataToSend }).unwrap();

      toast.success('Study updated successfully');
      refetch();
      navigate('/admin-dashboard');
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl px-5 py-4 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Edit Study</h2>
          <p className="text-sm text-gray-500">Update study details and content</p>
        </div>

        <button
          onClick={() => navigate('/admin-dashboard')}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full transition"
        >
          <IoIosArrowBack />
          Back
        </button>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FORM */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 space-y-4">

          {/* GRID INPUTS */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Title" register={register('title')} error={errors.title} />
            <Input label="Author" register={register('author')} error={errors.author} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Category" register={register('category')} error={errors.category} />
            <Input type="date" register={register('date')} error={errors.date} />
          </div>

          {/* TEXTAREAS */}
          <Textarea label="Description" register={register('description')} error={errors.description} />

          <Textarea
            label="Outline"
            register={register('outline')}
            error={errors.outline}
            onChange={(e) => setOutlinePreview(e.target.value)}
          />

          {/* IMAGE UPLOAD */}
          <div className="flex items-center gap-4 flex-wrap">

            <label className="cursor-pointer bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-xl transition">
              Choose Image
              <input
                type="file"
                className="hidden"
                ref={imageRef}
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
              />
            </label>

            {image && (
              <div className="relative">
                <img
                  src={image}
                  alt="preview"
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <AiOutlineClose size={12} />
                </button>
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl transition font-medium"
          >
            Update Study
          </button>
        </div>

        {/* PREVIEW */}
        <div className="bg-white rounded-2xl shadow-sm p-5 h-fit sticky top-6">
          <h3 className="font-semibold text-gray-700 mb-3">Outline Preview</h3>
          <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-xl">
            <ReactMarkdown>{outlinePreview}</ReactMarkdown>
          </div>
        </div>

      </div>
    </div>
  );
};

/* INPUT */
const Input = ({ label, register, error, type = "text" }) => (
  <div>
    <input
      type={type}
      placeholder={label}
      {...register}
      className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-green-400 outline-none transition"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

/* TEXTAREA */
const Textarea = ({ label, register, error, onChange }) => (
  <div>
    <textarea
      placeholder={label}
      {...register}
      onChange={onChange}
      className="w-full p-3 h-28 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-green-400 outline-none transition"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

export default EditStudy;