import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsLetterAuthApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/newsletter" }),
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation({
      query: (email) => ({
        url: "/subscribe",
        method: "POST",
        body: { email },
      }),
    }),
    getSubscriptionStatus: builder.query({
        query: (email) => `/subscription-status/${email}`,
      }),
  }),
});

export const { useSubscribeNewsletterMutation, useGetSubscriptionStatusQuery } = newsLetterAuthApi;
