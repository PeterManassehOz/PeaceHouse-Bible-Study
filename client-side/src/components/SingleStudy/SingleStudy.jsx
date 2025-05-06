import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdDownload } from 'react-icons/md';
import { RiSendPlaneFill } from "react-icons/ri";
import { FaCommentAlt, FaTimes } from "react-icons/fa"; 
import { 
  useGetStudyByIdQuery,
  useMarkStudyDownloadedMutation, 
  useGetStudyToDownloadQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useReactToStudyMutation, 
  useGetStudyReactionsQuery,
  useMarkStudyInProgressMutation, 
  useMarkstudyCompletedMutation, 
  useGetMarkStudyCompletedQuery,
  useGetAllStudyQuery,
} from '../../redux/studyAuthApi/studyAuthApi';
import Loader from '../Loader/Loader';
import { format, differenceInDays } from "date-fns";
import getCommenterImage from '../getCommenterImage/getCommenterImage';
import EmojiPicker from 'emoji-picker-react';
import { FaSmile } from "react-icons/fa";
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';






const SingleStudy = () => {
  const { id } = useParams(); 
  const { data: study, refetch } = useGetStudyByIdQuery(id);
  const [markStudyDownloaded] = useMarkStudyDownloadedMutation();
  const { data: _fileData } = useGetStudyToDownloadQuery(id, { skip: !id }); 
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation(); 
  const [reactToStudy] = useReactToStudyMutation();
  const { data: reactionData, refetch: refetchReactions } = useGetStudyReactionsQuery(id, {
    refetchOnMountOrArgChange: true, // Ensures fresh data on mount
  });
  const [markStudyInProgress] = useMarkStudyInProgressMutation();
  const { data: allStudies } = useGetAllStudyQuery(); // Fetch all studies


  const [markStudyCompleted] = useMarkstudyCompletedMutation();
  const { data: completedStudies, refetch: refetchCompleted } = useGetMarkStudyCompletedQuery({
    refetchOnMountOrArgChange: true,
  });


  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [isCompleted, setIsCompleted] = useState(false);
  const [comment, setComment] = useState("");
  const [showDelete, setShowDelete] = useState(null);
  const [deleteTimeout, setDeleteTimeout] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userReaction, setUserReaction] = useState(reactionData?.userReaction || null); 
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();


  const getWordsPerPage = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024 ? 2000 : 250; // 1024px is a common laptop breakpoint
    }
    return 250; // Default fallback
  };
  
  const [wordsPerPage, setWordsPerPage] = useState(getWordsPerPage());
  
  
  useEffect(() => {
    const handleResize = () => {
      setWordsPerPage(getWordsPerPage());
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  


  useEffect(() => {
    if (id) {
      markStudyInProgress(id).unwrap().catch((error) => {
        console.error("Error marking study as in-progress:", error);
      });
    }
  }, [id, markStudyInProgress]);

  /*
     const markInProgress = useCallback(() => {
        markStudyInProgress(id).unwrap().catch((error) => {
          console.error("Error marking study as in-progress:", error);
        });
      }, [id, markStudyInProgress]);

      useEffect(() => {
        if (id) {
          markInProgress();
        }
      }, [id, markInProgress]);

  */

  // Ensure isCompleted updates when completedStudies changes
  useEffect(() => {
    if (completedStudies) {
      setIsCompleted(completedStudies.some(study => study._id === id)); // ✅ Match study._id
    }
  }, [completedStudies, id]);
  
  
    
  // Update userReaction when reactionData changes
  useEffect(() => {
    if (reactionData?.userReaction) {
      setUserReaction(reactionData.userReaction);
    }
  }, [reactionData]);

  const handleComplete = async () => {
    try {
      await markStudyCompleted(id).unwrap();
      setIsCompleted(true); // Optimistically update the UI
      refetchCompleted(); // Ensure fresh data
      setShowModal(true); // Show overlay when study is completed
    } catch (error) {
      console.error("Error marking study as completed:", error);
    }
  };

    // Function to find the next study
    const getNextStudy = () => {
      if (!allStudies || !study) return;
  
      // Filter studies in the same category
      const categoryStudies = allStudies.filter((s) => s.category === study.category);
  
      // Find completed study IDs
      const completedIds = completedStudies?.map((s) => s._id) || [];
  
      // Find the next unfinished study
      const nextStudy = categoryStudies.find((s) => !completedIds.includes(s._id));
  
      if (nextStudy) {
        return nextStudy._id;
      }
  
      // If no unfinished study in this category, move to the next category
      const categories = [...new Set(allStudies.map((s) => s.category))];
      const currentCategoryIndex = categories.indexOf(study.category);
      const nextCategory = categories[currentCategoryIndex + 1];
  
      if (nextCategory) {
        const nextCategoryStudies = allStudies.filter((s) => s.category === nextCategory);
        return nextCategoryStudies.length > 0 ? nextCategoryStudies[0]._id : null;
      }
  
      return null; // No more studies available
    };
  
    const handleNextStudy = () => {
      const nextStudyId = getNextStudy();
      if (nextStudyId) {
        navigate(`/study/${nextStudyId}`);
      } else {
        toast.error("No more studies available!");
      }
      setShowModal(false);
    };
  


  const handleReact = async (emojiObject) => {
    if (!emojiObject) return;
    
    // Optimistically update the UI
    setUserReaction(emojiObject.emoji);
    
    // Send reaction to the server
    await reactToStudy({ id, emoji: emojiObject.emoji });

    
    refetchReactions();
    setShowEmojiPicker(false);
  };
  
  
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCommentPopup(true);
      setTimeout(() => setShowCommentPopup(false), 10000); // Hide popup after 4 seconds
    }, 120000); // Show popup every 2 minutes
  
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);




  if (!study) return <div className="text-center mt-20"><Loader /></div>;

  const fileUrl = `http://localhost:5000/${study.filePath}`;
  const fileURL = `http://localhost:5000/studies/${id}/download`;

  const handleDownload = async () => {
    try {
      await markStudyDownloaded(id).unwrap();
      const response = await fetch(fileURL, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });

      if (!response.ok) throw new Error(`Failed to download: ${response.status}`);

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${study.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleComment = async () => {
    if (comment.trim()) {
      await addComment({ id, text: comment });
      setComment("");
      refetch();
    }
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment({ studyId: id, commentId });
    setShowDelete(null);
    clearTimeout(deleteTimeout);
    refetch();
  };

  let timer;
  const handleMouseDown = (commentId) => {
    timer = setTimeout(() => {
      setShowDelete(commentId);
      const timeout = setTimeout(() => {
        setShowDelete(null);
      }, 10000); 
      setDeleteTimeout(timeout);
    }, 1000);
  };

  const handleMouseUp = () => clearTimeout(timer);

  const formatCommentTime = (timestamp) => {
    const commentDate = new Date(timestamp);
    const now = new Date();
    const daysDifference = differenceInDays(now, commentDate);
  
    if (daysDifference === 0) {
      return format(commentDate, "h:mm a"); // Show hour and minute for today
    } else if (daysDifference === 1) {
      return `Yesterday, ${format(commentDate, "h:mm a")}`; // Show "Yesterday" and time
    } else if (daysDifference < 7) {
      return `${format(commentDate, "EEEE, h:mm a")}`; // Show weekday and time
    } else {
      return format(commentDate, "EEEE, dd/MM/yyyy, h:mm a"); // Show day, date, and time
    }
  };


  
  // Paginate the outline
  const outlineWords = study.outline.split(" ");
  const totalPages = Math.ceil(outlineWords.length / wordsPerPage);
  const currentWords = outlineWords.slice(currentPage * wordsPerPage, (currentPage + 1) * wordsPerPage).join(" ");

  

  
  return (
    <div className="p-6">

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white bg-green-400 hover:bg-green-300 py-4 px-4 rounded-full cursor-pointer"
      >
        <IoIosArrowBack className="text-xl" />
      </button>

      <h2 className="text-2xl font-semibold text-center mt-13">
        {study.title}
      </h2>

     
      <div className="mt-6 relative">
            { /* <iframe 
                src={fileUrl} 
                width="100%" 
                height="600px"
                className="border rounded-lg shadow-md"
              />*/
            }

    {currentPage === 0 && (
            <div className="flex justify-center mt-4">
              <img 
                  src={`http://localhost:5000/${study.image}`}
                alt={study.title} 
                className="w-[200px] h-[200px] object-top object-cover rounded-lg shadow-md sm:w-[200px] sm:h-[180px] md:w-[300px] md:h-[200px]"  
              />
            </div>
    )}

    {currentPage === 0 && (
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <button 
              onClick={() => window.open(fileUrl, '_blank')}
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-full cursor-pointer text-sm sm:text-xs"
            >
              View PDF
            </button>

            <button 
              onClick={handleDownload}
              className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-full flex items-center gap-2 cursor-pointer   text-sm sm:text-xs"
            >
              <MdDownload />
              Download PDF
            </button>

            <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="bg-black hover:bg-gray-700 text-white py-2 px-4 rounded-full flex items-center gap-2 cursor-pointer text-sm sm:text-xs"
                  >
                    {userReaction ? <span>{userReaction}</span> : <FaSmile />} 
                    React
                  </button>

                  {showEmojiPicker && (
                    <div className="fixed bottom-20 right-10 z-50 bg-white p-3 rounded-lg shadow-lg">
                      <EmojiPicker onEmojiClick={handleReact} />
                    </div>
                  )}
            </div>
        </div>
    )}

        <div className="relative mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
           {currentPage === 0 && <h3 className="text-lg font-semibold">Outline</h3>}
           <div className="prose">
             <div className="mt-2 text-gray-700">
              <ReactMarkdown>
                 {currentWords}
              </ReactMarkdown>
             </div>
           </div>
          
                
        
         {/* Show "Complete" only on the final page */}
          {currentPage === totalPages - 1 && (
            <div className="mt-4 text-center">
              <button 
                className={`text-white p-3 rounded-full cursor-pointer ${isCompleted ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-400'}`}
                onClick={handleComplete}
                disabled={isCompleted}
              >
                {isCompleted ? "Completed" : "Complete"}
              </button>
            </div>
          )}

          
      {/** Overlay Modal */}
      {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-md bg-opacity-30">
            <div className="bg-white shadow-md shadow-green-300 rounded-lg text-center relative max-w-md mx-auto overflow-hidden">
              
              {/* Background Image (30% Height of the Container) */}
              <div 
                className="h-32 bg-cover bg-center" 
                style={{ backgroundImage: "url('/sun.jpeg')" }} 
              ></div>

              {/* Close Button */}
              <button 
                className="absolute top-3 right-3 text-gray-600 hover:text-white hover:bg-red-600 rounded-full cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                <FaTimes className="text-xl" />
              </button>

              {/* Modal Content (70% Bottom Section) */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-green-600">Congratulations!</h3>
                <p className="text-gray-700 mt-2">You have successfully completed this study.</p>

                {/* Next Study Button */}
                <button 
                  className="bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 mt-4 rounded-full cursor-pointer"
                  onClick={handleNextStudy}
                >
                  Next Study
                </button>
              </div>
            </div>
          </div>
        )}

  
                {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === 0 ? 'bg-gray-300' : 'bg-green-400 hover:bg-green-300 text-white'}`}
          >
            <IoIosArrowBack className="text-xl cursor-pointer" />
          </button>
          
          <span className="text-sm text-gray-600">Page {currentPage + 1} of {totalPages}</span>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === totalPages - 1 ? 'bg-gray-300' : 'bg-green-400 hover:bg-green-300 text-white'}`}
          >
            <IoIosArrowForward className="text-xl cursor-pointer"/>
          </button>
        </div>

        <div className='absolute -top-13 right-0'>
        <div className="relative">             
            {showCommentPopup && (
              <div className="absolute bottom-15 right-6 bg-black text-white p-2 rounded-md text-sm shadow-lg animate-bounce">
                Comment
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-black mx-auto mt-1"></div>
              </div>
            )}

              
            <button 
              onClick={() => {
                console.log("Comment icon clicked!");
                setShowComments((prev) => !prev);  // Toggle comments
              }} 
              className="absolute bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-md hover:bg-green-400 cursor-pointer"
            >
              <FaCommentAlt />
            </button>
        </div>
        </div>
          
      </div>


     </div>

      {showComments && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-md bg-opacity-30">
          <div className="bg-white shadow-md shadow-green-300 p-6 rounded-lg w-4/5 h-4/5 max-w-lg flex flex-col">

            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold">Comments ({study.comments?.length || 0})</h3>
              <button onClick={() => setShowComments(false)} className="text-gray-600 hover:text-gray-800">
                <FaTimes className="text-xl hover:bg-red-500 hover:text-white rounded-full cursor-pointer" />
              </button>
            </div>

            <div className="relative flex items-center mt-4">
              <textarea
                className="w-full border p-3 rounded-md resize-none focus:outline-green-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <button className="absolute bottom-2 right-2  bg-green-500 text-white p-2 rounded-full ml-2 cursor-pointer" onClick={handleComment}>
                <RiSendPlaneFill className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
              {study.comments?.length > 0 ? (
                [...study.comments].reverse().map((c) => (
                  <div 
                    key={c._id} 
                    className="flex items-start gap-3 p-3 border-b relative"
                    onMouseDown={() => handleMouseDown(c._id)}
                    onMouseUp={handleMouseUp}
                  >

                    <img
                      src={getCommenterImage(c.userId)}
                      alt={c.userId?.username || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                    
                    <div className="flex-1">
                      <div className="font-semibold">
                        {c.userId?.firstname ? `${c.userId.firstname} ${c.userId.lastname}` : "Admin"}
                      </div>
                      <div>{c.text}</div>
                      <div className="absolute bottom-2 right-2 text-gray-500 text-sm">{formatCommentTime(c.createdAt)}</div>
                    </div>

                    {showDelete === c._id && (
                      <button 
                        onClick={() => handleDeleteComment(c._id)} 
                        className="text-white bg-red-600 hover:bg-red-500 py-1 px-2 rounded text-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

  </div>
  );
};

export default SingleStudy;



