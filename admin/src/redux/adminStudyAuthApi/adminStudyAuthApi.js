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


export const adminStudyAuthApi = createApi({
    reducerPath: 'adminStudyAuthApi',
    baseQuery,
    endpoints: (builder) => ({
      createStudy: builder.mutation({
        query: (formData) => ({
          url: '/',
          method: 'POST',
          body: formData,
        }),
      }),      
          
    getAllStudy: builder.query({
        query: () => {
          console.log("Fetching all studies...");
          return {
            url: '/',
            method: 'GET',
          };
        },
      }),
      
    studyCompleted: builder.mutation({
        query: (id) => {
          console.log(`Marking study with ID: ${id} as completed`);
          return {
            url: `/${id}/study-completed`,
            method: 'PUT',
          };
        },
      }),
      
    getStatisticsData: builder.query({
        query: () => {
          console.log("Fetching statistics for sermon data...");
          return {
            url: '/stats',
            method: 'GET',
          };
        },
      }),
      
    getUsertActivityByAdmin: builder.query({
        query: (id) => {
          console.log(`Fetching user activity for user ID: ${id}`);
          return {
            url: `/${id}/activity`,
            method: 'GET',
          };
        },
      }),

      findUserByEmail: builder.query({
        query: (email) => ({
          url: `/find-user/${email}`,
          method: "GET",
        }),
      }),
      
    updateStudy: builder.mutation({
        query: ({ id, studyData }) => ({
          url: `/${id}`,
          method: 'PUT',
          body: studyData, // Keep it as FormData
        }),
      }),    
      deleteStudy: builder.mutation({
        query: (id) => ({
          url: `/${id}`,
          method: 'DELETE',
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
    }),
});

export const {
    useCreateStudyMutation,
    useGetAllStudyQuery,
    useStudyCompletedMutation,
    useGetStatisticsDataQuery,
    useGetUsertActivityByAdminQuery,
    useFindUserByEmailQuery,
    useUpdateStudyMutation,
    useDeleteStudyMutation,
    useGetStudyByIdQuery
    } = adminStudyAuthApi;