import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsLetterAuthApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/newsletter",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // or however you store it
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
      getAllSubscribers: builder.query({
        query: () => ({
            url: "/all-subscribers",
          method: "GET",
        }),
      }),
  }),
});

export const {useGetAllSubscribersQuery } = newsLetterAuthApi;
