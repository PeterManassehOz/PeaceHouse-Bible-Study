import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/studies',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const studyAuthApi = createApi({
  reducerPath: 'studyAuthApi',
  baseQuery,
  endpoints: (builder) => ({
    getAllStudy: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
    }),
    getStudyById: builder.query({
      query: (id) => {
        console.log(`Fetching study with ID: ${id}`);
        return {
          url: `/${id}`,
          method: 'GET',
        };
      },
    }),
    reactToStudy: builder.mutation({
      query: ({ id, emoji }) => ({
        url: `/${id}/react`,
        method: "POST",
        body: { emoji },
      }),
    }),     
    getStudyReactions: builder.query({
      query: (id) => `/${id}/reactions`, 
    }),   
    markStudyInProgress: builder.mutation({
      query: (id) => {
        console.log(`Marking study with ID: ${id} as in-progress`);
        return {
          url: `/${id}/reading`,
          method: 'PATCH',
        };
      },
    }),   
    getMarkStudyInProgress: builder.query({
      query: () => ({
        url: '/reading',
        method: 'GET',
      }),
    }),
    markstudyCompleted: builder.mutation({
      query: (id) => {
        console.log(`Marking study with ID: ${id} as completed`);
        return {
          url: `/${id}/completed`,
          method: 'PATCH',
        };
      },
    }),
    getMarkStudyCompleted: builder.query({
      query: () => {
        console.log("Fetching completed studies...");
        return {
          url: '/completed',
          method: 'GET',
        };
      },
    }),
    markStudyDownloaded: builder.mutation({
      query: (id) => {
        console.log(`Marking study with ID: ${id} as downloaded`);
        return {
          url: `/${id}/download`,
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth setup
          },
        };
      },
    }),
    
    getUserDownloads: builder.query({
      query: () => ({
        url: `/downloads`,  // New endpoint
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
   addComment: builder.mutation({
      query: ({ id, text }) => {
        console.log(`Adding comment to sermon ID: ${id}`, { text });
        return {
          url: `/${id}/comment`,
          method: 'POST',
          body: { text },
        };
      },
    }),
    deleteComment: builder.mutation({
      query: ({ studyId, commentId }) => {
        console.log(`Deleting comment with ID: ${commentId} from sermon ID: ${studyId}`);
        return {
          url: `/${studyId}/comment/${commentId}`,
          method: 'DELETE',
        };
      },
    }),
    getUserDashboardData: builder.query({
      query: () => {
        console.log("Fetching user dashboard data...");
        return {
          url: '/dashboard',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
      },
    }),
    getStudyToDownload: builder.query({
      query: (id) => ({
        url: `/${id}/download`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth setup
        },
    })    
  }),
  }),
});

export const {
  useGetAllStudyQuery,
  useGetStudyByIdQuery,
  useReactToStudyMutation,
  useGetStudyReactionsQuery,
  useMarkStudyInProgressMutation,
  useGetMarkStudyInProgressQuery,
  useMarkstudyCompletedMutation,
  useGetMarkStudyCompletedQuery,
  useMarkStudyDownloadedMutation,
  useGetUserDownloadsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetUserDashboardDataQuery,
  useGetStudyToDownloadQuery,
} = studyAuthApi;
