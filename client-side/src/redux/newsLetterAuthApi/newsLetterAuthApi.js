import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsLetterAuthApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "VITE_API_URL/newsletter",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // or however you store it
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation({
      query: (email) => ({
        url: "/subscribe",
        method: "POST",
        body: { email },
      }),
    }),
    getSubscriptionStatus: builder.query({
        query: () => ({
          url: "/status",
          method: "GET",
          // no email needed
        }),
      }),
      
  }),
});

export const { useSubscribeNewsletterMutation, useGetSubscriptionStatusQuery } = newsLetterAuthApi;
