import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateStudyMutation } from "../../redux/adminStudyAuthApi/adminStudyAuthApi";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import { MdCloudUpload, MdImage, MdSend, MdAutoFixHigh } from "react-icons/md";

/* Schema */
const studySchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  date: yup.string().required(),
  outline: yup.string().required(),
  author: yup.string().required(),
  category: yup.string().required(),
  status: yup.string().required(),
});

const DRAFT_KEY = "study_draft_v1";

const CreateStudy = () => {
  const [createStudy, { isLoading }] = useCreateStudyMutation();

  const [outlinePreview, setOutlinePreview] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [studyFile, setStudyFile] = useState(null);
  const dropRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studySchema),
  });

  const watched = watch();

  /* ---------------- AUTO SAVE DRAFT ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      Object.keys(data).forEach((key) => setValue(key, data[key]));
      setOutlinePreview(data.outline || "");
    }
  }, []);

 useEffect(() => {
  const draftData = {
    title: watched.title || "",
    description: watched.description || "",
    date: watched.date || "",
    outline: watched.outline || "",
    author: watched.author || "",
    category: watched.category || "",
    status: watched.status || "",
  };

  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify(draftData)
  );
}, [watched]);

  /* ---------------- DRAG & DROP IMAGE ---------------- */
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        setValue("image", [file]);
        setImagePreview(URL.createObjectURL(file));
      }
    };

    el.addEventListener("drop", handleDrop);
    return () => el.removeEventListener("drop", handleDrop);
  }, [setValue]);

  /* ---------------- FAKE AI OUTLINE GENERATOR ---------------- */
  const generateOutline = () => {
    const auto = `## Introduction\nExplain the core idea...\n\n## Key Lessons\n- Point 1\n- Point 2\n\n## Summary\nWrap up key insights.`;
    setValue("outline", auto);
    setOutlinePreview(auto);
    toast.success("Outline generated!");
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data) => {
  try {
    if (!imageFile || !studyFile) {
      toast.error("Image and study file are required");
      return;
    }

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("author", data.author);
    formData.append("category", data.category);
    formData.append("status", data.status);
    formData.append("outline", data.outline);

    // IMPORTANT
    formData.append("image", imageFile);
    formData.append("file", studyFile);

    // DEBUG
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    await createStudy(formData).unwrap();

    toast.success("Study created successfully!");

    localStorage.removeItem(DRAFT_KEY);

    reset();

    setImagePreview(null);
    setFileName("");
    setOutlinePreview("");

    setImageFile(null);
    setStudyFile(null);

    } catch (err) {
      console.error(err);

      toast.error(
        err?.data?.message ||
        "Failed to create study"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FORM */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create Study</h2>

            <button
              type="button"
              onClick={generateOutline}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              <MdAutoFixHigh />
              Generate Outline
            </button>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data" className="space-y-4"
          >

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title" register={register("title")} error={errors.title} />
              <Input label="Author" register={register("author")} error={errors.author} />
              <Input label="Category" register={register("category")} error={errors.category} />

              <select
                {...register("status")}
                className="w-full p-3 rounded-xl border-none bg-gray-100 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Status</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>

              <Input type="date" register={register("date")} error={errors.date} />
            </div>

            {/* DESCRIPTION */}
            <textarea
              placeholder="Description"
              {...register("description")}
              className="w-full p-3 rounded-xl border-none bg-gray-100 outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* OUTLINE */}
            <textarea
              placeholder="Outline (Markdown)"
              {...register("outline")}
              onChange={(e) => {
                setValue("outline", e.target.value);
                setOutlinePreview(e.target.value);
              }}
              className="w-full p-3 h-40 rounded-xl border-none bg-gray-100 outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* UPLOAD AREA */}
            <div
              ref={dropRef}
              className="flex gap-3 flex-wrap border-2 border-dashed border-gray-300 rounded-xl p-4"
            >

              {/* IMAGE */}
              <label className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl cursor-pointer">
                <MdImage />
                Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setImageFile(file);

                      setImagePreview(
                        URL.createObjectURL(file)
                      );
                    }
                  }}
                />
              </label>

              {/* FILE */}
              <label className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl cursor-pointer">
                <MdCloudUpload />
                File
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.epub"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setStudyFile(file);

                      setFileName(file.name);
                    }
                  }}
                />
              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl"
              >
                <MdSend />
                {isLoading ? "Creating..." : "Create"}
              </button>

            </div>

          </form>
        </div>

        {/* PREVIEW PANEL */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6 h-fit">

          <h3 className="font-semibold mb-4">Live Preview</h3>

          {imagePreview && (
            <img src={imagePreview} className="rounded-xl mb-4 w-full h-40 object-cover" />
          )}

          {fileName && <p className="text-sm mb-3">📄 {fileName}</p>}

          <div className="prose prose-sm">
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
      className="w-full p-3 rounded-xl border-none bg-gray-100 outline-none focus:ring-2 focus:ring-green-500"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

export default CreateStudy;